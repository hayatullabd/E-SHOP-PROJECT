import React, { useContext, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";

import Link from "next/link";
import { useCustomQuery } from "../../hooks/useMyShopData";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import CreateContext from "../CreateContex";
import { setCookie } from "../../hooks/useCustomCookie";
import Image from "next/image";
import NavbarProductCard from "../../Shared/NavbarProductCard";
import { Icon } from "@iconify/react";

const NavbarSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [searchEnable, setSearchEnable] = useState(false);
  const [search, setSearch] = useState(false);
  const containerRef = useRef(null);
  const { queryFromCategory, setQueryFromCategory } = useContext(CreateContext);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCookie("searchQuery", e.target.search.value, 7);
    setSearchEnable(false);
    setQueryFromCategory(`search=${searchValue}`);
    router.push(`/shop`);
  };

  const handleIntersProductSave = (product) => {
    setCookie("searchQuery", searchValue, 7);
    setSearchEnable(false);
  };

  const { data: result, loading } = useCustomQuery(
    ["product", searchValue],
    searchValue.length > 1 ? `product?status=true&search=${searchValue}` : null
  );
  return (
    <>
      {/* <div className="block lg:hidden">
        <button onClick={() => setSearch(!search)}><Icon className="text-black text-3xl" icon="fluent:search-24-filled" /></button>
      </div> */}


      <div className={` ${search === true ? 'navbar-center w-full absolute top-[85px] duration-700 left-0 ' : 'absolute duration-700 w-full right-0 top-[-200px] hidden'}`}>
        <div className="form-control w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center"
          >
            <input
              type="text"
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchEnable(true);
              }}
              placeholder="Search Product"
              className="border border-primary block w-full h-10 rounded-l px-2"
              style={{ outline: "none" }}
              name="search"
            />
            <button
              type="submit"
              className="bg-primary  border-none hover:bg-black h-10 rounded-r px-4"
            >
              <AiOutlineSearch size={22} className="text-white" />
            </button>
          </form>
          {/* search product list */}
          {result?.status === "success" &&
            searchEnable &&
            searchValue.length > 1 && (
              <div
                ref={containerRef}
                className="w-full max-h-[350px] bg-white border-gray-200 border p-3 rounded-sm overflow-y-scroll shadow-xl absolute top-10 z-10 left-0 right-0"
              >
                {result.data.products.length > 0 ? (
                  result.data.products.slice(0, 10).map((product) => (
                    <NavbarProductCard product={product} />
                  ))
                ) : (
                  <div className="text-center uppercase py-8">
                    Product Not found
                  </div>
                )}
              </div>
            )}
        </div>
      </div>

      <div className="  navbar-center lg:flex justify-center items-center relative w-full">
        <div className="form-control w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center"
          >
            <input
              type="text"
              onChange={(e) => {
                setSearchValue(e.target.value);
                setSearchEnable(true);
              }}
              placeholder="Search For Products"
              className=" border-0 lg:border-2 lg:border-r-0 text-sm  border-gray-200 rounded-l  block w-full h-11 px-5 lg:px-2"
              style={{ outline: "none" }}
              name="search"
            />
            <button
              type="submit"
              className="  border-0 lg:border-2 lg:border-l-0 border-gray-200 rounded-r  h-11 px-4 lg:px-2"
            >
              <Icon className="text-2xl text-gray-400" icon="gg:search" />
            </button>
          </form>
          {/* search product list */}
          {result?.status === "success" &&
            searchEnable &&
            searchValue.length > 1 && (
              <div
                ref={containerRef}
                className="w-full max-h-[350px] bg-white border-gray-200 border p-3 rounded-sm overflow-y-scroll shadow-xl absolute top-10 z-10 left-0 right-0"
              >
                {result.data.products.length > 0 ? (
                  result.data.products.slice(0, 10).map((product) => (
                    <NavbarProductCard product={product} />
                  ))
                ) : (
                  <div className="text-center uppercase py-8">
                    Product Not found
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default NavbarSearch;
