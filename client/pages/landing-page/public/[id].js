import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Header from '../../../src/Components/Admin/LandingPage/Header';
import GalarySection from '../../../src/Components/Admin/LandingPage/GalarySection';
import Features from '../../../src/Components/Admin/LandingPage/Features';
import CheckOut from '../../../src/Components/Admin/LandingPage/CheckOut';
import { server_url_v2 } from '../../../lib/config';
import { LandingPageGallaryImages } from '../../../lib/LandingPageGallaryImages';
import Head from 'next/head';

const SingleLandingPage = ({ page }) => {
    const transformedItems = page?.products?.map(item => ({
        item_id: item._id,
        item_name: item.productTitle,
        price: item.salePrice,
        quantity: item.quantity,
    }));
    useEffect(() => {
        window.gtag("event", "view_item", {
            currency: "BDT",
            value: 0,
            items: transformedItems
        });
    }, [])
    return (
        <>
            <Head>
                <title>UU E-SHOP</title>
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
            <div className=''>
                <Header data={page} />
            </div>
            <div className='mid-container'>
                <GalarySection data={page} />
                <Features data={page} />
                <CheckOut data={page} />
            </div>
        </>
    );
};

export async function getStaticProps({ params }) {
    const { id } = params;
    const response = await fetch(`${server_url_v2}/landing-page/${id}`);
    const data = await response.json();

    return {
        props: {
            page: data.data,
        },
    };
}

export async function getStaticPaths() {
    // This function is required to specify the dynamic paths to be pre-rendered at build time
    // In this example, it's an empty array because we don't know the exact values of `id`
    return { paths: [], fallback: 'blocking' };
}

export default SingleLandingPage;
