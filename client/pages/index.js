import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import server_url from "../lib/config";
import CreateContext from "../src/Components/CreateContex";
import Banner from "../src/Components/Home/Banner/Banner";
import Category from "../src/Components/Home/Category/Category";
import PopularProducts from "../src/Components/Home/PopularProducts/PopularProducts";
import ProductSection from "../src/Components/ProductSection/ProductSection";
import ScrollButtons from "../src/Shared/ScrollButton/ScrollButtons";

export async function getStaticProps() {
  const fetchData = async (endpoint) => {
    const res = await fetch(`${server_url}/${endpoint}`);
    return res.json();
  };

  const [bannerData, categoryData, productsData, discountedProductsData, arrivalsProductsData] = await Promise.all([
    fetchData('banner?status=active&sort=position'),
    fetchData('category?status=true'),
    fetchData('product?status=true'),
    fetchData('product?status=true&subCategory=discounted'),
    fetchData('product?status=true&subCategory=arrivals')
  ]);

  return {
    props: {
      banners: bannerData,
      category: categoryData,
      products: productsData,
      discountedProducts: discountedProductsData,
      arrivalsProducts: arrivalsProductsData
    },
    revalidate: 1500, // Regenerate every 15 seconds
  };
}

export default function Home({ banners, category, products, discountedProducts, arrivalsProducts }) {
  const [bannerData, setBannerData] = useState(banners);
  const { categoryData, setCategoryData } = useContext(CreateContext);
  const [productsData, setProductsData] = useState(products);
  const [discountedProductsData, setDiscountedProductsData] = useState(discountedProducts);
  const [newArrivalProducts, setNewArrivalProducts] = useState(arrivalsProducts);
  const [userInterest, setUserInterest] = useState("");



  const fetchAndUpdateData = async (endpoint, setData) => {
    const res = await fetch(`${server_url}/${endpoint}`);
    const newData = await res.json();
    setData(newData);
  };

  useEffect(() => {
    setCategoryData(category);
  }, [category]);

  useEffect(() => {
    const interval = setInterval(() => fetchAndUpdateData('banner?status=active&sort=position', setBannerData), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchAndUpdateData('category?status=true', setCategoryData), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchAndUpdateData('product?status=true', setProductsData), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchAndUpdateData('product?status=true&subCategory=discounted', setDiscountedProductsData), 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchAndUpdateData('product?status=true&subCategory=arrivals', setNewArrivalProducts), 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>UU ESHOP</title>
        <meta name="description" content="Best e-commerce website" />
        <link rel="icon" href="/favicon.ico" />
        <script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'GTM-TD6RZJF5');
         `}
        </script>
      </Head>
      <Banner data={bannerData} catagories={categoryData} />
      <Category catagories={categoryData} />
      <ProductSection
        heading={"New Arrivals"}
        subtitle={""}
        data={newArrivalProducts?.data?.products}
      />
      <div className="">
        <ProductSection
          heading={"Latest Discounted Products"}
          subtitle={""}
          data={discountedProductsData?.data?.products}
        />
        <PopularProducts />
      </div>
      <ScrollButtons />
    </>
  );
}
