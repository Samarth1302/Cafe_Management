import React, { useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const buttonRef = useRef(null);

  const LOGIN_USER = gql`
    mutation Login($loginInput: loginInput) {
      login(loginInput: $loginInput) {
        token
      }
    }
  `;

  const [loginUser] = useMutation(LOGIN_USER);
  const handleChange = (e) => {
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
      const { data } = await loginUser({
        variables: { loginInput: { email: email, password: password } },
      });
      if (data.login.token) {
        localStorage.setItem("myUser", JSON.stringify(data.login.token));
        toast.success("Logged in successfully", {
          position: "top-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setEmail("");
        setPass("");
        setTimeout(() => {
          router.push(process.env.NEXT_PUBLIC_HOST);
        }, 1000);
      } else {
        toast.error("Did not receive server data", {
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
    } catch (error) {
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
      setPass("");
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
      <section className=" bg-slate-900">
        <div className=" flex flex-col items-center justify-between px-6 py-6 mx-auto h-screen lg:py-0">
          <div className="w-full rounded-lg shadow  md:mt-24 sm:max-w-md xl:p-0">
            <div className="p-4 relative space-y-8 md:space-y-2 sm:p-8 border  rounded-lg">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl ">
                LOGIN
              </h1>
              <form
                id="loginForm"
                onSubmit={handleSubmit}
                className="space-y-4 md:space-y-6"
                method="POST"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    buttonRef.current.focus();
                    handleSubmit(e);
                  }
                }}
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
                    className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
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
                      className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full pr-10 p-2.5"
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
                <div className="flex items-center justify-between">
                  <Link href="/forget" legacyBehavior>
                    <a className="text-sm font-medium text-primary-600 hover:underline text-yellow-300">
                      Forgot password?
                    </a>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    ref={buttonRef}
                    disabled={!password || !email}
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-2 
    focus:outline-none focus:ring-white font-medium rounded-lg text-base px-7 py-2 text-center disabled:hover:cursor-not-allowed"
                  >
                    Login
                  </button>
                </div>
                <p className="text-center text-sm font-medium text-white ">
                  Don't have an account yet ?{" "}
                  <Link href="/signup" legacyBehavior>
                    <a className="font-semibold text-yellow-200 text-primary-600 hover:underline ">
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
