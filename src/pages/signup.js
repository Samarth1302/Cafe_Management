import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {
  const [username, setUname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const REGISTER_USER = gql`
    mutation Signup($signupInput: signupInput) {
      signup(signupInput: $signupInput) {
        token
      }
    }
  `;

  const [registerUser] = useMutation(REGISTER_USER);
  const handleChange = (e) => {
    if (e.target.name == "username") {
      setUname(e.target.value);
    }
    if (e.target.name == "email") {
      setEmail(e.target.value);
    }
    if (e.target.name == "password") {
      setPass(e.target.value);
    }
  };
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await registerUser({
        variables: {
          signupInput: { email: email, password: password, username: username },
        },
      });
      if (data.signup.token) {
        localStorage.setItem("myUser", JSON.stringify(data.signup.token));
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
          router.push(process.env.NEXT_PUBLIC_HOST);
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
          theme: "light",
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
        theme: "light",
      });
    }
    setEmail("");
    setUname("");
    setPass("");
  };
  return (
    <div>
      <Head>
        <title>Signup - Cafe-Management</title>
        <meta
          username="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
        <meta username="keywords" content="food order cafe eat" />
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
      <section className=" bg-slate-900">
        <div className=" flex flex-col items-center justify-between px-6 py-6 mx-auto h-screen lg:py-0">
          <div className="w-full rounded-lg shadow  md:mt-24 sm:max-w-md xl:p-0">
            <div className="p-4 relative space-y-8 md:space-y-2 sm:p-8 border  rounded-lg">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl  ">
                SIGN-UP
              </h1>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                method="POST"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Username
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    className="bg-slate-900 border-white-300 border-2 text-white 0 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                    placeholder="user123"
                    required=""
                  />
                </div>
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
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
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
                  <div className="relative">
                    <input
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={password}
                      placeholder="••••••••"
                      className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                      required=""
                    />
                    <span
                      onClick={handlePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-xl text-white cursor-pointer"
                    >
                      {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-4 
    focus:outline-none focus:ring-yellow-200 font-medium rounded-lg text-base px-7 py-2 text-center"
                  >
                    Sign-Up
                  </button>
                </div>
                <p className=" text-center text-sm font-medium text-white ">
                  Already a registered user ?{" "}
                  <Link href="/login" legacyBehavior>
                    <a className="font-semibold text-white text-primary-600 hover:underline ">
                      Login
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

export default Signup;
