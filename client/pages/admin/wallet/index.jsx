import Link from "next/link";
import React from "react";
import { useQuery } from "react-query";
import { getCoupons } from "../../../lib/helper";
import CouponsTableItem from "../../../src/Shared/TableItem/TableItemCoupons";
import DashboardLayout from "../../../src/Components/DashboardLayout";
import { useCustomQuery } from "../../../src/hooks/useMyShopData";
import { useState } from "react";
import dynamic from "next/dynamic";

const WalletTableItem = dynamic(
  () => import("../../../src/Shared/TableItem/WalletTableItem"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const Wallet = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, refetch } = useCustomQuery(
    ["wallet", searchQuery],
    `wallet?sort=-createdAt`
  );


  return (
    <DashboardLayout>
      <div className="">
        <h1 className="font-semibold mt-5 mb-2 text-xl">Cashback</h1>

        <div className="p-8 rounded bg-white shadow flex justify-center items-center gap-4">
          <div className="w-full md:w-[75%]">
            <input
              type="text"
              id="name"
              name="user_name"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
              placeholder="Search by Cashback name"
            />
          </div>

          <Link
            href={"/admin/wallet/add-wallet"}
            className="w-full md:w-[25%]"
          >
            <button className="btn btn-primary font-bold w-full text-white">
              Add Cashback
            </button>
          </Link>
        </div>
        {/* -----------------------bellow table------------------------- */}
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th className="bg-[#f3f3f3] text-center">ID</th>
                  <th className="bg-[#f3f3f3] text-center">NAME</th>
                  <th className="bg-[#f3f3f3] text-center">PERCENTAGE</th>
                  <th className="bg-[#f3f3f3] text-center">category</th>
                  <th className="bg-[#f3f3f3] text-center">Min Amount</th>
                  <th className="bg-[#f3f3f3] text-center">Max Amount</th>
                  <th className="bg-[#f3f3f3] text-center">STATUS </th>
                  <th className="bg-[#f3f3f3] text-center">ACTIONS </th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.result?.map((item, index) => (
                  <WalletTableItem
                    key={item?._id}
                    coupon={item}
                    index={index}
                    refetch={refetch}
                  ></WalletTableItem>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
