import React, { useContext, useEffect, useState } from "react";

import { getCategories } from "../../lib/helper";
import { useQuery } from "react-query";
import LoadingComponets from "./LoadingComponets";
import CreateContext from "../Components/CreateContex";
import Link from "next/link";
import Image from "next/image";

const CatagoryMenu = ({ toggleDrawerCatagory, toggle = false }) => {
  const { setQueryFromCategory } = useContext(CreateContext);
  const [active, setActive] = useState("");
  const [activeChildCategory, setActiveChildCategory] = useState("");

  const {
    data: catagories,
    isLoading,
    refetch,
  } = useQuery(["category"], getCategories);

  if (isLoading) {
    return (
      <div className="block md:hidden">
        <LoadingComponets />
      </div>
    );
  }

  const handelCategoryParams = (cat) => {
    const params = new URLSearchParams();
    params.append("category", cat);
    const url = `${params.toString()}`;
    setQueryFromCategory(url)
  }

  const handelChildeCategoryParams = (cat) => {
    const params = new URLSearchParams();
    params.append("subCategory", cat);
    const url = `${params.toString()}`;
    setQueryFromCategory(url)
  }


  return (
    <ul
      className="p-2 bg-none  md:bg-base-100 w-full h-[70vh] overflow-hidden  md:h-[350px] overflow-y-scroll"
      id="test-catagory-menus "
    >
      {catagories?.data?.result?.map((category) => {
        return (
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              onClick={() => setActive(category.parentCategory)}
              className={`flex cursor-pointer items-center justify-between px-3 py-2.5  border-b  ${active === category.parentCategory
                ? "bg-white  text-black"
                : "bg-white  text-black"
                }`}
            >
              <Link
                onClick={() => {
                  // setQueryFromCategory(`category=${category.parentCategory}`);
                  handelCategoryParams(category.parentCategory)
                  if (toggle) {
                    toggleDrawerCatagory();
                  }
                }}
                href={`/category/${category.parentCategory}`}
                className="flex items-center gap-2 w-[90%]"
              >
                <Image
                  alt="category icon"
                  src={category?.imageURLs[0]}
                  width={50}
                  height={50}
                  className="rounded-md object-fill w-5 h-5"
                />
                <span className="text-sm font-bold text-black">
                  {category.parentCategory}
                </span>
              </Link>

              {category?.childCategory.length > 0 && (
                <span
                  onClick={() => {
                    setActiveChildCategory("");
                    setActive("");
                  }}
                  className="shrink-0 transition duration-300 group-open:-rotate-180"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-black"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </summary>
            {category?.childCategory.length > 0 && (
              <nav aria-label="Teams Nav" className="flex flex-col">
                {category?.childCategory.map((child, index) => (
                  <Link
                    onClick={() => {
                      // setQueryFromCategory(`subCategory=${child}`);
                      handelChildeCategoryParams(child)
                      setActiveChildCategory(child);
                      setActive(category.parentCategory);
                      if (toggle) {
                        toggleDrawerCatagory();
                      }
                    }}
                    href={"/shop"}
                    className={`flex items-center gap-2 border-gray-300 pr-4 pl-9 py-2.5 border-b ${activeChildCategory === child
                      ? " text-black/50"
                      : " text-black/50"
                      }`}
                  >
                    <span className="text-sm font-medium ">{child} </span>
                  </Link>
                ))}
              </nav>
            )}
          </details>
        );
      })}
    </ul>
  );
};

export default CatagoryMenu;
