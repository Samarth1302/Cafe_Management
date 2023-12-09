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
    }
  }
`;

const Sales = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth() + 1;
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
      selectedMonth: date.getMonth(),
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
  return (
    <>
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center flex-wrap px-5 py-6 mx-auto overflow-x-hidden">
        {loading ? (
          <div className="fixed top-0 left-0 w-screen h-screen z-[99999999999999] flex items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="w-full max-w-2xl overflow-y-auto flex-auto">
            <p className="text-white text-2xl text-center">
              Monthly Sales Data Dashboard
            </p>
            <div className="flex justify-center mt-4">
              <DatePicker
                selected={selectedDate}
                className="bg-slate-800 px-2 py-1 text-center w-36 border border-white rounded-md mr-4"
                onChange={handleDateChange}
                showMonthYearPicker
                dateFormat="MM/yyyy"
                style={{ background: "#333", color: "#fff" }}
              />
            </div>
            {data && data.getMonthlySales ? (
              <div className="mt-6 space-y-4 text-center">
                <p className="text-lg">
                  Total Sales: {data.getMonthlySales.totalSales}
                </p>
                <p className="text-lg">
                  Number of Orders: {data.getMonthlySales.numberOfOrdersMonthly}
                </p>
                <p className="text-lg">
                  Average Order Completion Time:{" "}
                  {getRoundedAverageTime()?.hours} hours{" "}
                  {getRoundedAverageTime()?.minutes} minutes
                </p>
                <p className="text-lg">
                  Month: {data.getMonthlySales.month}, Year:{" "}
                  {data.getMonthlySales.year}
                </p>
              </div>
            ) : (
              <div>
                <Image
                  src="/no-data.jpg"
                  alt="No sales data for this month"
                  width={300}
                  height={180}
                  className="mx-auto mt-6"
                />
                <p className="text-center justify-center text-white text-lg mt-6 mb-6">
                  No sales data available for the selected month.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Sales;
