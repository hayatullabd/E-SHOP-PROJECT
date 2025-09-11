import { useRouter } from "next/router";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import Descriptions from "../../src/Components/ProductsDetails/Descriptions/Descriptions";
import AppAds from "../../src/Components/Home/AppAds/AppAds";
import AlreadyProductHave from "../../src/Components/Home/PopularProducts/AlreadyProductHave";
import CreateContext from "../../src/Components/CreateContex";
import StarRating from "../../src/Shared/StarRating";
import ProductSection from "../../src/Components/ProductSection/ProductSection";
import setCartInLocalStorageFromPorductDetails from "../../lib/setCartInLocalStorageFromPorductDetails";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { TiInputChecked } from "react-icons/ti";
import ProductColorPicker from "../../src/Components/ProductSection/ProductColorPicker";
import ProductSizePicker from "../../src/Components/ProductSection/ProductSizePicker";
import WhatsAppButton from "../../src/Shared/WhatsAppButton";
import CustomMetaSetting from "../../src/Shared/CustomMetaSetting";
import CustomProductDetailsSkeleton from "../../src/Components/CustomSkeleton/CustomProductDetailsSkeleton";

import { BsBagPlus, BsCart4, BsTelephoneFill } from "react-icons/bs";
import Head from "next/head";
import Image from "next/image";
import { useQuery } from "react-query";
import ReletedSection from "../../src/Components/ProductSection/ReletedSection";
import { calculateDiscount } from "../../lib/claculateDiscount";

const ProductDetails = () => {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [inputSize, setInputSize] = useState("");
  const [userProductColor, setUserProductColor] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const [seleteVariant, setSeleteVariant] = useState({});

  const [isAlreadyAvailable, setIsAlreadyAvailable] = useState(false);

  const { addToCartRefresher, setAddToCartRefresher, setQueryFromCategory } =
    useContext(CreateContext);
  const handleSetLocalStorage = () => {
    setAddToCartRefresher(!addToCartRefresher);
    const localStorageMessage = setCartInLocalStorageFromPorductDetails(
      product,
      seleteVariant,
      userProductColor
    );
    setIsAlreadyAvailable(false);
    if (localStorageMessage) {
      setIsAlreadyAvailable("Added In Cart");
    }
  };

  const { data, refetch, isSuccess, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/product/${id}`).then(
        (res) => res.json()
      ),
  });

  const product = data?.data;

  useEffect(() => {
    if (isSuccess) {
      setInputSize(data?.data?.size[0]);
      setUserProductColor(data?.data?.productColor[0]);
      setSeleteVariant(data?.data?.variant[0]);
    }
  }, [isSuccess]);

  const handleSize = (index, size) => {
    setSizeIndex(index);
    setInputSize(size);
  };
  const { asPath } = useRouter();
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const productUrl = `${origin}${asPath}`;

  const handleBuyNowButtonClick = () => {
    window.gtag("event", "begin_checkout", {
      currency: "BDT",
      value: product?.salePrice,
      items: [
        {
          item_id: product?._id,
          item_name: product?.name,
          price: product?.salePrice,
          quantity: 1
        }
      ]
    });
  };
  const handleAddCartButtonClick = () => {
    window.gtag('event', 'add_to_cart', {
      currency: 'BDT',
      value: product?.salePrice,
      items: [
        {
          item_id: product?._id,
          item_name: product?.name,
          price: product?.salePrice,
          quantity: 1
        }
      ]
    });
  };

  const handelCategoryParams = (cat) => {
    const params = new URLSearchParams();
    params.append("category", cat);
    const url = `${params.toString()}`;
    return url;
  };

  const discountPrice = calculateDiscount(
    product?.productPrice,
    product?.salePrice
  );

  return (
    <>
      <Head>
        <meta property="og:url" content={encodeURIComponent(productUrl)} />
        <meta
          property="og:title"
          content={product?.name || "We Are Best E-commerce in Bangladesh"}
        />
        <CustomMetaSetting
          productTitle={product?.name}
          productUrl={productUrl}
          description={product?.name}
          imageUrl={product?.imageURLs && product?.imageURLs[0]}
        />
      </Head>

      {isLoading && <CustomProductDetailsSkeleton />}
      {isLoading === false && (
        <div className="sm:bg-accent py-1">
          <div className="mid-container">
            <div className=" bg-white rounded-2xl overflow-hidden shadow-none md:shadow-xl mt-5 p-0 sm:p-4">
              <div className="grid grid-cols-12 gap-5 md:gap-16    ">
                <div className="md:col-span-5 col-span-12 rounded-none md:rounded-2xl  md:overflow-hidden ">
                  <Carousel
                    showArrows={false}
                    showStatus={false}
                    showIndicators={true}
                    autoPlay={true}
                    stopOnHover={true}
                    axis="horizontal"
                    preventMovementUntilSwipeScrollTolerance={true}
                    swipeScrollTolerance={50}
                    className=""
                    emulateTouch={false}
                    showThumbs={true}
                    renderThumbs={() =>
                      product?.imageURLs.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt="product details thumbs image"
                          width={100}
                          height={100}
                          className="w-10"
                        />
                      ))
                    }
                  >
                    {product?.imageURLs?.map((url, index) => (
                      <div key={index}>
                        <Image
                          src={url}
                          width={300}
                          height={300}
                          className="w-full "
                          alt={"product details page image"}
                        />
                      </div>
                    ))}
                  </Carousel>
                </div>
                {product === null ? (
                  <>
                    <CustomProductDetailsSkeleton />
                  </>
                ) : (
                  <>
                    <div className="md:col-span-7 col-span-12 pt-0  md:pt-14 p-2  md:mr-10 mr-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/category/${product?.category}`}
                          onClick={() =>
                            setQueryFromCategory(
                              handelCategoryParams(product?.category)
                            )
                          }
                        >
                          <span className=" text-[#9234D2] hover:text-black duration-150 ">
                            <TiInputChecked className="text-xl  font-bold inline-block" />
                            <span className="text-sm  font-extrabold">
                              {product?.category}
                            </span>
                          </span>
                        </Link>
                        {product?.brand !== "no brand" &&
                          product?.brand !== "Choose Brand" && (
                            <span className="  hover:text-black">
                              <span className="text-sm  font-extrabold">
                                Brand:{" "}
                              </span>
                              <span className="text-sm  font-extrabold">
                                {product?.brand}
                              </span>
                            </span>
                          )}
                      </div>
                      <h1 className=" font-semibold text-xl md:text-3xl font-serif mb-2">
                        {product?.name}
                      </h1>
                      {/* <p className="text-sm">SKU <span className='text-[17px]'>:</span> {product?.sku}</p> */}
                      <div className="flex  items-end gap-2">
                        <StarRating
                          ratingValue={product?.ratingValue}
                          disabled={true}
                        />
                        {product?.quantity > 0 ? (
                          <p className="text-green-600 font-bold mt-1">
                            {" "}
                            In Stock
                          </p>
                        ) : (
                          <p className="text-red-600 font-bold mt-1">
                            Out Of Stock
                          </p>
                        )}
                      </div>
                      {/* <div className="my-5">
                        <div className="flex items-center gap-6 mt-1 ">
                          <p className="text-sm text-gray-500 line-through ">
                            TK {product?.productPrice}.00
                          </p>
                          <p className="uppercase font-extrabold text-orange-600 text-2xl md:text-4xl">
                            TK {product?.salePrice}.00
                          </p>
                          {discountPrice > 0 && (
                            <p className=" bg-red-600 text-white rounded-2xl btn-sm text-xs btn btn-warning hover:bg-red-600">
                              {discountPrice}% OFF
                            </p>
                          )}
                        </div>
                      </div> */}

                      <div className="my-5">
                        <div className="flex items-center gap-6 mt-1 ">
                          <p className="text-sm text-gray-500 line-through ">
                            TK {seleteVariant?.productPrice}.00
                          </p>
                          <p className="uppercase font-extrabold text-orange-600 text-2xl md:text-4xl">
                            TK {seleteVariant?.salePrice}.00
                          </p>
                          <p className=" bg-red-600 text-white rounded-2xl btn-sm text-xs btn btn-warning hover:bg-red-600">
                            {seleteVariant?.discount}% OFF
                          </p>
                        </div>
                      </div>

                      {/* product size */}

                      <ProductSizePicker
                        size={product?.variant}
                        setSeleteVariant={setSeleteVariant}
                        seleteVariant={seleteVariant}
                      />
                      {/* product color-------------- */}
                      <ProductColorPicker
                        productColor={product?.productColor}
                        setUserProductColor={setUserProductColor}
                        userProductColor={userProductColor}
                      />

                      {/* <SocialShare /> */}

                      <div className="mt-10 grid grid-cols-2  gap-4 ">
                        {product?.quantity < 1 && (
                          <p className="text-red-600 font-bold mt-1 col-span-2">
                            Out Of Stock
                          </p>
                        )}
                        <Link
                          href={
                            product?.quantity < 1
                              ? "#"
                              : `/checkout/direct-buy/${id}`
                          }
                        >
                          <button
                            disabled={product?.quantity < 1}
                            title={
                              product?.quantity < 1
                                ? "Out of Stock"
                                : "অর্ডার করুন"
                            }
                            onClick={handleBuyNowButtonClick}
                            className="btn btn-primary w-full  rounded flex items-center gap-2  text-base-100 "
                          >
                            <BsBagPlus size={22} />
                            <h1>অর্ডার করুন</h1>
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            handleSetLocalStorage();
                            handleAddCartButtonClick();
                          }}
                          className="btn bg-[#ff8b2c] hover:bg-[#D0611E] border-none w-full flex items-center gap-0 md:gap-2 rounded  text-base-100 "
                          disabled={product?.quantity < 1}
                          title={
                            product?.quantity < 1
                              ? "Out of Stock"
                              : "কার্টে যুক্ত করুন"
                          }
                        >
                          <BsCart4 size={22} />
                          <h1>কার্টে যুক্ত করুন</h1>
                        </button>

                        <div>
                          <WhatsAppButton
                            productUrl={productUrl}
                            productQuantity={product?.quantity}
                            productName={product?.name}
                            productPrice={product?.salePrice}
                          />
                        </div>
                        <a
                          href="tel:+8809613107010"
                          disabled={product?.quantity < 1}
                          title={
                            product?.quantity < 1
                              ? "Out of Stock"
                              : "Direct Call"
                          }
                          className="btn bg-red-600 hover:bg-red-800 border-none w-full  flex items-center rounded font-bold  text-base-100 "
                        >
                          <BsTelephoneFill className="text-sm md:text-xl mr-1" />
                          <h1>09613107010</h1>
                          <h1></h1>
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className=" bg-white  mb-10 p-1 md:p-5 rounded-xl">
                <div className="">
                  <Descriptions
                    description={product?.description}
                    youtube={product?.youtube}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mid-container" style={{ padding: 0 }}>
            <div className=" my-8">
              <ReletedSection
                query={`&${handelCategoryParams(product?.category)}`}
                heading={"Related Product"}
                viewQuery={`&${handelCategoryParams(product?.category)}`}
                sliceItem={5}
              />
            </div>
          </div>
          <div className="my-10">
            <AppAds />
          </div>
        </div>
      )}

      <>
        {isAlreadyAvailable && (
          <AlreadyProductHave
            setIsAlreadyAvailable={setIsAlreadyAvailable}
            isAlreadyAvailable={isAlreadyAvailable}
          />
        )}
      </>
    </>
  );
};

export default ProductDetails;
