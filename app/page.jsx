'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Mission from "@/components/Mission";
import Check from "@/components/check";

const Home = () => {
  return (
    <>
      <div className="">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Mission/>
        <Check/>
        <Banner />
        <NewsLetter />
      </div>
    </>
  );
};

export default Home;
