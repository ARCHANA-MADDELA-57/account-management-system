import { Link, useNavigate } from "react-router-dom"

function Navbar(){

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return(

    <div className="navbar">

      <h2>Banking App</h2>

      {token && (

        <div className="nav-links">

          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transfer">Transfer</Link>
          <Link to="/statement">Statement</Link>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      )}

    </div>

  )

}

export default Navbar