import { useEffect, useState } from "react"
import api from "../services/api"

function Dashboard() {

  const [balance, setBalance] = useState(0)
  const [name, setName] = useState("")

  useEffect(() => {

    const fetchBalance = async () => {

      const res = await api.get("/account/balance")

      setBalance(res.data.balance)
      setName(res.data.name)

    }

    fetchBalance()

  }, [])

  return (

    <div className="container">

      <h2>Welcome, {name}</h2>
      <div className="balanceCard">
       <h3>Your Balance</h3> 
       <p>₹ {balance}</p>
      </div>
      

      

    </div>

  )

}

export default Dashboard