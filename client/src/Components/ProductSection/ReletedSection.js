import Link from "next/link";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import LoadingComponets from "../../Shared/LoadingComponets";
import ProductCard from "../../Shared/ProductCard";
import { AiFillEye } from "react-icons/ai";
import CreateContext from "../CreateContex";
import { products } from "../../../lib/helper";
import CustomProductSectionSkeleton from "../CustomSkeleton/CustomProductSectionSkeleton"
const ReletedSection = ({
    query,
    heading,
    subtitle = "",
    viewQuery,
    sliceItem = 10,
}) => {
    const [queryFilter, setQuery] = useState(query);
    const { queryFromCategory, setQueryFromCategory } = useContext(CreateContext);
    const { data, isLoading, refetch } = useQuery(["products", queryFilter], () =>
        products(queryFilter)
    );



    return (
        <>
            <div className=" md:py-10 bg-accent ">
                <div className="mid-container">
                    <div className="md:mb-7 mb-[-30px] mx-auto md:w-[600px]">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold capitalize text-[#444]  mt-8 mb-2">
                                {heading}
                            </h1>
                            <p className=" text-neutral">{subtitle}</p>
                        </div>
                    </div>
                    {!isLoading ? (
                        <div className="grid lg:grid-cols-6 md:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-4">
                            {data?.data?.products.slice(0, sliceItem)?.map((item) => (
                                <ProductCard key={item._id} product={item}></ProductCard>
                            ))}
                        </div>
                    ) : (
                        <CustomProductSectionSkeleton />
                    )}
                </div>
                <div className="text-center mt-10 mb-2">
                    <Link
                        onClick={() => setQueryFromCategory(viewQuery)}
                        href={"/shop"}
                        className="inline-block bg-primary px-4 py-2 rounded-md hover:bg-white hover:text-primary border border-primary text-white duration-150 font-bold "
                    >
                        <span className="flex justify-center items-center gap-2 ">
                            <AiFillEye size={22} /> View All
                        </span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ReletedSection;
