import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { name: "داشبورد", path: "/dashboard" },
  { name: "ویدئو ها", path: "/video" },
  { name: "پادکست ها", path: "/podcast" },
  { name: "مقالات", path: "/article" },
  { name: "دوره ها", path: "/course" },
  { name: " صفحه اصلی", path: "/homepage" },
  { name: "کاربران", path: "/users" },
  { name: "سایر تنظیمات", path: "/settings" },
  { name: "خروج", path: "/" },
];

const SideBar = () => {
  const [currentItem, setCurrentItem] = useState<
    undefined | { name: string; path: string }
  >(undefined);
  const location = useLocation(); // Add this to get the location object

  useEffect(() => {
    const handleSetCurrentItem = () => {
      const currentPath = location.pathname;
      const current = items.find((item) => `/admin${item.path}` === currentPath);
      setCurrentItem(current);
    };
    handleSetCurrentItem();
  }, [location.pathname]);

  return (
    <div className="w-64 h-[calc(100vh-40px)] sticky right-0 top-5 bg-white shadow-lg rounded-s-2xl">
      <div className="flex flex-col items-end pt-5">
        {items.map((item, index) => (
          <Link
            to={item.path === '/' ? '/' : `/admin${item.path}`}
            key={`path-${index}`}
            className={clsx(
              "h-14 w-full flex items-center pe-10 rounded-sm overflow-hidden",
              item === currentItem ? "bg-gray-100 justify-between" : "justify-end"
            )}
          >
            {item === currentItem && (
              <div className="h-full w-1 bg-blue-900"></div>
            )}
            <p className="w-fit">{item.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;