import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  sumOfCartPrice,
  sumOfProductPrice,
  sumOfSalePrice,
} from "../../lib/commonFunction";
import updateCartLocalStorage from "../../lib/updateCartLocalStorage";
import { handlePostMethod } from "../../lib/usePostHooks";
import BdCity from "../../src/Components/BdCity";
import PaymentIndex from "../../src/Components/CheckoutPayment/PaymentIndex";
import CheckoutProductItems from "../../src/Components/CheckoutProductItems/CheckoutProductItems";
import CreateContext from "../../src/Components/CreateContex";
import CustomModal from "../../src/Shared/CustomModal";
import CartProductItems from "../../src/Shared/drawer/CartProductItems";
import ApplyCoupon from "../../src/Components/Coupons/ApplyCoupon";
import AuthUser from "../../lib/AuthUser";
import swal from "sweetalert";
import SizeAndColorInCheckout from "../../src/Components/CheckoutProductItems/SizeAndColorInCheckout";
import RequireAuth from "../../src/RequireAuth/RequireAuth";
import BDAutoCity from "../../src/Components/BDAutoCity";
import server_url from "../../lib/config";
import { usePostOrder, useWalletTaka } from "../../lib/usePostOrder";
import { useQuery } from "react-query";
import { getUserInfo } from "../../lib/helper";
import ApplyWallet from "../../src/Components/Coupons/ApplyWallet";
import CustomButtonLoading from "../../src/Shared/CustomButtonLoading";
import PaymentIndex2 from "../../src/Components/CheckoutPayment/PaymentIndex2";
const Checkout = () => {
  const [userDetails, setUserDetails] = useState();
  const [sizeIndex, setSizeIndex] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenSizeAndColor, setIsOpenSizeAndColor] = useState(false);
  const [order, setOrder] = useState({});
  const [totalPriceOfCartItem, setTotalPriceOfCartItem] = useState(0);
  const [selectedCity, setSelectedCity] = useState("");
  const [cityErrorMessage, setCityErrorMessage] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [originalPriceTotal, setOriginalPriceTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [databaseCartAndPriceTotal, setDatabaseCartAndPriceTotal] = useState({
    cartTotal: 0,
    originalProductPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [walletAmount, setWalletAmount] = useState();

  const [finalTotal, setFinalTotal] = useState(0);
  const [applyWallet, setApplyWallet] = useState();

  // when user click in size set product item
  const [productItem, setProductItem] = useState({});

  const router = useRouter();
  const {
    localStorageCartItems,
    buyNowProduct,
    setAddToCartRefresher,
    addToCartRefresher,
    setOrderResponse,
    setQueryFromCategory,
  } = useContext(CreateContext);

  const { userInfo: user } = AuthUser();

  const { data: userData } = useQuery(["user"], () => {
    if (user._id) {
      return getUserInfo(user._id);
    }
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    reset,
  } = useForm({
    defaultValues: {
      firstName: user?.fullName?.split(" ")[0],
      email: user?.email,
    },
  });

  // cartTotal and originalProductPrice
  const { cartTotal: cartTotalFromLocalStorage } = localStorageCartItems || [];
  let cartTotal = cartTotalFromLocalStorage;

  useEffect(() => {
    if (localStorageCartItems.cartTotal) {
      const productIdAndQuantity = localStorageCartItems?.items?.map((item) => {
        return { id: item?._id, quantity: item?.quantity };
      });
      const url = "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/order/get-total-price";
      handlePostMethod(url, productIdAndQuantity, setTotalPriceOfCartItem);
    }
    if (localStorageCartItems?.items?.length > 0) {
      const totalOriginal = sumOfSalePrice(localStorageCartItems);
      setOriginalPriceTotal(totalOriginal);
      // its function response product id and q to product sale price total and original price total
      sumOfCartPrice(localStorageCartItems, setDatabaseCartAndPriceTotal);
    } else {
      setOriginalPriceTotal(0);
      setDatabaseCartAndPriceTotal({
        cartTotal: 0,
        originalProductPrice: 0,
      });
    }
    setCouponDiscount(0);
  }, [localStorageCartItems]);

  // console.log("form local storage", productIdAndQuantity);
  let productsArr = [];
  if (localStorageCartItems) {
    productsArr = localStorageCartItems?.items?.map((p) => ({
      product: p._id,
      name: p.productTitle,
      price: p.salePrice,
      originalProductPrice: p.price,
      quantity: p.quantity,
      imageURL: p.image,
      size: p?.userSize.size || "",
      variant: p?.userSize._id,
      color: p?.userColor || "",
      category: p.category,
      subCategory: p.subCategory[0],
    }));
  }

  const onSubmitForm = async (data) => {
    setLoading(true);
    if (localStorageCartItems.items.length < 1) {
      return swal("error", "Product cart is empty!!", "error");
    }

    const newOrder = {
      orderItem: productsArr,
      user: user?._id,
      shippingPrice: Number(shippingCost),
      totalAmount:
        finalTotal +
        Number(shippingCost) -
        couponDiscount -
        (applyWallet ? applyWallet : 0),
      afterDiscountPrice: finalTotal - couponDiscount,
      originalProductPrice: originalPriceTotal,
      discount: originalPriceTotal - finalTotal + couponDiscount,
      couponDiscount,
      walletAmount: walletAmount,
      useWallet: applyWallet ? applyWallet : 0,
      shippingAddress: {
        address: data.address,
        city: selectedCity,
        thana: data.thana || "",
        email: data.email,
        firstName: data.firstName, //frisName mane backend a fullName hisabe jacche, ekhan theke firstName e pathate hobe
        lastName: data.lastName || "",
        phone: data.phone,
        postalCode: data.postal || "",
      },
    };

    if(userData){
      setOrder(newOrder);
      setIsOpen(true);
      setLoading(false);
    }else{
      router.push("/auth/login")
    }
  };

  const handleIncreaseProduct = (product) => {
    const action = "add";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);
    // let newCount = count + 1;
    // setCount(newCount);
  };
  const handleDecreseProduct = (product) => {
    const action = "minus";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);
  };

  const handleSaveSizeInLocal = (product, size) => {
    product.userSize = size;
    const action = "size";
    updateCartLocalStorage({ product, action });
    setAddToCartRefresher(!addToCartRefresher);
  };

  useEffect(() => {
    calculateTotalSalePrice(localStorageCartItems?.items);
  }, [localStorageCartItems?.items]);

  function calculateTotalSalePrice(products) {
    // Calculate total sale price taking quantity into account
    const total = products?.reduce(
      (total, product) => total + product.salePrice * product.quantity,
      0
    );
    setFinalTotal(total);
  }

  return (
    // <RequireAuth>
    <div className="bg-accent">
      <div className="mid-container">
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className=" block md:grid grid-cols-5 justify-center gap-5 py-16">
            <div className="w-full md:col-span-3 p-5 md:p-9 rounded-xl shadow h-fit mb-3 md:mb-0 ">
              <h1 className="font-semibold mb-4">
                অর্ডার কনফার্ম করতে নিচের ফর্মটি{" "}
                <span className="text-primary"> সঠিক তথ্য </span> দিয়ে পূরণ
                করুন:{" "}
              </h1>
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
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                    placeholder="মোবাইল নাম্বার"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: {
                        value: 11,
                        message: "Phone number must be 11 digit.",
                      },
                      maxLength: {
                        value: 11,
                        message: "Phone number must be 11 digit.",
                      },
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must consist of digits only.",
                      },
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
              <div className="w-full my-3">
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
            <div className="w-full md:col-span-2 bg-white rounded-xl shadow p-5 relative">
              <h1 className="mb-1 font-semibold title-font">Product List</h1>
              <div className=" overflow-y-scroll max-h-96">
                {localStorageCartItems &&
                  localStorageCartItems?.items?.map((product) => (
                    // row

                    <CheckoutProductItems
                      product={product}
                      handleDecreseProduct={handleDecreseProduct}
                      handleIncreaseProduct={handleIncreaseProduct}
                      sizeIndex={sizeIndex}
                      setProductItem={setProductItem}
                      setIsOpenSizeAndColor={setIsOpenSizeAndColor}
                    />
                  ))}
              </div>

              <div className="mt-14">
                <h1 className="font-semibold border-b-[1px] pb-2 mb-5">
                  Order Summery
                </h1>

                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">Products Total</h1>
                  <p>৳ {originalPriceTotal}</p>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">After Discount Total</h1>
                  <p className="font-bold">৳ {finalTotal - couponDiscount}</p>
                </div>
                {couponDiscount > 0 && (
                  <small className="text-green-500 text-end block font-bold">
                    You got Coupon Discount {couponDiscount} TK.
                  </small>
                )}
                <div className="flex justify-between items-center text-sm mb-2">
                  <h1 className="font-medium">Discount Amount</h1>
                  <p>৳ {originalPriceTotal - finalTotal + couponDiscount}</p>
                </div>
                <div className="flex justify-between items-center  text-sm mb-2">
                  <h1 className="font-medium">Delivery Fee</h1>
                  <p className="font-bold">৳{shippingCost}</p>
                </div>
                <div className="flex justify-between items-center  text-sm">
                  <h1 className="font-medium">Total</h1>
                  <p className="text-green-800 font-bold">
                    ৳ {finalTotal + Number(shippingCost) - couponDiscount}
                  </p>
                </div>
                <p className="text-xs text-end">
                  VAT included, where applicable
                </p>

                {applyWallet && (
                  <div className="flex justify-between items-center  text-sm">
                    <h1 className="font-medium">Use Cashback</h1>
                    <p className="text-yellow-800 font-bold">৳ {applyWallet}</p>
                  </div>
                )}
                {applyWallet && (
                  <div className="flex justify-between items-center  text-sm">
                    <h1 className="font-medium">After Total</h1>
                    <p className="text-green-800 font-bold">
                      ৳ {finalTotal + Number(shippingCost) - applyWallet}
                    </p>
                  </div>
                )}

                <div>
                  {userData && (
                    <ApplyWallet
                      data={userData}
                      applyWallet={applyWallet}
                      setWalletAmount={setApplyWallet}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 mt-5">
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
                    type="submit"
                    className="text-white btn btn-success border-0 py-2 px-6 focus:outline-none w-full rounded hover:bg-green-900"
                  >
                    {loading ? <CustomButtonLoading /> : "অর্ডার কনফার্ম করুন"}
                  </button>
                </div>
                {/* --------------coupon method ------------------- */}
                <ApplyCoupon setCouponDiscount={setCouponDiscount} />
              </div>
            </div>
          </div>
        </form>
      </div>

      <CustomModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
        <PaymentIndex2
          order={order}
          walletAmount={walletAmount}
          setIsOpen={setIsOpen}
        />
      </CustomModal>
      <CustomModal
        modalIsOpen={modalIsOpenSizeAndColor}
        setIsOpen={setIsOpenSizeAndColor}
      >
        {/* -----------this modal for when user change size and color */}
        <SizeAndColorInCheckout
          product={productItem}
          setIsOpen={setIsOpenSizeAndColor}
        />
      </CustomModal>
    </div>
    // </RequireAuth>
  );
};

export default Checkout;
