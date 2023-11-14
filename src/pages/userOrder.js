import React, { useEffect, useState } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useQuery } from "@apollo/client";

const GET_USER_ORDERS = gql`
  query UserOrders {
    userOrders {
      id
      createdAt
      customerName
      status
      totalAmount
    }
  }
`;

const UserOrder = ({ user }) => {
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
  const formatStringToDateString = (dateString) => {
    try {
      if (!dateString) {
        return "Invalid Date";
      }
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (data) {
      setOrders(data.userOrders);
      setLoadingData(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message, {
        position: "top-left",
        autoClose: 1000,
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
                    <p className="text-base">
                      Date: {formatStringToDateString(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right justify-normal lg:pr-8 py-2">
                    {order.status === "pending" && (
                      <p className="text-base text-yellow-400">
                        {order.status}
                      </p>
                    )}
                    {order.status === "completed" && (
                      <p className="text-base text-green-600">{order.status}</p>
                    )}
                    {order.status === "cancelled" && (
                      <p className="text-base text-red-700">{order.status}</p>
                    )}

                    <p className="text-base ">Total: ₹{order.totalAmount}</p>
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

export default UserOrder;
