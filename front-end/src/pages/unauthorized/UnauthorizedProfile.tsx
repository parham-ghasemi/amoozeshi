import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { motion } from "framer-motion";

const UnauthorizedProfile = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <Lock size={48} className="text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">شما وارد نشده‌اید</h2>
        <p className="text-gray-600 mb-6 text-sm">
          برای دسترسی به صفحه پروفایل ابتدا وارد حساب کاربری خود شوید.
        </p>
        <Link
          to="/auth"
          className="inline-block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors text-sm font-medium"
        >
          ورود به حساب
        </Link>
      </motion.div>
    </div>
  );
};

export default UnauthorizedProfile;
