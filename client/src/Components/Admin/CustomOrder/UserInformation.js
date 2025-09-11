import React from "react";
import CustomModal from "../../../Shared/CustomModal";
import CheckoutProductItems from "../../CheckoutProductItems/CheckoutProductItems";
import BdCity from "../../BdCity";
import swal from "sweetalert";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useContext } from "react";
import CreateContext from "../../CreateContex";
import SizeAndColorInCheckoutDirectBuy from "../../CheckoutProductItems/SizeAndColorInCheckoutDirectBuy";
import { Icon } from "@iconify/react";
import { Tooltip } from "react-tooltip";
import { handlePostMethod } from "../../../../lib/usePostHooks";
import {
  sumOfCartPrice2,
  sumOfSalePrice2,
} from "../../../../lib/commonFunction";
import { usePostCustomeOrder } from "../../../../lib/usePostOrder";
import server_url from "../../../../lib/config";
import { useRouter } from "next/router";
import SizeAndColorInCustomeOrder from "./SizeAndColorInCustomeOrder";
import ApplyCoupon from "../../Coupons/ApplyCoupon";
import ApplyCustomCoupon from "./ApplyCustomCoupon";
import BDAutoCity from "../../BDAutoCity";
import CheckoutProductItems2 from "../../CheckoutProductItems/CheckoutProductItems2";

const UserInformation = ({ user, getProductId, setGetProductId }) => {
  // const router = useRouter();
  // const id = router.query.id;
  const [sizeIndex, setSizeIndex] = useState(0);
  const [inputSize, setInputSize] = useState({});
  const [userColor, setUserColor] = useState("");
  const [loading, setLoading] = useState(false);
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
  const [isExistUser, setIsExistUser] = useState(false);
  const [databaseCartAndPriceTotal, setDatabaseCartAndPriceTotal] = useState({
    cartTotal: 0,
    originalProductPrice: 0,
  });
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
  // const { userInfo: user } = AuthUser();

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (isExistUser) {
      setValue("firstName", user?.fullName);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
    } else {
      reset();
    }
  }, [user, isExistUser]);
  // -------------------find product using id----------------

  const getTotalSalePrice = (products) => {
    let totalSalePrice = 0;
    // Iterate through each product and calculate the total sale price
    products.forEach((product) => {
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
    setOriginalPriceTotal(getTotalproductPrice(getProductId));
    setCartTotal(getTotalSalePrice(getProductId));
  }, [getProductId]);

  // console.log("form local storage", productIdAndQuantity);
  let productsArr = [];
  if (getProductId) {
    productsArr = getProductId?.map((p) => ({
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

  useEffect(() => {
    if (getProductId) {
      const productIdAndQuantity = getProductId?.map((item) => {
        return { id: item?._id, quantity: item?.quantity };
      });
      const url =
        "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/order/get-total-price";
      handlePostMethod(url, productIdAndQuantity, setTotalPriceOfCartItem);
    }
    if (getProductId.length > 0) {
      const totalOriginal = sumOfSalePrice2(getProductId);
      setOriginalPriceTotal(totalOriginal);
      // its function response product id and q to product sale price total and original price total
      sumOfCartPrice2(getProductId, setDatabaseCartAndPriceTotal);
    } else {
      setOriginalPriceTotal(0);
      setDatabaseCartAndPriceTotal({
        cartTotal: 0,
        originalProductPrice: 0,
      });
    }
    setCouponDiscount(0);
  }, [getProductId]);

  const onSubmitForm = async (data) => {
    if (getProductId.length < 1) {
      return swal("error", "Product cart is empty!!", "error");
    }
    // if (!selectedCity) {
    //   return setCityErrorMessage(true);
    // }
    // setCityErrorMessage(false);
    setIsOpen(true);

    const newOrder = {
      orderItem: productsArr,
      user: isExistUser ? user?._id : "",
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
        email: isExistUser ? user?.email : "",
        firstName: data.firstName, //frisName mane backend a fullName hisabe jacche, ekhan theke firstName e pathate hobe
        lastName: data.lastName || "",
        phone: data.phone,
        postalCode: data.postal || "",
      },
    };

    // setOrder(newOrder);
    newOrder.paymentDetails = {
      method: "cod",
    };

    const url = `${server_url}/order`;
    usePostCustomeOrder(url, newOrder, setOrderResponse, router);
  };

  const handleSaveSizeInLocal = (size) => {
    setInputSize(size);
  };
  const handleDelete = (id) => {
    setGetProductId((prevTotalProduct) =>
      prevTotalProduct.filter((product) => product._id !== id)
    );
  };

  const handleIncreaseProduct = (product) => {
    const update = getProductId.map((pro) => {
      if (pro._id !== product._id) return pro;
      return { ...pro, quantity: pro.quantity + 1 };
    });
    setGetProductId(update);
  };

  const handleDecreseProduct = (product) => {
    const update = getProductId.map((pro) => {
      if (pro._id !== product._id) return pro;
      return { ...pro, quantity: pro.quantity === 1 ? 1 : pro.quantity - 1 };
    });
    setGetProductId(update);
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className=" block md:flex justify-center gap-5">
          <div className="w-full md:w-[55%] bg-primary/20 p-5 md:p-9 rounded-xl shadow h-fit mb-3 md:mb-0 ">
            <div className="mb-6">
              <label className=" cursor-pointer pl-0 ">
                <span className="flex items-center gap-2 justify-start ">
                  <input
                    onClick={() => setIsExistUser(!isExistUser)}
                    type="checkbox"
                    checked={isExistUser}
                    className="checkbox checkbox-primary checkbox-sm"
                  />
                  <span className="label-text inline-block font-bold">
                    User Info From Existing User
                  </span>
                </span>
              </label>
            </div>

            <h1 className="font-semibold mb-4">
              অর্ডার কনফার্ম করতে নিচের ফর্মটি{" "}
              <span className="text-primary"> সঠিক তথ্য </span> দিয়ে পূরণ করুন:{" "}
            </h1>
            <div className="grid grid-cols-1 ">
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
              {/* ----------last name ta comment karon full name jacche ekhon jodi kichu na jay tobe, empnty string jay */}
              {/*  <div className=" p mb-4">
                    <label htmlFor="name" className="leading-7 text-sm ">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="last-name"
                      className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                      placeholder="last Name"
                      {...register("lastName")}
                      onKeyUp={(e) => {
                        trigger("lastName");
                      }}
                    />
                  </div> */}
            </div>
            <div className="grid grid-cols-1 gap-5">
              {/*    <div className=" p mb-4">
                    <label htmlFor="name" className="leading-7 text-sm ">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                      placeholder="Email Address"
                      disabled
                      {...register("email")}
                      onKeyUp={(e) => {
                        trigger("email");
                      }}
                    />
                    <small className="text-[#FF4B2B] text-xs font-medium my-2">
                      {errors?.email?.message}
                    </small>
                  </div> */}
              {/*  <div className=" p mb-4">
                    <label htmlFor="name" className="leading-7 text-sm ">
                      Phone Number
                    </label>
                    <input
                      type="number"
                      id="phone"
                      name="phone"
                      className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                      placeholder="Phone Number"
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
                  </div> */}
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
              {/* <BdCity
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                setShippingCost={setShippingCost}
              /> */}
              <BDAutoCity
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                setShippingCost={setShippingCost}
              />
              <p className="text-red-500 text-xs">
                {cityErrorMessage && "Please Select city"}
              </p>
            </div>

            {/* -----------------thana and postal code coment kora hoyche and er poriborte empty stirng pathanu hoyeche jeno error na dey */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div className=" p mb-4">
                    <label htmlFor="name" className="leading-7 text-sm ">
                      Thana
                    </label>
                    <input
                      type="text"
                      id="thana"
                      name="thana"
                      className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                      placeholder="Khilkhet"
                      {...register("thana", {
                        required: "thana Name is required",
                      })}
                      onKeyUp={(e) => {
                        trigger("thana");
                      }}
                    />
                    <small className="text-[#FF4B2B] text-xs font-medium my-2">
                      {errors?.thana?.message}
                    </small>
                  </div>
                  <div className=" p mb-4">
                    <label htmlFor="name" className="leading-7 text-sm ">
                      ZIP / Postal
                    </label>
                    <input
                      type="text"
                      id="postal"
                      name="postal"
                      className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                      placeholder="2345"
                      {...register("postal", {
                        required: "ZIP/ Postal is required",
                      })}
                      onKeyUp={(e) => {
                        trigger("postal");
                      }}
                    />
                    <small className="text-[#FF4B2B] text-xs font-medium my-2">
                      {errors?.postal?.message}
                    </small>
                  </div>
                </div> */}
          </div>

          {/* Cart Product */}
          <div className="w-full md:w-[45%] bg-white rounded-xl shadow p-5 relative">
            <h1 className="mb-1 font-semibold title-font">Product List</h1>

            <div className=" overflow-y-scroll max-h-96">
              {getProductId.length ? (
                getProductId?.map((productData) => (
                  // row
                  <div className="flex gap-2">
                    <div className="w-[95%]">
                      <CheckoutProductItems2
                        product={productData}
                        handleDecreseProduct={handleDecreseProduct}
                        handleIncreaseProduct={handleIncreaseProduct}
                        sizeIndex={sizeIndex}
                        setProductItem={setProductItem}
                        setIsOpenSizeAndColor={setIsOpenSizeAndColor}
                      />
                    </div>
                    <Tooltip anchorSelect="#delete_product">Delete</Tooltip>
                    <div className="flex items-center justify-center w-[40px] max-w-[40px]">
                      <span
                        onClick={() => handleDelete(productData?._id)}
                        id="delete_product"
                        className="cursor-pointer border rounded-md  p-2 bg-red-100 "
                      >
                        <Icon
                          className="text-red-600 text-lg"
                          icon="material-symbols:delete-outline"
                        />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <h2 className=" text-center text-xl font-bold my-10">
                  Please select a product!
                </h2>
              )}
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
              <p className="text-xs text-end">VAT included, where applicable</p>

              <div className="grid grid-cols-1 gap-5 mt-5">
                {/* <div
                                    onClick={() => {
                                        router.push("/shop");
                                        setQueryFromCategory("");
                                    }}
                                    className="text-white btn btn-primary border-0 py-2 px-6 focus:outline-none w-full rounded"
                                >
                                    Continue Shopping
                                </div> */}

                <button
                  disabled={!getProductId.length}
                  type="submit"
                  className="text-white btn btn-success border-0 py-2 px-6 focus:outline-none w-full rounded hover:bg-green-900"
                >
                  অর্ডার কনফার্ম করুন
                </button>
              </div>
              {/* --------------coupon method ------------------- */}
              <ApplyCustomCoupon
                setCouponDiscount={setCouponDiscount}
                product={getProductId}
              />
            </div>
          </div>
        </div>
      </form>
      {/* <CustomModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}> */}
      {/* -----------this modal for when user placed order then open modal for payment and there have 4 type payment system */}
      {/* <PaymentIndex order={order} setIsOpen={setIsOpen} /> */}
      {/* </CustomModal> */}
      <CustomModal
        modalIsOpen={modalIsOpenSizeAndColor}
        setIsOpen={setIsOpenSizeAndColor}
      >
        {/* -----------this modal for when user change size and color */}
        <SizeAndColorInCustomeOrder
          product={productItem}
          setInputSize2={setInputSize}
          setGetProductId={setGetProductId}
          getProductId={getProductId}
          setIsOpen={setIsOpenSizeAndColor}
        />
      </CustomModal>
    </div>
  );
};

export default UserInformation;
