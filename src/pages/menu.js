import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Image from "next/image";
import Confirm from "../components/Confirm";

const GET_ITEMS = gql`
  query AllItems {
    allItems {
      id
      itemDesc
      itemGrp
      itemImage
      itemName
      itemPrice
    }
  }
`;

const ADD_ITEM = gql`
  mutation AddItem($itemInput: itemInput) {
    addItem(itemInput: $itemInput) {
      id
      itemName
      itemPrice
    }
  }
`;

const REMOVE_ITEM = gql`
  mutation DeleteItem($itemId: ID!) {
    deleteItem(itemId: $itemId) {
      id
    }
  }
`;

const MenuItemForm = ({ token, showForm, setShowForm }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemDesc: "",
    itemGrp: "",
    itemImage: "",
    itemPrice: 0,
  });
  const router = useRouter();
  const [addItem] = useMutation(ADD_ITEM);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemPrice = parseFloat(formData.itemPrice);
    try {
      const { data } = await addItem({
        variables: {
          itemInput: {
            itemName: formData.itemName,
            itemDesc: formData.itemDesc,
            itemGrp: formData.itemGrp,
            itemImage: formData.itemImage,
            itemPrice: itemPrice,
          },
        },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      if (data) {
        toast.success("Item added to menu", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/menu");
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setFormData({
      itemName: "",
      itemDesc: "",
      itemGrp: "",
      itemImage: "",
      itemPrice: 0,
    });
    setShowForm(false);
  };
  const buttonRef = useRef();
  const formRef = useRef();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, setShowForm]);
  return (
    <div>
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-95 mt-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-slate-900 rounded-lg shadow-md p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl">
                ADD ITEM
              </h1>
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-3 md:space-y-4"
                method="POST"
              >
                <div>
                  <label
                    htmlFor="itemName"
                    className="block mt-2 mb-2 text-sm font-medium text-white"
                  >
                    Item Name
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="itemName"
                    id="itemName"
                    value={formData.itemName}
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="itemDesc"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Item Description
                  </label>
                  <input
                    onChange={handleChange}
                    name="itemDesc"
                    id="itemDesc"
                    value={formData.itemDesc}
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 resize-none"
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="itemGrp"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Item Group
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="itemGrp"
                    id="itemGrp"
                    value={formData.itemGrp}
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="itemImage"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Item Image URL
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="itemImage"
                    id="itemImage"
                    value={formData.itemImage}
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="itemPrice"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Item Price
                  </label>
                  <input
                    onChange={handleChange}
                    type="number"
                    name="itemPrice"
                    id="itemPrice"
                    value={formData.itemPrice}
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    required=""
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    ref={buttonRef}
                    disabled={
                      !formData.itemName ||
                      !formData.itemDesc ||
                      !formData.itemGrp ||
                      !formData.itemImage ||
                      !formData.itemPrice
                    }
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-2 
  focus:outline-none focus:ring-white font-medium rounded-lg text-base px-7 py-2 text-center disabled:hover:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuPage = ({ user }) => {
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { error, data } = useQuery(GET_ITEMS);
  const router = useRouter();
  const [removeItem] = useMutation(REMOVE_ITEM);

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data) {
      setItems(data.allItems);
      setLoadingData(false);
    }
  }, [data]);

  useEffect(() => {
    console.log(items);
    if (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [error]);

  const handleDelete = async (empID) => {
    setItemToDelete(empID);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const { data } = await removeItem({
        variables: {
          itemId: itemToDelete,
        },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      if (data && data.deleteItem && data.deleteItem.id === null) {
        toast.success("Item removed from menu", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/menu");
      } else {
        toast.error("Failed to delete item", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setConfirmDelete(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setItemToDelete(null);
  };

  const handleAddItem = async () => {
    setShowForm(true);
  };

  return (
    <>
      <Head>
        <title>Menu Page</title>
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          user.role === "admin" && (
            <>
              <p className="text-white text-2xl text-center mb-10">
                Menu Items
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items &&
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row"
                    >
                      <div className="md:mr-4 mb-4 md:mb-0 max-w-md">
                        <Image
                          className="m-auto block"
                          src={item.itemImage}
                          alt={item.itemName}
                          width={200}
                          height={140}
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="mt-3 font-semibold text-white text-lg">
                            {item.itemName}
                          </h3>
                          <p className="text-gray-300">{item.itemDesc}</p>
                          <p className="text-base text-gray-300">
                            ( {item.itemGrp} )
                          </p>
                          <p className="text-base font-semibold">
                            Price: ₹ {item.itemPrice}
                          </p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 text-white text-lg px-4 py-2 rounded focus:bg-slate-900 focus:border-2 focus:border-red-600 focus:text-red-500"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="justify-center items-center flex mt-8">
                <button
                  className="bg-white text-lg font-bold text-slate-900 px-6 py-3 rounded focus:bg-slate-900 focus:border-2 focus:border-white focus:text-white"
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
                {showForm && (
                  <MenuItemForm
                    token={token}
                    showForm={showForm}
                    setShowForm={setShowForm}
                  />
                )}
              </div>
            </>
          )
        )}
      </div>
      {confirmDelete && (
        <Confirm
          message="Are you sure you want to delete this item?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default MenuPage;
