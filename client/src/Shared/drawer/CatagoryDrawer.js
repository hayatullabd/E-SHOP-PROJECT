import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import Drawer from "react-modern-drawer";
import CreateContext from "../../Components/CreateContex";
import CatagoryMenu from "../CatagoryMenu";
import AuthUser from "../../../lib/AuthUser";
import { useMyShopData } from "../../hooks/useMyShopData";
import Image from "next/image";
import { useMediaQuery } from "@react-hook/media-query";
import { useRouter } from "next/router";
import NavbarSearch from "../../Components/NavbarSerach/NavbarSearch";

const CatagoryDrawer = ({
  isOpenCatgory,
  toggleDrawerCatagory,
  dir,
  products,
}) => {
  const [selectMenu, setSelectMenu] = useState("cat");
  const { setQueryFromCategory } = useContext(CreateContext);
  const { logout } = AuthUser();
  const { token, user } = useContext(CreateContext);
  const { isLoading, data: shopData, error } = useMyShopData();
  const userRole = user?.role;
  const [mobile, setMobile] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 1000px)");
  const { pathname } = useRouter();
  useEffect(() => {
    if (isSmallScreen) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [isSmallScreen]);

  let menus = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Shop",
      path: "/shop",
    },
    {
      title: "Offer",
      path: "/offer",
    },
    {
      title: "About Us",
      path: "/about",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
    // {
    //   title: "FAQ",
    //   path: "/faq",
    // },
  ];

  return (
    <>
      <Drawer
        open={isOpenCatgory}
        onClose={toggleDrawerCatagory}
        direction={dir}
        className=""
        style={mobile ? { width: "85%" } : { width: "400px" }}
      >
        <div className="bg-white h-full">
          <div className="p-3">
            <div className="flex justify-between">
              <span className="flex items-center text-white gap-2">
                {/* <MdAddShoppingCart size={30} /> */}
                <span className="text-2xl font-bold">
                </span>
              </span>
              
            </div>
          </div>
          <div className="mb-3">
            <NavbarSearch />
          </div>
          <div className="">
            <div className="w-full  grid grid-cols-2  border overflow-hidden">
            <button
                onClick={() => setSelectMenu("cat")}
                className={`py-3 font-bold cursor-pointer duration-300 ${selectMenu === "cat"
                  ? "bg-gray-200 text-black border-b-2 border-primary"
                  : "bg-gray-100 text-gray-500 border-b-2 border-transparent"
                  }`}
              >
                Categories
              </button>
              <button
                onClick={() => setSelectMenu("menu")}
                className={`py-3 font-bold cursor-pointer duration-300 ${selectMenu === "menu"
                  ? "bg-gray-200 text-black border-b-2 border-primary"
                  : "bg-gray-100 text-gray-500 border-b-2 border-transparent"
                  }`}
              >
                Menu
              </button>

            </div>
          </div>

          {selectMenu === "cat" && (
            <CatagoryMenu
              toggleDrawerCatagory={toggleDrawerCatagory}
              toggle={true}
            />
          )}
          {selectMenu === "menu" && (
            <>
              <ul className="p-2" id="test-catagory-menus">
                {menus.map((menu, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (menu.path === "/shop") {
                          setQueryFromCategory("");
                        }
                      }}
                    >
                      <Link
                        onClick={toggleDrawerCatagory}
                        href={menu.path}
                        className={`${pathname === menu?.path ? 'text-primary' : 'text-black hover:text-primary'} flex items-center gap-2  duration-300   py-2.5 px-3 text-sm border-b font-bold `}
                      >
                        {menu.title}
                      </Link>
                    </li>
                  );
                })}
                {/* here show admin menu */}
                {/* {token && (
                  <h2 className="text-black font-bold  px-3 mt-3 text-xl">
                    My Dashboard
                  </h2>
                )} */}
                <li>
                  {!token && (
                    <Link href={"/auth/login"} className="flex items-center gap-2 text-black  py-2 px-3 text-sm border-b font-bold  ">
                      Login
                    </Link>
                  )}
                </li>
                <li>

                  {token && userRole === "user" && (
                    <Link
                      className="flex items-center gap-2 text-black  py-2 px-3 text-sm border-b font-bold "
                      href={"/user/dashboard"}
                    >
                      Dashboard
                    </Link>
                  )}
                  {userRole === "admin" && (
                    <Link
                      className="flex items-center gap-2 text-black  py-2 px-3 text-sm border-b font-bold "
                      href={"/admin/dashboard"}
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
                      className="flex items-center gap-2 text-black  py-2 px-3 text-sm border-b font-bold "
                      href={"/user/my-order"}
                    >
                      My Order
                    </Link>
                  </li>
                )}

                {token && (userRole === "admin" || userRole === "user" || userRole === "staff") ? (
                  <>
                    <li>
                      <span
                        className="flex items-center gap-2 text-black  py-2 px-3 text-sm border-b font-bold "
                        onClick={logout}
                      >
                        Logout
                      </span>
                    </li>
                  </>
                ) : (
                  <></>
                )}
              </ul>
            </>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default CatagoryDrawer;
