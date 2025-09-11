import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import swal from "sweetalert";
import AuthUser from "../../../lib/AuthUser";
import server_url from "../../../lib/config";
import { getUserInfo } from "../../../lib/helper";
import BDAutoCity from "../../../src/Components/BDAutoCity";
import PaymentIndex from "../../../src/Components/CheckoutPayment/PaymentIndex";
import CheckoutProductItemsDirectBuy from "../../../src/Components/CheckoutProductItems/CheckoutProductItemsDirectBuy";
import SizeAndColorInCheckoutDirectBuy from "../../../src/Components/CheckoutProductItems/SizeAndColorInCheckoutDirectBuy";
import ApplyCoupon from "../../../src/Components/Coupons/ApplyCoupon";
import ApplyWallet from "../../../src/Components/Coupons/ApplyWallet";
import CreateContext from "../../../src/Components/CreateContex";
import CustomButtonLoading from "../../../src/Shared/CustomButtonLoading";
import CustomModal from "../../../src/Shared/CustomModal";
const DirectBuy = () => {
  const router = useRouter();
  const id = router.query.id;

  const [product, setProduct] = useState({});
  const [sizeIndex, setSizeIndex] = useState(0);
  const [inputSize, setInputSize] = useState({});
  const [userColor, setUserColor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState({});
  const [productData, setProductData] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [cityErrorMessage, setCityErrorMessage] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [originalPriceTotal, setOriginalPriceTotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [productId, setProductId] = useState(0);
  const [modalIsOpenSizeAndColor, setIsOpenSizeAndColor] = useState(false);
  // when user click in size set product item
  const [productItem, setProductItem] = useState({});
  const [qyt, setQyt] = useState(1);
  const [walletAmount, setWalletAmount] = useState();
  const [applyWallet, setApplyWallet] = useState();

  const {
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
  // -------------------find product using id----------------
  const productUrl = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/product/${id}`;

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(productUrl)
        .then((res) => res.json())
        .then((data) => {
          setProduct({ items: [data.data] });
          setOriginalPriceTotal(data.data.productPrice);
          setCartTotal(data?.data?.salePrice);
          setProductId(data.data._id);
          setProductData(data.data);
          if (data?.data?.size) {
            setInputSize(data.data.variant[0]);
          }
          if (data?.data?.productColor?.length > 0) {
            setUserColor(data.data.productColor[0]);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);
  // cartTotal and originalProductPrice

  useEffect(() => {
    setCouponDiscount(0);
    setOriginalPriceTotal(inputSize?.productPrice * qyt);
    setCartTotal(inputSize?.salePrice * qyt);
  }, [product, qyt, inputSize]);

  // console.log("form local storage", productIdAndQuantity);
  let productsArr = [];
  if (productData?.name) {
    productsArr = [
      {
        product: productData._id,
        name: productData.name,
        price: inputSize?.salePrice,
        originalProductPrice: inputSize?.productPrice,
        quantity: qyt,
        imageURL: productData?.imageURLs[0],
        size: inputSize?.size,
        variant: inputSize?._id,
        color: userColor,
        category: productData?.category,
        subCategory: productData?.subCategory[0],
      },
    ];
  }

  const onSubmitForm = async (data) => {
    setLoading2(true);
    if (product?.items?.length < 1) {
      return swal("error", "Product cart is empty!!", "error");
    }
    // if (!selectedCity) {
    //   return setCityErrorMessage(true);
    // }
    // setCityErrorMessage(false);
    // setIsOpen(true);

    const newOrder = {
      orderItem: productsArr,
      user: user?._id,
      shippingPrice: Number(shippingCost),
      totalAmount:
        cartTotal +
        Number(shippingCost) -
        couponDiscount -
        (applyWallet ? applyWallet : 0),
      afterDiscountPrice: cartTotal - couponDiscount,
      originalProductPrice: originalPriceTotal,
      discount: originalPriceTotal - cartTotal + couponDiscount,
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
    newOrder.paymentDetails = {
      method: "cod",
    };

    if (userData) {
      setOrder(newOrder);
      setIsOpen(true);
      setLoading2(false);
    }else{
      router.push("/auth/login")
    }
  };

  const handleSaveSizeInLocal = (size) => {
    setInputSize(size);
  };

  return (
    <>
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
                </div>
                <div className="grid grid-cols-1 gap-5"></div>
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
              </div>

              {/* Cart Product */}
              <div className="w-full md:col-span-2 bg-white rounded-xl shadow p-5 relative">
                <h1 className="mb-1 font-semibold title-font">Product List</h1>

                <div className=" overflow-y-scroll max-h-96">
                  {product &&
                    product?.items?.map((productData) => (
                      // row

                      <CheckoutProductItemsDirectBuy
                        product={productData}
                        handleSaveSizeInLocal={handleSaveSizeInLocal}
                        qyt={qyt}
                        setQyt={setQyt}
                        setIsOpenSizeAndColor={setIsOpenSizeAndColor}
                        setProductItem={setProductItem}
                        inputSize={inputSize}
                        userColor={userColor}
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

                  {applyWallet && (
                    <div className="flex justify-between items-center  text-sm">
                      <h1 className="font-medium">Use Cashback</h1>
                      <p className="text-yellow-800 font-bold">
                        ৳ {applyWallet}
                      </p>
                    </div>
                  )}
                  {applyWallet && (
                    <div className="flex justify-between items-center  text-sm">
                      <h1 className="font-medium">After Total</h1>
                      <p className="text-green-800 font-bold">
                        ৳ {cartTotal + Number(shippingCost) - applyWallet}
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
                    <button
                      type="submit"
                      className="text-white btn btn-success border-0 py-2 px-6 focus:outline-none w-full rounded hover:bg-green-900"
                    >
                      {loading2 ? (
                        <CustomButtonLoading />
                      ) : (
                        "অর্ডার কনফার্ম করুন"
                      )}
                    </button>
                  </div>
                  {/* --------------coupon method ------------------- */}
                  <ApplyCoupon
                    setCouponDiscount={setCouponDiscount}
                    query={{
                      from: "true",
                      id: productId,
                      quantity: qyt,
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <CustomModal modalIsOpen={modalIsOpen} setIsOpen={setIsOpen}>
          <PaymentIndex
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
          <SizeAndColorInCheckoutDirectBuy
            product={productItem}
            setIsOpen={setIsOpenSizeAndColor}
            userSizeAndColor={{
              inputSize,
              setInputSize,
              userColor,
              setUserColor,
            }}
          />
        </CustomModal>
      </div>
    </>
  );
};

export default DirectBuy;
