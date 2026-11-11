import React, { useEffect, useState } from "react";
import CreateUserHook2 from "../../../lib/CreateUserHook2";

const ResentOtp = ({ data, setSuccessData }) => {
    const [isLoading,setIsLoading]=useState(false)
    const message = "Resent otp your phone"


    console.log("+++===+++",data)

  const onSubmit = async () => {
    setIsLoading(true);
    CreateUserHook2(data, message, setSuccessData, setOtpModal, setIsLoading);
  };

  const setOtpModal = ()=>{

  }


  return (
    <div>
      <p className="text-center text-info text-sm font-medium mt-4">
        Didn't get the code?{" "}
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSubmit()}
          className={`font-bold underline ${isLoading ? " text-gray-500" : "text-primary "}`}
        >
          Click to resend
        </button>
      </p>
    </div>
  );
};

export default ResentOtp;
