import React, { useEffect, useRef, useState } from "react";
import ResentOtp from "./ResentOtp";
import CustomButtonLoading from "../CustomButtonLoading";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import CreateUserHook3 from "../../../lib/CreateUserHook3";
import AuthUser from "../../../lib/AuthUser";
import { useRouter } from "next/router";

const OtpForm = ({successData, lastData,setSuccessData, length = 4, onOtpSubmit = () => {} }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const [loading,setLoading]=useState(false)
  const navigate = useRouter();
  const { getToken, setToken } = AuthUser();

  const { handleSubmit } = useForm();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // submit trigger
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // optional
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };
  // --------end otp-------------

  const onSubmit = async () => {
    const verifyNumberData = Object.values(otp).join("");
    if (verifyNumberData !== successData?.code) {
      return swal(
        "Oops",
        `OTP didn't match`,
        "error"
      );
    } else {
      const data = {
        activationCode:verifyNumberData,
        token:successData?.token,
      };
      CreateUserHook3(data, navigate, setToken );
    }
  };


  async function navigator() {
    const from = (await navigate.query.from) || "/";
    navigate.push(from);
  }

  if (getToken()) {
    navigator();
    return null;
  }

  

  return (
    <div className="card flex-shrink-0 shadow-2xl bg-base-100  sm:w-[600px] w-full">
      <div className="card-body w-full">
        <h1 className="font-bold text-3xl text-center mb-5">Sign Up</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-[0px] max-h-[75vh] overflow-y-scroll md:px-9 pb-9"
        >
          <div>
            <p className="text-normal text-base text-info">
              Please Enter OTP That Sent To {lastData?.phone} your otp : {lastData?.data?.code}
            </p>
            <div className=" flex items-center justify-center w-full mt-5">
              <h1 className="text-lg font-medium text-dark-gray mb-4">
                Enter OTP
              </h1>
            </div>
            <div className="flex items-center justify-between py-2 md:gap-9 gap-4  mx-auto md:w-[280px]">
              {otp.map((value, index) => {
                return (
                  <input
                    key={index}
                    type="text"
                    ref={(input) => (inputRefs.current[index] = input)}
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="border border-dark-gray/20 text-center outline-none focus:border-primary w-10 h-11 rounded-[10px]"
                  />
                );
              })}
            </div>
            <ResentOtp data={lastData} setSuccessData={setSuccessData}/>
          </div>

          <div className="flex w-full mx-auto flex-col">
            <button
              className="btn bg-primary hover:bg-primary my-[20px] border-0 text-white text-[17px]  font-bold "
              type="submit"
            >
              {loading ? <CustomButtonLoading /> : "OTP Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
