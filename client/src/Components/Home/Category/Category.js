import { getCategories, products } from "../../../../lib/helper";
import { useQuery } from "react-query";
import LoadingComponets from "../../../Shared/LoadingComponets";
import Link from "next/link";

import { useContext, useEffect, useState } from "react";
import CreateContext from "../../CreateContex";
import CustomFeaturedCategoriesSkeleton from "../../CustomSkeleton/CustomFeaturedCategoriesSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation ,Autoplay} from "swiper";
import Image from "next/image";

const Category = ({ catagories }) => {
  const { setQueryFromCategory } = useContext(CreateContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (catagories) {
      setIsLoading(false);
    }
  }, [catagories]);
  // const {
  //   data: catagories,
  //   isLoading,
  //   refetch,
  // } = useQuery(["categories"], getCategories);

  const handelCategoryParams = (cat) => {
    const params = new URLSearchParams();
    params.append("category", cat);
    const url = `${params.toString()}`;
    setQueryFromCategory(url);
  };

  return (
    <>
      <div className="pt-3">
        <div className="mid-container">
          <div className=" bg-white p-2 rounded-lg">
            {isLoading ? (
              <CustomFeaturedCategoriesSkeleton />
            ) : (
              <Swiper
                slidesPerView={2}
                spaceBetween={10}
                breakpoints={{
                  "@.50": {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  "@1.00": {
                    slidesPerView: 4,
                    spaceBetween: 10,
                  },
                  "@1.50": {
                    slidesPerView: 5,
                    spaceBetween: 10,
                  },
                  "@1.75": {
                    slidesPerView: 7,
                    spaceBetween: 15,
                  },
                  "@2.25": {
                    slidesPerView: 8,
                    spaceBetween: 15,
                  },
                }}
                navigation={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                modules={[Navigation, Autoplay]}
                className=" mySwiper_2"
              >
                {catagories?.data?.result?.map((category, index) => {
                  return (
                    <SwiperSlide key={index} className=" ">
                      <Link
                        onClick={() =>
                          // setQueryFromCategory(
                          //   `category=${category.parentCategory}`
                          // )
                          handelCategoryParams(category.parentCategory)
                        }
                        href={`/category/${category.parentCategory}`}
                        className="font-[500] md:font-extrabold text-[10px] hover:text-primary overflow-hidden "
                      >
                        <Image
                          alt="category icon"
                          src={category?.imageURLs[0]}
                          width={300}
                          height={200}
                          className="rounded-2xl object-fill w-16 md:w-20 h-16 mx-auto hover:scale-125  duration-500"
                        />
                        <p className="text-center mt-2">
                          {category.parentCategory}
                        </p>
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
