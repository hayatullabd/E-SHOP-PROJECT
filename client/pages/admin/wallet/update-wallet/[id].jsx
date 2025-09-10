import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../../src/Components/DashboardLayout";
import AdminDashboardBreadcrumb from "../../../../src/Shared/AdminDashboardBreadcrumb";
import { singleImageUploader } from "../../../../lib/imageUploader";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import {
  getCategoriesAndSubCategory,
  getCategoriesItem,
} from "../../../../lib/helper";
import { useQuery } from "react-query";
import {updateMethodHook } from "../../../../lib/usePostHooks";
import server_url from "../../../../lib/config";
import "react-datepicker/dist/react-datepicker.css";
import { convertTimestamp2 } from "../../../../lib/convertTimestampDateAndTime";


const UpdateWallet = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  const router = useRouter()

  const id = router.query.id;
  let url = server_url + "/wallet";

  const [selectedChildCategory, setSelectedChildCategory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  const [subCategory, setSubCategory] = useState();
  const [subCategoryItem, setSubCategoryItem] = useState();
  const [wallet,setWallet] = useState({})

  useEffect(() => {
    if (id) {
      setLoading(true);
      url += `/${id}`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setValue("walletName",data?.data?.walletName)
            setValue("discountPercentage",data?.data?.discountPercentage)
            setValue("minAmount",data?.data?.minAmount)
            setValue("maxAmount",data?.data?.maxAmount)
            setValue("underOfCategory",data?.data?.underOfCategory)
            setSubCategory(data?.data?.underOfCategory)
            setWallet(data?.data)
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, url]);

  // const [startDateInputType, setStartDateInputType] = useState('text');
  // const [endDateInputType, setEndDateInputType] = useState('text');
  const {
    data: categoryAndSubCategory,
    isLoading,
    refetch,
  } = useQuery(["category-SubCategory"], getCategoriesAndSubCategory);

  const { data: category } = useQuery(["category"], getCategoriesItem);

 


  useEffect(() => {
    if (subCategory) {
      const result = category?.data?.result?.find(
        (item) => item.parentCategory === subCategory
      );
      setSubCategoryItem(result);
    }
  }, [subCategory,wallet]);

  const handleAddCoupon = (data) => {
    setLoading(true);
    const url = server_url + "/wallet/" +id;
    updateMethodHook(url, data,setLoading);
  };

  // const handleFocusStartDateInputType = () => {
  //   setStartDateInputType('date');
  // };

  // const handleBlurStartDateInputType = () => {
  //   setStartDateInputType('text');
  // };
  // const handleFocusEndDateInputType = () => {
  //   setEndDateInputType('date');
  // };

  // const handleBlurEndDateInputType = () => {
  //   setEndDateInputType('text');
  // };

  return (
    <DashboardLayout>
      <div className="mid-container">
        <AdminDashboardBreadcrumb
          title={"Update Cashback"}
          subtitle={"Add your Cashback and necessary information from here"}
        />
        <div className="mt-5 md:px-7">
          <form onSubmit={handleSubmit(handleAddCoupon)}>
            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Cashback Name</p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type={"text"}
                  {...register("walletName", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Cashback Name "
                />
              </div>
            </div>
            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Cashback Percentage</p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type="number"
                  {...register("discountPercentage", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Cashback Percentage"
                />
              </div>
            </div>
            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Minimum Cashback Amount</p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type="number"
                  {...register("minAmount", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Minimum Cashback Amount"
                />
              </div>
            </div>
            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Maximum Cashback Amount</p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type="number"
                  {...register("maxAmount", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Maximum Cashback Amount"
                />
              </div>
            </div>

            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Which Category</p>
              </div>
              <div className="w-full md:w-[70%]">
                <select
                  {...register("underOfCategory", { required: true })}
                  className="select select-bordered w-full  focus:outline-none "
                  placeholder="Type"
                  value={subCategory}
                >
                  <option disabled selected hidden>
                    Select category and subCategory
                  </option>
                  {categoryAndSubCategory?.data?.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-[30%] text-lg font-semibold md:block hidden"></div>
              <div className="w-full md:w-[70%]">
                <input
                  type={"submit"}
                  className="btn btn-primary w-full text-white"
                  value={loading ? "Loading.." : "Update Wallet"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateWallet;
