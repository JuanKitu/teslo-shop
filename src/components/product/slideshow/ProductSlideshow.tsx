'use client';
import React, { useState } from 'react';
import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { ProductImage } from '@/components';

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export function ProductSlideshow({ images, title, className }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      {/* 🔹 Slider principal */}
      <Swiper
        style={
          {
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties
        }
        spaceBetween={10}
        navigation
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-lg">
              <ProductImage src={image} alt={title} fill className="object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🔹 Thumbnails */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            {/* 🧱 Mantiene todas las miniaturas cuadradas */}
            <div className="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer">
              <ProductImage
                src={image}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
