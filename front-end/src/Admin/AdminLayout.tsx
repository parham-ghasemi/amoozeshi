import { Outlet } from "react-router-dom";
import SideBar from "./components/SideBar";

const AdminLayout = () => {
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
