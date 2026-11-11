import swal from "sweetalert";
import server_url from "./config";

const CreateUserHook2 = async (userInfo, message, setSuccessData,setOtpModal, setLoading = () => { }) => {
  fetch(`${server_url}/user/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((response) => response.json())
    .then((data) => {

      console.log("=responce=",data)

      if (data.status === "success") {
        setSuccessData(data?.data)
        setLoading(false)
        setOtpModal(true)
        return swal("Good job!", message + `OTP=${data?.data?.code}`, "success");
      } else if (data?.error?.includes("Already you have an Account")) {
        setLoading(false)
        return swal(
          "Oops",
          `${data?.error?.split(":").slice(2).join(":")}`,
          "error"
        );
      } else {
        setLoading(false)
        return swal(
          "Oops",
          `${data?.message}`,
          "error"
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      setLoading(false)

    });
};

export default CreateUserHook2;
