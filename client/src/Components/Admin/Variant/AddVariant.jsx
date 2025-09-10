import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { handleMultiImageUpload } from "../../../../lib/imageUploader";
import { BiImageAdd } from "react-icons/bi";
import Image from "next/image";
import swal from "sweetalert";
import CustomButtonLoading from "../../../Shared/CustomButtonLoading";
import server_url from "../../../../lib/config";

const AddVariant = ({ id, setOpen, imageUrl2, setReload,product }) => {
  const [imageUrl, setImageUrl] = useState(imageUrl2);
  const [productColor, setProductColor] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);


  console.log(id)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  useEffect(()=>{
    setValue("buyPrice",product?.buyingPrice)
    setValue("salePrice",product?.salePrice)
    setValue("price",product?.productPrice)
  },[product])

  const addProductHandler = (data) => {
    setLoading(true);
    const product = {
      imageURLs: imageUrl,
      quantity: Number(data.quantity),
      buyingPrice: Number(data.buyPrice),
      productPrice: Number(data.price),
      salePrice: Number(data.salePrice),
      discount: Math.ceil(
        (1 - Number(data.salePrice) / Number(data.price)) * 100
      ),
      productColor: productColor,
      size: data?.size,
    };

    console.log(product)
    // ------------------------------------------------post method here

    fetch(`${server_url}/variant/create/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setLoading(false);
          swal(" Variant Added Successfully.", {
            icon: "success",
          });
          setOpen(false);
          setReload((pre) => !pre)
        } else {
          setLoading(false);
          swal(
            result.error.includes("E11000")
              ? result.error.split(":").slice(-1)[0] + " already used! its uniq"
              : result.error,
            {
              icon: "error",
            }
          );
        }
      });
  };


  // --------------------------------------------handle multi image upload
  const handleImageUpload = (e) => {
    handleMultiImageUpload(
      e,
      imageUrl,
      setImageUrl,
      setImageUploadErrorMessage
    );
  };

  return (
    <div className=" md:w-[700px] w-full">
      <h2 className=" text-[20px] font-bold">Product Variant Add</h2>
      <div>
        <form
          onSubmit={handleSubmit(addProductHandler)}
          className="mt-5 px-2 md:px-7"
        >
          {/* <div className="block gap-5 mb-4">
            <div className=" text-lg font-semibold mt-3">
              <p>Product Images</p>
            </div>
            <div className="w-full  ">
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

              <div className="flex flex-wrap gap-2">
                {imageUrl.map((img, index) => {
                  return (
                    <div
                      className="  w-[100px] h-auto p-1 bg-white shadow-md rounded-md mt-3 "
                      key={index}
                    >
                      <Image
                        src={img}
                        width="100"
                        height="2"
                        alt="category image"
                        className="w-full h-full object-contain "
                      />
                    </div>
                  );
                })}
                <div className="relative w-[100px] h-[100px] p-1 bg-white shadow-md rounded-md mt-3 flex justify-center items-center">
                  <span>
                    <BiImageAdd
                      onChange={handleImageUpload}
                      size={45}
                      className="text-primary cursor-pointer hover:text-slate-700"
                    />
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="opacity-0 absolute top-0 left-0 bottom-0 right-0 w-full h-full cursor-pointer"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div> */}

          <div className="block gap-5 mb-4">
            <div className=" text-lg font-semibold mt-3">
              <p>Product Size</p>
            </div>
            <div className="w-full">
              <input
                type="text"
                {...register("size", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Product Size"
              />
            </div>
          </div>

          <div className="block gap-5 mb-4">
            <div className="w-full text-lg font-semibold mt-3">
              <p>Buy Price</p>
            </div>
            <div className="w-full">
              <input
                type="number"
                {...register("buyPrice", { required: true })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Buy price"
              />
            </div>
          </div>


          <div className="block gap-5 mb-4">
            <div className="text-lg font-semibold mt-3">
              <p>Sale Price</p>
            </div>
            <div className="w-full">
              <input
                type="number"
                {...register("salePrice", { required: true })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Sale Price"
              />
            </div>
          </div>

          <div className="block gap-5 mb-4">
            <div className="w-full text-lg font-semibold mt-3">
              <p>Product Price</p>
            </div>
            <div className="w-full">
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Price"
              />
            </div>
          </div>

          <div className="block gap-5 mb-4">
            <div className="w-full text-lg font-semibold mt-3">
              <p>Product Quantity</p>
            </div>
            <div className="w-full">
              <input
                type="number"
                {...register("quantity", { required: true })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Quantity"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-center items-center gap-5 mb-4">
              <button className="btn btn-primary ml-auto text-white">
                {loading ? <CustomButtonLoading /> : "Add Variant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVariant;
