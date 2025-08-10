import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';

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

const HeroMosaic: React.FC = () => {
  return (
    <div className="w-full max-w-xl h-[600px] mx-auto flex gap-4 mb-12">
      {/* First vertical swiper */}
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
            className="!h-[300px]" // fixed slide height
          >
            <img
              src={src}
              alt={`img-${idx}`}
              className="w-[283px] h-[300px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Second vertical swiper - slightly slower & offset */}
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
            className="!h-[365px]" // fixed slide height
          >
            <img
              src={src}
              alt={`img-${idx}`}
              className="w-[283px] h-[365px] object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};


const FeatureCard: React.FC<{ title?: string; desc?: string }> = ({ title, desc }) => {
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm">{title}</CardTitle>
          <div className="w-10 h-10 bg-neutral-200 rounded ml-3" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
        <div className="mt-4 text-xs text-muted-foreground flex justify-between">
          <span>ادامه ›</span>
          <span>مشاهده ›</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function HomePage() {
  const title = "لورم ایپسوم متن ساختگی با تولید سادگی";
  const paragraph =
    "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <main className="container mx-auto px-4 py-12">
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <HeroMosaic />
          </div>

          <div className="max-w-xl text-right">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4">{title}</h1>
            <p className="text-sm leading-relaxed mb-6 text-muted-foreground">{paragraph}</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 border rounded">join</button>
              <Button variant="default">Explore</Button>
            </div>
          </div>
        </section>

        {/* Intro paragraph centered below mosaic */}
        <section className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و
            متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز.
          </p>
        </section>

        {/* Feature cards row */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            title={title}
            desc={paragraph}
          />
          <FeatureCard
            title={title}
            desc={paragraph}
          />
          <FeatureCard
            title={title}
            desc={paragraph}
          />
        </section>

        {/* Large feature with image left, text right */}
        <section className="mt-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-neutral-200 rounded" />
          <div className="text-right">
            <h2 className="text-2xl font-bold mb-3">لورم ایپسوم متن ساختگی با تولید سادگی</h2>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
            </p>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <footer className="mt-20 bg-neutral-200 py-10">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
          <div className="text-right">
            <h3 className="text-xl font-bold">لورم ایپسوم متن ساختگی با تولید سادگی</h3>
            <p className="text-sm text-muted-foreground mt-2">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ</p>
          </div>
          <div className="mt-4 lg:mt-0 flex gap-3">
            <button className="px-4 py-2 border rounded">join</button>
            <Button variant="default">Explore</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
