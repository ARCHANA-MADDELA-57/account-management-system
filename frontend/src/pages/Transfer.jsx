import { useState } from "react"
import api from "../services/api"

function Transfer() {

  const [receiverEmail, setReceiverEmail] = useState("")
  const [amount, setAmount] = useState("")

  const handleTransfer = async (e) => {

    e.preventDefault()

    try {

      await api.post("/account/transfer", {
        receiverEmail,
        amount: Number(amount)   // convert string → number
      })

      alert("Transfer successful")

      // reset form
      setReceiverEmail("")
      setAmount("")

    } catch (error) {

      alert("Transfer failed")

    }

  }

  return (

    <div className="container">
  
      <h2>Send Money</h2>
  
      <form onSubmit={handleTransfer}>
  
        <input
          placeholder="Receiver Email"
          value={receiverEmail}
          onChange={(e)=>setReceiverEmail(e.target.value)}
        />
  
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e)=>setAmount(e.target.value)}
        />
  
        <button type="submit">
          Transfer
        </button>
  
      </form>
  
    </div>
  
  )

}

export default Transfer