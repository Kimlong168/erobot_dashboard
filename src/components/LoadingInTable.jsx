import { useEffect, useState } from "react";

// this component is used when we are fetching data to display in each table. it will show loading first
const LoadingInTable = () => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [time]);

  return (
    <>
      {time < 5 ? (
        <div className=" flex items-center justify-center gap-2">
          <div
            style={{ borderTopColor: "transparent" }}
            className="w-5 h-5 border-4 border-gray-800 dark:border-white rounded-full animate-spin"
          ></div>
          <span className="text-bold  text-gray-800 dark:text-white text-lg">
            Loading...
          </span>
        </div>
      ) : (
        <div className="text-bold text-gray-800 dark:text-white text-lg">
          No data
        </div>
      )}
    </>
  );
};

export default LoadingInTable;
