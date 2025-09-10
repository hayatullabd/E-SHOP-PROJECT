export const usePostOrder = (url, body, setFunction, router) => {
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setFunction(data.data);
        swal("success", data.message, "success");
        router.push("/checkout/success-order");
      }
      if (data.status === "fail") {
        swal("error", data.error, "error");
      }
    });
};


export const useUpdatePostOrder = (url, body, setFunction, router) => {
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setFunction(data);
        // swal("success", data.message, "success");
        // router.push("/checkout/success-order");
      }
      if (data.status === "fail") {
        swal("error", data.error, "error");
      }
    });
};


export const useWalletTaka = (url, body, setFunction) => {
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setFunction(data.data?.totalDiscount);
      }
    });
};


export const usePostCustomeOrder = (url, body, setFunction,router) => {
  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        setFunction(data.data);
        swal("success", data.message, "success");
        router.push("/admin/orders");
      }
      if (data.status === "fail") {
        swal("error", data.error, "error");
      }
    });
};
