
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";
import { useQuery } from "react-query";
import { getCategories } from "../../../../lib/helper";
import CreateContext from "../../CreateContex";
import CustomCategorySkeleton from "../../CustomSkeleton/CustomCategorySkeleton";
import Image from "next/image";

const SiebarMenu = ({catagories}) => {
  const { setQueryFromCategory } = useContext(CreateContext);
  const [activeParentCategory, setActiveParentCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (catagories) {
      setIsLoading(false)
    }
  }, [catagories])

  const handleParentCategoryMouseEnter = (parentCategory) => {
    setActiveParentCategory(parentCategory);
  };

  const handleParentCategoryMouseLeave = () => {
    setActiveParentCategory(null);
  };

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
    <div className="">
      <ul id="catagory-menu" className="">
        <>
          {
            isLoading ? <CustomCategorySkeleton /> : <>{catagories?.data?.result?.slice(0, 10).map((category) => {
              const isParentCategoryActive =
                activeParentCategory === category?.parentCategory;
              const hasChildCategories = category?.childCategory?.length > 0;
              return (
                <li
                  key={category._id}
                  id="parent-category"
                  className="border-b  border-black/10"
                  onMouseEnter={() =>
                    handleParentCategoryMouseEnter(category.parentCategory)
                  }
                  onMouseLeave={handleParentCategoryMouseLeave}
                >
                  <Link
                    onClick={() =>
                      // setQueryFromCategory(`category=${category.parentCategory}`)
                      handelCategoryParams(category.parentCategory)
                    }
                    href={`/category/${category.parentCategory}`}
                    className=""
                  >
                    <span className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-extrabold text-xs uppercase">
                        <Image
                          alt="category icon"
                          src={category?.imageURLs[0]}
                          width={35}
                          height={35}
                          className="rounded-md object-fill w-5 h-5"
                        />
                        {category.parentCategory}
                      </span>
                      {hasChildCategories && <BiChevronRight size={25} />}
                    </span>
                  </Link>
                  {/* dropdown */}
                  {hasChildCategories && (
                    <ul
                      // id="child-category"
                      className={`${isParentCategoryActive ? "visible" : "hidden"
                        } absolute mt-1 bg-white shadow-lg p-2 h-[335px] overflow-y-auto`}
                    >
                      {/* <p className="font-bold text-md pt-5 pl-5 border-b-2 border border-accent">
                        {category.parentCategory}
                      </p> */}
                      {category.childCategory.map((child, index) => (
                        <li key={index}>
                          <Link
                            onClick={() =>
                              // setQueryFromCategory(`subCategory=${child}`)
                              handelChildeCategoryParams(child)
                            }
                            href="/shop"
                            className="text-xs font-extrabold  uppercase cursor-pointer"
                          >
                            {child}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}</>
          }
        </>
      </ul>
    </div>
  );
};

export default SiebarMenu;
