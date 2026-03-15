import { useState } from "react"
import api from "../services/api"

function Transfer() {

  const [receiverEmail, setReceiverEmail] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleTransfer = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError("")
    setSuccess("")

    try {

      await api.post("/account/transfer", {
        receiverEmail,
        amount: Number(amount)
      })

      setSuccess("Transfer successful 🎉")

      setReceiverEmail("")
      setAmount("")

    } catch (err) {

      setError("Transfer failed")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div>

      <h2>Send Money</h2>

      <form onSubmit={handleTransfer}>

        <input
          placeholder="Receiver Email"
          value={receiverEmail}
          onChange={(e)=>setReceiverEmail(e.target.value)}
        />

        <input
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Transfer"}
        </button>

      </form>

      {error && <p style={{color:"red"}}>{error}</p>}
      {success && <p style={{color:"green"}}>{success}</p>}

    </div>

  )

}

export default Transfer