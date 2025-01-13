import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const GoToTop = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    });
  }, []);

  // this function is used to scroll to the top of the page
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {showScroll && (
        <div
          onClick={scrollTop}
          className="fixed animate-bounce right-5 bottom-10 rounded-full hover:bg-red-600 bg-green-600 w-[40px] h-[40px] grid place-items-center cursor-pointer"
        >
          <FaArrowUp color="white" />
        </div>
      )}
    </div>
  );
};

export default GoToTop;
