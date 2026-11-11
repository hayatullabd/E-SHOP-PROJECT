import { FaFacebookF } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { IoLogoYoutube } from "react-icons/io";
import { FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import AuthUser from "../../lib/AuthUser";
import { useMyShopData } from "../hooks/useMyShopData";
import { MdLocationOn, MdOutlineAlternateEmail, MdPhone } from "react-icons/md";
import Image from "next/image";
import { Icon } from "@iconify/react";
const Footers = () => {
  const { userInfo } = AuthUser();

  const { data, isLoading, refetch } = useMyShopData();

  return (
    <>
      <div className=" lg:pb-3 lg:pt-5 bg-gray-100">
        <div className="mid-container">
          <div className="">
            <div className=" border-b border-gray-300">
              <footer className="footer px-0  sm:px-4 py-10 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 p-10  text-base-content">
                <div>
                  {/* <Image src={logo} alt=""/> */}
                  <Link href={"/"} className="">
                    <Image
                      src={data?.data?.logo}
                      alt="logo"
                      width={200}
                      height={100}
                      className="w-[120px] md:w-[190px]"
                    />
                  </Link>

                  <p className="capitalize">{data?.data?.aboutShop}</p>
                  <div className="flex justify-center items-center gap-2 mt-2 text-lg ">
                    <div className="text-gray-600 hover:text-primary duration-300">
                      <a
                        href={
                          data?.data?.facebookPage ||
                          data?.data?.facebookGroup ||
                          "/"
                        }
                        target={"_blank"}
                      >
                        <FaFacebookF />
                      </a>
                    </div>
                    <div className="text-gray-600 hover:text-primary duration-300">
                      <a href={data?.data?.twitter || "/"} target={"_blank"}>
                        <BsTwitter />
                      </a>
                    </div>
                    <div className="text-gray-600 hover:text-primary duration-300">
                      <a href={data?.data?.Youtube || "/"} target={"_blank"}>
                        <IoLogoYoutube />
                      </a>
                    </div>
                    <div className="text-gray-600 hover:text-primary duration-300">
                      <a href={data?.data?.linkedin || "/"} target={"_blank"}>
                        <FaLinkedinIn />
                      </a>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl sm:text-2xl">
                    Contact Us
                  </span>
                  <p className=" flex items-center flex-wrap gap-1">
                    <MdOutlineAlternateEmail
                      size={20}
                      className="text-primary"
                    />
                    {data?.data?.email}
                  </p>
                  <p className=" flex items-center gap-1">
                    <MdPhone size={20} className="text-primary" />
                    {data?.data?.phone}
                  </p>
                  <p className=" flex gap-1">
                    <MdLocationOn size={26} className="text-primary" />
                    {data?.data?.address}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-xl sm:text-2xl">
                    Quick Links
                  </span>
                  <Link href={"/warranty-policy"} className="link link-hover">
                    Warranty Policy
                  </Link>
                  <Link href={"/return-policy"} className="link link-hover">
                    Return & Refund Policy
                  </Link>
                  <Link href={"/privacy-policy"} className="link link-hover">
                    Privacy Policy
                  </Link>
                  <Link href={"/terms"} className="link link-hover">
                    Terms and Conditions
                  </Link>
                  <Link href={"/about"} className="link link-hover">
                    About us
                  </Link>
                </div>
                <div>
                  <span className="font-bold text-xl sm:text-2xl">
                    Customer Service
                  </span>

                  <Link href={"/contact"}>
                    <p className="link link-hover">Support Center</p>
                  </Link>
                  {/* <Link href={"/faq"}>
                  <p className="link link-hover">Frequently ask Question</p>
                </Link> */}
                  <Link href={"/privacy-policy"}>
                    <p className="link link-hover">Privacy & Policy</p>
                  </Link>
                  <Link href={"/terms"}>
                    <p className="link link-hover">Terms & Conditions</p>
                  </Link>
                </div>
              </footer>
            </div>
            <div>
              <p
                // href="https://www.softriple.com"
                className="text-sm text-center mt-5 block"
                // target={"_blank"}
              >
                Design & Developed By{" "}
                <span className="font-bold text-primary cursor-pointer">
                  Hayatulla Kha
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footers;
