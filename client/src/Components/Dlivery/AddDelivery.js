import React, { useEffect } from "react";
import { useState } from "react";
import BdCity from "../BdCity";
import { useForm } from "react-hook-form";
import { postMethodHook } from "../../../lib/usePostHooks";
import server_url from "../../../lib/config";
import { updateMyShopHook } from "../../../lib/usePostHooks";
import { useQuery } from "react-query";
const AddDelivery = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [postResponse, setPostResponse] = useState(null);

  const { data, isLoading, error, refetch } = useQuery('myData', async () => {
    const response = await fetch('https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/delivery-cost');
    const data = await response.json();

    return data;
  });
  const deliveryCost = data?.data?.result[0]

  useEffect(() => {
    if (deliveryCost) {
      setValue("inDhaka", deliveryCost?.inDhaka)
      setValue("outDhaka", deliveryCost?.outDhaka)
    }
  }, [deliveryCost])

  const handleAddShippingCost = (data) => {
    // if (selectedCity.length <= 0) {
    //   return alert("Please Select City");
    // }
    const url = `${server_url}/delivery-cost/update-delivery-cost?did=${deliveryCost?._id}`

    const newData = {
      inDhaka: Number(data?.inDhaka),
      outDhaka: Number(data?.outDhaka),
      others: deliveryCost?.others
    };
    // console.log(shippingCost)
    // postMethodHook(url, shippingCost, refetch);
    // console.log("===============",newData)
    updateMyShopHook(url, newData, setLoading);
    refetch();
  };

  return (
    <div>
      <section className="p-6 bg-gray-100 text-gray-900">
        <form onSubmit={handleSubmit(handleAddShippingCost)} className="">
          <div className="mb-4">
            <p className="mb-2">Inside Dhaka City (ঢাকা সিটির ভিতরে)</p>
            <input
              type="number"
              // defaultValue={deliveryCost?.inDhaka}
              className="border border-black/40 rounded-md px-3 py-1 w-[350px]"
              placeholder=""
              {...register("inDhaka", { required: true })}
            />
          </div>
          <div className="mb-4">
            <p className="mb-2">Outside Dhaka City (ঢাকার বাইরে)</p>
            <input type="number"
              // defaultValue={deliveryCost?.outDhaka}
              placeholder=""
              className="border border-black/40 rounded-md px-3 py-1 w-[350px]"
              {...register("outDhaka", { required: true })}
            />
          </div>
          {/* 
          <div className="mb-4">
            <p className="mb-2">Others (অন্যান্য জেলা)</p>
            <input
              type="number"
              defaultValue={deliveryCost?.others}
              placeholder=""
              className="border border-black/40 rounded-md px-3 py-1 w-[350px]"
              {...register("others", { required: true })}
            />
          </div> */}

          {/* <div className="block md:flex items-center gap-2">
                <div className="">
                  <BdCity
                    selectedCity={selectedCity}
                    setSelectedCity={setSelectedCity}
                  />
                </div>
                <div className="">
                  <label className="text-sm">Shipping Cost</label>
                  <input
                    type="Number"
                    {...register("cost", { required: true })}
                    placeholder="Price"
                    className={`shadow-sm border mb-2  bg-white text-black w-64 p-3 flex items-center justify-between rounded-lg cursor-pointer `}
                  />
                </div>
              </div> */}
          <div>
            <input
              type="submit"
              className={`btn btn-primary btn-sm text-white `}
              value="Add"
            />
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddDelivery;
