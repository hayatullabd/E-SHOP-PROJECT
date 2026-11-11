import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import BkashPayment from "./BkashPayment";
import { AiOutlineRollback } from "react-icons/ai";
import { usePostOrder, useUpdatePostOrder } from "../../../lib/usePostOrder";
import server_url from "../../../lib/config";
import CreateContext from "../CreateContex";
import Link from "next/link";
import Image from "next/image";
import AuthUser from "../../../lib/AuthUser";

import swal from "sweetalert";
import CustomButtonLoading from "../../Shared/CustomButtonLoading";

const PaymentIndex2 = ({ order, walletAmount }) => {
  const [method, setMethod] = useState("");
  const [isClickMethod, setIsClickMethod] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    setOrderResponse,
    lastLogin,
    setLastLogin,
    setlocalStorageCartItems,
  } = useContext(CreateContext);
  const { userInfo } = AuthUser();

  const router = useRouter();

  const onSubmitOrder = (data) => {
    setLoading(true);

    if (data === "bkash") {
      order.paymentDetails = {
        method: "bkash",
      };
    } else {
      order.paymentDetails = {
        method: "cod",
      };
    }
    order.paymentDetails = {
      method: "cod",
    };

    order.walletAmount = walletAmount;

    const url = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/order`;
    useUpdatePostOrder(url, order, successFunction, router);
    setlocalStorageCartItems(0);
    localStorage.removeItem("shopping-cart");
  };

  const successFunction = (data) => {
    if (data.status === "success") {
      setOrderResponse(data?.data);
      router.push("/checkout/success-order");
      swal(
        "success",
        `ধন্যবাদ Mr/Mrs  ${data?.data?.shippingAddress?.firstName}, আপনার অর্ডারটি সফল হয়েছে`,
        "success"
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold uppercase flex items-center">
        {isClickMethod && (
          <span
            onClick={() => {
              setIsClickMethod(false);
              setMethod("");
            }}
            className="cursor-pointer mr-2 bg-red-600 hover:bg-primary hover:text-black text-white duration-200"
          >
            <AiOutlineRollback />
          </span>
        )}{" "}
        Payment Method
      </h2>
      <span className="divider -mt-1"></span>
      {!isClickMethod && (
        <>
          {loading ? (
            <h2>Loading...</h2>
          ) : (
            <>
              <div className=" flex flex-wrap gap-2 md:gap-5 mb-3">
                <Image
                  onClick={() => {
                    setMethod("cod");
                    onSubmitOrder("cod");
                  }}
                  src={"/assets/cod.jpg"}
                  alt="cod"
                  width={200}
                  height={200}
                  className="w-20 h-20 rounded-md object-fill hover:scale-50 duration-300 cursor-pointer border-4 p-2"
                />
                <Link href={"#"}>
                  <Image
                    onClick={() => {
                      setMethod("bkash");
                      setIsClickMethod(true);
                    }}
                    src={"/assets/bkash.png"}
                    alt="bkash"
                    width={200}
                    height={200}
                    className="w-20 h-20 rounded-md object-fill hover:scale-50 duration-300 cursor-pointer border-2 p-2"
                  />
                </Link>
                {/* <Image
                onClick={() => {
                  setMethod("rocket");
                  setIsClickMethod(true);
                }}
                width={200}
                height={200}
                src={"/assets/nogod.png"}
                alt="cod"
                className="w-20 h-20 rounded-md object-fill hover:scale-50 duration-300 cursor-pointer border-2 p-2"
              /> */}
                <Image
                  onClick={() => {
                    setMethod("nagad");
                    setIsClickMethod(true);
                  }}
                  src={"/assets/nogod.png"}
                  alt="nagad"
                  width={200}
                  height={200}
                  className="w-20 h-20 rounded-md object-fill hover:scale-50 duration-300 cursor-pointer border-2 p-2"
                />
              </div>
            </>
          )}
        </>
      )}
      {(method === "bkash" || method === "rocket" || method === "nagad") && (
        <BkashPayment
          method={method}
          order={order}
          walletAmount={walletAmount}
        />
      )}
    </div>
  );
};

export default PaymentIndex2;
