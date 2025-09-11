import React, { useContext } from "react";
import { AiFillEye } from "react-icons/ai";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import swal from "sweetalert";
import handleDelete from "../../../lib/handleDelete";
import handleUpdate from "../../../lib/handleUpdate";
import CreateContext from "../../Components/CreateContex";
import { useRouter } from "next/router";
import ProductShowModal from "../ProductShowModal";
import AdminProductDetails from "../AdminProductDetails";
import { Tooltip } from "react-tooltip";
import { calculateDiscount } from "../../../lib/claculateDiscount";
import Image from "next/image";
const ProductsTableItemsRow = ({ product, index }) => {
  const { reolder, setReloader } = useContext(CreateContext);
  const [modalIsOpen, setIsOpenModal] = React.useState(false);
  const [modalProductData, setModalProductData] = React.useState({});
  const router = useRouter();

  let fethUrl = "https://uu-e-shop-server-e7w2ppakl-hayatullabds-projects.vercel.app/api/v1/product/";

  const handleDeleteProduct = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fethUrl += id;
        handleDelete(fethUrl, setReloader, reolder);
      } else {
        swal("Product is safe!");
      }
    });
  };

  const handleUpdateProduct = (id) => {
    fethUrl += id;
    const result = handleUpdate(
      fethUrl,
      {
        status: !product.status,
      },
      setReloader,
      reolder
    );
    swal("Success!.", {
      icon: "success",
    });
  };

  const handleEditProduct = (id) => {
    router.push(`/admin/products/update-product?id=${id}`);
  };
  const discountPrice = calculateDiscount(
    product?.productPrice,
    product?.salePrice
  );
  return (
    <>
      <tr
        className={`py-10 text-center  ${product.quantity < 3 ? "text-red-800 font-bold active" : "bg-none"
          }`}
      >
        <td>{+index + 1}</td>
        <td className="">
          <Image
            src={product?.imageURLs[0]}
            height={40}
            width={40}
            className="w-[50px] h-full rounded-md"
            alt="product_image"
          />
        </td>
        <td>{product.sku.slice(0, 15)}</td>
        <td>{product.name.slice(0, 15)}...</td>
        <td>{product.category}</td>
        <td>{product.quantity}</td>
        <td>
          <span>
            <p>
              <span className="text-xs font-bold">
                Buy.Price {product?.variant[0]?.buyingPrice}
              </span>
            </p>
            <p>
              <span className="text-xs font-bold">
                Reg.Price {product?.variant[0]?.productPrice}
              </span>
            </p>
            <p>
              <span className="text-xs font-bold">
                Sale.Price {product?.variant[0]?.salePrice}
              </span>
            </p>
          </span>
        </td>

        <td>{discountPrice}</td>
        {/* <td>
          <button className="btn btn-xs btn-danger text-white">
            {product.status ? "review" : "published"}
          </button>
        </td> */}

        <td>
          <label
            onClick={() => {
              setIsOpenModal(true);
              setModalProductData(product);
            }}
            className="cursor-pointer flex items-center justify-center"
          >
            <Tooltip anchorSelect="#view">View</Tooltip>
            <AiFillEye id="view" size={25} className={"text-primary"} />
          </label>
        </td>
        <td>
          {product.status ? (
            <button
              onClick={() => handleUpdateProduct(product._id)}
              className="btn btn-xs border-none bg-red-500 text-white"
            >
              unhide
            </button>
          ) : (
            <button
              onClick={() => handleUpdateProduct(product._id)}
              className="btn btn-xs btn-primary text-white font-bold"
            >
              hide
            </button>
          )}
        </td>
        <td>
          <span className="flex justify-center gap-2 ">
            <Tooltip anchorSelect="#edit">Edit</Tooltip>
            <button id="edit" onClick={() => handleEditProduct(product._id)}>
              <FaEdit size={17} className="text-warning block mx-auto " />
            </button>
            <Tooltip anchorSelect="#delete">Delete</Tooltip>
            <button
              id="delete"
              onClick={() => handleDeleteProduct(product._id)}
              className="cursor-pointer"
            >
              <FaTrashAlt size={15} className="text-red-600 block mx-auto " />
            </button>
          </span>
        </td>
      </tr>
      <ProductShowModal
        modalIsOpen={modalIsOpen}
        setIsOpenModal={setIsOpenModal}
      >
        {/* <AdminProductDetails product={modalProductData} /> */}
        <div className="max-w-[600px] py-5">
          <AdminProductDetails product={modalProductData} />
        </div>
      </ProductShowModal>
    </>
  );
};

export default ProductsTableItemsRow;
