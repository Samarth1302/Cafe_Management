import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Head from "next/head";

const GET_ORDER = gql`
  query FindOrder($orderId: ID!) {
    findOrder(orderId: $orderId) {
      createdAt
      customerName
      items {
        name
        price
        quantity
      }
      orderApprovedAt
      orderCompletedAt
      status
      totalAmount
      id
    }
  }
`;

const Summary = ({ order }) => {
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";
  const router = useRouter();
  const { orderId } = router.query;

  const { error, data } = useQuery(GET_ORDER, {
    variables: { orderId },
    context: {
      headers: {
        authorization: token || "",
      },
    },
  });
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

  const order = data.findOrder;
  return (
    <>
      <Head>
        <title>Order Summary</title>
        <meta name="description" content="Order summary details" />
        <meta name="keywords" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        <div className="w-full max-w-2xl">
          <div key={order.id} className="my-4 p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="text-left lg:pl-10">
                <h3 className="text-white text-lg">Order ID: {order.id}</h3>
              </div>
              <div className="text-right justify-normal lg:pr-8 py-2">
                {order.status === "Pending" && (
                  <p className="text-base text-yellow-400">{order.status}</p>
                )}
                <p className="text-base ">Total: ₹{order.totalAmount}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Cart Items:</h4>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <p className="text-base">{item.name}</p>
                  <p className="text-base">Quantity: {item.quantity}</p>
                </div>
              ))}
            </div>
            {order.status === "Pending" && (
              <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
                Confirm Order
              </button>
            )}
            <button className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Summary;
