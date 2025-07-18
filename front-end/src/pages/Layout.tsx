import { Outlet } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-100 pb-7">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
