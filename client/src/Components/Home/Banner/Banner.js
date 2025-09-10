import React from "react";
import SidebarMenu from "./SiebarMenu";
import SliderInHeader from "./SliderInHeader";

const Banner = ({ data , catagories}) => {
  return (
    <div className=" md:pb-5">
    <div className="mid-container mx-auto px-1 m:px-2">
      <div className="flex gap-0 md:gap-3">
        <div className="lg:w-[270px] lg:block hidden max-h-[370px] bg-white p-2 mt-4  rounded-sm">
          <h2 className=" font-bold px-5 py-2 text-lg border-b border-b-gray-300">Category</h2>
          <SidebarMenu catagories={catagories} />
        </div>
        {/* -----------------------------slider */}
        <div className="lg:w-[73%] w-full mt-2 md:mt-4 ">
          <SliderInHeader data={data} />
        </div>
      </div>
    </div>
  </div>
  );
};

export default Banner;
