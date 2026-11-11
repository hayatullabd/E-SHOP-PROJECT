import React, { useContext, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { reactLocalStorage } from "reactjs-localstorage";

import updateCartLocalStorage from "../../../lib/updateCartLocalStorage";
import CreateContext from "../../Components/CreateContex";
import { useRouter } from "next/router";
import Image from "next/image";

const CartProductItems = ({ product }) => {
  const { addToCartRefresher, setAddToCartRefresher } =
    useContext(CreateContext);
  const router = useRouter();

  const handleIncreaseProduct = () => {
    const action = "add";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);
    // let newCount = count + 1;
    // setCount(newCount);
  };
  const handleDecreseProduct = () => {
    const action = "minus";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);

    /*    let newCount = count - 1;
    setCount(newCount); */
  };

  const handleDeleteCartItem = () => {
    updateCartLocalStorage({ product, action: "delete" });
    setAddToCartRefresher(!addToCartRefresher);
  };
  const productView = () => {
    router.push(`/product/${product?._id}`);

    window.gtag("event", "view_item", {
      currency: "BDT",
      value: product?.salePrice,
      items: [
        {
          item_id: product?._id,
          item_name: product?.name,
          price: product?.salePrice,
          quantity: 1,
        },
      ],
    });
  };
  return (
    <div className=" ">
      <div className="flex items-center gap-3 bg-primary bg-opacity-25 border-y-base-300 p-3 md:py-4 md:px-7 border">
        <div className="flex items-center w-1/3 overflow-hidden">
          <Image
            src={product?.image}
            alt="product"
            width={100}
            height={100}
            className=" object-cover bg-white p-1 border-2 border-gray-200  h-full w-[150px]"
          />
        </div>
        {/* --------info------------ */}
        <div className="w-2/3">
          <div className="">
            <div>
              <h2
                onClick={() => {
                  productView();
                }}
                className="text-sm text-slate-900  flex-wrap cursor-pointer hover:scale-105 duration-150"
              >
                {product?.productTitle?.length > 55
                  ? product?.productTitle.slice(0, 55) + "..."
                  : product?.productTitle}
              </h2>
              <div className=" flex items-end mt-2">
                <div>
                  <p className="text-slate-800  text-sm font-bold mb-1">
                    ৳ {product?.salePrice}
                  </p>
                  {product.quantity > 1 && (
                    <p className="text-xl font-bold text-slate-900">
                      ৳{product?.itemTotal}
                    </p>
                  )}
                  <p className="text-slate-800 line-through text-xs mb-1">
                    ৳ {product.price}
                  </p>
                </div>
                <div className=" ml-auto flex items-center">
                  <div>
                    <div className="flex items-center justify-start border-gray-300 border-2 rounded-md">
                      <button
                        onClick={handleDecreseProduct}
                        className="btn-xs text-3xl flex items-center"
                      >
                        -
                      </button>
                      <input
                        type={"text"}
                        style={{
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                        className="input-square input-sm w-8 font-bold "
                        value={product?.quantity}
                        disabled
                      />
                      <button
                        onClick={handleIncreaseProduct}
                        className="btn-xs text-xl font-bold flex items-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button className=" ml-2" onClick={handleDeleteCartItem}>
                    <MdDeleteForever
                      size={25}
                      className="text-red-600 hover:text-red-900 duration-150"
                    />
                  </button>
                </div>
              </div>
              {product?.userSize?.size && (
                <div className="block md:flex  items-center">
                  <h2 className="p-2 font-bold text-lg">Size:</h2>
                  <div
                    className={`mx-1 border items-center animate-bounce justify-center rounded-md font-bold bg-[#000] text-white cursor-pointer flex gap-2 p-1 text-xs `}
                  >
                    <span className="text-xs text-center block pt-[2px]">
                      {product?.userSize?.size}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductItems;
