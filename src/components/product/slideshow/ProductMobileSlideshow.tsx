'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import { ProductImage } from '@/components';
interface Props {
  images: string[];
  title: string;
  className?: string;
}
export function ProductMobileSlideshow({ images, title, className }: Props) {
  return (
    <div className={`${className}`}>
      <Swiper
        style={{
          width: '100vw',
          height: '500px',
        }}
        pagination
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <ProductImage
              width={1024}
              height={800}
              alt={title}
              className="object-fill"
              src={image}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
