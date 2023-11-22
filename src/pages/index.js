import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";

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
const Home = ({ user, cart, addtoCart, removefromCart }) => {
  const [loadingData, setLoadingData] = useState(true);
  const { error, data } = useQuery(GET_ALL_ITEMS);
  const [items, setItems] = useState([]);

  const router = useRouter();
  const handleButton = (item) => {
    if (!user.email) {
      toast.error("Please login first to order items", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        router.push("/login");
      }, 1000);
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

  useEffect(() => {
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

  return (
    <>
      <Head>
        <title>Cafe-management</title>
        <meta name="description" content="." />
        <meta name="keywords" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-wrap px-5 py-8 mx-auto">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="lg:w-1/5 md:w-1/3 p-4 w-96 h-48 cursor-pointer shadow-lg shadow-slate-800 m-5 rounded-lg border-slate-800 border-r-2"
            >
              <div className="flex mt-4 text-center">
                <div className="mr-4">
                  <Image
                    className="m-auto block"
                    src={item.itemImage}
                    alt={item.itemName}
                    width={140}
                    height={100}
                  ></Image>
                </div>
                <div className="text-left">
                  <h3 className="text-white text-lg">{item.itemName}</h3>
                  <p className="mt-1 text-base">₹ {item.itemPrice}</p>
                  <p className="text-base">
                    In cart: {cart[item.id] ? cart[item.id].qty : 0}
                  </p>
                  <button
                    onClick={() => handleButton(item)}
                    className="flex m-2 text-sm text-white bg-slate-700 
                  border-white border-2 py-1  px-2 focus:outline-none hover:bg-slate-600 rounded "
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <div className="justify-center mt-4">
          {!loadingData && (
            <Link href={"/order"} legacyBehavior>
              <button
                disabled={Object.keys(cart).length === 0 || !user.email}
                className="bg-white text-lg font-bold text-slate-900 px-6 py-3 rounded focus:bg-slate-900 focus:border-2 focus:border-white focus:text-white disabled:bg-slate-900 disabled:border-white disabled:border-2 disabled:text-slate-600 disabled:hover:cursor-not-allowed"
              >
                Finalize Order
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default Home;
