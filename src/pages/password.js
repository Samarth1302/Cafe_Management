import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useMutation } from "@apollo/client";
import Head from "next/head";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const CHANGE_PASSWORD = gql`
    mutation ChangePassword($currentPassword: String, $newPassword: String) {
      changePassword(
        currentPassword: $currentPassword
        newPassword: $newPassword
      ) {
        message
        success
      }
    }
  `;
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";

  const [showCPass, setshowCPass] = useState(false);
  const [showNPass, setshowNPass] = useState(false);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentPassword == newPassword) {
      toast.error("New password should be different than current pasword", {
        position: "top-left",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      try {
        const { data } = await changePassword({
          variables: { currentPassword, newPassword },
          context: {
            headers: {
              authorization: token || "",
            },
          },
        });

        if (data.changePassword.success) {
          toast.success(data.changePassword.message, {
            position: "top-left",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          router.push("/");
          setCurrentPassword("");
          setNewPassword("");
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
    }
  };

  return (
    <div>
      <Head>
        <title>Change Password - Cafe-Management</title>
        {/* Add meta tags as needed */}
      </Head>
      <section className=" bg-slate-900">
        <div className="flex flex-col items-center justify-between px-6 py-6 mx-auto h-screen lg:py-0">
          <div className="w-full rounded-lg shadow md:mt-24 sm:max-w-md xl:p-0">
            <div className="p-4 relative space-y-8 md:space-y-2 sm:p-8 border  rounded-lg">
              <h1 className="text-xl mb-10 text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl ">
                CHANGE PASSWORD
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
                    htmlFor="currentPassword"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCPass ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    />
                    <span
                      onClick={() => setshowCPass(!showCPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-xl text-white cursor-pointer"
                    >
                      {showCPass ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block mb-2 text-sm font-medium text-white "
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNPass ? "text" : "password"}
                      name="newPassword"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      required
                    />
                    <span
                      onClick={() => setshowNPass(!showNPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-xl text-white cursor-pointer"
                    >
                      {showNPass ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-2 focus:outline-none focus:ring-white font-medium rounded-lg text-base px-7 py-2 text-center disabled:hover:cursor-not-allowed"
                  >
                    Change
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChangePassword;
