import React, { useContext } from "react";
import CreateContext from "../../src/Components/CreateContex";
import CustomModal from "../../src/Shared/CustomModal";
import WalletLoginModal from "../../src/Components/walletLogin/WalletLoginModal";
import { useRouter } from "next/router";
import Image from "next/image";
const SuccessOrder = () => {
  const { orderResponse, lastLogin, setLastLogin } = useContext(CreateContext);
  const router = useRouter();

  return (
    // <RequireAuth>
    <>
      <div className="my-8">
        <div className="mid-container">
          <div className=" flex items-center py-10 justify-center flex-col">
            <div>
              <Image
                src={"/assets/success.png"}
                width={500}
                height={500}
                alt="success"
                className="w-[200px] h-full"
              />
            </div>
            <div className=" text-center">
              <h2 className=" text-[40px] font-bold">
                Your Order create Success
              </h2>
            </div>
            <div className=" mt-7">
              <button
                onClick={() => router.push("/")}
                className=" bg-primary text-white py-3 px-8 rounded-lg"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <CustomModal modalIsOpen={lastLogin} setIsOpen={setLastLogin}>
        <WalletLoginModal
          orderResponse={orderResponse}
          setLastLogin={setLastLogin}
        />
      </CustomModal>
    </>
    // </RequireAuth>
  );
};

export default SuccessOrder;
