import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  const handleLogout = () => {
    localStorage.removeItem("token");
    queryClient.setQueryData(["get-user-w-jwt"], null);
    // @ts-ignore
    queryClient.invalidateQueries(["get-user-w-jwt"]);
    navigate("/auth");
  };

  return (
    <Button onClick={handleLogout} variant="destructive">
      خروج
    </Button>
  );
};

export default LogoutButton;
