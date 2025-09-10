import React, { useEffect, useState } from "react";

import Drawer from "react-modern-drawer";
import { BiHeart } from "react-icons/bi";

import "react-modern-drawer/dist/index.css";
import WishlistProductItems from "./WishlistProductItems";
import { useMediaQuery } from "@react-hook/media-query";

const WishlilstDrawer = ({
  isOpenWishlist,
  toggleDrawerWishlist,
  dir,
  products,
}) => {
  const [mobile, setMobile] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");

  useEffect(() => {
    if (isSmallScreen) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [isSmallScreen]);

  return (
    <>
      <Drawer
        open={isOpenWishlist}
        onClose={toggleDrawerWishlist}
        direction={dir}
        className=" "
        style={mobile ? { width: "85%" } : { width: "400px" }}
      >
        <div className="bg-primary p-3 md:py-4 md:px-7">
          <div className="flex justify-between">
            <span className="flex items-center text-white gap-2">
              <BiHeart size={26} />
              <span className="text-xl font-bold">Wishlist</span>
            </span>
            <span className=" p-3">
              <button
                onClick={toggleDrawerWishlist}
                className="text-white hover:text-red-500"
              >
                <span>x</span> close
              </button>
            </span>
          </div>
        </div>
        {/* ------------------------items------------------- */}

        <div className=" overflow-y-scroll h-[85%]">
          {products?.items?.map((product) => (
            <WishlistProductItems key={product._id} product={product} />
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default WishlilstDrawer;
