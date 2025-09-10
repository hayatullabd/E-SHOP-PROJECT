import { getAdminToken } from "./getToken";

const handleUpdate2 = (url, data, setReloader=()=>{}, reolder) => {
  fetch(url, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${getAdminToken()}` 
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {

      console.log(result)

      if (result) {
        setReloader(!reolder)
        return true;
      } else {
        return false;
      }
    });
};

export default handleUpdate2;
