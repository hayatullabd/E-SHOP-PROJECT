import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import BottomNav from "../Shared/BottomNav";
import DashboardNavbar from "../Shared/DashboardNavbar";
import CartDrawer from "../Shared/drawer/CartDrawer";
import Footers from "../Shared/Footers";
import Navbar from "../Shared/Navbar";
import Head from "next/head";
import Script from "next/script";

function Layout({ children }) {
  const router = useRouter();
  const pathName = router.pathname;
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(pathName);

    // Delay GTM script injection by 6 seconds
    const timer = setTimeout(() => {
      // Inject GTM container snippet
      const gtmScript = document.createElement("script");
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-TD6RZJF5');
      `;
      document.head.appendChild(gtmScript);

      const gtmNoScript = document.createElement("noscript");
      gtmNoScript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TD6RZJF5"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      document.body.appendChild(gtmNoScript);
    }, 5000); // Delay in milliseconds (6 seconds)

    // Clear the timer on component unmount
    return () => clearTimeout(timer);
  }, [pathName]);

  return (
    <>
      {url.includes("landing-page/public") ? (
        <></>
      ) : (
        <>
          {url.includes("user/") || url.includes("admin/") ? (
            // <DashboardNavbar />
            <></>
          ) : (
            <Navbar></Navbar>
          )}

          {url.includes("user/") ? (
            <>
              <DashboardNavbar />
            </>
          ) : (
            <></>
          )}
        </>
      )}

      <main className="bg-[#F9FAFB]">{children}</main>

      {url.includes("landing-page/public") ? (
        <></>
      ) : (
        <>
          {url.includes("admin") ||
            (url.includes("user/") ? (
              <div className="">{/* www.FashionPoint.com */}</div>
            ) : (
              <Footers></Footers>
            ))}
        </>
      )}
      <CartDrawer />
    </>
  );
}

export default Layout;
