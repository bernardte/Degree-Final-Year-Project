import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/share-components/Navbar";
import Footer from "./components/share-components/Footer";
import { useEffect, useState } from "react";
import ChatWidget from "./components/chat widget/ChatWidget";
import { ArrowUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MainLayout = () => {
  const [displayToTopButton, setDisplayToTopButton] = useState(false);
  const [showFloatingOptions, setShowFloatingOptions] = useState(false);
  const isCheckoutPage = window.location.pathname.includes("/booking/confirm/");
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setDisplayToTopButton(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  return (
    <div className="m-0 min-h-screen w-full overflow-x-hidden p-0">
      {!isCheckoutPage && <Navbar />}
      <Outlet />
      {!isCheckoutPage && <Footer />}

      {/* Floating Button Group */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-2">
        {/* AnimatePresence handles exit animation */}
        <AnimatePresence>
          {showFloatingOptions && (
            <motion.div
              key="floating-options"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-end gap-2"
            >
              {displayToTopButton && (
                <motion.button
                  key="scrollToTop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={scrollToTop}
                  className="group animate-fadeInUp focus:ring-opacity-50 flex h-14 w-14 transform items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Move To Top"
                >
                  <ArrowUp size={24} className="group-hover:animate-bounce" />
                </motion.button>
              )}

              <motion.div
                key="chat-widget"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
              
              >
                <ChatWidget />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button (always shown) */}
        <motion.button
          key="toggle-button"
          onClick={() => setShowFloatingOptions((prev) => !prev)}
          whileTap={{ scale: 0.9 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg transition-all hover:scale-110"
        >
          {showFloatingOptions ? (
            <X className="h-6 w-6" />
          ) : (
            <span className="text-2xl font-bold">⋮</span>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default MainLayout;
