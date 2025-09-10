import React from "react";

const ProductSizePicker = ({ size, setSeleteVariant, seleteVariant }) => {
  const handleSize = (item) => {
    setSeleteVariant(item);
  };

  return (
    <>
      {size?.length > 1 && (
        <div>
          <h2 className="p-2 font-bold"> Size:</h2>

          <div className="flex flex-wrap gap-2 items-center mb-5">
            {size?.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSize(item)}
                className={` border items-center w-auto rounded-md font-bold ${
                  seleteVariant?.size === item?.size
                    ? "bg-[#000] text-white"
                    : "bg-[#fff] text-black"
                } cursor-pointer flex gap-2 px-3 py-2 `}
              >
                <span className="text-xs pt-[2px]">{item?.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSizePicker;
