import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      orderServedAt
      orderCompletedAt
      status
      totalAmount
      id
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation OrderStatus($orderId: ID!, $newStatus: String!) {
    changeOrderStatus(orderId: $orderId, newStatus: $newStatus) {
      createdAt
      status
      orderServedAt
      orderCompletedAt
    }
  }
`;
const Summary = ({ user }) => {
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { slug } = router.query;
  const [order, setOrder] = useState([]);

  const { error, data } = useQuery(GET_ORDER, {
    variables: { orderId: slug },
    context: {
      headers: {
        authorization: token || "",
      },
    },
  });
  useEffect(() => {
    if (data) {
      setOrder(data.findOrder);
      setLoadingData(false);
    }
  }, [data]);

  const handleGoBack = () => {
    router.push("/userOrder");
  };

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

  const [updateOrder] = useMutation(UPDATE_ORDER);

  const handleButton = async (stat) => {
    try {
      const { data } = await updateOrder({
        variables: { orderId: slug, newStatus: stat },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      if (data) {
        toast.success("Order status updated", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push(`/ord/${slug}`);
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
  };

  return (
    <>
      <Head>
        <title>Order Summary</title>
        <meta name="description" content="Order summary details" />
        <meta name="keywords" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            <div className="mt-4">
              <button
                className="bg-white text-sm font-bold text-slate-900 px-2 py-3 rounded focus:bg-slate-900 focus:border-2 focus:border-white focus:text-white"
                onClick={handleGoBack}
              >
                Back to Orders
              </button>
            </div>
            <div key={order.id} className="my-4 p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-left lg:pl-10">
                  <h3 className="text-white text-lg">
                    Username: {order.customerName}
                  </h3>
                  <h3 className="text-white text-base">Order ID: {order.id}</h3>
                </div>
                <div className="text-right justify-normal lg:pr-8 py-2">
                  {order.status === "Pending" && (
                    <p className="text-base text-yellow-400">{order.status}</p>
                  )}
                  {order.status === "Completed" && (
                    <p className="text-base text-green-600">{order.status}</p>
                  )}
                  {order.status === "Preparing" && (
                    <p className="text-base text-blue-300">{order.status}</p>
                  )}
                  {order.status === "Prepared" && (
                    <p className="text-base text-blue-400">{order.status}</p>
                  )}
                  {order.status === "Served" && (
                    <p className="text-base text-blue-500">{order.status}</p>
                  )}
                  {order.status === "Cancelled" && (
                    <p className="text-base text-red-700">{order.status}</p>
                  )}
                  <p className="text-base ">Total: ₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Cart Items:</h4>
                {order.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center mb-2"
                  >
                    <p className="text-base">{item.name}</p>
                    <p className="text-base">Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
              {user.role !== "customer" && (
                <div className="mt-10 text-white">
                  {order.status === "Pending" && (
                    <button
                      className="bg-blue-300 px-4 mx-2 my-3 py-2 font-bold border-2  text-black border-blue-300 hover:bg-slate-800 hover:border-blue-300 hover:text-white rounded"
                      onClick={() => handleButton("Preparing")}
                    >
                      Confirm Order
                    </button>
                  )}

                  {order.status === "Preparing" && (
                    <button
                      className="bg-blue-400 px-4 mx-2 my-3 py-2 font-bold border-2  text-black border-blue-400 hover:bg-slate-800 hover:border-blue-400 hover:text-white rounded"
                      onClick={() => handleButton("Prepared")}
                    >
                      Prepared
                    </button>
                  )}

                  {order.status === "Prepared" && (
                    <button
                      className="bg-blue-500 px-4 mx-2 my-3 py-2 font-bold border-2  text-black border-blue-500 hover:bg-slate-800 hover:border-blue-500 hover:text-white rounded"
                      onClick={() => handleButton("Served")}
                    >
                      Served
                    </button>
                  )}

                  {order.status === "Served" && (
                    <button
                      className="bg-green-500 px-4 mx-2 my-3 py-2 font-bold border-2  text-black border-green-500 hover:bg-slate-800 hover:border-green-500 hover:text-white rounded"
                      onClick={() => handleButton("Completed")}
                    >
                      Paid
                    </button>
                  )}
                  {order.status === "Pending" && (
                    <button
                      className="bg-red-400 px-4 mx-2 my-3 py-2 font-bold border-2  text-black border-red-400 hover:bg-slate-800 hover:border-red-400 hover:text-white rounded"
                      onClick={() => handleButton("Cancelled")}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Summary;
