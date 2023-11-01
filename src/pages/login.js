import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from "next/head";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const router = useRouter();

  useEffect(() => {}, []);

  const handleChange = (e) => {
    if (e.target.name == "email") {
      setEmail(e.target.value);
    }
    if (e.target.name == "password") {
      setPass(e.target.value);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    // const response = await fetch()
    //const result = await response.json();
    setEmail("");
    setPass("");
    if (result.success) {
      localStorage.setItem(
        "myUser",
        JSON.stringify({
          token: result.token,
          email: result.email,
        })
      );
      toast.success("Logged in successfully", {
        position: "top-left",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        router.push(`${process.env.NEXT_PUBLIC_HOST}`);
      }, 1000);
    } else {
      toast.error(result.error, {
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
  };
  return (
    <div>
      <Head>
        <title>Login - Cafe-Management</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
        <meta name="keywords" content="cafe order food " />
      </Head>
      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <section className="bg-black">
        <div className=" flex flex-col items-center justify-between px-6 py-6 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow  md:mt-24 sm:max-w-md xl:p-0">
            <div className="p-4 relative space-y-8 md:space-y-2 sm:p-8 border  rounded-lg">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl ">
                LOGIN
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                method="POST"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className="bg-black border-white-300 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-white "
                  >
                    Password
                  </label>
                  <input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    placeholder="••••••••"
                    className="bg-black border-white-300 border-2 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                    required=""
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4  accent-yellow-400 border border-white rounded bg-white focus:ring-3 focus:ring-primary-300"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-white">
                        Remember
                      </label>
                    </div>
                  </div>
                  <Link href="/forget" legacyBehavior>
                    <a className="text-sm font-medium text-primary-600 hover:underline text-yellow-300">
                      Forgot password?
                    </a>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-4 
    focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-base px-7 py-2 text-center"
                  >
                    Login
                  </button>
                </div>
                <p className="text-center text-sm font-medium text-white ">
                  Don't have an account yet ?{" "}
                  <Link href="/signup" legacyBehavior>
                    <a className="font-semibold text-white text-primary-600 hover:underline ">
                      Sign up
                    </a>
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
