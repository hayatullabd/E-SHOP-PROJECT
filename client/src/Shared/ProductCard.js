
import { useContext, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import CreateContext from "../Components/CreateContex";
import setCartInLocalStorage from "../../lib/setCartInLocalStorage";
import AlreadyProductHave from "../Components/Home/PopularProducts/AlreadyProductHave";
import { AiOutlineHeart } from "react-icons/ai";
import setWishlistInLocalStorage from "../../lib/setWishlistInLocalStorage";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { calculateDiscount } from "../../lib/claculateDiscount";
import { Icon } from "@iconify/react/dist/iconify.js";
const ProductCard = ({ product }) => {
  // use for toast
  const [isAlreadyAvailable, setIsAlreadyAvailable] = useState(false);

  const navigate = useRouter();


  const handleBuyNowButtonClick = () => {
    navigate.push(`/checkout/direct-buy/${product?._id}`)
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
  }

  const {
    addToCartRefresher,
    setAddToCartRefresher,
    setWishlistRefresher,
    wishlistRefresher,
    setBuyNowProduct,
  } = useContext(CreateContext);

  const handleSetLocalStorage = () => {
    setAddToCartRefresher(!addToCartRefresher);
    const localStorageMessage = setCartInLocalStorage(product);

    setIsAlreadyAvailable(false);

    if (localStorageMessage) {
      setIsAlreadyAvailable("Already Added In Cart");
    }
  };

  const handleSetLocalStorageWishlist = () => {
    setWishlistRefresher(!wishlistRefresher);
    const localStorageMessageWishlist = setWishlistInLocalStorage(product);

    setIsAlreadyAvailable(false);

    if (localStorageMessageWishlist) {
      setIsAlreadyAvailable("Already Added In Wishlist");
    }
  };

  const productView = () => {
    navigate.push(`/product/${product?._id}`)
    window.gtag("event", "view_item", {
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
  }

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


  const discountPrice = calculateDiscount(product?.variant[0]?.productPrice, product?.variant[0]?.salePrice)


  return (
    <div className="bg-white group  overflow-hidden border">
      <div className="mb-auto overflow-hidden relative">
        <Link
          href={`/product/${product?._id}`}
          className="w-full  overflow-hidden relative cursor-pointer"
          onClick={() => { productView(); }}
        >
          <Image
            src={product?.imageURLs[0]}
            alt="product image"
            width={500}
            height={367}
            className="h-[195px] md:h-[210px]  object-container"
          />
        </Link>
        <div className="bg-white px-2 py-2 flex flex-col gap-2 text-black/80 absolute right-[-500px] group-hover:right-2 duration-500 group-hover:top-2">
          <button
            disabled={product?.quantity < 1}
            onClick={() => { handleSetLocalStorage(); handleAddCartButtonClick(); }}
          ><Icon className='text-3xl' icon="fluent:cart-16-regular" /></button>
          <button
            onClick={() => { handleSetLocalStorageWishlist(); }}
            disabled={product?.quantity < 1}
          ><Icon className='text-3xl' icon="fluent:heart-16-regular" /></button>
        </div>
        {/* <Link href={`/checkout/direct-buy/${product?._id}`}>
        <button className="w-full bg-black bottom-[-110px] group-hover:block absolute group-hover:bottom-0 py-1.5 text-white font-bold text-sm duration-500">QUICK BUY

        </button>
      </Link> */}

        {/* <label
        onClick={() => { handleSetLocalStorageWishlist(); }}
        disabled={product?.quantity < 1}
        tabIndex={0}
        className="btn btn-sm btn-ghost btn-circle absolute top-0 right-0 bg-[#00000033]"
      >


        <AiOutlineHeart
          className="text-secondary hover:text-primary"
          size={22}
        />

      </label> */}
        {/* {product?.quantity > 0 && (
        <Link
          href={`/checkout/direct-buy/${product?._id}`}
          tabIndex={0}
          className=" absolute top-0 left-0 "
        >
          <div onClick={() => handleBuyNowButtonClick(product?.name?.slice(0, 50))} className="flex items-center gap-1 text-xs  p-1 rounded-md cursor-pointer bg-primary bg-opacity-80 duration-150 hover:bg-opacity-70 text-white hover:text-black font-bold  border-2 border-primary ">
            <AiOutlineHeart className="" size={15} />
            <span className="text-[9px]">Buy Now</span>
          </div>
        </Link>
      )} */}
        {discountPrice > 0 && <span className=" absolute top-1.5 left-1.5 ">
          <div className="text-[10px] md:text-xs py-1 px-2.5 rounded-full  bg-primary  text-white  font-bold   ">
            <span>{product?.variant[0]?.discount}% OFF</span>
          </div>
        </span>}
      </div>

      <div className="p-3 flex flex-col justify-between h-[120px] md:h-[125px]">
        <div>
          <h1
            className="text-sm text-black/80 font-[400] md:font-[500] hover:text-primary cursor-pointer duration-150 mb-2"
            onClick={() => { productView(); }}
          >
            {product?.name?.length > 20
              ? product?.name.slice(0, 19) + "..."
              : product?.name}
          </h1>
          <div className="flex items-center text-lg text-black/30 gap-[-4px]">
            <Icon icon="mdi:star-outline" />
            <Icon icon="mdi:star-outline" />
            <Icon icon="mdi:star-outline" />
            <Icon icon="mdi:star-outline" />
            <Icon icon="mdi:star-outline" />
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto ">
          <div className="flex items-center">
            {product?.salePrice !== product?.productPrice && <p className="text-[13px] text-black/50  mr-2 line-through">
              ৳{product?.variant[0]?.productPrice}
            </p>}
            <p className="text-[13px] text-primary font-bold">
              ৳ {product?.variant[0]?.salePrice}
            </p>


          </div>
          {/* {product?.quantity < 1 ? (
          <span className="text-xs text-red-600 font-extrabold">
            Out Of Stock
          </span>
        ) : (
          <div className="flex items-center">
            <button
              disabled={product?.quantity < 1}
              onClick={() => { handleSetLocalStorage(); handleAddCartButtonClick(); }}
              // onClick={handleSetLocalStorage}
              className=""
            >
              <Icon className='text-lg hover:text-primary duration-200 text-black' icon="ion:cart" />
            </button>
          </div>
        )} */}
        </div>
      </div>
      <>
        {isAlreadyAvailable && (
          <AlreadyProductHave
            setIsAlreadyAvailable={setIsAlreadyAvailable}
            isAlreadyAvailable={isAlreadyAvailable}
          />
        )}
      </>
    </div>
  );
};

export default ProductCard;
