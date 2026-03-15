import { useEffect, useState } from "react"
import api from "../services/api"

function Statement() {

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=>{

    const fetchTransactions = async () => {

      try {

        const res = await api.get("/account/statement")

        setTransactions(res.data)

      } catch (err) {

        setError("Failed to load transactions")

      } finally {

        setLoading(false)

      }

    }

    fetchTransactions()

  },[])

  if (loading) {
    return <h3>Loading transactions...</h3>
  }

  if (error) {
    return <h3 style={{color:"red"}}>{error}</h3>
  }

  return (

    <div>

      <h2>Transaction History</h2>

      <table>

        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Sender</th>
            <th>Receiver</th>
          </tr>
        </thead>

        <tbody>

          {transactions.map((t,i)=>(
            <tr key={i}>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
              <td style={{color: t.transaction_type === "credit" ? "green" : "red"}}>
                {t.transaction_type}
              </td>
              <td>₹ {t.amount}</td>
              <td>{t.sender?.name}</td>
              <td>{t.receiver?.name}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>

  )

}

export default Statement