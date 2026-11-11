import React, { useContext, useEffect, useState } from "react";
import { BsCloudUploadFill } from "react-icons/bs";
import DashboardLayout from "../../../src/Components/DashboardLayout";

import { TagsInput } from "react-tag-input-component";
import { useForm } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import swal from "sweetalert";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import Select from "react-select";
import AdminDashboardBreadcrumb from "../../../src/Shared/AdminDashboardBreadcrumb";
import ColorPicker from "../../../src/Shared/ColorPicker";
import { useCustomQuery } from "../../../src/hooks/useMyShopData";
import CustomButtonLoading from "../../../src/Shared/CustomButtonLoading";
import Image from "next/image";
import CustomModal from "../../../src/Shared/CustomModal";
import AddVariant from "../../../src/Components/Admin/Variant/AddVariant";
import VariantList from "../../../src/Components/Admin/Variant/VariantList";
import server_url from "../../../lib/config";
import { getAdminToken } from "../../../lib/getToken";
import ImageLoader from "../../../src/Shared/ImageLoader";

const sizeOptions = [
  { value: "Default", label: "Default" },
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
  { value: "xl", label: "xl" },
  { value: "Xll", label: "Xll" },
];

const UpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [selectedProductTag, setSelectedProductTag] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [richText, setValueOfRichText] = useState("");
  const [valueOfParantCategory, setValueOfParantCategory] = useState("");
  const [childCategories, setChildCategories] = useState([]);
  const [imageUploadErrorMessage, setImageUploadErrorMessage] = useState(null);
  const [product, setProduct] = useState({});
  const [selectedOption, setSelectedOptionSize] = useState([]);
  const [ratingValue, SetRatingValue] = useState(0);
  const [productColor, setProductColor] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  // for child category
  const [selectedOptionCategory, setSelectedOptionCategory] = useState(null);
  const { data: brands } = useCustomQuery(["brands"], "brands");
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(false)
  const [imageLoading,setImageLoading]=useState(false)

  const router = useRouter();
  const id = router.query.id;

  let url = `${server_url}/product/${id}`;

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setProduct(data.data);
          setSelectedProductTag(data.data.tags);
          setSelectedOptionSize(data.data.size);
          setImageUrl(data.data.imageURLs);
          setValueOfRichText(data.data.description);
          SetRatingValue(data?.data?.ratingValue || 0);
          setProductColor(data?.data?.productColor || []);
          setValueOfParantCategory(data.data.category);
          setChildCategories(data?.data?.subCategory);
        }
      });
  }, [id, reload]);

  /*  if (product.name) {
   
  } */

  console.log(product);

  useEffect(() => {
    if (childCategories.length > 0) {
      const option = childCategories.map((child) => {
        return { value: child, label: child };
      });

      setSelectedOptionCategory(option);
    }
  }, [childCategories]);
  const {
    data: categories,
    isLoading,
    refetch,
  } = useCustomQuery(["categories"], "category/childCategory");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  //   ------------------------product add function --------uses react hooks fForm------------------------
  // --------------------update product handler--------------------
  const addProductHandler = (data) => {
    setLoading(true);
    const updateProduct = {
      name: data.name || product.name,
      sku: data.sku || product.name,
      path: data?.path || product.path,
      description: richText,
      category: valueOfParantCategory,
      subCategory: selectedOptionCategory.map((child) => child.label),
      // productType: data.productType,
      quantity: Number(data.quantity) || product.quantity,
      buyingPrice: Number(data.buyPrice) || product.buyingPrice,
      productPrice: Number(data.price) || product.productPrice,
      salePrice: Number(data.salePrice) || product.salePrice,
      discount:
        Math.ceil((1 - Number(data.salePrice) / Number(data.price)) * 100) ||
        product.discount,
      brand: data.brand,
      tags: selectedProductTag,
      imageURLs: imageUrl, //------------array
      size: selectedOption,
      ratingValue: data.ratingValue || product.ratingValue,
      youtube: data.youtube || product.youtube,
      status: data.status,
      productColor: productColor,
    };

    // ------------------------------------------------post method here
    fetch(`${server_url}/product/${product._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify(updateProduct),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == "success") {
          setLoading(false);
          swal("Product updated successfully.", {
            icon: "success",
          });
        } else {
          setLoading(false);
          swal(result.error, {
            icon: "error",
          });
        }
      });
  };

  // --------------------------------------------handle image upload
  const imgUrl = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
  const handleImageUpload = (e) => {
    setImageLoading(true)
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);

    fetch(imgUrl, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.data?.url) {
          let newImageUrls = [...imageUrl];
          newImageUrls.push(result.data?.url);
          setImageUrl(newImageUrls);
          setImageUploadErrorMessage(null);
          setImageLoading(false)
        }

        return setImageUploadErrorMessage(
          "Image Upload failed, please check your internet connectoin"
        );
      });
  };
  // ------------------------remove image-----------------------------
  const handleRemoveImage = (index) => {
    imageUrl.splice(index, 1);
  };

  // ----------------------------filter with parent category--------------------

  const handleFilterWithParantCategory = (event) => {
    setValueOfParantCategory(event.target.value);
  };

  return (
    <DashboardLayout>
      <div className="mid-container">
        <AdminDashboardBreadcrumb
          title={"Update Product"}
        // subtitle={" Update your product and necessary information from here"}
        />

        <form
          onSubmit={handleSubmit(addProductHandler)}
          className="mt-5 px-2 md:px-7"
        >
          <div className="block md:flex gap-5 mb-4">
            <div className="w-[30%] text-lg font-semibold mt-3">
              <p>Product Images</p>
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

              <div className="flex flex-wrap gap-2">
                {imageLoading && <ImageLoader />}
                {imageUrl.map((img, index) => {
                  return (
                    <div
                      className="  w-[100px] h-auto p-1 bg-white shadow-md rounded-md mt-3 relative"
                      key={index}
                    >
                      <Image
                        src={img}
                        width="100"
                        height="2"
                        alt="category image"
                        className="w-full h-full object-contain "
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="btn btn-outline btn-warning rounded-full bg-red-700 absolute right-0 top-0 btn-xs"
                      >
                        x
                      </button>
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
          </div>

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Title/Name</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.name}
                type="text"
                {...register("name", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Product Title"
              />
            </div>
          </div>

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product SKU</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.sku}
                type="text"
                {...register("sku", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Product SKU"
              />
            </div>
          </div>

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Slug</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.path}
                type="text"
                {...register("path")}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Product Slug"
              />
            </div>
          </div>

          <div className="block md:flex gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Description</p>
            </div>
            <div className="w-full md:w-[70%]">
              <ReactQuill
                theme="snow"
                value={richText}
                onChange={setValueOfRichText}
                style={{ height: 200, marginBottom: 12 }}
              />
              ;
            </div>
          </div>

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Parent Category</p>
            </div>
            <div className="w-full md:w-[70%]">
              <select
                onChange={handleFilterWithParantCategory}
                value={valueOfParantCategory}
                className="select select-bordered w-full  focus:outline-none "
                placeholder="Category"
              // {...register("category", { required: false })}
              >
                <option disabled selected>
                  Category
                </option>
                {categories?.data?.parentCategories.map((category, index) => (
                  <option value={category} key={index}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* -----------------------------------child category---------------------- */}
          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Child Category</p>
            </div>
            <div className="w-full md:w-[70%]">
              {selectedOptionCategory && (
                <Select
                  defaultValue={selectedOptionCategory}
                  onChange={setSelectedOptionCategory}
                  isMulti
                  name="colors"
                  options={categories?.data?.childCategories.map((child) => {
                    return { value: child, label: child };
                  })}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              )}
            </div>
          </div>

          {/*  <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Type</p>
            </div>
            <div className="w-full md:w-[70%]">
              <select
                className="select select-bordered w-full  focus:outline-none "
                {...register("productType", { required: false })}
                defaultValue={product.productType}
              >
                <option value={"Shirt"} selected={product.brand === "Shirt"}>
                  Shirt
                </option>
                <option value={"Cloths"} selected={product.brand === "Cloths"}>
                  Cloths
                </option>
                <option
                  value={"Leather"}
                  selected={product.brand === "Leather"}
                >
                  Leather
                </option>
                <option
                  value={"Panjabi"}
                  selected={product.brand === "Panjabi"}
                >
                  Panjabi
                </option>
              </select>
            </div>
          </div> */}
          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Select Product Color</p>
            </div>
            <div className="w-full md:w-[70%]">
              <div className="flex gap-2 my-2">
                {productColor.map((clr, index) => (
                  <span key={index}>
                    <span
                      onClick={() => {
                        const arr = productColor.filter(
                          (color) => color !== clr
                        );
                        setProductColor(arr);
                      }}
                      className="w-7 h-7 rounded-full inline-block shadow-md hover:scale-105 cursor-crosshair hover:border-red-500 hover:border"
                      style={{ background: clr, color: clr }}
                    >
                      x
                    </span>
                  </span>
                ))}
              </div>

              <div>
                <div>
                  <span
                    onClick={() => setIsOpen(true)}
                    className="btn btn-xs btn-info text-white hover:text-black"
                  >
                    Pick Color
                  </span>
                  {productColor.length > 0 && (
                    <span
                      onClick={() => setProductColor([])}
                      className="btn btn-xs btn-warning ml-3 text-white hover:text-black"
                    >
                      Clear Color
                    </span>
                  )}
                </div>
              </div>

              <ColorPicker
                productColor={productColor}
                setProductColor={setProductColor}
                setIsOpen={setIsOpen}
                modalIsOpen={modalIsOpen}
              />
            </div>
          </div>
          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Brands</p>
            </div>
            <div className="w-full md:w-[70%]">
              <select
                defaultValue={product.brand}
                className="select select-bordered w-full  focus:outline-none "
                {...register("brand", { required: false })}
              >
                <option
                  value={"no brand"}
                  selected={product.brand === "no brand"}
                >
                  No Brand
                </option>
                {brands?.data?.result?.map((bnd) => (
                  <option
                    key={bnd?._id}
                    selected={product.brand === bnd.name}
                    value={bnd.name}
                  >
                    {bnd.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="block md:flex gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Quantity</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.quantity}
                readOnly
                type="number"
                {...register("quantity", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Quantity"
              />
            </div>
          </div>

          <div className="block md:flex gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Rating</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                type="number"
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Type Product Rating 0 to 5"
                id="number-input"
                {...register("ratingValue", {
                  required: false,
                  min: 0,
                  max: 5,
                  validate: (value) => /^[0-9]*$/.test(value), // only allow integer values
                })}
                defaultValue={product.ratingValue}
              />
              {errors.ratingValue && (
                <p>Enter a valid number between 0 and 5</p>
              )}
            </div>
          </div>

          {/* <div className="block md:flex gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Buy Price</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.buyingPrice}
                type="number"
                {...register("buyPrice", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Buy price"
              />
            </div>
          </div>

          <div className="block md:flex gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Product Price</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.productPrice}
                type="number"
                {...register("price", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Price"
              />
            </div>
          </div>

          <div className="block md:flex gap-5 mb-4">
            <div className="w-[30%] text-lg font-semibold mt-3">
              <p>Sale Price</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                defaultValue={product.salePrice}
                type="number"
                {...register("salePrice", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Sale Price"
              />
            </div>
          </div> */}

          <div className="block md:flex gap-5 mb-4">
            <div className="w-[30%] text-lg font-semibold mt-3">
              <p>youtube Url</p>
            </div>
            <div className="w-full md:w-[70%]">
              <input
                type="text"
                defaultValue={product.youtube}
                {...register("youtube", { required: false })}
                className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
                placeholder="Youtube URL"
              />
            </div>
          </div>
          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold">
              <p>Product Tags</p>
            </div>
            <div className="w-full md:w-[70%]">
              <div>
                <TagsInput
                  value={selectedProductTag}
                  onChange={setSelectedProductTag}
                  placeHolder="enter tag name"
                />
                <em className="text-xs">press enter or comma to add new tag</em>
              </div>
            </div>
          </div>

          {/* <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold">
              <p>Size</p>
            </div>
            <div className="w-full md:w-[70%]">
              <div className="w-full md:w-[70%]">
                <div>
                  <TagsInput
                    value={selectedOption}
                    onChange={setSelectedOptionSize}
                    placeHolder="enter Size "
                  />
                  <em className="text-xs">
                    press enter to add new size ex: M, L, XL, XXL, etc..
                  </em>
                </div>
              </div>
            </div>
          </div> */}

          <div className="block md:flex items-center gap-5 mb-4">
            <div className="w-full md:w-[30%] text-lg font-semibold mt-3">
              <p>Status</p>
            </div>
            <div className="w-full md:w-[70%]">
              <select
                defaultValue={product.status}
                className="select select-bordered w-full  focus:outline-none "
                {...register("status", { required: false })}
              >
                <option value={true} selected={product.status === true}>
                  Publish
                </option>
                <option value={false} selected={product.status === false}>
                  Review
                </option>
              </select>
            </div>
          </div>

          <div className="flex justify-end items-center gap-5 mb-4">
            <button className="btn btn-primary ml-auto text-white">
              {loading ? <CustomButtonLoading /> : "Update Product"}
            </button>
          </div>
        </form>

        <div>
          <div className="flex items-center gap-3 py-5  w-full ">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <h2 className="text-[20px] font-semibold">Variant</h2>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className=" font-bold text-[25px]">Variant </h2>
              <button
                onClick={() => setOpen(true)}
                type="button"
                className="btn btn-primary ml-auto text-white"
              >
                {"Add Variant"}
              </button>
            </div>
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th className="bg-[#f3f3f3] text-center">S/N</th>
                      <th className="bg-[#f3f3f3] text-center">Size</th>
                      <th className="bg-[#f3f3f3] text-center">Quantity</th>
                      <th className="bg-[#f3f3f3] text-center">Buy Price</th>
                      <th className="bg-[#f3f3f3] text-center">
                        Product Price
                      </th>
                      <th className="bg-[#f3f3f3] text-center">Sale Price</th>
                      <th className="bg-[#f3f3f3] text-center">Discount</th>
                      <th className="bg-[#f3f3f3] text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product?.variant?.map((pro, index) => (
                      <VariantList key={pro._id} product={pro} productId={id} index={index} setReloader={setReload} reolder={reload} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal modalIsOpen={open} setIsOpen={setOpen}>
        <AddVariant id={product?._id} setOpen={setOpen} imageUrl2={imageUrl} setReload={setReload} product={product}/>
      </CustomModal>
    </DashboardLayout>
  );
};

export default UpdateProduct;
