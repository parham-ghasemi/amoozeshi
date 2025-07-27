import { useEffect } from "react"
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const handleLogout = () => {
      localStorage.removeItem("token"); // remove the JWT
      navigate("/auth"); // redirect to auth form or login page
    };
    handleLogout();
  })
  return (
    <div>Logout</div>
  )
}

export default Logout