import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useQuery } from "@apollo/client";

const GET_USER_ORDERS = gql`
  query UserOrders {
    userOrders {
      id
      createdAt
      customerName
      items {
        name
        quantity
        price
      }
      status
      totalAmount
    }
  }
`;

const userOrder = ({ user }) => {
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";
  const [loadingData, setLoadingData] = useState(true);
  const { error, data } = useQuery(GET_USER_ORDERS, {
    context: {
      headers: {
        authorization: token || "",
      },
    },
  });

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (data) {
      setOrders(data.userOrders);
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
        <title>User Orders</title>
        <meta name="description" content="." />
        <meta name="keywords" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-black/40">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {orders.map((order) => (
              <div key={order.id} className="my-4 p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-left lg:pl-10">
                    <h3 className="text-white text-lg">Order ID: {order.id}</h3>
                    <p className="mt-1 text-base">
                      Customer Name: {order.customerName}
                    </p>
                    <p className="text-base">Status: {order.status}</p>
                    <p className="text-base">Date: {order.createdAt}</p>
                  </div>
                  <div className="text-right lg:pr-8">
                    {order.items.map((item, index) => (
                      <div key={index}>
                        <p className="mt-1 text-base">{item.name}</p>
                        <p className="text-base">Quantity: {item.quantity}</p>
                        <p className="text-base">Price: ₹{item.price}</p>
                      </div>
                    ))}
                    <p className="text-lg mt-4 pr-2">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default userOrder;
