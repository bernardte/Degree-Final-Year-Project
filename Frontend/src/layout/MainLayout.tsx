import { Outlet } from "react-router-dom";
import Navbar from "./components/share-components/Navbar";
import Footer from "./components/share-components/Footer";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const [ displayToTopButton, setDisplayToTopButton ] = useState(false);
  const isCheckoutPage = window.location.pathname.includes("/booking/confirm/");
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1300) {
        setDisplayToTopButton(true);
      } else {
        setDisplayToTopButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [window.scrollY]);

  const scrollToTop = () => {
    window.scrollTo({"behavior": "smooth", top: 0});
  }

  return (
    <div className="m-0 min-h-screen w-full overflow-x-hidden p-0">
      {!isCheckoutPage && <Navbar /> }
      <Outlet />
      {displayToTopButton && (
        <div
          onClick={scrollToTop}
          className="animate-fadeInUp fixed right-5 bottom-10 z-50 h-16 w-16 translate-y-0 transform cursor-pointer rounded-full bg-gradient-to-br from-cyan-500/80 to-blue-500/80 text-white opacity-100 shadow-[0_6px_15px_rgba(0,0,0,0.3),_inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md transition-all duration-500 ease-in-out hover:scale-110 hover:shadow-[0_8px_18px_rgba(0,0,0,0.4),_inset_0_2px_4px_rgba(255,255,255,0.2)]"
        >
          <span className="flex h-full items-center justify-center text-3xl font-bold drop-shadow-sm">
            ↑
          </span>
        </div>
      )}
      {!isCheckoutPage && <Footer /> }
    </div>
  );
};

export default MainLayout;
