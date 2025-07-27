import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the JWT
    navigate("/auth"); // redirect to auth form or login page
  };

  return (
    <Button onClick={handleLogout} variant="outline">
      Logout
    </Button>
  );
};

export default LogoutButton;
