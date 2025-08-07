import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import { useQuery } from "@tanstack/react-query";
import authAxios from "@/lib/authAxios";
import UnauthorizedAdmin from "@/pages/profile/UnauthorizedAdmin";

const fetchUser = async () => {
  const res = await authAxios.get("/user/me");
  return res.data;
};

const AdminLayout = () => {

  const { data: currentUser, isLoading, isError } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: fetchUser,
    enabled: !!localStorage.getItem("token"),
  });

  const isAdmin = currentUser?.role?.includes("admin");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-lg">
        در حال بارگذاری...
      </div>
    );
  }

  if (isError || !isAdmin) {
    return <UnauthorizedAdmin />;
  }

  return (
    <div className="flex flex-row-reverse">
      <SideBar />
      <main className="min-h-screen bg-slate-100 pb-7 pt-24 flex items-center flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
