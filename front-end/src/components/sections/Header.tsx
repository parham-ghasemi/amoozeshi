import { Link } from "react-router-dom"

const Header = () => {
  return (
    <div className="w-full flex justify-between h-20 sticky top-0 items-center px-11 border-b backdrop-blur-lg z-50 bg-[#f1f5f9100a1] hover:bg-slate-100 hover:shadow-xl transition-all duration-300">
      <div className="">
        <button className="bg-blue-600 text-slate-100 px-5 py-1 rounded text-xl cursor-pointer hover:brightness-105">Join</button>
      </div>
      <div className="flex items-center justify-center gap-5">
        <Link to={'/'}>تماس با ما</Link>
        <Link to={'/'}>دوره ها</Link>
        <Link to={'/'}>ویدئو ها</Link>
        <Link to={'/'}>مقالات</Link>
        <Link to={'/'}>خانه</Link>
      </div>
      <div className="w-28 h-16 bg-green-200 rounded-xl"></div>
    </div>
  )
}

export default Header