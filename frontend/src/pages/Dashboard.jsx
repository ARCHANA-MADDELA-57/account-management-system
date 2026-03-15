import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get("/account/balance");

        setBalance(res.data.balance);
        setName(res.data.name);
      } catch (err) {
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <h3>Loading dashboard...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }

  return (
    <div className="container">
      <h2>Welcome, {name} 👋</h2>
      <div className="balanceCard">
        <h3>Your Balance</h3>

        <p>₹ {balance}</p>
      </div>
    </div>
  );
}

export default Dashboard;
