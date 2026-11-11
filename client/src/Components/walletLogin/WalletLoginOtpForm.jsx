import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { useRouter } from "next/router";
import ResentOtp from "../../Shared/otp/ResentOtp";
import CustomButtonLoading from "../../Shared/CustomButtonLoading";
import AuthUser from "../../../lib/AuthUser";
import CreateUserHook3 from "../../../lib/CreateUserHook3";
import server_url from "../../../lib/config";
import CreateContext from "../CreateContex";

const WalletLoginOtpForm = ({
  successData,
  lastData,
  setSuccessData,
  orderResponse,
  length = 4,
  onOtpSubmit = () => {},
}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const { getToken, setToken, userInfo } = AuthUser();
  const { setLastLogin } = useContext(CreateContext);

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
      return swal("Oops", `OTP didn't match`, "error");
    } else {
      const data = {
        activationCode: verifyNumberData,
        token: successData?.token,
      };

      fetch(`${server_url}/user/verify`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            successFuncation(data.data.user._id)
            setToken(
              data.data.user.email,
              data.data.token,
              data.data.user.role,
              data.data.user
            );
            setLoading(false);
            setLastLogin(false)
            return swal("Good job!", "Account Created", "success");
          } else if (data.error.includes("Already you have an Account")) {
            setLoading(false);
            setLastLogin(false)
            return swal(
              "Oops",
              `${data.error.split(":").slice(2).join(":")}`,
              "error"
            );
          } else {
            setLoading(false);
            return swal(
              "Oops",
              `${data.error.split(":").slice(2).join(":")}`,
              "error"
            );
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setLoading(false);
          setLastLogin(false)
        });

      // CreateUserHook3(data, navigate, setToken,navigator );
    }
  };

  const successFuncation = (id) => {
    const from = "/";
    setSuccessData();
    const url = `${server_url}/order/update-user/${orderResponse?._id}`;

    const userData = {
      user: id,
    };
    console.log("========&&&&&&&&&=========",userData)

    fetch(url, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          navigate.push(from);
        }
      });
  };



  // if (getToken()) {
  //   navigator();
  //   return null;
  // }

  return (
    <div className="card flex-shrink-0 shadow-2xl bg-base-100  sm:w-[600px] w-full">
      <div className="card-body w-full">
        <h1 className="font-bold text-3xl text-center mb-5">OTP verify</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full mt-[0px] max-h-[75vh] overflow-y-scroll px-9 pb-9"
        >
          <div>
            <p className="text-normal text-base text-info">
              Please Enter OTP That Sent To {lastData?.phone}
            </p>
            <div className=" flex items-center justify-center w-full mt-5">
              <h1 className="text-lg font-medium text-dark-gray mb-4">
                Enter OTP
              </h1>
            </div>
            <div className="flex items-center py-2 gap-9  mx-auto w-[280px]">
              {otp?.map((value, index) => {
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
            <ResentOtp data={lastData} setSuccessData={setSuccessData} />
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

export default WalletLoginOtpForm;
