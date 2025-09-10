
import AppAds from "../../src/Components/Home/AppAds/AppAds";
import OfferCard from "./../../src/Components/Offer/OfferCards";
import Data from "./Data.json";
import SecondaryImageCover from "../../src/Shared/SecondaryImageCover";

const Offer = () => {
  return (
    <>
      <SecondaryImageCover title={"Mega Offer"} />
      <div className=" bg-accent pb-10">
        <div className="mid-container -z-20 p-9">
          <OfferCard />
        </div>
        <AppAds />
      </div>
    </>
  );
};

export default Offer;
