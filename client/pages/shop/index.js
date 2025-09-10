import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillFilter } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { useQuery } from "react-query";
import { getCategories, products } from "../../lib/helper";
import CreateContext from "../../src/Components/CreateContex";
import CustomProductSectionSkeleton from "../../src/Components/CustomSkeleton/CustomProductSectionSkeleton";
import FilterByCategoryRow from "../../src/Components/Shop/FilterByCategoryRow";
import FilterBySubCategory from "../../src/Components/Shop/FilterBySubCategory";
import ProductCard from "../../src/Shared/ProductCard";
import ShopPagination from "../../src/Shared/ShopPageniation";
import ShopPageDrawer from "../../src/Shared/drawer/ShopPageDrawer";

const Shop = () => {
  const [queryFilterPrice, setQueryFilterPrice] = useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const { queryFromCategory, setQueryFromCategory } = useContext(CreateContext);
  const [currentItems, setCurrentItems] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;


  const loadingComp = <>
    <CustomProductSectionSkeleton />
    <CustomProductSectionSkeleton />
    <CustomProductSectionSkeleton />
  </>


  const fetchProducts = () => products(`${queryFilterPrice}&page=${page}&limit=${itemsPerPage}`);

  const { data, isLoading, refetch } = useQuery(["products", queryFilterPrice, page], fetchProducts, {
    keepPreviousData: false,
  });

  const { data: categories, isLoading: categoryLoading } = useQuery("category", getCategories);

  useEffect(() => {
    if (queryFromCategory.length > 0) {
      setQueryFilterPrice(queryFromCategory);
      setPage(1); // Reset to the first page when filter changes
      refetch();
    } else {
      setQueryFilterPrice("");
      refetch();
    }
  }, [queryFromCategory]);

  useEffect(() => {
    if (data?.data?.products) {
      setCurrentItems(data.data.products);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleFilterByPrice = (e) => {
    e.preventDefault();
    let minPrice = e.target.minPrice.value;
    let maxPrice = e.target.maxPrice.value;
    setQueryFilterPrice(
      `salePrice[gte]=${minPrice}&salePrice[lte]=${maxPrice}`
    );
    setPage(1); // Reset to the first page when filter changes
    refetch();
  };

  const handlePriceSort = (e) => {
    let value = e.target.value;
    if (value === "lth") {
      setQueryFilterPrice(`sort=salePrice`);
    } else {
      setQueryFilterPrice(`sort=-salePrice`);
    }
    setPage(1); // Reset to the first page when sort changes
    refetch();
  };

  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };



  return (
    <div className="bg-white">
      <div className="px-5 md:px-[3rem]">
        <div className="py-7">
          <div className="flex gap-10 mt-3">
            <div className="w-[20%] hidden md:block">
              {/* price */}
              <div className="overflow-scroll h-[90vh] md:h-full ">
                <form
                  onSubmit={handleFilterByPrice}
                  className="bg-white p-3 md:p-5 rounded-md mb-1 md:mb-6"
                >
                  <div className="pb-3">
                    <h3 className="text-[#39404a] font-bold text-sm ">FILTER BY PRICE</h3>
                  </div>
                  <div className="filter-body">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        {...register("minPrice", { required: true })}
                        placeholder="Min - 00"
                        className="w-full block h-11 rounded-md bg-[#f5f5f5] text-center text-[#555] text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max - 5k"
                        {...register("maxPrice", { required: true })}
                        className="w-full block h-11 rounded-md bg-[#f5f5f5] text-center text-[#555] text-sm "
                      />
                    </div>
                  </div>
                  <div className=" mt-3 mb-1">
                    <button
                      type="submit"
                      className="text-sm flex items-center justify-center w-full gap-1 text-[#39404a] px-3 py-[6px] rounded-md bg-[#e8e8e8] outline-none duration-150 hover:bg-primary hover:text-white"
                    >
                      <FaSearch />
                      <span className="font-bold">Search</span>
                    </button>
                  </div>
                </form>
                <div className="bg-white p-3  md:p-5 rounded-md mb-1 md:mb-6">
                  <div className="pb-3">
                    <h3 className="text-[#39404a] font-bold text-sm ">
                      FILTER BY CATEGORY
                    </h3>
                  </div>
                  {/* filter by category */}
                  <FilterByCategoryRow
                    setQueryFilterPrice={setQueryFilterPrice}
                    queryFilterPrice={queryFilterPrice}
                    categories={categories}
                    refetch={refetch}
                  />
                </div>
                <div className="bg-white p-3 md:p-5 rounded-md mb-1 md:mb-6">
                  <div className="pb-3">
                    <h3 className="text-[#39404a] font-bold text-sm ">
                      FILTER BY SUB CATEGORY
                    </h3>
                  </div>
                  {/* ---------------sub category------------- */}
                  <FilterBySubCategory
                    categories={categories}
                    setQueryFilter={setQueryFilterPrice}
                    refetch={refetch}
                  />
                </div>
              </div>
            </div>
            <div className="md:w-[80%] w-full min-h-screen">
              <div className="block md:flex justify-between items-center mb-3">
                <div className="w-full md:w-1/2 flex items-center justify-between">
                  <p className="text-sm capitalize font-bold w-4/5">
                    Total {data?.data?.total} items Found
                  </p>
                  <div
                    onClick={toggleDrawer}
                    className="md:hidden bg-primary text-white font-bold cursor-pointer flex justify-center items-center w-[100px] h-10 rounded-md border border-primary hover:bg-white hover:text-primary duration-150 "
                  >
                    Filter <AiFillFilter size={20} />
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-1/2 justify-start md:justify-end items-center py-2">
                  <p className="font-bold hidden lg:block">Sort by :</p>
                  <div>
                    <select
                      onChange={handlePriceSort}
                      className="select select-primary w-full max-w-xs focus:outline-none"
                    >
                      <option disabled selected hidden>
                        Best Match
                      </option>
                      <option value={"lth"}>Price Low to High</option>
                      <option value={"htl"}>Price High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
              {isLoading ? (
                <>{loadingComp}</>
              ) : (
                <div className="flex flex-col gap-2 items-center justify-between h-[85%]">
                  <div className="grid lg:grid-cols-5 md:grid-cols-4  sm:grid-cols-3 grid-cols-2 gap-4 ">
                    {currentItems?.map((item) => (
                      <ProductCard key={item._id} product={item}></ProductCard>
                    ))}
                  </div>
                  <ShopPagination
                    totalItems={data?.data?.total}
                    itemsPerPage={itemsPerPage}
                    currentPage={page}
                    onPageChange={(newPage) => setPage(newPage)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ShopPageDrawer
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        dir={"left"}
        leftSideBar={"leftSideBar"}
      ></ShopPageDrawer>
    </div>
  );
};

export default Shop;
