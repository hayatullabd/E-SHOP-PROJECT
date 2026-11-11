import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MdDashboardCustomize,
  MdOutlineContactMail,
  MdOutlineDashboard,
  MdOutlineLocalShipping,
} from "react-icons/md";
import { usePathname } from "next/navigation";

import { FaJediOrder, FaRegUser, FaUncharted } from "react-icons/fa";
import { SiCoursera } from "react-icons/si";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import SubMenu from "./SubMenu";
import AuthUser from "../../../lib/AuthUser";
import { useCustomQuery } from "../../hooks/useMyShopData";
import { FiLogOut, FiUser, FiUsers } from "react-icons/fi";
import { CgMenuGridO } from "react-icons/cg";
import { TbBrandAbstract } from "react-icons/tb";
import { RiListUnordered, RiProductHuntLine } from "react-icons/ri";
import { BsGift } from "react-icons/bs";
import { SlSettings } from "react-icons/sl";

const customerList = [
  {
    name: "Customer",
    icon: FiUser,
    active: 16,
    activeData: "/admin/customers",
    menus: [
      {
        title: "Add Customer",
        link: "/admin/customers/add-user",
      },
      {
        title: "All Customer",
        link: "/admin/customers",
      },
    ],
  },
];

const categoryList = [
  {
    name: "Category",
    icon: CgMenuGridO,
    active: 15,
    activeData: "/admin/category",
    menus: [
      {
        title: "Add Category",
        link: "/admin/category/add-category",
      },
      {
        title: "Category",
        link: "/admin/category",
      },
    ],
  },
];

const productList = [
  {
    name: "Product",
    icon: RiProductHuntLine,
    active: 15,
    activeData: "/admin/products",
    menus: [
      {
        title: "Add Product",
        link: "/admin/products/add-product",
      },
      {
        title: "Add Product",
        link: "/admin/products",
      },
    ],
  },
];

const settingList = [
  {
    name: "Setting",
    icon: SlSettings,
    active: 14,
    activeData: "/admin/setting",
    menus: [
      {
        title: "My Shop",
        link: "/admin/setting/my-shop",
      },
      {
        title: "Banner Setting",
        link: "/admin/setting/banner-setting",
      },
      {
        title: "Api Setting",
        link: "/admin/setting/site-api-setting",
      },
    ],
  },
];

const AdminSidebar = (props) => {
  const mobile = true;
  const pathname = usePathname();
  const isActive = (href) => {
    return pathname === href;
  };

  const { logout, userInfo } = AuthUser();

  const { data, isLoading, refetch } = useCustomQuery(
    "users-profile",
    `user/${userInfo?._id}`
  );

  const activeStyle = {
    // your active style

    color: "rgb(0, 106, 60)",
    background: "rgba(0, 106, 60, 0.08)",
    borderRight: "3px solid rgb(0, 106, 60)",
  };

  return (
    <div className=" w-[225px] max-w-[16rem] bg-white text-gray border-r border-r-gray-300 h-screen relative">
        
    <div className=" flex items-center justify-start px-5 py-4">
        <Image 
            src={"/logo.png"}
            width={100}
            height={100}
            alt="logo"
            className="w-[120px]"
        />
    </div>
     
      <div className="sticky inset-x-0 top-7 border-b border-gray-100">
        <Link
          href={`/admin/customers/update-user/${data?.data?._id}`}
          className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50"
        >
          <Image
            alt="profile image"
            src={data?.data?.imageURL || "/assets/user.jpg"}
            width={100}
            height={100}
            className="h-10 w-10 rounded-full object-cover"
          />

          <div>
            <p className="text-xs">
              <strong className="block font-extrabold uppercase">
                {data?.data?.fullName}
              </strong>

              <span className="text-gray-500"> {data?.data?.email} </span>
            </p>
          </div>
        </Link>
      </div>
      <div className=" h-[75vh] overflow-y-auto">
        <ul className=" mt-2">
          <li>
            <Link
              style={isActive("/admin/dashboard") ? activeStyle : undefined}
              href={"/admin/dashboard"}
              className=" flex items-center py-3 relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
            >
              <MdDashboardCustomize size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                DashBoard
              </span>
            </Link>
          </li>

          {customerList?.map((menu) => (
            <div key={menu.name} className="flex flex-col gap-1">
              <SubMenu data={menu} />
            </div>
          ))}

          {categoryList?.map((menu) => (
            <div key={menu.name} className="flex flex-col gap-1">
              <SubMenu data={menu} />
            </div>
          ))}

          <li>
            <Link
              style={
                isActive("/admin/brand/brand-setting") ? activeStyle : undefined
              }
              href={"/admin/brand/brand-setting"}
              className=" flex items-center py-3 relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
            >
              <TbBrandAbstract size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                Brand
              </span>
            </Link>
          </li>

          {productList?.map((menu) => (
            <div key={menu.name} className="flex flex-col gap-1">
              <SubMenu data={menu} />
            </div>
          ))}

          <li>
            <Link
              style={isActive("/admin/orders") ? activeStyle : undefined}
              href={"/admin/orders"}
              className=" flex items-center py-3 relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
            >
              <RiListUnordered size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                Order
              </span>
            </Link>
          </li>

          <li>
            <Link
              style={isActive("/admin/coupons") ? activeStyle : undefined}
              href={"/admin/coupons"}
              className=" flex items-center py-3 relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
            >
              <BsGift size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                Coupons
              </span>
            </Link>
          </li>

          <li>
            <Link
              style={isActive("/admin/delivery") ? activeStyle : undefined}
              href={"/admin/delivery"}
              className=" flex items-center py-3 relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
            >
              <MdOutlineLocalShipping size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                Shipping Setting
              </span>
            </Link>
          </li>

          {settingList?.map((menu) => (
            <div key={menu.name} className="flex flex-col gap-1">
              <SubMenu data={menu} />
            </div>
          ))}

          <li>
            <span
              onClick={() => logout()}
              className={
                "flex items-center py-3 cursor-pointer relative group  text-slate-500 font-semibold px-5 gap-3 hover:bg-gray-200"
              }
            >
              <FiLogOut size={20} className={" min-w-max"} />
              <span
                className={`${
                  !mobile
                    ? "absolute top-[3px] hidden group-hover:flex  bg-gray-200 rounded-md p-2 left-[100px]"
                    : ""
                }`}
              >
                Log Out
              </span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
