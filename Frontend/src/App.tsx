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
import AdminMainPage from "./pages/Admin main page/AdminMainPage";
import UnauthorizedPage from "./pages/401-unauthorized-page/UnauthorizedPage";
import RoleBasedProvider from "./provider/RoleBasedProvider";
import AdminPageMainLayout from "./layout/AdminPageMainLayout";
import AdminRoomPage from "./pages/Admin room page/AdminRoomPage";
import AdminEventsPage from "./pages/Admin events page/AdminEventsPage";
import CancelBookingPage from "./pages/Cancel booking page/CancelBookingPage";
import AdminFacilityPage from "./pages/Admin-facility-page/AdminFacilityPage";
import PendingBookingPage from "./pages/Pending booking page/PendingBookingPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { ROLE } from "./constant/roleList";
import AdminBookingCalendarPage from "./pages/AdminBookingCalendarPage/AdminBookingCalendarPage";
import AdminRewardSettingPage from "./pages/Admin reward update page/AdminRewardSettingPage";
import AdminRewardHistoryPage from "./pages/Admin reward update page/AdminRewardHistoryPage";
import AdminRewardRedemptionPage from "./pages/Admin reward update page/AdminRewardRedemptionPage";

const App = () => {
  const { user, showLoginPopup, showSignupPopup } = useAuthStore();


  return (
    <>
      {/* public route */}
      {/* Always mounted popups at top-level */}
      {showLoginPopup && !user && <LoginPagePopUp />}
      {showSignupPopup && !user && <SignupPagePopUp />}

      <Routes>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
            path="cancelled-booking-policy"
            element={<CancelBookingPage />}
          />
          <Route path="pending-booking" element={<PendingBookingPage />} />
        </Route>

        {/* User Login Route */}
        <Route element={<RouteProvider />}>
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/display-booking" element={<BookingDisplayPage />} />
        </Route>

        {/* Admin and SuperAdmin Routes */}
        <Route
          element={<RoleBasedProvider allowedRoles={[ROLE.Admin, ROLE.SuperAdmin]} />}
        >
          <Route element={<AdminPageMainLayout />}>
            <Route path="/verify-admin-otp" element={<VerifyAdminOtpPage />} />
            <Route path="/admin-portal" element={<AdminMainPage />} />
            <Route path="/admin-profile" element={<ProfilePage />} />
            <Route path="/admin-facility" element={<AdminFacilityPage />} />
            <Route path="/admin-booking-calendar" element={<AdminBookingCalendarPage />} />
            <Route path="/admin-room" element={<AdminRoomPage />} />
            <Route path="/admin-event" element={<AdminEventsPage />} />
            <Route path="/admin-reward-setting" element={<AdminRewardSettingPage />} />
            <Route path="/admin-reward-redemption" element={<AdminRewardRedemptionPage />} />
            <Route path="/admin-reward-history" element={<AdminRewardHistoryPage />} />
          </Route>
        </Route>

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
