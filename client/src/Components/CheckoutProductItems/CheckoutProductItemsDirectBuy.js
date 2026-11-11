import React, { useState } from "react";

import { useRouter } from "next/router";
import Image from "next/image";
const CheckoutProductItemsDirectBuy = ({
  product,
  handleSaveSizeInLocal,
  qyt,
  setQyt,
  setIsOpenSizeAndColor,
  setProductItem,
  inputSize,
  userColor,
}) => {
  const router = useRouter();
  const handleSizeAndColorWithModal = () => {
    setProductItem(product);
    setIsOpenSizeAndColor(true);
  };


  console.log("sixe",product)


  return (
    <div
      key={product?._id}
      className=" mb-2 p-2 rounded cursor-pointer hover:bg-accent duration-200 border"
    >
      <div className="flex gap-3 items-center">
        <div className="w-14 flex flex-col items-center justify-center gap-1">
          <Image
            width={50}
            height={50}
            src={product?.imageURLs[0]}
            alt="fdd"
            className="w-full h-14 object-cover rounded"
          />
          <div className="block md:hidden">
            <p className="text-xs line-through">৳{inputSize?.productPrice}</p>
            <p className="text-xs  font-bold ">৳{inputSize?.salePrice}</p>
          </div>
        </div>
        <div>
          <h1
            onClick={() => router.push(`/product/${product?._id}`)}
            className="font-medium text-sm"
          >
            {product?.name?.slice(0, 35)}...
          </h1>
          <div className="flex justify-betweens gap-2 items-end md:items-center">
            <div className="flex flex-col md:flex-row md:justify-end items-center gap-3 ">
              <div className="hidden md:block">
                <p className="text-xs line-through">৳{inputSize?.productPrice}</p>
                <p className="text-xs  font-bold ">৳{inputSize?.salePrice}</p>
              </div>
              <div className="flex items-center justify-start border-gray-300 border-2 rounded-md">
                <label
                  onClick={() => {
                    if (qyt < 2) {
                      return setQyt(1);
                    } else {
                      setQyt(--qyt);
                    }
                  }}
                  className="btn-xs text-3xl flex items-center"
                >
                  -
                </label>
                <input
                  type={"text"}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "none",
                  }}
                  className="input-square input-sm w-10 text-center font-bold "
                  value={qyt}
                  disabled
                />
                <label
                  onClick={() => setQyt(++qyt)}
                  className="btn-xs text-xl font-bold flex items-center"
                >
                  +
                </label>
              </div>
            </div> 
            <div>
              {inputSize?.size && (
                <div className="block md:flex  items-center">
                  <h2 className="p-2 font-bold text-lg">Size:</h2>
                  <div
                    onClick={handleSizeAndColorWithModal}
                    className={`mx-1 border items-center animate-bounce justify-center rounded-md font-bold bg-[#000] text-white cursor-pointer flex gap-2 p-1 text-xs `}
                  >
                    <span className="text-xs pt-[2px] block  text-center ">
                      {inputSize?.size}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div>
              {product?.productColor.length > 0 && (
                <div className="block md:flex  items-center ">
                  <h2 className="p-2 font-bold text-lg">Color:</h2>

                  <span
                    onClick={handleSizeAndColorWithModal}
                    className="w-6 h-6 block rounded-full ml-2 animate-bounce"
                    style={{ background: userColor }}
                  ></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProductItemsDirectBuy;