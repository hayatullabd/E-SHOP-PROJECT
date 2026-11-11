import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../src/Components/DashboardLayout";
import AdminDashboardBreadcrumb from "../../../src/Shared/AdminDashboardBreadcrumb";

import { BsCloudUploadFill } from "react-icons/bs";
import { TagsInput } from "react-tag-input-component";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import swal from "sweetalert";
import Image from "next/image";
import { getAdminToken } from "../../../lib/getToken";
import { Icon } from "@iconify/react/dist/iconify.js";
import CustomButtonLoading from "../../../src/Shared/CustomButtonLoading";
import ImageLoader from "../../../src/Shared/ImageLoader";

const UpdateCategory = () => {
  const [selectedChildCategory, setSelectedChildCategory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [childCategories, setChildCategories] = useState([]);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
  const [category, setCategory] = useState({});
  const [sub, setSub] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();
  const id = router.query.id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  let url = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/category/${id}`;

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setCategory(data.data);
          setImageUrl(data.data.imageURLs[0]);
          setSelectedChildCategory(data.data.childCategory);
          setValue("status", data?.data?.status);
        }
      });
  }, [id]);

  // ------------------------------------handle category add-------------------------
  const handleUpdateCategory = (data) => {
    setLoading(true);
    const categories = {
      // productType: data.productType || category.productType,
      parentCategory: data.parentCategory || category.parentCategory,
      childCategory: selectedChildCategory,
      imageURLs: imageUrl,
      status: data.status || category.status,
    };
    // ------------------------------------------------post method here
    fetch(
      `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/category/${category._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify(categories),
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.status == "success") {
          swal("Category updated successfully.", {
            icon: "success",
          });
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  // --------------------------------------------handle image upload
  const imgUrl = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
  const handleImageUpload = (e) => {
    setImageLoading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    fetch(imgUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        setImageUrl(result.data?.url);
        setImageLoading(false);
      });
  };
  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const handelAdd = () => {
    const newValue = sub;
    setSelectedChildCategory([...selectedChildCategory, newValue]);
    setSub("");
  };

  const HandelRemove = (ind) => {
    const remove = selectedChildCategory.filter((item, index) => index !== ind);
    setSelectedChildCategory(remove);
  };
  return (
    <DashboardLayout>
      <div className="mid-container">
        <AdminDashboardBreadcrumb
          title={"Update Category"}
          subtitle={
            "Update your Product category and necessary information from here"
          }
        />
        <div className="md:flex block items-center gap-5 mt-3 mb-4">
          <div className="w-full md:w-[30%] text-lg font-semibold">
            <p>Category Icon</p>
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
              <input
                type="file"
                onChange={handleImageUpload}
                className="opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full cursor-pointer"
              />
            </div>
            {imageLoading && <ImageLoader />}
            {imageUrl && (
              <div className="  w-[100px] h-auto p-1 bg-white shadow-md rounded-md mt-3 relative">
                <Image
                  src={imageUrl}
                  width="100"
                  height="2"
                  alt="category image"
                  className="w-full h-full object-contain "
                />
                <button
                  onClick={() => handleRemoveImage(0)}
                  className="btn btn-outline btn-warning rounded-full bg-red-700 absolute right-0 top-0 btn-xs"
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(handleUpdateCategory)}
          className="mt-5 md:px-7"
        >
          {/* end type----------------- */}
          <div className="md:flex block items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold">
              <p>Parent Category</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                type="text"
                defaultValue={category?.parentCategory}
                {...register("parentCategory", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Type Parent Category "
              />
            </div>
          </div>

          <div className=" gap-5 mb-4 flex items-center">
            <div className="w-full md:w-[30%] text-lg font-semibold">
              <p>Child Category</p>
            </div>
            <div className="w-full md:w-[70%]">
              <div className=" flex items-center gap-1">
                <input
                  type="text"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                  className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                  placeholder="Type Child Category"
                />
                <button
                  type="button"
                  disabled={!sub}
                  onClick={() => handelAdd()}
                  className="py-[12px] rounded-md bg-primary text-white px-4"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex gap-2 items-center flex-wrap">
                {selectedChildCategory?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 p-1 gap-1 rounded-md"
                  >
                    <h2>{item}</h2>{" "}
                    <button type="button" onClick={() => HandelRemove(index)}>
                      <Icon icon="ic:outline-close" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Status</p>
            </div>
            <div className="w-full md:w-[70%]">
              <select
                className="select select-bordered w-full  focus:outline-none "
                {...register("status", { required: false })}
              >
                <option value={false}>Review</option>
                <option value={true}>Publish</option>
              </select>
            </div>
          </div>

          <div className="md:flex block items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold hidden md:block"></div>
            <div className="w-full md:w-[70%]">
              <button
                type={"submit"}
                className="btn btn-primary w-full text-white"
                value={"Add Category"}
                disabled={!imageUrl}
              >
                {loading ? <CustomButtonLoading /> : "Update Category"}
              </button>
            </div>
          </div>
        </form>
        <ToastContainer />
      </div>
    </DashboardLayout>
  );
};

export default UpdateCategory;
