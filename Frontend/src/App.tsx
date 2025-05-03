import { Bounce, ToastContainer } from "react-toastify";
import { Route, Routes, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import MainLayout from "./layout/MainLayout";
import LoadingScreen from "@/layout/components/share-components/LoadingScreen";
import useAuthStore from "./stores/useAuthStore";
import RoomAndSuitesPage from "./pages/Room and suites page/RoomAndSuitesPage";
import VerifyAdminOtpPage from "./pages/Authentication page/VerifyAdminOtpPage";
import RoomInformationPage from "./pages/Room and suites page/RoomInformationPage";
import PageNotFound from "./pages/404-page-not-found/PageNotFound";
import FacilitiesPage from "./pages/Facilities page/FacilitiesPage";
import LoginPagePopUp from "./pages/Authentication page/LoginPagePopUp";
import SignupPagePopUp from "./pages/Authentication page/SignupPagePopUp";
import EventPage from "./pages/Event Page/EventPage";
import ContactUsPage from "./pages/Contact Us page/ContactUsPage";
import FilteredRoomsPage from "./pages/Filtered room page/FilteredRoomPage";
import BookingCheckOutPage from "./pages/Booking Page/BookingCheckOutPage";
import RouteProvider from "@/provider/RouteProvider";
import PaymentSuccess from "./layout/components/payment-transaction/PaymentSuccess";
import PaymentCancelled from "./layout/components/payment-transaction/PaymentCancelled";
import BookingDisplayPage from "./pages/Booking display page/BookingDisplayPage";

const App = () => {
  const { user, showLoginPopup, showSignupPopup } = useAuthStore();

  return (
    <>
      {/* public route */}
      {/* Always mounted popups at top-level */}
      {showLoginPopup && !user && <LoginPagePopUp />}
      {showSignupPopup && !user && <SignupPagePopUp />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Public routes */}
        <Route path="/filter-room" element={<FilteredRoomsPage />} />
        <Route
          path="/booking/confirm/:sessionId"
          element={<BookingCheckOutPage />}
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />

        <Route element={<MainLayout />}>
          <Route path="home" element={<Homepage />} />
          <Route path="room-suite" element={<RoomAndSuitesPage />} />
          <Route
            path="/room-suite/room/:id"
            element={<RoomInformationPage />}
          />
          <Route path="facilities" element={<FacilitiesPage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route
            path="/verify-admin-otp"
            element={
              <RouteProvider>
                <VerifyAdminOtpPage />
              </RouteProvider>
            }
          />
          <Route
            path="/loading"
            element={
              <RouteProvider>
                <LoadingScreen />
              </RouteProvider>
            }
          />
        </Route>
        <Route 
            path="/display-booking" 
            element={
              <RouteProvider>
                <BookingDisplayPage />
              </RouteProvider>
            }
          />
        {/* Catch-all route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
};

export default App;
