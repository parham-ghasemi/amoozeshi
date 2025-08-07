import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      toast.success("ورود موفق");
      // Clear state to prevent toast on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return <div>Home</div>;
};
export default Home