import React from "react";

const ProductColorPicker = ({
  productColor,
  setUserProductColor,
  userProductColor,
}) => {
  return (
    <>
      {productColor?.length >= 1 && (
        <div>
          <h2 className="p-2 font-bold">Color:</h2>

          <div className="flex gap-2 mb-2 items-center px-2">
            {productColor.map((clr, index) => (
              <span key={index}>
                <span
                  className={`bg-white  p-1 rounded-full w-9 flex justify-center items-center ju h-9`}
                  style={
                    clr === userProductColor
                      ? { border: `5px solid  ${clr}` }
                      : { background: "#fff" }
                  }
                >
                  <span
                    onClick={() => {
                      setUserProductColor(clr);
                    }}
                    className={`w-5 h-5 rounded-full inline-block  hover:scale-105 cursor-pointer  `}
                    style={{ background: clr, color: clr }}
                  ></span>
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductColorPicker;
