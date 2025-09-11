import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import getFetchFunction from "../../../lib/getFetchFunction";
import CreateContext from "../../../src/Components/CreateContex";
import DashboardLayout from "../../../src/Components/DashboardLayout";
import LoadingComponets from "../../../src/Shared/LoadingComponets";
import dynamic from "next/dynamic";

const CategoryTableItem = dynamic(
  () => import("../../../src/Shared/TableItem/TableItemCategory"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const Category = () => {
  const [categories, setCategories] = useState([]);
  const { reolder, setReloader } = useContext(CreateContext);
  //-------------------its reloader use for when we delete or update and set !reolder, then depenciy reloded

  let categoryUrl = `https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/category/`;

  useEffect(() => {
    getFetchFunction(categoryUrl, setCategories);
  }, [reolder, categoryUrl]);

  const onChangeCategorySerach = (event) => {
    categoryUrl += `?search=${event.target.value}`;
    getFetchFunction(categoryUrl, setCategories);
  };

  if (!categories) {
    return <LoadingComponets />;
  }

  return (
    <DashboardLayout>
      <div className="">
        <h1 className="font-semibold mt-5 mb-2 text-xl">Products</h1>

        <div className="md:p-8 py-4 px-4 rounded bg-white shadow flex justify-center items-center gap-4">
          <div className="md:w-[40%] w-0"></div>
          <div className="md:w-[40%] w-full">
            <input
              type="text"
              onChange={onChangeCategorySerach}
              className="w-full rounded input input-bordered focus:border-primary duration-300 ease-in-out focus:outline-none"
              placeholder="Search by Category"
            />
          </div>

          <Link
            href={"/admin/category/add-category"}
            className="md:w-[20%] w-full"
          >
            <button className="btn btn-primary font-bold w-full text-white">
              Add Category
            </button>
          </Link>
        </div>
        {/* -----------------------bellow table------------------------- */}
        <div className="mt-6">
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th className="bg-[#f3f3f3] text-center">ID</th>
                  <th className="bg-[#f3f3f3] text-center">ICON</th>
                  <th className="bg-[#f3f3f3] text-center">PARENT</th>
                  <th className="bg-[#f3f3f3] text-center">CHILDREN</th>
                  <th className="bg-[#f3f3f3] text-center">Status</th>
                  <th className="bg-[#f3f3f3] text-center">Actions</th>
                </tr>
              </thead>
              {categories?.map((category, index) => (
                <CategoryTableItem
                  key={category?._id}
                  category={category}
                  index={index}
                ></CategoryTableItem>
              ))}
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Category;
