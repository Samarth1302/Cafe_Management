import React, { useEffect } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
const Confirm = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-95 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-slate-900 rounded-lg shadow-md p-6">
          <div className="flex justify-end mb-1">
            <button
              onClick={onCancel}
              className="text-white text-2xl cursor-pointer focus:outline-1"
            >
              <AiOutlineCloseCircle />
            </button>
          </div>
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-red-400">
            Confirm action
          </h1>
          <p className="text-white text-center mt-2 mb-4">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                onConfirm();
              }}
              className="bg-red-400 hover:bg-red-500 text-black font-medium rounded-lg px-4 py-1 focus:outline-none"
            >
              Yes
            </button>
            <button
              onClick={() => {
                onCancel();
              }}
              className="bg-gray-600 hover:bg-gray-800 text-white font-medium rounded-lg px-4 py-1 focus:outline-none"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
