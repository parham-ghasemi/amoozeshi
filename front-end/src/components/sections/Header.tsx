import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full flex md:justify-between justify-start items-center h-16 md:h-20 sticky top-0 left-0 right-0 px-6 xl:px-96 md:px-24 border-b backdrop-blur-lg z-50 bg-[#f1f5f9100a1] hover:bg-slate-100 hover:shadow-xl transition-all duration-300">
      <Link to='/auth' className=" hidden md:block bg-blue-500 py-2 px-5 rounded-lg text-white hover:shadow hover:bg-blue-700 cursor-pointer transition" >
        ثبت نام | ورود
      </Link>

      <div className="md:flex hidden items-center justify-center gap-6">
        <Link to="/">تماس با ما</Link>
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
          <Link to="/" onClick={() => setOpen(false)}>تماس با ما</Link>
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
