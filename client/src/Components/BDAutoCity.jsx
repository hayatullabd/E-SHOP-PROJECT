import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";

const BDAutoCity = ({ shippingCost, setShippingCost }) => {
  // ----------------------------
  // const [searchResult, setSearchResult] = useState([]);
  // const [searchText, setSearchText] = useState("");
  // const [open, setOpen] = useState(false);
  // useEffect(() => {
  //     fetch(`https://akashwebs.github.io/data-of-district/bd.json`)
  //         .then((res) => res.json())
  //         .then((data) => {
  //             const match = data.districts.filter((d) =>
  //                 d.name.toLowerCase().includes(searchText.toLowerCase())
  //             );
  //             setSearchResult(match);
  //         });
  // }, [searchText]);

  // ----------------------------

  // const handleSearchChange = (event) => {
  //     const name = event.target.value;
  //     setSearchText(name);
  // };
  // const handleSelectCity = () => {
  //     const url = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/delivery-cost/get-delivery-for-user?city=${districtName}`;
  //     fetch(url)
  //         .then((res) => res.json())
  //         .then((data) => setShippingCost(data?.data?.cost));
  //     if (district?.name) {
  //         let districtName = district.name;
  //         setSelectedCity(districtName);
  //         setOpen(false);
  //         setSearchText("");

  //     }
  // };

  // const handleSelectedUser = (district) => {

  //     const url = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/delivery-cost/get-delivery-for-user?city=${districtName}`;
  //     fetch(url)
  //         .then((res) => res.json())
  //         .then((data) => setShippingCost(data?.data?.cost));

  //     if (district.value) {
  //         // let districtName = district.value;
  //         // setSelectedCity(districtName);
  //         setOpen(false);
  //         // setSearchText("");

  //     }
  // }
  // setSelectedUser(user.value)

  const { data, isLoading, error } = useQuery("myData", async () => {
    const response = await fetch(
      "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/delivery-cost"
    );
    const data = await response.json();

    return data;
  });
  const deliveryCost = data?.data?.result[0];

  console.log(deliveryCost);

  useEffect(() => {
    if (deliveryCost) {
      setShippingCost(Number(deliveryCost?.inDhaka));
    }
  }, [deliveryCost]);

  return (
    <>
      {/* ---------------------------------------------------------- */}
      <div className="">
        <div className="w-full ">
          <label htmlFor="message" className="leading-7 text-sm">
            আপনার এরিয়া সিলেক্ট করুন
          </label>
          <div className=" border   text-black  w-full  p-1 flex items-center justify-between rounded cursor-pointer ">
            <select
              value={shippingCost}
              onChange={(event) => setShippingCost(event.target.value)}
              className="w-full text-black rounded py-2.5 px-3"
            >
              <option value={deliveryCost?.inDhaka}>ঢাকা সিটির ভিতর</option>
              <option value={deliveryCost?.outDhaka}>ঢাকার বাইরে</option>
              {/* <option value={deliveryCost?.others}>অন্যান্য জেলা</option> */}
            </select>
            {/* <Select
                            defaultValue={selectedCity}
                            onChange={handleSelectedUser}
                            // isMulti
                            name="user"
                            required
                            options={searchResult?.map((district) => {
                                return {
                                    value: district.name, label: <div className="flex gap-5">
                                        <p className="w-20">{district.name}</p>
                                        <p className="w-2">-</p>
                                        <p className="w-20">{district.bn_name}</p>
                                    </div>
                                }
                            })}
                            className="outline-none w-full  text-[16px] border-none  focus:border-primary "
                            id='choose_account_category'
                            classNamePrefix="select"
                            isSearchable
                        /> */}
            {/* ----------------Create new user------------------ */}
          </div>
        </div>
      </div>
      {/* ---------------------------------------------------------- */}
    </>
  );
};

export default BDAutoCity;
