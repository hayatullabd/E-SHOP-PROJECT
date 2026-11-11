import React, { useContext, useEffect, useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsBagCheck } from "react-icons/bs";

import Link from "next/link";
import CartDrawer from "./drawer/CartDrawer";
import CreateContext from "../Components/CreateContex";
import WishlilstDrawer from "./drawer/WishlilstDrawer";
import CatagoryMenu from "./CatagoryMenu";
import { useRouter } from "next/router";
import { reactLocalStorage } from "reactjs-localstorage";
import AuthUser from "../../lib/AuthUser";
import { useMyShopData, useUserData } from "../hooks/useMyShopData";
import { SlUser } from "react-icons/sl";
import NavbarSearch from "../Components/NavbarSerach/NavbarSearch";
import LogoLoader from "./LogoLoader";
import Image from "next/image";
import { HiMenuAlt1 } from "react-icons/hi";
import CatagoryDrawer from "./drawer/CatagoryDrawer";
import { Icon } from "@iconify/react";
import SiebarMenu from "../Components/Home/Banner/SiebarMenu";

const Navbar = () => {
  const router = useRouter();
  const { logout } = AuthUser();
  const [isOpenCatgory, setIsOpenCatgory] = useState(false);
  const {
    addToCartRefresher,
    isOpen,
    setIsOpen,
    localStorageCartItems,
    setlocalStorageCartItems,
    localStorageWishlistItems,
    setlocalStorageWishlistItems,
    wishlistRefresher,
    isOpenWishlist,
    setIsOpenWishlist,
    user,
    token,
    setUser,
    setToken,
    setQueryFromCategory,
    categoryData
  } = useContext(CreateContext);

  const userRole = user?.role;
  const { isLoading, data: shopData, error } = useMyShopData();
  // const { user: userData } = useUserData();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_info"));
    const token = localStorage.getItem("access");
    setUser(user);
    setToken(token);
  }, [router, setUser, setToken]);

  const { pathname } = useRouter();
  // console.log(pathname)
  // const [isOpen, setIsOpen] = React.useState(false);
  // use for open cart drawer
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // ---------use for open wishlist drawer--------------
  const toggleDrawerWishlist = () => {
    setIsOpenWishlist(!isOpenWishlist);
  };

  useEffect(() => {
    const carts = reactLocalStorage.getObject("shopping-cart", true);
    const cart = JSON.parse(carts);
    setlocalStorageCartItems(cart);

    const wishilists = reactLocalStorage.getObject("wishlist", true);
    const wishilist = JSON.parse(wishilists);
    setlocalStorageWishlistItems(wishilist);
  }, [
    setlocalStorageCartItems,
    setlocalStorageWishlistItems,
    wishlistRefresher,
    addToCartRefresher,
  ]);

  const handleLogOut = () => {
    // reactLocalStorage.clear();
    // remove user from local storage to log user out
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleAdminDashboard = async () => {
    await router.push("/admin/dashboard");
  };
  const handleUserDashboard = async () => {
    await router.push("/user/dashboard");
  };

  const toggleDrawerCatagory = () => {
    setIsOpenCatgory(!isOpenCatgory);
  };

  return (
    <>
      {/* ------top small menu------------------ */}
      <div className="py-2 hidden bg-primary lg:block">
        <div className=" mid-container text-[13px] font-medium flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <a
              href={`tel:+88${shopData?.data?.phone}`}
              className="flex items-center gap-2"
            >
              <Icon className="text-lg" icon="ri:customer-service-fill" />{shopData?.data?.phone}
            </a>

            <a
              href={'#'} rel="noopener noreferrer"
              className="flex items-center gap-2"
            >

              <Icon className="text-lg" icon="mdi:email-outline" />{shopData?.data?.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {/* <a
              href="#"
              className="flex items-center gap-2"
            ><Icon icon="" />
              <Icon className="text-lg" icon="mdi:location" />Track Order
            </a> */}

            <button
              onClick={toggleDrawerWishlist}
              className="flex items-center gap-2 text-white"
            >
              <Icon className="text-lg text-white" icon="fluent:heart-16-regular" />Wishlist
            </button>
          </div>

        </div>
      </div>
      {/* --------------------main navbar------------------------ */}
      <div className="">
        <div className="bg-white  border border-b py-2">
          <div className=" mid-container flex items-center justify-between gap-3 md:gap-0 mx-auto">

            <div className="">
              <Link href={"/"} className="">
                <Image
                  src={"/logo.png"}
                  alt="logo"
                  height={300}
                  width={500}
                  className=" w-[150px] md:w-[200px] my-2"
                />
              </Link>
            </div>
            <div className=" lg:flex w-[58%] hidden justify-center items-center"><NavbarSearch /></div>

            {/* ------serachbar center-------- */}


            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDrawerCatagory}
                  className="p-3 bg-primary/10 rounded-full block lg:hidden"
                >
                  <Icon className="text-primary text-2xl  md:text-2xl" icon="ri:menu-fill" />
                </button>
                <div className="">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle  "
                    onClick={toggleDrawer}
                  >
                    <div className="indicator p-2 lg:p-0 bg-primary/10 lg:bg-white rounded-full">
                      <Icon className="text-[27px] text-primary lg:text-black" icon="material-symbols-light:shopping-bag-outline" />
                      <span className="badge badge-xs text-xs px-1 py-2 absolute right-1 top-1 rounded-full indicator-item bg-white lg:bg-primary border-none text-primary lg:text-white">
                        {localStorageCartItems.totalItems
                          ? localStorageCartItems.totalItems
                          : 0}
                      </span>
                    </div>
                  </label>
                </div>

              </div>
              {!token && (
                <div className=" hidden lg:block">
                  <label
                    tabIndex={0}
                    className=""
                  >
                    <Link href={"/auth/login"} className="flex items-center gap-1 font-bold text-sm text-black ">
                      Login / Register
                    </Link>
                  </label>
                </div>
              )}
              {/* nav drop */}

              {token && (
                <div className="dropdown dropdown-end hidden lg:block">
                  <label
                    tabIndex={0}
                    className="btn btn-sm btn-ghost btn-circle avatar bg-primary"
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        src={user?.imageURL || "/assets/user.jpg"}
                        className="rounded-full"
                        height={100}
                        width={100}
                        alt="profile"
                      />
                    </div>
                  </label>

                  <ul
                    tabIndex={0}
                    className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      {token && userRole === "user" && (
                        <Link
                          href={"/user/dashboard"}
                          className="justify-between"
                        >
                          Dashboard
                        </Link>
                      )}
                      {token && userRole === "admin"&& (
                        <Link
                          href={"/admin/dashboard"}
                          className="justify-between"
                        >
                          Dashboard
                        </Link>
                      )}

                      {token && userRole === "staff"&& (
                        <Link
                          href={"/admin/products/add-product"}
                          className="justify-between"
                        >
                          Dashboard
                        </Link>
                      )}
                    </li>

                    {token && userRole === "user" && (
                      <li>
                        <Link
                          href={"/user/my-order"}
                          className="justify-between"
                        >
                          My Order
                        </Link>
                      </li>
                    )}

                    {token &&
                      (userRole === "staff" || userRole === "user" || userRole === "admin") ? (
                      <>
                        <li>
                          <span onClick={logout}>Logout</span>
                        </li>
                      </>
                    ) : (
                      <></>
                    )}
                  </ul>
                </div>
              )}
            </div>


          </div>
        </div>
        {/* -------------------------3rd menu--------------- */}
        <div className="border-b bg-white hidden lg:block">
          <div className="mid-container flex items-center justify-center gap-5">
            {/* {
              pathname === '/' && <div className="bg-primary text-white  flex items-center w-[270px] justify-between px-2 py-3 rounded-t">
                <Icon className="text-3xl text-white" icon="material-symbols-light:menu" />
                <Icon className="text-lg" icon="solar:alt-arrow-down-outline" />
              </div>
            } */}
            {/* {
              pathname !== '/' && <div className="group">
                <div className="bg-primary text-white  flex items-center w-[270px] justify-between px-2 py-3 rounded-t">
                  <Icon className="text-3xl text-white" icon="material-symbols-light:menu" />
                  <Icon className="text-lg" icon="solar:alt-arrow-down-outline" />
                </div>
                <div className='absolute top-[-700px] group-hover:top-[185px]  w-[270px] bg-white z-[100]'>
                  <SiebarMenu catagories={categoryData} />
                </div>
              </div>
            } */}
            <ul className="font-bold lg:flex items-center justify-center gap-5 py-3  uppercase text-sm hidden">
              <li>
                <Link
                  className={`${pathname === '/' ? 'py-2  text-primary' : 'py-2  text-black/90  hover:text-primary'}`}
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => setQueryFromCategory("")}
                  className={`${pathname === '/shop' ? 'py-2 text-primary' : 'py-2  text-black/90  hover:text-primary'}`}
                  href="/shop"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/offer" className={`${pathname === '/offer' ? 'py-2   text-primary' : 'py-2  text-black/90  hover:text-primary'}`}>
                  Offer
                </Link>
              </li>
              <li>
                <Link href="/about" className={`${pathname === '/about' ? 'py-2  text-primary' : 'py-2  text-black/90  hover:text-primary'}`}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`${pathname === '/contact' ? 'py-2  text-primary' : 'py-2  text-black/90  hover:text-primary'}`}>
                  Contact Us
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </div>
      <CartDrawer
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        dir={"right"}
        products={localStorageCartItems}
      />
      <WishlilstDrawer
        isOpenWishlist={isOpenWishlist}
        toggleDrawerWishlist={toggleDrawerWishlist}
        dir={"right"}
        products={localStorageWishlistItems}
      />

      {/* shopping bag for dekstop */}

      {localStorageCartItems.totalItems > 0 && (
        <div
          className="toast toast-end toast-middle z-10 cursor-pointer hidden md:block"
          onClick={toggleDrawer}
        >
          <div className="alert p-0 bg-primary">
            <div className="flex flex-col text-xs">
              <div className="text-white font-bold flex flex-col items-center px-5 bg-slate-300  rounded-t-md py-3">
                <BsBagCheck size={25} className="text-primary mb-1" />
                <span className="text-slate-600 text-sm">
                  {localStorageCartItems?.totalItems} Items
                </span>
              </div>
              <p className="text-white font-bold  text-sm pb-2">
                ৳{localStorageCartItems?.cartTotal}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* shopping bag for mobile */}
      {localStorageCartItems.totalItems > 0 && (
        <div
          className="toast toast-end toast-middle z-10 mr-[-20px] cursor-pointer block md:hidden "
          onClick={toggleDrawer}
        >
          <div className="alert p-0 bg-primary">
            <div className="flex flex-col text-xs">
              <div className="text-white font-bold flex flex-col items-center px-3 bg-slate-300  rounded-md py-3">
                <BsBagCheck size={22} className="text-primary mb-1" />
                <span className="text-slate-600 text-sm">
                  {localStorageCartItems?.totalItems} Items
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
      <CatagoryDrawer
        isOpenCatgory={isOpenCatgory}
        toggleDrawerCatagory={toggleDrawerCatagory}
        dir={"left"}
        products={[]}
      />
    </>
  );
};

export default Navbar;

// cart drawer
