import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQuery } from "@apollo/client";
import { gql } from "graphql-tag";

const ItemComponent = ({ item }) => {
  return (
    <div className="mt-4 text-center">
      <h3 className="text-white text-base tracking-widest title-font mb-1">
        {item.itemName}
      </h3>
      <p className="text-white  text-sm font-medium"> {item.itemDesc}</p>
      <p className="mt-1">Price: ₹{item.itemPrice}</p>
      <Image
        className="m-auto block"
        src={item.itemImage}
        alt={item.itemName}
        width={100}
        height={80}
      ></Image>
    </div>
  );
};
export default function Home() {
  const GET_ALL_ITEMS = gql`
    query AllItems {
      allItems {
        itemDesc
        itemGrp
        itemImage
        itemName
        itemPrice
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_ALL_ITEMS);
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (data) {
      setItems(data.allItems);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) {
    return toast.error(error.message, {
      position: "top-left",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
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
      <div className=" bg-slate-900 text-white flex flex-auto px-5 py-24 mx-auto">
        {items.map((item) => (
          <div className="lg:w-1/4 md:w-1/3 p-4 w-full cursor-pointer shadow-lg m-5">
            <ItemComponent key={item.itemName} item={item} />
          </div>
        ))}
      </div>
    </>
  );
}
