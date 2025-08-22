import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaWhatsapp, FaTelegram, FaMusic, FaThreads, FaMessage } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const Footer: React.FC = () => {
  const socialLinks = [
    { href: "https://chat.whatsapp.com/BA8tfrDdRHrFGwCNQSTQy6", icon: FaWhatsapp, color: "text-green-500", name: 'واتساپ' },
    { href: "https://eitaa.com/karamodiriran", icon: FaMessage, color: "text-orange-400", name: 'ایتا' },
    { href: "https://telegram.me/alireza_yousefi_management", icon: FaTelegram, color: "text-blue-500", name: 'تلگرام' },
    { href: "https://www.threads.net/@alirezayousefi40", icon: FaThreads, color: "text-gray-600", name: 'شبکه اجتماعی Threads' },
    { href: "https://soundcloud.com/user-511667111", icon: FaMusic, color: "text-orange-500", name: 'Soundcloud' },
    { href: "https://www.facebook.com/alireza.yousefi.967", icon: FaFacebookF, color: "text-blue-700", name: 'فیسبوک' },
    { href: "https://twitter.com/alirezayousefii", icon: FaTwitter, color: "text-blue-400", name: 'توییتر' },
    { href: "https://www.youtube.com/channel/UCyuzEhGXzYvOMQs1PdK91cQ?view_as=subscriber", icon: FaYoutube, color: "text-red-600", name: 'یوتیوب' },
    { href: "https://instagram.com/management.today?igshid=x99j8teqek9v", icon: FaInstagram, color: "text-pink-500", name: 'اینستاگرام' }
  ];

  const navLinks = [
    { to: "/", label: "خانه" },
    { to: "/about", label: "درباره ما" },
    { to: "/courses", label: "دوره‌ها" },
    { to: "/videos", label: "ویدئوها" },
    { to: "/podcasts", label: "پادکست‌ها" },
    { to: "/articles", label: "مقالات" },
  ];

  const fetchFooterData = async () => {
    const { data } = await axios.get('/api/footer');
    return data;
  };

  const { data: footerData = { title: 'اطلاعیه', description: 'محتوای سفارشی از سوی مدیریت به زودی اضافه خواهد شد.' } } = useQuery({
    queryKey: ['footer-data'],
    queryFn: fetchFooterData,
  });

  return (
    <motion.footer
      className="text-slate-900 py-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" dir='rtl'>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Links Section */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 font-vazir">قبل از رفتن، این لینک‌ها را بررسی کنید</h3>
            <ul className="space-y-2">
              {navLinks.map((link, linkIndex) => (
                <li><Link to={link.to} className="text-sm hover:text-slate-600 text-slate-900 transition-colors font-vazir">{link.label}</Link></li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center relative"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 font-vazir">ما را دنبال کنید</h3>
            <div className="flex gap-4 flex-wrap justify-center absolute top-1/2 -translate-y-1/2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-full bg-gray-200 ${link.color} hover:bg-gray-300 transition-colors`}
                  aria-label={link.name}
                >
                  <link.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Admin Editable Section */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 font-vazir">{footerData.title}</h3>
            <p className="text-sm text-slate-600 font-vazir">{footerData.description}</p>
          </motion.div>
        </div>

        {/* Copyright and Developer Credit */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 font-vazir">
            © {new Date().getFullYear()} تمامی حقوق محفوظ است.
          </p>
          <p className="text-sm text-gray-400 mt-1">
            توسعه توسط <a href='mailto:parham.ghasemi.1388@gmail.com' className='text-blue-400 hover:underline'>پرهام قاسمی (parham.ghasemi.1388@gmail.com)</a>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;