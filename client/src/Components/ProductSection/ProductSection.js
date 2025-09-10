import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import LoadingComponets from "../../Shared/LoadingComponets";
import ProductCard from "../../Shared/ProductCard";
import { AiFillEye } from "react-icons/ai";
import CreateContext from "../CreateContex";
import { products } from "../../../lib/helper";
import CustomProductSectionSkeleton from "../CustomSkeleton/CustomProductSectionSkeleton"
const ProductSection = ({
  heading,
  subtitle = "",
  data,
}) => {
  // const [queryFilter, setQuery] = useState(query);
   const { queryFromCategory, setQueryFromCategory } = useContext(CreateContext);
  // const { data, isLoading, refetch } = useQuery(["products", queryFilter], () =>
  //   products(queryFilter)
  // );

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])



  return (
    <div className="">
      <div className="mid-container">
        <div className="my-5">
          <div className="flex items-center justify-between">
            <span className="text-[18px] md:text-[22px]  text-black/70">
              {heading}
            </span>
            {
              data?.length > 1 && <div className="text-end mt-2">
                <Link
                  onClick={() => setQueryFromCategory(viewQuery)}
                  href={"/shop"}
                  className="text-[15px] md:text-lg  text-black/70   font-bold "
                >
                  View All
                </Link>
              </div>
            }
          </div>
          {/* <span className="h-[2px] bg-gray-400 w-full"></span> */}
        </div>
        {!isLoading ? (
          <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4 ">
            {data?.slice(0, 12)?.map((item) => (
              <ProductCard key={item._id} product={item}></ProductCard>
            ))}
          </div>
        ) : (
          <CustomProductSectionSkeleton />
        )}

      </div>

    </div>
  );
};

export default ProductSection;
