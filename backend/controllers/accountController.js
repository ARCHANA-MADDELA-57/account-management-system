const supabase = require("../config/supabaseClient");

exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("users")
      .select("name, balance")
      .eq("id", userId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.transferMoney = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverEmail, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const { data: sender } = await supabase
      .from("users")
      .select("*")
      .eq("id", senderId)
      .single();

    const { data: receiver } = await supabase
      .from("users")
      .select("*")
      .eq("email", receiverEmail)
      .single();

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const newSenderBalance = sender.balance - amount;

    await supabase
      .from("users")
      .update({ balance: newSenderBalance })
      .eq("id", senderId);

    const newReceiverBalance = receiver.balance + amount;

    await supabase
      .from("users")
      .update({ balance: newReceiverBalance })
      .eq("id", receiver.id);

    await supabase.from("transactions").insert({
      sender_id: senderId,
      receiver_id: receiver.id,
      amount,
      transaction_type: "debit",
      balance_after: newSenderBalance,
    });

    await supabase.from("transactions").insert({
      sender_id: senderId,
      receiver_id: receiver.id,
      amount,
      transaction_type: "credit",
      balance_after: newReceiverBalance,
    });

    res.json({ message: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStatement = async (req, res) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
    amount,
    transaction_type,
    created_at,
    balance_after,
    sender:sender_id(name),
    receiver:receiver_id(name)
  `
      )
      .or(
        `and(sender_id.eq.${userId},transaction_type.eq.debit),and(receiver_id.eq.${userId},transaction_type.eq.credit)`
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const filtered = data.filter((tx) => {
      if (tx.transaction_type === "debit" && tx.sender) return true;
      if (tx.transaction_type === "credit" && tx.receiver) return true;
      return false;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
