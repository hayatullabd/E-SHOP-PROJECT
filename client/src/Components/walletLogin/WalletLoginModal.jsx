import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import WalletLoginOtpForm from "./WalletLoginOtpForm";
import AuthUser from "../../../lib/AuthUser";
import CustomButtonLoading from "../../Shared/CustomButtonLoading";
import CreateUserHook2 from "../../../lib/CreateUserHook2";

const WalletLoginModal = ({ orderResponse, setLastLogin }) => {
  const { getToken, setToken } = AuthUser();
  const [lastData, setLastData] = useState();
  const [successData, setSuccessData] = useState();
  const [loading, setLoading] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
    trigger,
    reset,
  } = useForm();
  const navigate = useRouter();

  const message =
    "আপনার ফোনে একটি OTP পাঠানো হয়েছে | OTP দিয়ে অ্যাকাউন্ট ভেরিফিকেশন করুন";

  const handleSignUp = (data) => {
    setLoading(true);
    setLastData(data);
    CreateUserHook2(data, message, setSuccessData, setOtpModal, setLoading);
  };


  return (
    <div>
      <div className="flex justify-center items-center pt-5">
        {!otpModal ? (
          <div className="card flex-shrink-0 shadow-2xl bg-base-100  sm:w-[600px] w-full">
            <div className="card-body w-full">
              <h1 className="font-bold text-3xl text-center mb-5">Sign Up</h1>
              <form
                onSubmit={handleSubmit(handleSignUp)}
                className="w-full mx-auto"
              >
                <div className="flex  w-full mx-auto flex-col">
                  <label className="text-[#747474] text-sm font-medium ml-1 mb-2">
                    Your Name
                  </label>
                  <input
                    className="py-3 px-5 bg-[#F2F2F2] rounded-md focus:outline-0"
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Your Full Name"
                    {...register("fullName", {
                      required: "name is required",
                    })}
                    onKeyUp={(e) => {
                      trigger("fullName");
                    }}
                  />
                  <small className="text-[#FF4B2B] text-xs ml-2 font-medium my-2">
                    {errors?.name?.message}
                  </small>
                </div>

                <div className="flex  w-full mx-auto flex-col">
                  <label className="text-[#747474] text-sm font-medium ml-1 mb-2">
                    Email
                  </label>
                  <input
                    className="py-3 px-5 bg-[#F2F2F2] rounded-md focus:outline-0"
                    type="email"
                    id=""
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    onKeyUp={(e) => {
                      trigger("email");
                    }}
                  />
                  <small className="text-[#FF4B2B] text-xs ml-2 font-medium my-2">
                    {errors?.email?.message}
                  </small>
                </div>

                <div className="flex  w-full mx-auto flex-col">
                  <label className="text-[#747474] text-sm font-medium ml-1 mb-2">
                    Phone Number
                  </label>
                  <input
                    className="py-3 px-5 bg-[#F2F2F2] rounded-md focus:outline-0"
                    type="tel"
                    id=""
                    placeholder="Phone Number"
                    {...register("phone", {
                      required: "Phone number is required",
                      minLength: {
                        value: 11,
                        message: "Phone number must be 11 digit.",
                      },
                      maxLength: {
                        value: 11,
                        message: "Phone number must be 11 digit.",
                      },
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Phone number must consist of digits only.",
                      },
                    })}
                    onKeyUp={(e) => {
                      trigger("phone");
                    }}
                  />
                  <small className="text-[#FF4B2B] text-xs ml-2 font-medium my-2">
                    {errors?.phone?.message}
                  </small>
                </div>

                <div className="flex  w-full mx-auto flex-col">
                  <label className="text-[#747474] text-sm font-medium ml-1 mb-2">
                    Password
                  </label>
                  <input
                    className="py-3 rounded-md bg-[#F2F2F2] px-5 focus:outline-0"
                    type="password"
                    name="password"
                    id=""
                    placeholder="Enter password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 character required",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("password");
                    }}
                  />
                  <small className="text-[#FF4B2B] ml-2 text-xs font-medium my-2">
                    {errors?.password?.message}
                  </small>
                </div>
                <div className="flex  w-full mx-auto flex-col">
                  <label className="text-[#747474] text-sm font-medium ml-1 mb-2">
                    Re-enter Password
                  </label>
                  <input
                    className="py-3 rounded-md bg-[#F2F2F2] px-5 focus:outline-0"
                    type="password"
                    name="password"
                    id=""
                    placeholder="Re-enter password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      minLength: {
                        value: 3,
                        message: "Minimum 3 character required",
                      },
                    })}
                    onKeyUp={() => {
                      trigger("confirmPassword");
                    }}
                  />
                  <small className="text-[#FF4B2B] ml-2 text-xs font-medium my-2">
                    {errors?.confirmPassword?.message}
                  </small>
                </div>

                <div className="flex w-full mx-auto flex-col">
                  <button
                    className="btn bg-primary hover:bg-primary my-[20px] border-0 text-white text-[17px]  font-bold "
                    type="submit"
                  >
                    {loading ? <CustomButtonLoading /> : "Sign Up"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <WalletLoginOtpForm
            successData={successData}
            lastData={lastData}
            setSuccessData={setSuccessData}
            orderResponse={orderResponse}
          />
        )}
      </div>
    </div>
  );
};

export default WalletLoginModal;
