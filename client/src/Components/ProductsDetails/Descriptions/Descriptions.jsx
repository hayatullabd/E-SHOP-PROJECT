import { useState } from "react";
import AddReview from "./AddReview";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { server_url_v4 } from "../../../../lib/config";
import { Icon } from "@iconify/react/dist/iconify.js";
import { convertTimestamp2 } from "../../../../lib/convertTimestampDateAndTime";

function Descriptions({ description, youtube }) {
  const [toggleState, setToggleState] = useState(1);
  const router = useRouter();
  const { id } = router.query;

  const toggleTab = (index) => {
    setToggleState(index);
  };

  function extractVideoID(url) {
    const regex = /(?:\?v=|&v=|youtu\.be\/|shorts\/)([^&\n]+)/;
    const match = url.match(regex);
    if (match) {
        return match[1];
    }
    return null;
  }

  const { data, isLoading, isError,refetch } = useQuery('reviewData', async () => {
    const response = await fetch(`${server_url_v4}/review/get/${id}?sort=-createdAt`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
  const reviews = data?.data
  
  return (
    <>
      <div>
        <div className="bg-gray-200  gap-5  flex">
          <button
            className={
              toggleState === 1 ? "bg-white p-3 border-t-2 border-l-2" : "p-3 min-w-max"
            }
            onClick={() => toggleTab(1)}
          >
            Description
          </button>

          <button
            className={
              toggleState === 2
                ? "bg-white p-3 border-t-2  text-left"
                : "p-3 "
            }
            onClick={() => toggleTab(2)}
          >
            Video
          </button>

          <button
            className={
              toggleState === 3
                ? "bg-white p-3 border-t-2  text-left"
                : "p-3 min-w-max"
            }
            onClick={() => toggleTab(3)}
          >
            Review
          </button>
        </div>

        <div className="content-tabs  md:w-2/3 w-full py-5 ">
          <div
            className={toggleState === 1 ? "block  active-content" : "hidden"}
          >
            <h2 className="text-xl font-bold block md:hidden mb-2 bg-slate-200 p-4">
              Description
            </h2>
            {description && (
              <div className="p-1 product-description" dangerouslySetInnerHTML={{ __html: description }}></div>
            )}
          </div>

          <div
            className={toggleState === 2 ? "block  active-content" : "hidden"}
          >
            <hr />
            {youtube ? (
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${extractVideoID(youtube)}`}
                title="YouTube video player"
                // frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <h2>Video Not Found</h2>
            )}
          </div>

          <div
            className={toggleState === 3 ? "block  active-content" : "hidden"}
          >
            {/* <button onClick={() => setOpenModal(true)} className="btn btn-xs md:btn-sm btn-primary text-white mt-1">
              Add Review
            </button> */}
            {/* show review section========================= */}
            <div className="mt-3 max-h-[450px] overflow-y-auto">
              {
                reviews?.map((review, index) => <div className="mt-3">
                  <div className="flex items-center flex-wrap gap-1">
                    <Icon className="text-lg" icon="uim:user-nurse" />
                    <p className="font-bold text-black">{review?.fullName}</p>
                    <div className="flex items-center text-lg text-black/30 gap-[-4px]">
                      <Icon className={`${review?.rating >= 1 && "text-orange-600"}`} icon="mdi:star-outline" />
                      <Icon className={`${review?.rating >= 2 && "text-orange-600"}`} icon="mdi:star-outline" />
                      <Icon className={`${review?.rating >= 3 && "text-orange-600"}`} icon="mdi:star-outline" />
                      <Icon className={`${review?.rating >= 4 && "text-orange-600"}`} icon="mdi:star-outline" />
                      <Icon className={`${review?.rating >= 5 && "text-orange-600"}`} icon="mdi:star-outline" />
                    </div>
                    <p className="text-[9px] text-black/50">{convertTimestamp2(review?.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon className="text-lg invisible" icon="uim:user-nurse" />
                    <p className="">{review?.comment}</p>
                  </div>

                </div>)
              }
            </div>

           {/* add review section ==============================  */}
            <div className="mt-7">
            <AddReview/>
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          {youtube && (
            <iframe
              width="100%"
              height="auto"
              src={`https://www.youtube.com/embed/${extractVideoID(youtube)}`}
              title="YouTube video player"
              // frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </div>
     
    </>
  );
}

export default Descriptions;
