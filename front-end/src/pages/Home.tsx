import React from "react";
import { GiQuill, GiQuillInk, GiScrollQuill } from "react-icons/gi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { ArticleShort } from "types/article";
import { Link, useNavigate } from "react-router-dom";
import authAxios from "@/lib/authAxios";

const HeroMosaic = ({ images1, images2 }: { images1: string[], images2: string[] }) => {
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024;
  const combinedImages = [...images1, ...images2];

  return (
    <motion.div
      className="w-full lg:max-w-xl h-[200px] sm:h-[300px] lg:h-[600px] flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 sm:mb-12 lg:mb-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {isSmallScreen ? (
        <Swiper
          direction="horizontal"
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={0}
          loop
          speed={4000}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          allowTouchMove={true}
          className="w-full h-[200px] sm:h-[300px]"
        >
          {combinedImages.map((src, idx) => (
            <SwiperSlide
              key={idx}
              className="!w-full !h-full"
            >
              <motion.img
                src={src}
                alt={`img-${idx}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <Swiper
            direction="vertical"
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={10}
            loop
            speed={4000}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            allowTouchMove={false}
            className="w-full sm:w-[48%] h-full"
          >
            {images1.map((src, idx) => (
              <SwiperSlide
                key={idx}
                className="!h-[150px] sm:!h-[200px] lg:!h-[300px]"
              >
                <motion.img
                  src={src}
                  alt={`img-${idx}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            direction="vertical"
            modules={[Autoplay]}
            slidesPerView="auto"
            spaceBetween={10}
            loop
            speed={5000}
            autoplay={{
              delay: 1,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            allowTouchMove={false}
            className="w-full sm:w-[48%] h-full translate-y-4 sm:translate-y-8 lg:translate-y-12"
          >
            {images2.map((src, idx) => (
              <SwiperSlide
                key={idx}
                className="!h-[150px] sm:!h-[200px] lg:!h-[365px]"
              >
                <motion.img
                  src={src}
                  alt={`img-${idx}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </motion.div>
  );
};

const FeatureCard: React.FC<{ title?: string; desc?: string; image?: string; index: number; id: string }> = ({ title, desc, image, index, id }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
    >
      <Card className="shadow-sm border flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center justify-end">
            <CardTitle className="text-xs sm:text-sm text-end">{title}</CardTitle>
            <img src={image} className="w-8 h-8 sm:w-10 sm:h-10 rounded ml-2 sm:ml-3 object-cover" alt={title} />
          </div>
        </CardHeader>
        <CardContent className="flex-grow" dir="rtl">
          <CardDescription className="text-xs sm:text-sm leading-relaxed">{desc}</CardDescription>
        </CardContent>
        <CardFooter className="justify-end" dir="rtl">
          <motion.span
            className="hover:text-neutral-800 cursor-pointer text-xs text-muted-foreground"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={`/article/${id}`}>
              مشاهده ›
            </Link>
          </motion.span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const StatsCard: React.FC<{ title: string; content: string; index: number }> = ({ title, content, index }) => {
  console.log(title)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
    >
      <Card className="border flex flex-col h-full items-center justify-center gap-2.5 text-center py-6 px-4 hover:shadow-xl transition cursor-pointer" dir="rtl">
        <GiScrollQuill size={50} className="text-neutral-800 mb-5" />
        <p className="text-lg font-semibold text-neutral-800">{title}</p>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-900">{content}</h3>
      </Card>
    </motion.div>
  );
};

interface HomePageData {
  heroTitle: string;
  heroDescription: string;
  middleText: string;
  sectionTitle: string;
  sectionDescription: string;
  footerTitle: string;
  footerDescription: string;
  mosaicImages1: string[];
  mosaicImages2: string[];
  sectionImage: string;
  statsCards: { title: string; content: string }[];
}


const fetchMostViewed = (): Promise<ArticleShort[]> => axios.get("/api/articles/most-viewed").then(res => res.data);
const fetchHomePage = (): Promise<HomePageData> => axios.get("/api/homepage").then(res => res.data);

export default function HomePage() {
  const navigator = useNavigate();

  const { data: mostViewedArticles = [], isLoading: loadingViewed } = useQuery({
    queryKey: ["articles", "mostViewed"],
    queryFn: fetchMostViewed,
  });
  const { data: homepage, isLoading: loadinghomepage } = useQuery({
    queryKey: ['homepage-stuff'],
    queryFn: fetchHomePage,
  });
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

  return (
    <motion.div
      className="min-h-screen bg-white text-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center">
          <div className="flex justify-center">
            {homepage?.mosaicImages1 && homepage.mosaicImages2 && <HeroMosaic images1={homepage?.mosaicImages1} images2={homepage?.mosaicImages2} />}
          </div>

          <motion.div
            className="max-w-full sm:pr-5 text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-extrabold mb-4" dir="rtl">{homepage?.heroTitle}</h1>
            <p className="text-xs sm:text-sm leading-relaxed mb-6 text-muted-foreground" dir="rtl">{homepage?.heroDescription}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <motion.button
                className="px-4 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition w-full sm:w-auto"
                onClick={() => navigator('/auth')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!user && ' ثبت‌نام '}
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button variant="default" className="cursor-pointer w-full sm:w-auto" onClick={() => navigator('/courses')} >
                  مشاهده دوره‌ها
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="mt-8 text-center text-xs sm:text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p dir="rtl">
            {homepage?.middleText}
          </p>
        </motion.section>

        <section className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {mostViewedArticles && mostViewedArticles.length > 2
            ? mostViewedArticles.slice(0, 3).map((article, index) => (
              <FeatureCard
                key={index}
                title={article.title}
                desc={article.description}
                image={article.thumbnail}
                index={index}
                id={article._id}
              />
            ))
            : null}
        </section>

        <motion.section
          className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center "
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.img
            src={homepage?.sectionImage}
            alt="آموزش آنلاین"
            className="w-full h-48 sm:h-64 lg:h-80 rounded object-cover"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3" dir="rtl">{homepage?.sectionTitle}</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground mb-6" dir="rtl">
              {homepage?.sectionDescription}
            </p>
          </motion.div>
        </motion.section>

        {homepage?.statsCards && (
          <section className={`mt-8 grid grid-cols-1 sm:grid-cols-${homepage.statsCards.length >= 2 ? 2 : homepage.statsCards.length} lg:grid-cols-${homepage.statsCards.length >= 4 ? 4 : homepage.statsCards.length} gap-4 sm:gap-6`}>
            {homepage.statsCards.slice(0, 4).map((card, index) => (
              <StatsCard
                key={index}
                title={card.title}
                content={card.content}
                index={index}
              />
            ))}
          </section>
        )}
      </main>

      <motion.footer
        className="mt-8 bg-neutral-200 py-8 sm:py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg sm:text-xl font-bold" dir="rtl">{homepage?.footerTitle}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2" dir="rtl">
              {homepage?.footerDescription}
            </p>
          </motion.div>
          <motion.div
            className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              className="px-4 py-2 rounded hover:bg-neutral-300 cursor-pointer transition w-full sm:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigator('/auth')}
            >
              {!user && ' ثبت‌نام '}
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button variant="default" className="cursor-pointer w-full sm:w-auto" onClick={() => navigator('/courses')} >
                مشاهده دوره‌ها
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}