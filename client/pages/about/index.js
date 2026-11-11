import React from "react";
import SecondaryImageCover from "../../src/Shared/SecondaryImageCover";
import Head from "next/head";
import { useQuery } from "react-query";
import Image from "next/image";
import GoogleMap from "../../src/Shared/GoogleMap";

const AboutUs = () => {
  return (
    <div>
      <Head>
        <title>About Us | Ecommerce Website</title>
      </Head>
      <SecondaryImageCover title={"about us"} />
      <div className="mid-container">
        <div className="w-full md:w-2/3 mx-auto  py-5">
          <div>
            <h2 className="font-bold text-3xl text-center my-5">
              Welcome to our UU ESHOP
            </h2>
            <p className="text-justify">
              At UU-ESHOP, we believe in bringing you an unparalleled shopping experience that caters to all your needs under one virtual roof. From the latest gadgets to trendy fashion, from home essentials to delightful gifts, we've curated a diverse collection to delight every shopper.


              <br />
              <br />
              Discover Endless Choices:
              Explore our extensive range of products carefully selected to meet the demands of modern living. Whether you're searching for stylish apparel to revamp your wardrobe, cutting-edge electronics to upgrade your tech game, or unique decor pieces to personalize your space, UU-ESHOP has you covered.
            </p>
          </div>
       
        </div>
        {/* <div className="my-5">
         <GoogleMap />
        </div> */}
      </div>
    </div>
  );
};

export default AboutUs;
