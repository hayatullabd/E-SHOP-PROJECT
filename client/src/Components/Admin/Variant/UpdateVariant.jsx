import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { handleMultiImageUpload } from "../../../../lib/imageUploader";
import swal from "sweetalert";
import CustomButtonLoading from "../../../Shared/CustomButtonLoading";
import server_url from "../../../../lib/config";

const UpdateVariant = ({ variant, id, setOpen, imageUrl2, setReload, productId }) => {
  const [imageUrl, setImageUrl] = useState([]);
  const [productColor, setProductColor] = useState();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);

  console.log("=====vvvvv======", variant)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();


  useEffect(() => {
    setImageUrl(variant?.variant)
    setProductColor(variant?.productColor)
    setValue("buyPrice", variant?.buyingPrice)
    setValue("price", variant?.productPrice)
    setValue("salePrice", variant?.salePrice)
    setValue("discount", variant?.discount)
    setValue("size", variant?.size)
    setImageUrl(variant?.imageURLs)
  }, [variant])

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
      productId,
    };

    console.log(product)
    // ------------------------------------------------post method here

    fetch(`${server_url}/variant/update/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setLoading(false);
          swal("Variant Update Successfully.", {
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
      <h2 className=" text-[20px] font-bold">Product Variant Update</h2>
      <div>
        <form
          onSubmit={handleSubmit(addProductHandler)}
          className="mt-5 px-2 md:px-7"
        >

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
              <p>Product Quantity (only add)</p>
            </div>
            <div className="w-full">
              <input
                type="number"
                {...register("quantity", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Quantity"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-center items-center gap-5 mb-4">
              <button className="btn btn-primary ml-auto text-white">
                {loading ? <CustomButtonLoading /> : "Update Variant"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateVariant;
