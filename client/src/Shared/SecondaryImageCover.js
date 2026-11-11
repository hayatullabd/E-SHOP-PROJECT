
import Image from "next/image";
import React from "react";

const SecondaryImageCover = ({ title }) => {
  return (
    <div className="h-[150px] md:h-[250px] relative flex justify-center items-center bg-slate-200">
      <Image
        src={"/assets/contact.png"}
        alt="Picture of the author"
        width={1080}
        height={720}
        className="w-full h-full absolute md:object-cover"
      />
      <h1 className="font-black sm:text-3xl md:text-4xl text-white  capitalize absolute">
        {title}
      </h1>
    </div>
  );
};

export default SecondaryImageCover;
