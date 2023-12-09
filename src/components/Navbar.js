import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import {
  AiOutlineCloseCircle,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { FiAlignJustify } from "react-icons/fi";
import { useRouter } from "next/router";

const Navbar = ({
  user,
  cart,
  addtoCart,
  removefromCart,
  clearCart,
  total,
  logout,
}) => {
  const [sidebar, setSidebar] = useState(false);
  const router = useRouter();
  const [hamMenu, setHam] = useState(false);
  const [hamHovered, setHamHovered] = useState(false);
  const [cartCount, setCartCount] = useState(Object.keys(cart).length);
  const toggleCart = () => {
    setSidebar(!sidebar);
    setHam(false);
  };
  const toggleHam = () => {
    setHam(!hamMenu);
    setSidebar(false);
  };
  const closeBoth = () => {
    setHam(false);
    setSidebar(false);
  };
  useEffect(() => {
    setCartCount(Object.keys(cart).length);
  }, [cart]);

  const ref = useRef();

  const iconStyle = {
    color: "yellow",
    marginTop: "-8px",
  };

  return (
    <>
      <div
        className={`flex flex-col md:justify-start sm:justify-center items-start border-blue-50 py-2 shadow-md sticky top-0 z-10 pb-4 pt-4 bg-slate-950 ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="relative left-5 mx-2 flex content-end md:mx-2">
          <div className="text-3xl items-center py-1 mr-5">
            <FiAlignJustify
              className={`text-xl md:text-3xl ${hamHovered ? "hovered" : ""}`}
              style={{
                color: hamHovered ? "white" : "#d3ad15",
                cursor: "pointer",
              }}
              onClick={toggleHam}
              onMouseOver={() => setHamHovered(true)}
              onMouseLeave={() => setHamHovered(false)}
            />
            {hamMenu && (
              <aside
                id="sidebar-multi-level-sidebar"
                className={`fixed top-0 left-0 z-40 w-56 h-screen transition-transform -translate-x-full sm:translate-x-0 left-ham-menu ${
                  hamMenu ? "translate-x-0" : ""
                }`}
                aria-label="Sidebar"
              >
                <div className="h-full px-3 py-4 overflow-y-auto bg-slate-800">
                  <span
                    onClick={toggleHam}
                    className="absolute top-5 right-2 cursor-pointer text-2xl"
                  >
                    <AiOutlineCloseCircle
                      size={30}
                      style={{ color: "white" }}
                    />
                  </span>
                  <ul className="space-y-6 mt-10 text-center justify-evenly text-lg text-white font-medium">
                    <Link href={"/"}>
                      <li className="my-3 hover:text-blue-400 hover:bg-slate-900 rounded-full">
                        Home
                      </li>
                    </Link>

                    {user.role === "admin" && (
                      <Link href={"/employee"}>
                        <li className="my-3 hover:text-teal-400 hover:bg-slate-900 rounded-full">
                          Employees
                        </li>
                      </Link>
                    )}
                    {user.email && (
                      <Link href={"/userOrder"}>
                        <li className="my-3 hover:text-green-400 hover:bg-slate-900 rounded-full">
                          Orders
                        </li>
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href={"/sales"}>
                        <li className="my-3 hover:text-yellow-400 hover:bg-slate-900 rounded-full">
                          Sales
                        </li>
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link href={"/menu"}>
                        <li className="my-3 hover:text-orange-400 hover:bg-slate-900 rounded-full">
                          Edit Menu
                        </li>
                      </Link>
                    )}
                    {user.email && (
                      <Link href={"/password"}>
                        <li className="my-3 hover:text-fuchsia-400 hover:bg-slate-900 rounded-full">
                          Password
                        </li>
                      </Link>
                    )}
                    {user.email && (
                      <Link href={"/"}>
                        <li
                          className="my-3 hover:text-red-400 hover:bg-slate-900 rounded-full"
                          onClick={logout}
                        >
                          Logout
                        </li>
                      </Link>
                    )}
                  </ul>
                </div>
              </aside>
            )}
          </div>
          <Link href={"/"}>
            <div className=" text-yellow-400 mr-2 md:text-3xl sm:text-sm">
              MICRO CAFE
            </div>
          </Link>
        </div>
        <div
          className={`cart items-center cursor-pointer absolute md:right-16  ${
            sidebar && "md:right-60 sm:right-2"
          } md:top-5 sm:top-6 sm:right-0 ml-56 flex`}
        >
          <div className="mr-3 flex flex-col items-center">
            <p
              className="text-yellow-400 text-sm md:text-base"
              style={{ marginTop: "-1rem" }}
            >
              {cartCount}
            </p>
            <BsCart2
              onClick={toggleCart}
              className="text-xl md:text-2xl"
              style={iconStyle}
            />
          </div>
          {user.email && (
            <div>
              <MdAccountCircle
                className="text-xl mt-0 mx-4 mr-6 md:text-2xl"
                style={iconStyle}
              />
              <p className="text-center justify-center text-yellow-300 text-xs">
                {user.username}
              </p>
            </div>
          )}
          {!user.email && (
            <button className="bg-yellow-400 px-2 md:py-1 rounded-md text-sm  font-bold text-black mx-4">
              <Link href={"/login"}>Login</Link>
            </button>
          )}{" "}
        </div>
        <div
          ref={ref}
          className={`w-60 h-[100vh] sidecart top-0 overflow-y-scroll absolute bg-slate-700 px-8 py-10 text-base transition-all text-slate-300 ${
            sidebar ? "right-0" : "-right-96"
          } `}
        >
          <h2 className="font-bold text-xl text-center text-slate-50">
            Food Cart
          </h2>
          <span
            onClick={toggleCart}
            className="absolute top-5 right-2 cursor-pointer text-2xl"
          >
            <AiOutlineCloseCircle style={{ color: "white" }} />
          </span>
          <ol className="list-decimal font-semibold ">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your cart is empty</div>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5 text-base">
                    <div className="w-2/3 font-semibold mx-4">
                      {cart[k].name}
                    </div>
                    <div className="flex items-center text-lg font-bold justify-center ">
                      <AiOutlineMinusCircle
                        onClick={() => {
                          removefromCart(k, 1, cart[k].price);
                        }}
                        className="cursor-pointer"
                      />
                      <span className="mx-2 text-sm">{cart[k].qty}</span>
                      <AiOutlinePlusCircle
                        onClick={() => {
                          addtoCart(k, cart[k].name, 1, cart[k].price);
                        }}
                        className="cursor-pointer disabled:cursor-not-allowed"
                        aria-disabled={cart[k] && cart[k].qty === 10}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <span className="font-bold">SubTotal: ₹ {total}</span>
          <div className="flex my-4">
            <Link href={"/order"} legacyBehavior>
              <button
                disabled={Object.keys(cart).length === 0 || !user.email}
                className=" disabled:bg-slate-800 disabled:text-white flex mr-2  disabled:hover:cursor-not-allowed bg-slate-200 border-0 py-2 px-1 
              text-black focus:outline-none hover:bg-slate-400 rounded text-sm"
              >
                Order
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={clearCart}
              className="  disabled:bg-slate-800 disabled:text-white flex disabled:hover:cursor-not-allowed bg-slate-200 border-0 py-2 px-1 
              text-black focus:outline-none hover:bg-slate-400 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
          {!user.email && (
            <span className="text-red-400 font-bold text-sm">
              Please login to add items
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
