import { useState, useEffect } from "react";
import { MdOutlineUnfoldMore } from "react-icons/md";
import ProductCard from "../../../Shared/ProductCard";
import CustomProductSectionSkeleton from "../../CustomSkeleton/CustomProductSectionSkeleton";
import { useCustomQuery } from "../../../hooks/useMyShopData";

const PopularProducts = ({ userInterest }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const { data, isLoading } = useCustomQuery(
    ["products", limit, page],
    `product/user-interested-product?page=${page}&limit=${limit}`,
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (data?.data) {
      setProducts((prevProducts) => [...prevProducts, ...data.data]);
    }
  }, [data]);

  const showMoreItems = () => {
    setPage((prevPage) => prevPage + 1);
    setLimit(10);
  };

  return (
    <>
      {isLoading && page === 1 ? (
        <CustomProductSectionSkeleton />
      ) : (
        <div className="py-1 md:py-10 bg-accent">
          <div className="mid-container">
            <div className="my-5">
              <div className="flex items-center justify-between">
                <span className="text-[18px] md:text-[22px] text-black/70">
                  Just For You
                </span>
              </div>
            </div>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3">
              {products.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
            {data?.total > products.length && (
              <div className="w-full text-center">
                <button
                  onClick={showMoreItems}
                  className="bg-primary px-3 py-2 font-bold mt-5 rounded-md mx-auto flex items-center gap-1 hover:bg-opacity-0 duration-150 text-white hover:text-primary border border-primary"
                >
                  <MdOutlineUnfoldMore size={22} />
                  Load More
                </button>
                {isFetching && <CustomProductSectionSkeleton />}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopularProducts;
