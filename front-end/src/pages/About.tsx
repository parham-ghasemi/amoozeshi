import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram, FaWhatsapp, FaTelegram, FaMusic, FaThreads, FaMessage } from 'react-icons/fa6';
import { FiDownload } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from './about/aboutdata';

const About: React.FC = () => {
  const [language, setLanguage] = useState<'fa' | 'en'>('fa');

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.03, transition: { duration: 0.2 } }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.95 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const socialLinks = [
    { href: "https://chat.whatsapp.com/BA8tfrDdRHrFGwCNQSTQy6", icon: FaWhatsapp, color: "text-green-500", name: language === 'fa' ? 'واتساپ' : 'WhatsApp' },
    { href: "https://eitaa.com/karamodiriran", icon: FaMessage, color: "text-orange-400", name: language === 'fa' ? 'ایتا' : 'Eitaa' },
    { href: "https://telegram.me/alireza_yousefi_management", icon: FaTelegram, color: "text-blue-500", name: language === 'fa' ? 'تلگرام' : 'Telegram' },
    { href: "https://www.threads.net/@alirezayousefi40", icon: FaThreads, color: "text-gray-600", name: language === 'fa' ? 'شبکه اجتماعی Threads' : 'Threads' },
    { href: "https://soundcloud.com/user-511667111", icon: FaMusic, color: "text-orange-500", name: language === 'fa' ? 'Soundcloud' : 'Soundcloud' },
    { href: "https://www.facebook.com/alireza.yousefi.967", icon: FaFacebookF, color: "text-blue-700", name: language === 'fa' ? 'فیسبوک' : 'Facebook' },
    { href: "https://twitter.com/alirezayousefii", icon: FaTwitter, color: "text-blue-400", name: language === 'fa' ? 'توییتر' : 'Twitter' },
    { href: "https://www.youtube.com/channel/UCyuzEhGXzYvOMQs1PdK91cQ?view_as=subscriber", icon: FaYoutube, color: "text-red-600", name: language === 'fa' ? 'یوتیوب' : 'YouTube' },
    { href: "https://instagram.com/management.today?igshid=x99j8teqek9v", icon: FaInstagram, color: "text-pink-500", name: language === 'fa' ? 'اینستاگرام' : 'Instagram' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 p-1">
            <Button
              variant={language === 'en' ? 'default' : 'ghost'}
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${language === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
            >
              English
            </Button>
            <Button
              variant={language === 'fa' ? 'default' : 'ghost'}
              onClick={() => setLanguage('fa')}
              className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${language === 'fa' ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'} ${language === 'fa' ? 'font-vazir' : ''}`}
            >
              فارسی
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            dir={language === 'fa' ? 'rtl' : 'ltr'}
          >
            {/* Header Section */}
            <motion.section
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                {content[language].title}
              </h1>
              <p className={`text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto ${language === 'fa' ? 'font-vazir' : ''}`}>
                {content[language].subtitle}
              </p>
            </motion.section>

            {/* Summary of Activities Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className={`text-2xl font-semibold ${language === 'fa' ? 'font-vazir' : ''}`}>
                    {content[language].summaryTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 text-gray-600 dark:text-gray-300 ${language === 'fa' ? 'font-vazir' : ''}`}>
                  <AnimatePresence>
                    {content[language].summaryText.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.section>

            {/* Contact and Resume Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {/* Contact Section */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className={`text-2xl font-semibold ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {content[language].contactTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-gray-600 dark:text-gray-300 mb-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {content[language].contactText}
                    </p>
                    <TooltipProvider>
                      <div className="flex overflow-x-auto space-x-3 pb-2">
                        {socialLinks.map((link, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <motion.a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${link.color} flex-shrink-0`}
                              >
                                <link.icon className="h-5 w-5" />
                              </motion.a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className={`${language === 'fa' ? 'font-vazir' : ''}`}>{link.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Resume Section */}
              <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover="hover">
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className={`text-2xl font-semibold flex items-center gap-2 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      <FiDownload className="h-6 w-6" /> {content[language].resumeTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-gray-600 dark:text-gray-300 mb-4 ${language === 'fa' ? 'font-vazir' : ''}`}>
                      {content[language].resumeText}
                    </p>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button asChild>
                        <a href="/path-to-resume.pdf" download className="flex items-center gap-2">
                          <FiDownload className="h-4 w-4" /> {content[language].resumeButton}
                        </a>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Articles Section */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-12"
            >
              <Card className="shadow-lg bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className={`text-2xl font-semibold ${language === 'fa' ? 'font-vazir' : ''}`}>
                    {content[language].articlesTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-gray-600 dark:text-gray-300 ${language === 'fa' ? 'font-vazir' : ''}`}>
                    {content[language].articlesText}
                  </p>
                </CardContent>
              </Card>
            </motion.section>

            <Separator className="my-8" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default About;