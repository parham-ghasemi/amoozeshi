import { Outlet } from "react-router-dom";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { useEffect } from "react";
import axios from "axios";

const Layout = () => {
  const TrackVisit = () => {
    useEffect(() => {
      axios.post('/api/track').catch((err) => {
        console.error('Visit tracking failed:', err);
      });
    }, []);

    return null;
  };
  return (
    <>
      <TrackVisit />
      <Header />
      <main className="min-h-screen bg-slate-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
