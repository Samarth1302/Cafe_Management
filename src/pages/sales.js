import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

const GET_MONTHLY_SALES = gql`
  query GetMonthlySales($selectedMonth: Int, $selectedYear: Int) {
    getMonthlySales(
      selectedMonth: $selectedMonth
      selectedYear: $selectedYear
    ) {
      avgOrderCompletionTime
      month
      numberOfOrdersMonthly
      totalSales
      year
      avgOrderValue
      bestSellingCategory
      busyTime
      topSellingItems {
        itemName
        totalQuantity
      }
    }
  }
`;

const Sales = (user) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const { loading, error, data, refetch } = useQuery(GET_MONTHLY_SALES, {
    variables: { selectedMonth, selectedYear },
  });
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
  }, [selectedMonth, selectedYear]);
  const handleDateChange = (date) => {
    setSelectedDate(date);
    refetch({
      selectedMonth: date.getMonth() + 1,
      selectedYear: date.getFullYear(),
    });
  };
  const getRoundedAverageTime = () => {
    if (data && data.getMonthlySales) {
      const avgTimeInSeconds = data.getMonthlySales.avgOrderCompletionTime;
      const avgTimeInMinutes = Math.ceil(avgTimeInSeconds / 60);
      const hours = Math.floor(avgTimeInMinutes / 60);
      const remainingMinutes = avgTimeInMinutes % 60;

      return { hours, minutes: remainingMinutes };
    }
    return null;
  };
  const formatBusiestTimeIST = () => {
    if (data && data.getMonthlySales) {
      const busiestTimeInHours = data.getMonthlySales.busyTime;
      const busiestTimeIST = new Date();
      busiestTimeIST.setHours(busiestTimeInHours, 0, 0);
      const formattedTimeIST = busiestTimeIST.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });

      return formattedTimeIST;
    }
    return null;
  };
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-5 py-6 mx-auto">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {!loading && user.role === "admin" && (
        <div className="w-full max-w-3xl -mt-32 overflow-y-auto">
          <p className="text-3xl font-bold mb-6 text-center">
            Monthly Sales Data Dashboard
          </p>
          <div className="flex justify-center mb-10">
            <DatePicker
              selected={selectedDate}
              className="bg-slate-800 px-4 py-2 text-center border border-white rounded-md mr-4"
              onChange={handleDateChange}
              showMonthYearPicker
              dateFormat="MM/yyyy"
              style={{ background: "#333", color: "#fff" }}
            />
          </div>
          {data && data.getMonthlySales ? (
            <div className="space-y-6 text-center">
              <p className="text-xl font-semibold">
                {new Date(selectedDate).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-lg font-semibold">
                  Total Sales: ₹ {data.getMonthlySales.totalSales}
                </p>
                <p className="text-lg font-semibold">
                  Number of Orders: {data.getMonthlySales.numberOfOrdersMonthly}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-lg font-semibold">
                  Average Serve Time:{" "}
                  {getRoundedAverageTime()?.hours === 0
                    ? `${getRoundedAverageTime()?.minutes} minutes`
                    : `${getRoundedAverageTime()?.hours} hours ${
                        getRoundedAverageTime()?.minutes
                      } minutes`}
                </p>
                <p className="text-lg font-semibold">
                  Best Selling Category:{" "}
                  {data.getMonthlySales.bestSellingCategory}
                </p>
                <p className="text-lg font-semibold">
                  Busiest Time: {formatBusiestTimeIST()} IST
                </p>
                <p className="text-lg font-semibold">
                  Average Order Value: ₹
                  {data.getMonthlySales.avgOrderValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold">Top Selling Items</p>
                <ul>
                  {data.getMonthlySales.topSellingItems.map((item) => (
                    <li key={item.itemName} className="text-sm">
                      {item.itemName} ({item.totalQuantity})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center mt-6">
              <Image
                src="/no-data.jpg"
                alt="No sales data for this month"
                width={300}
                height={180}
                className="mx-auto"
              />
              <p className="text-lg text-white mt-6">
                No sales data available for the selected month.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales;
