import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { gql, useQuery, useMutation } from "@apollo/client";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useRouter } from "next/router";

const GET_EMPLOYEES = gql`
  query GetEmployees {
    getEmployees {
      username
      email
      password
      role
      id
    }
  }
`;

const ADD_EMPLOYEE = gql`
  mutation RegisterEmployee($signupInput: signupInput) {
    registerEmployee(signupInput: $signupInput) {
      email
      password
      role
      token
      username
    }
  }
`;

const EmployeeForm = ({ token, showForm, setShowForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const [addEmployee] = useMutation(ADD_EMPLOYEE);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const iconStyle = {
    color: "yellow",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addEmployee({
        variables: {
          signupInput: {
            email: formData.email,
            password: formData.password,
            username: formData.username,
          },
        },
        context: {
          headers: {
            authorization: token || "",
          },
        },
      });
      if (data) {
        toast.success("Employee added", {
          position: "top-left",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        router.push("/employee");
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
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setShowForm(false);
  };

  const buttonRef = useRef();
  const formRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, setShowForm]);

  return (
    <div>
      {showForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-95 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-slate-900 rounded-lg shadow-md p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-yellow-300 md:text-2xl">
                REGISTER EMPLOYEE
              </h1>
              <form
                ref={formRef}
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
                {" "}
                <div>
                  <label
                    htmlFor="username"
                    className="block mt-2 mb-2 text-sm font-medium text-white"
                  >
                    Username
                  </label>
                  <input
                    onChange={handleChange}
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    className="bg-slate-900 border-white-300 border-2 text-white 0 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
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
                    value={formData.email}
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
                      value={formData.password}
                      className="bg-slate-900 border-white-300 border-2 text-white sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  "
                      required=""
                    />
                    <span
                      onClick={handlePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 text-xl text-white cursor-pointer"
                    >
                      {showPassword ? (
                        <AiFillEye style={iconStyle} />
                      ) : (
                        <AiFillEyeInvisible style={iconStyle} />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    ref={buttonRef}
                    disabled={
                      !formData.username ||
                      !formData.password ||
                      !formData.email
                    }
                    className="w-auto text-black bg-yellow-300 hover:bg-yellow-500 focus:ring-2 
    focus:outline-none focus:ring-white font-medium rounded-lg text-base px-7 py-2 text-center disabled:hover:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeePage = ({ user }) => {
  const check = typeof window !== "undefined" && window.localStorage;
  const token = check ? JSON.parse(localStorage.getItem("myUser")) : "";

  const [loadingData, setLoadingData] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { error, data } = useQuery(GET_EMPLOYEES);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    if (data) {
      setEmployees(data.getEmployees);
      setLoadingData(false);
    }
  }, [data]);

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

  const handleButton = async () => {
    setShowForm(true);
  };

  return (
    <>
      <Head>
        <title>Employee Page</title>
      </Head>
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-8">
        {loadingData ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          user.role === "admin" && (
            <div className="w-full max-w-2xl overflow-y-auto flex-auto">
              <p className="text-white text-2xl text-center">Employees</p>
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="my-4 p-4 bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left lg:pl-10">
                      <h3 className="text-white text-base">
                        UserName: {employee.username}
                      </h3>
                      <p className="text-base">Email: {employee.email}</p>
                      <p className="mt-1 text-sm">ID: {employee.id}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="justify-center items-center flex mt-8">
                <button
                  className="bg-white text-lg font-bold text-slate-900 px-6 py-3 rounded focus:bg-slate-900 focus:border-2 focus:border-white focus:text-white"
                  onClick={handleButton}
                >
                  Add Employee
                </button>
                {showForm && (
                  <EmployeeForm
                    token={token}
                    showForm={showForm}
                    setShowForm={setShowForm}
                  />
                )}
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default EmployeePage;
