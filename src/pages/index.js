import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";

const Home = ({ user, cart, addtoCart, removefromCart }) => {
  const GET_ALL_ITEMS = gql`
    query AllItems {
      allItems {
        id
        itemName
        itemDesc
        itemGrp
        itemImage
        itemPrice
      }
    }
  `;

  const [loadingData, setLoadingData] = useState(true);
  const { error, data } = useQuery(GET_ALL_ITEMS);
  const [items, setItems] = useState([]);

  const handleButton = () => {
    if (!user.email) {
      return toast.error("Please login first to order items", {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      addtoCart(item.id, item.itemName, 1, item.itemPrice);
    }
  };
  useEffect(() => {
    if (data) {
      setItems(data.allItems);
      setLoadingData(false);
    }
  }, [data]);
  if (error) {
    return toast.error(error.message, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
  return (
    <>
      <Head>
        <title>Cafe-management</title>
        <meta name="description" content="." />
        <meta name="keywords" content="" />
        <link rel="icon" />
      </Head>
      <ToastContainer
        position="top-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="min-h-screen bg-slate-900 text-white flex flex-auto px-5 py-24 mx-auto">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-black/40">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="lg:w-1/4 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-5"
            >
              <div className="flex mt-4 text-center">
                <div className="mr-4">
                  <Image
                    className="m-auto block"
                    src={item.itemImage}
                    alt={item.itemName}
                    width={100}
                    height={80}
                  ></Image>
                </div>
                <div className="text-left">
                  <h3 className="text-white text-lg mb-1">{item.itemName}</h3>
                  <p className="text-white text-sm "> {item.itemDesc}</p>
                  <p className="mt-1 text-sm">₹ {item.itemPrice}</p>
                  <button
                    onClick={handleButton}
                    className="flex m-2 text-sm text-white bg-slate-700 
                  border-white border-2 py-1  md:px-2 focus:outline-none hover:bg-slate-600 rounded "
                  >
                    Add it!
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
export default Home;
