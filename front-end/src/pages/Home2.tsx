import React from "react";
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

const images1 = [
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
];
const images2 = [
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
  'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg',
];
const image3 = 'http://localhost:3000/uploads/images/1751034700437-760365097.jpeg';

const HeroMosaic: React.FC = () => {
  return (
    <motion.div
      className="w-full max-w-xl h-[600px] mx-auto flex gap-4 mb-12"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Swiper
        direction="vertical"
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={20}
        loop
        speed={4000}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        className="w-[283px]"
      >
        {images1.map((src, idx) => (
          <SwiperSlide
            key={idx}
            className="!h-[300px]"
          >
            <motion.img
              src={src}
              alt={`img-${idx}`}
              className="w-[283px] h-[300px] object-cover"
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
        spaceBetween={20}
        loop
        speed={5000}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        allowTouchMove={false}
        className="w-[283px] translate-y-12"
      >
        {images2.map((src, idx) => (
          <SwiperSlide
            key={idx}
            className="!h-[365px]"
          >
            <motion.img
              src={src}
              alt={`img-${idx}`}
              className="w-[283px] h-[365px] object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};


const FeatureCard: React.FC<{ title?: string; desc?: string; image?: string; index: number }> = ({ title, desc, image, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2, ease: "easeOut" }}
    >
      <Card className="shadow-sm border flex flex-col h-full">
        <CardHeader>
          <div className="flex items-center justify-end">
            <CardTitle className="text-sm text-end">{title}</CardTitle>
            <img src={image} className="w-10 h-10 rounded ml-3 object-cover" alt={title} />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="text-sm leading-relaxed text-end">{desc}</CardDescription>
        </CardContent>
        <CardFooter className="justify-end">
          <motion.span
            className="hover:text-neutral-800 cursor-pointer text-xs text-muted-foreground"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            مشاهده ›
          </motion.span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const fetchMostViewed = (): Promise<ArticleShort[]> => axios.get("http://localhost:3000/articles/most-viewed").then(res => res.data);

export default function HomePage() {
  const title = "یادگیری، الهام و رشد در یک مکان";
  const paragraph =
    "در این وب‌سایت می‌توانید به مجموعه‌ای از مقالات تخصصی، ویدئوهای آموزشی، پادکست‌های الهام‌بخش و دوره‌های کاربردی دسترسی پیدا کنید. هدف ما کمک به ارتقای مهارت‌ها و توسعه فردی شماست.";

  const { data: mostViewedArticles = [], isLoading: loadingViewed } = useQuery({
    queryKey: ["articles", "mostViewed"],
    queryFn: fetchMostViewed,
  });

  return (
    <motion.div
      className="min-h-screen bg-white text-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <main className="container mx-auto px-4 py-12">
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <HeroMosaic />
          </div>

          <motion.div
            className="max-w-xl text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4">{title}</h1>
            <p className="text-sm leading-relaxed mb-6 text-muted-foreground">{paragraph}</p>
            <div className="flex gap-3 justify-end">
              <motion.button
                className="px-4 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ثبت‌نام
              </motion.button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="default" className="cursor-pointer">
                  مشاهده دوره‌ها
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <motion.section
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p>
            ما فضایی فراهم کرده‌ایم تا بتوانید از محتوای آموزشی باکیفیت در قالب‌های مختلف بهره‌مند شوید. از تازه‌ترین مقالات گرفته تا دوره‌های تخصصی، همه در خدمت رشد و یادگیری شماست.
          </p>
        </motion.section>

        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {mostViewedArticles && mostViewedArticles.length > 2
            ? mostViewedArticles.slice(0, 3).map((article, index) => (
              <FeatureCard
                key={index}
                title={article.title}
                desc={article.description}
                image={article.thumbnail}
                index={index}
              />
            ))
            : null}
        </section>

        <motion.section
          className="mt-16 grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.img
            src={image3}
            alt="آموزش آنلاین"
            className="h-80 rounded object-fit"
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
            <h2 className="text-2xl font-bold mb-3">مسیر یادگیری خود را آغاز کنید</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              با دوره‌های آموزشی متنوع، پادکست‌های انگیزشی و مقالات تخصصی، هر روز گامی به سمت پیشرفت و موفقیت بردارید.
            </p>
          </motion.div>
        </motion.section>
      </main>

      <motion.footer
        className="mt-20 bg-neutral-200 py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="text-right"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold">همراه شما در مسیر یادگیری</h3>
            <p className="text-sm text-muted-foreground mt-2">
              با محتوای آموزشی متنوع و به‌روز، مهارت‌های خود را ارتقا دهید و آینده‌ای بهتر بسازید.
            </p>
          </motion.div>
          <motion.div
            className="mt-4 lg:mt-0 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              className="px-4 py-2 rounded hover:bg-neutral-300 cursor-pointer transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ثبت‌نام
            </motion.button>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="default" className="cursor-pointer">
                مشاهده دوره‌ها
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
