import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import authAxios from "@/lib/authAxios"

const Header = () => {
  const [open, setOpen] = useState(false)
  const nav = useNavigate();

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const res = await authAxios.get(`/user/me`);
      return res.data;
    } catch {
      return false;
    }
  }
  const { data: user } = useQuery({
    queryKey: ["get-user-w-jwt"],
    queryFn: getUser,
    enabled: !!localStorage.getItem("token"),
    staleTime: 0,
  });


  const onClick = () => {
    if (!user) {
      nav('/auth');
      return;
    }
    nav('/profile');
  }

  return (
    <div className="w-full flex md:justify-between justify-start items-center h-16 md:h-20 sticky top-0 left-0 right-0 px-6 xl:px-96 md:px-24 border-b backdrop-blur-lg z-50 bg-[#f1f5f9100a1] hover:bg-slate-100 transition-all duration-300">
      <button onClick={onClick} className=" hidden md:block py-2 px-5 rounded-lg hover:shadow hover:text-cyan-500 cursor-pointer transition" >
        {
          // @ts-ignore
          user && user?.userName ? user.userName : ' ثبت نام | ورود'
        }
      </button>

      <div className="md:flex hidden items-center justify-center gap-6">
        <Link to="/about">درباره ما</Link>
        <Link to="/courses">دوره ها</Link>
        <Link to="/videos">ویدئو ها</Link>
        <Link to="/articles">مقالات</Link>
        <Link to="/">خانه</Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="text-gray-800">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="absolute top-16 left-0 w-full bg-white border-b shadow-md flex flex-col items-center gap-4 py-4 md:hidden">
          <Link to="/about" onClick={() => setOpen(false)}>درباره ما</Link>
          <Link to="/courses" onClick={() => setOpen(false)}>دوره ها</Link>
          <Link to="/videos" onClick={() => setOpen(false)}>ویدئو ها</Link>
          <Link to="/articles" onClick={() => setOpen(false)}>مقالات</Link>
          <Link to="/auth" onClick={() => setOpen(false)}>
            ثبت نام | ورود
          </Link>
          <Link to="/" onClick={() => setOpen(false)}>خانه</Link>
        </div>
      )}
    </div>
  )
}

export default Header
