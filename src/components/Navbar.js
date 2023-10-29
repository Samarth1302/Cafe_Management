import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import {
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from "next/router";

const Navbar = (
  user,
  cart,
  addtoCart,
  removefromCart,
  clearCart,
  total,
  logout
) => {
  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let nonSide = ["/"];
    if (nonSide.includes(router.pathname)) {
      setSidebar(false);
    }
  }, []);
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();
  const toggleCart = () => {
    setSidebar(!sidebar);
  };
  const ref = useRef();

  const iconStyle = {
    color: "yellow",
  };

  return (
    <>
      <div
        className={`flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 z-10 pb-6 bg-black ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="logo mx-2 mr-auto md:mx-2">
          <Link href={"/"}></Link>
        </div>
        <div className="nav text-yellow-400 text-lg">MICRO CAFE</div>
        <div className="cart items-center cursor-pointer absolute right-0 top-4 mx-5 flex">
          <BsCart2
            onClick={toggleCart}
            className=" text-xl md:text-2xl"
            style={iconStyle}
          />
          {user.value && (
            <Link href={"/orders"}>
              <MdAccountCircle
                className="text-xl mx-4 md:text-2xl"
                style={iconStyle}
              />
            </Link>
          )}
          {!user.value && (
            <Link href={"/login"}>
              <button className="bg-yellow-400 px-2 py-1 rounded-md text-sm text-black mx-4">
                Login / Sign-up
              </button>
            </Link>
          )}{" "}
        </div>
        <div
          ref={ref}
          className={`w-60 h-[100vh] sidecart top-0 overflow-y-scroll absolute bg-yellow-100 px-8 py-10 text-base transition-all ${
            sidebar ? "right-0" : "-right-96"
          } `}
        >
          <h2 className="font-bold text-xl text-center">Food Cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-5 right-2 cursor-pointer text-2xl"
          >
            <AiOutlineCloseCircle style={{ color: "black" }} />
          </span>
          <ol className="list-decimal font-semibold ">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your cart is empty</div>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5 ">
                    <div className="w-2/3 font-semibold mx-4">
                      {cart[k].iName} ({cart[k].size}/{cart[k].type})
                    </div>
                    <div className="flex items-center font-semibold justify-center w-1/3 ">
                      <AiOutlineMinusCircle
                        onClick={() => {
                          removefromCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].iName,
                            cart[k].size,
                            cart[k].type
                          );
                        }}
                        className="cursor-pointer"
                      />
                      <span className="mx-2 text-sm">{cart[k].qty}</span>
                      <AiOutlinePlusCircle
                        onClick={() => {
                          addtoCart(
                            k,
                            1,
                            cart[k].price,
                            cart[k].iName,
                            cart[k].size,
                            cart[k].type
                          );
                        }}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <span className="total font-bold">SubTotal: ₹{total}</span>
          <div className="flex my-4">
            <Link href={"/checkout"} legacyBehavior>
              <button
                disabled={Object.keys(cart).length === 0 || !user.value}
                className=" disabled:bg-yellow-200 flex mr-2  text-black bg-yellow-500 border-0 py-2 px-2 focus:outline-none hover:bg-yellow-600 rounded text-sm"
              >
                Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={clearCart}
              className="  disabled:bg-yellow-200 flex  bg-yellow-500 border-0 py-2 px-1 
              text-black focus:outline-none hover:bg-yellow-600 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
          {!user.value && (
            <span className="text-red-700 text-sm">
              Please login to buy a product
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
