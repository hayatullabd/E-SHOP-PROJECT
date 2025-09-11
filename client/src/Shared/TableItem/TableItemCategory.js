import React, { useContext } from "react";

import { FaEdit, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import handleDelete from "../../../lib/handleDelete";
import handleUpdate from "../../../lib/handleUpdate";
import CreateContext from "../../Components/CreateContex";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import Image from "next/image";

const CategoryTableItem = ({ category, index }) => {
  const { reolder, setReloader } = useContext(CreateContext);

  const router = useRouter();

  let fethUrl = "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/category/";
  const handleDeleteCategory = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fethUrl += id;
        handleDelete(fethUrl, setReloader, reolder);
      } else {
        swal("Category is safe!");
      }
    });
  };

  const handleUpdateCategory = (id) => {
    fethUrl += id;
    const result = handleUpdate(
      fethUrl,
      {
        status: !category.status,
      },
      setReloader,
      reolder
    );
    swal("Category Published.", {
      icon: "success",
    });
  };

  const handleEditCategory = (id) => {
    router.push(`/admin/category/update-category?id=${id}`);
  };

  return (
    <tr className="py-10 text-center">
      <th>{index + 1}</th>
      <td className="flex items-center justify-center">
        <span>
          <Image
            src={category?.imageURLs[0]}
            height={35}
            width={35}
            className="object-cover rounded-md"
            alt="category_image"
          />
        </span>
      </td>
      <td>{category.parentCategory}</td>
      <td>
        {category.childCategory.map((child, index) => (
          <p key={index} className="text-xs">
            {child}
          </p>
        ))}
      </td>
      {category?.parentCategory === "homepage" ? (
        <>
          <td>No Update</td>
        </>
      ) : (
        <td>
          {category.status ? (
            <button
              onClick={() => handleUpdateCategory(category._id)}
              className="btn btn-xs border-none bg-red-500 text-white"
            >
              unhide
            </button>
          ) : (
            <button
              onClick={() => handleUpdateCategory(category._id)}
              className="btn btn-xs btn-primary text-white"
            >
              hide
            </button>
          )}
        </td>
      )}

      {category?.parentCategory === "homepage" ? (
        <>
          <td>No Update</td>
        </>
      ) : (
        <td>
          <span className="flex justify-center gap-2">
            <Tooltip anchorSelect="#edit">Edit</Tooltip>
            <button id="edit" onClick={() => handleEditCategory(category._id)}>
              <FaEdit size={17} className="text-warning block mx-auto " />
            </button>
            <Tooltip anchorSelect="#delete">Delete</Tooltip>
            <button
              id="delete"
              onClick={() => handleDeleteCategory(category._id)}
              className="cursor-pointer"
            >
              <FaTrashAlt size={15} className="text-red-600 block mx-auto " />
            </button>
          </span>
        </td>
      )}
    </tr>
  );
};

export default CategoryTableItem;
