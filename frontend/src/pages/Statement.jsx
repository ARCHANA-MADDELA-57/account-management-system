import { useEffect, useState } from "react";
import api from "../services/api";

function Statement() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/account/statement");

      setTransactions(res.data);
    };

    fetchData();
  }, []);

  return (
    <div className="statement-container">
      <h2>Transaction History</h2>
      <div className="statement-wrapper">
        <table className="statement-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>

                <td
                  style={{
                    color: t.transaction_type === "credit" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {t.transaction_type.toUpperCase()}
                </td>

                <td
                  style={{
                    color: t.transaction_type === "credit" ? "green" : "red",
                  }}
                >
                  ₹ {t.amount}
                </td>

                <td>{t.sender?.name}</td>

                <td>{t.receiver?.name}</td>

                <td>₹ {t.balance_after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Statement;
