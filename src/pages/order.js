import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useRouter } from "next/router";
import { gql, useMutation } from "@apollo/client";

const PLACE_ORDER = gql`
  mutation PlaceOrder($orderInput: orderInput) {
    placeOrder(orderInput: $orderInput) {
      createdAt
      customerName
      status
    }
  }
`;

const Order = ({ user, cart, total, addtoCart, removefromCart, clearCart }) => {
  const calculateItemTotal = (qty, price) => {
    return qty * price;
  };
  const [customerName, setCustomerName] = useState(user.username);
  const handleInputChange = (e) => {
    setCustomerName(e.target.value);
  };
  const router = useRouter();
  const iconStyle = {
    color: "yellow",
    cursor: "pointer",
  };

  const [placeOrder] = useMutation(PLACE_ORDER);
  const handleAdClick = () => {
    router.push(process.env.NEXT_PUBLIC_HOST);
  };
  const itemsArray = Object.keys(cart).map((key) => {
    const item = cart[key];
    return {
      name: item.name,
      quantity: item.qty,
      price: item.price,
    };
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("myUser"));
    try {
      const { data, errors } = await placeOrder({
        variables: {
          orderInput: {
            customerName: customerName,
            items: itemsArray,
            totalAmount: total,
          },
        },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      if (errors) {
        console.error(errors);
      }
      if (data.placeOrder.status === "pending") {
        toast.success("Yayy! Order placed", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        clearCart();
        setTimeout(() => {
          router.push(`${process.env.NEXT_PUBLIC_HOST}/userOrder`);
        }, 1000);
      } else {
        toast.error("Did not receive server data", {
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
    } catch (error) {
      toast.error(error.message, {
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
  };
  return (
    <>
      <Head>
        <title>Your Order</title>
        <meta name="description" content="Your order details." />
        <link rel="icon" href="/favicon.ico" />
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
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        {user.role !== "customer" && (
          <div className="w-full justify-center flex flex-row text-center p-2">
            <p className=" content-center my-2 px-4">Customer Name:</p>
            <input
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={handleInputChange}
              className="bg-white text-slate-900 px-4 py-2 mb-4 rounded"
            />
          </div>
        )}
        <div className="w-full max-w-2xl">
          {Object.keys(cart).map((k) => {
            const item = cart[k];
            return (
              <div key={k} className="my-4 p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-left lg:pl-10">
                    <h3 className="text-white text-lg">{item.name}</h3>
                    <p className="mt-1 text-base">Price: ₹ {item.price}</p>
                    <p className="text-base">Quantity: {item.qty}</p>
                  </div>
                  <div className="text-right lg:pr-8">
                    <div className="text-center space-x-2 text-2xl font-bold ml-6 flex flex-row">
                      <AiFillMinusCircle
                        style={iconStyle}
                        onClick={() => {
                          removefromCart(k, 1);
                        }}
                      />
                      <AiFillPlusCircle
                        style={iconStyle}
                        onClick={() => {
                          addtoCart(k, item.name, 1, item.price);
                        }}
                      />
                    </div>
                    <p className="text-lg mt-4 pr-2">
                      ₹ {calculateItemTotal(item.qty, item.price)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between">
            <button
              className="bg-white font-semibold text-slate-900 px-4 py-2 mt-4 rounded"
              onClick={handleAdClick}
            >
              Add More Items
            </button>
            <div className="text-white text-xl pr-4">
              <p>Total: ₹ {total}</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-white text-lg font-bold text-slate-900 px-6 py-3 rounded focus:bg-slate-900 focus:border-2 focus:border-white focus:text-white"
              onClick={handleSubmit}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
