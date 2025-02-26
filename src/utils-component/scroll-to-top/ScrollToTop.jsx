import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Khi chuyển trang, cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300); // Hiện nút khi cuộn xuống 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="scroll_to_top">
      {showButton && (
        <button onClick={scrollToTop} className="button_scroll">
          <i className="fa-solid fa-circle-up"></i>
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
