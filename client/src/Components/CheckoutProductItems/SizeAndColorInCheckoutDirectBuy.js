import React, { useContext, useState } from "react";
import CreateContext from "../CreateContex";
import updateCartLocalStorage from "../../../lib/updateCartLocalStorage";
import ProductColorPicker from "../ProductSection/ProductColorPicker";

const SizeAndColorInCheckoutDirectBuy = ({
  product,
  setIsOpen,
  userSizeAndColor,
}) => {
  const [sizeIndex, setSizeIndex] = useState(0);

  const { inputSize, setInputSize, userColor, setUserColor } = userSizeAndColor;

  const { setAddToCartRefresher, addToCartRefresher } =
    useContext(CreateContext);
  const handleSaveSizeInLocal = () => {
    product.userSize = inputSize;
    product.userColor = userColor;
    const action = "size";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);
  };

  const handleSize = (index, item) => {
    setSizeIndex(index);
    setInputSize(item);
  };
  return (
    <div>
    
      {product.variant?.length > 1 && (
        <>
         <h2 className="p-2 font-bold">Size:</h2>
        <div className="flex flex-wrap mb-2">
          {product?.variant?.map((item, index) => (
            <>
              <div
                onClick={() => handleSize(index, item)}
                key={index}
                className={`mx-1 border items-center rounded-md font-bold ${
                  item === inputSize
                    ? "bg-[#000] text-white"
                    : "bg-[#fff] text-black"
                } cursor-pointer flex gap-2 p-1 text-xs `}
              >
                <span className="text-xs pt-[2px]">{item?.size}</span>
              </div>
            </>
          ))}
        </div>
        </>
      )}
      {product?.productColor?.length > 0 && (
        <ProductColorPicker
          productColor={product?.productColor}
          setUserProductColor={setUserColor}
          userProductColor={userColor}
        />
      )}
      <button
        onClick={() => {
          handleSaveSizeInLocal();
          setIsOpen(false);
        }}
        className="bg-primary px-5 py-1 text-white rounded-sm mt-3 hover:bg-opacity-0 hover:text-primary duration-150 border border-primary"
      >
        Save
      </button>
    </div>
  );
};

export default SizeAndColorInCheckoutDirectBuy;
