import React, { useEffect } from "react";
import BDAutoCity from "../../BDAutoCity";
import { useForm } from "react-hook-form";
import { useState } from "react";
import UserInformation from "../CustomOrder/UserInformation";
import ApplyCustomCoupon from "../CustomOrder/ApplyCustomCoupon";
import CheckoutProductItems from "../../CheckoutProductItems/CheckoutProductItems";
import { useRouter } from "next/router";
import { useContext } from "react";
import CreateContext from "../../CreateContex";
import swal from "sweetalert";
import { handlePostMethod } from "../../../../lib/usePostHooks";
import {
  sumOfCartPrice2,
  sumOfSalePrice2,
} from "../../../../lib/commonFunction";
import { usePostOrder } from "../../../../lib/usePostOrder";
import CustomModal from "../../../Shared/CustomModal";
import SizeAndColorInCheckout from "../../CheckoutProductItems/SizeAndColorInCheckout";
import server_url from "../../../../lib/config";
import SizeAndColorInCheckout2 from "../../CheckoutProductItems/SizeAndColorInCheckout2";
import CheckoutProductItems2 from "../../CheckoutProductItems/CheckoutProductItems2";

const CheckOut = ({ data, loading }) => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [inputSize, setInputSize] = useState("");
  const [userColor, setUserColor] = useState("");
  // const [loading, setLoading] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState({});
  const [productData, setProductData] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [cityErrorMessage, setCityErrorMessage] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [originalPriceTotal, setOriginalPriceTotal] = useState(0);
  const [totalPriceOfCartItem, setTotalPriceOfCartItem] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [modalIsOpenSizeAndColor, setIsOpenSizeAndColor] = useState(false);
  const [databaseCartAndPriceTotal, setDatabaseCartAndPriceTotal] = useState({
    cartTotal: 0,
    originalProductPrice: 0,
  });
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    setAllProducts(data?.products);
  }, [data?.products]);

  // when user click in size set product item
  const [productItem, setProductItem] = useState({});

  const router = useRouter();

  const {
    buyNowProduct,
    setAddToCartRefresher,
    addToCartRefresher,
    setOrderResponse,
    setQueryFromCategory,
  } = useContext(CreateContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    reset,
    setValue,
  } = useForm();

  // -------------------find product using id----------------
  const getTotalSalePrice = (products) => {
    let totalSalePrice = 0;
    // Iterate through each product and calculate the total sale price
    products?.forEach((product) => {
      totalSalePrice += product?.userSize?.salePrice * product.quantity;
    });

    return totalSalePrice;
  };

  const getTotalproductPrice = (products) => {
    let totalSalePrice = 0;
    // Iterate through each product and calculate the total sale price
    products.forEach((product) => {
      totalSalePrice += product?.userSize?.productPrice * product.quantity;
    });

    return totalSalePrice;
  };

  useEffect(() => {
    setCouponDiscount(0);
    setCartTotal(getTotalSalePrice(allProducts));
    setOriginalPriceTotal(getTotalproductPrice(allProducts));
  }, [allProducts]);

  // console.log("form local storage", productIdAndQuantity);
  let productsArr = [];
  if (allProducts) {
    productsArr = allProducts?.map((p) => ({
      product: p._id,
      name: p.productTitle,
      price: p?.userSize.salePrice,
      originalProductPrice: p?.userSize?.productPrice,
      quantity: p.quantity,
      imageURL: p.image,
      size: p?.userSize.size,
      variant: p?.userSize._id,
      color: p?.userColor || "",
      category: p.category,
    }));
  }

  // useEffect(() => {
  //   if (allProducts) {
  //     const productIdAndQuantity = allProducts?.map((item) => {
  //       return { id: item?._id, quantity: item?.quantity };
  //     });
  //     const url = "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/order/get-total-price";
  //     handlePostMethod(url, productIdAndQuantity, setTotalPriceOfCartItem);
  //   }
  //   if (allProducts?.length > 0) {
  //     const totalOriginal = sumOfSalePrice2(allProducts);
  //     setOriginalPriceTotal(totalOriginal);
  //     // its function response product id and q to product sale price total and original price total
  //     sumOfCartPrice2(allProducts, setDatabaseCartAndPriceTotal);
  //   } else {
  //     setOriginalPriceTotal(0);
  //     setDatabaseCartAndPriceTotal({
  //       cartTotal: 0,
  //       originalProductPrice: 0,
  //     });
  //   }
  //   setCouponDiscount(0);
  // }, [allProducts]);

  const onSubmitForm = async (data) => {
    // if (!selectedCity) {
    //   return setCityErrorMessage(true);
    // }
    // setCityErrorMessage(false);
    setIsOpen(true);

    const newOrder = {
      orderItem: productsArr,
      // user: isExistUser ? user?._id : "",
      shippingPrice: Number(shippingCost),
      totalAmount: cartTotal + Number(shippingCost) - couponDiscount,
      afterDiscountPrice: cartTotal - couponDiscount,
      originalProductPrice: originalPriceTotal,
      discount: originalPriceTotal - cartTotal + couponDiscount,
      couponDiscount,
      shippingAddress: {
        address: data.address,
        city: selectedCity,
        thana: data.thana || "",
        email: "",
        firstName: data.firstName, //frisName mane backend a fullName hisabe jacche, ekhan theke firstName e pathate hobe
        lastName: data.lastName || "",
        phone: data.phone,
        postalCode: data.postal || "",
      },
    };
    newOrder.paymentDetails = {
      method: "cod",
    };


    const url = `${server_url}/order`;
    usePostOrder(url, newOrder, setOrderResponse, router);

    // setOrder(newOrder);
  };

  // const handleSaveSizeInLocal = (size) => {
  //     setInputSize(size);
  // };
  // const handleDelete = (id) => {
  //     setallProducts((prevTotalProduct) => prevTotalProduct.filter(product => product._id !== id));
  // }

  console.log("orgenal", originalPriceTotal);

  const handleIncreaseProduct = (product) => {
    const update = allProducts?.map((pro) => {
      if (pro._id !== product._id) return pro;
      return { ...pro, quantity: pro.quantity + 1 };
    });
    setAllProducts(update);
  };

  const handleDecreseProduct = (product) => {
    const update = allProducts?.map((pro) => {
      if (pro._id !== product._id) return pro;
      return { ...pro, quantity: pro.quantity === 1 ? 1 : pro.quantity - 1 };
    });
    setAllProducts(update);
  };

  console.log(allProducts);

  return (
    <div className="pt-10 md:pt-20">
      <div
        id="palace-order"
        className="border-2 md:border-[5px] border-primary rounded-lg px-4 py-3 md:px-8 md:py-6 my-8"
      >
        <div className="bg-primary px-4 py-2 rounded-lg mb-5">
          <h1 className="text-[18px] md:text-[28px] font-bold text-center text-white">
            অর্ডার করতে নিচের ফর্মটি সঠিক তথ্য দিয়ে পূরণ করুন
          </h1>
        </div>

        {/* ---------order form------------- */}
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className=" block md:flex justify-center gap-5">
            <div className="w-full md:w-[55%] bg-primary/20 p-5 md:p-9 rounded-xl shadow h-fit mb-3 md:mb-0 ">
              {/* <h1 className="font-semibold mb-2">01. Personal Address</h1> */}
              <div className="grid grid-cols-1">
                <div className=" p mb-4">
                  <label htmlFor="name" className="leading-7 text-sm ">
                    {/* ekhane first name chilo, ekhon sudo diract fulll name hobe, tai ekhane first name er poriborte sudo label ta change hobe, last name a kichu jabe na, tai empnty string jabe */}
                    আপনার নাম
                  </label>
                  <input
                    type="name"
                    id="firstName"
                    name="first_name"
                    className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                    placeholder="আপনার নাম"
                    {...register("firstName", {
                      required: "Full Name is required",
                    })}
                    onKeyUp={(e) => {
                      trigger("firstName");
                    }}
                  />
                  <small className="text-[#FF4B2B] text-xs font-medium my-2">
                    {errors?.firstName?.message}
                  </small>
                </div>
                <div className=" p mb-4">
                  <label htmlFor="name" className="leading-7 text-sm ">
                    মোবাইল নাম্বার
                  </label>
                  <input
                    type="number"
                    id="phone"
                    name="phone"
                    className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                    placeholder="মোবাইল নাম্বার"
                    {...register("phone", {
                      required: "Phone is required",
                    })}
                    onKeyUp={(e) => {
                      trigger("phone");
                    }}
                  />
                  <small className="text-[#FF4B2B] text-xs font-medium my-2">
                    {errors?.phone?.message}
                  </small>
                </div>
              </div>
              <div className="relative mb-4">
                <label htmlFor="message" className="leading-7 text-sm">
                  আপনার ঠিকানা
                </label>
                <input
                  type="address"
                  id="address"
                  name="address"
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none "
                  placeholder="আপনার ঠিকানা"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  onKeyUp={(e) => {
                    trigger("address");
                  }}
                />
                <small className="text-[#FF4B2B] text-xs font-medium my-2">
                  {errors?.address?.message}
                </small>
              </div>
              {/* <h1 className="font-semibold my-2">02. Shipping Address</h1> */}
              <div className="w-full mb-4 mt-2">
                <BDAutoCity
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                  setShippingCost={setShippingCost}
                />
                <p className="text-red-500 text-xs">
                  {cityErrorMessage && "Please Select city"}
                </p>
              </div>
            </div>

            {/* Cart Product */}
            <div className="w-full md:w-[45%] bg-white rounded-xl shadow p-5 relative">
              <h1 className="mb-1 font-semibold title-font">Product List</h1>

              <div className=" overflow-y-scroll max-h-96">
                {allProducts?.length &&
                  allProducts?.map((product, index) => (
                    <>
                      <div key={index} className="">
                        <CheckoutProductItems2
                          product={product}
                          handleDecreseProduct={handleDecreseProduct}
                          handleIncreaseProduct={handleIncreaseProduct}
                          sizeIndex={sizeIndex}
                          setProductItem={setProductItem}
                          setIsOpenSizeAndColor={setIsOpenSizeAndColor}
                        />
                      </div>
                    </>
                  ))}
              </div>

              <div className="mt-5">
                <h1 className="font-semibold border-b-[1px] pb-2 mb-5">
                  Order Summery
                </h1>

                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">Products Total</h1>
                  <p>৳ {originalPriceTotal}</p>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">After Discount Total</h1>
                  <p className="font-bold">৳ {cartTotal - couponDiscount}</p>
                </div>
                {couponDiscount > 0 && (
                  <small className="text-green-500 text-end block font-bold">
                    You got Coupon Discount {couponDiscount} TK.
                  </small>
                )}
                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">Discount Amount</h1>
                  <p>৳ {originalPriceTotal - cartTotal + couponDiscount}</p>
                </div>
                <div className="flex justify-between items-center  text-sm mb-2">
                  <h1 className="font-medium">Delivery Fee</h1>
                  <p className="font-bold">৳{shippingCost}</p>
                </div>
                <div className="flex justify-between items-center  text-sm">
                  <h1 className="font-medium">Total</h1>
                  <p className="text-green-800 font-bold">
                    ৳ {cartTotal + Number(shippingCost) - couponDiscount}
                  </p>
                </div>
                <p className="text-xs text-end">
                  VAT included, where applicable
                </p>

                <div className="grid grid-cols-1 gap-5 mt-5">
                  <button
                    disabled={!allProducts?.length}
                    type="submit"
                    className="text-white btn btn-success border-0 py-2 px-6 focus:outline-none w-full rounded hover:bg-green-900"
                  >
                    অর্ডার কনফার্ম করুন
                  </button>
                </div>
                {/* --------------coupon method ------------------- */}
                <ApplyCustomCoupon
                  setCouponDiscount={setCouponDiscount}
                  product={allProducts}
                />
              </div>
            </div>
          </div>
        </form>
        {/* =------------------------ */}
      </div>

      <CustomModal
        modalIsOpen={modalIsOpenSizeAndColor}
        setIsOpen={setIsOpenSizeAndColor}
      >
        {/* -----------this modal for when user change size and color */}
        <SizeAndColorInCheckout2
          product={productItem}
          setInputSize2={setInputSize}
          setGetProductId={setAllProducts}
          getProductId={allProducts}
          setIsOpen={setIsOpenSizeAndColor}
        />
      </CustomModal>
    </div>
  );
};

export default CheckOut;
