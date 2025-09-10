import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../src/Components/DashboardLayout";

import { BsCloudUploadFill } from "react-icons/bs";
import { TagsInput } from "react-tag-input-component";
import AdminDashboardBreadcrumb from "../../../src/Shared/AdminDashboardBreadcrumb";
import { singleImageUploader } from "../../../lib/imageUploader";
import { useForm } from "react-hook-form";
import {
  getCategoriesAndSubCategory,
  getCategoriesItem,
} from "../../../lib/helper";
import { useQuery } from "react-query";
import { postMethodHook } from "../../../lib/usePostHooks";
import server_url from "../../../lib/config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { convertTimestamp2 } from "../../../lib/convertTimestampDateAndTime";
import CustomButtonLoading from "../../../src/Shared/CustomButtonLoading";
import Image from "next/image";
import { getAdminToken } from "../../../lib/getToken";
import swal from "sweetalert";
import { useRouter } from "next/router";

const AddWallet = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [selectedChildCategory, setSelectedChildCategory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [loading, setLoading] = useState(false);
  const [subCategory,setSubCategory]=useState()
  const [subCategoryItem,setSubCategoryItem]=useState()
  const router = useRouter()

  // const [startDateInputType, setStartDateInputType] = useState('text');
  // const [endDateInputType, setEndDateInputType] = useState('text');

  const {
    data: categoryAndSubCategory,
    isLoading,
    refetch,
  } = useQuery(["category-SubCategory"], getCategoriesAndSubCategory);


  const handleAddCoupon = (data) => {
    setLoading(true);
    const url = server_url + "/wallet";

    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${getAdminToken()}` 
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          swal("success", data?.message, "success");
          setLoading(false)
          router.push("/admin/wallet")
        }
        if (data.status === "fail") {
          swal("error", data?.message || data?.error, "error");
          setLoading(false)
        }
      });

    // postMethodHook(url, data, setLoading);
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
          title={"Add Cashback"}
          subtitle={"Add your Wallet and necessary information from here"}
        />
        <div className="mt-5 md:px-7">
          {/* <div className="md:flex block items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold">
              <p>Coupons Banner Image</p>
            </div>
            <div className="w-full md:w-[70%]  ">
              <div className="relative border-4 border-dashed w-full h-[150px]  text-center">
                <BsCloudUploadFill
                  size={35}
                  className="text-primary mx-auto block  mt-8"
                />
                <p className="text-xl font-bold  text-slate-900">
                  Drag your image here
                </p>
                <span className="text-xs font-bold text-slate-900">
                  (Only *.jpeg and *.png images will be accepted)
                </span>
                <span className="text-xs font-bold text-red-900">
                  {imageUploadErrorMessage && imageUploadErrorMessage}
                </span>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full cursor-pointer"
                />
              </div>
              {imageUrl && (
                <div className="w-[100px] h-[100px] p-3 bg-white shadow-md rounded-md mt-3">
                  <Image
                    src={imageUrl}
                    width="100"
                    height="100"
                    alt="category image"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div> */}
          {/* ----------------------end image------------------- */}
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
            {/* <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>Coupon Code</p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type={"text"}
                  {...register("couponCode", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Coupon code "
                />
              </div>
            </div> */}
            {/* <div className="md:flex block items-center gap-5 mb-4">
              <div className="w-full md:w-[30%] text-lg font-semibold">
                <p>expire Date </p>
              </div>
              <div className="w-full md:w-[70%]">
                <input
                  type={endDateInputType}
                  placeholder="mm/dd/yyy"
                  onFocus={handleFocusEndDateInputType}
                  onBlur={handleBlurEndDateInputType}
                  {...register("expireDate", { required: true })}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                />
              </div>
            </div> */}
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
                <p>Which Category and Sub Category</p>
              </div>
              <div className="w-full md:w-[70%]">
                <select
                  {...register("underOfCategory", { required: true })}
                  className="select select-bordered w-full  focus:outline-none "
                  placeholder="Type"
                  onChange={(e)=>setSubCategory(e.target.value)}
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
                  value={ loading ? "Loading..." : "Add Wallet"}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddWallet;
