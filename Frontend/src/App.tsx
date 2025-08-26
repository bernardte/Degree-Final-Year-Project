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
import AdminRewardManagementPage from "./pages/Admin reward update page/AdminRewardManagementPage";
import RewardRedemptionPage from "./pages/Reward redemption page/RewardRedemptionPage";
import AdminRoomCalendarPage from "./pages/AdminRoomCalendarPage/AdminRoomCalendarPage";
import AdminEventCalendarPage from "./pages/AdminEventCalendarPage/AdminEventCalendarPage";
import AdminNotificationPage from "./pages/Admin notification page/AdminNotificationPage";
import NotificationProvider from "./provider/NotificationProvider";
import AdminChatPage from "./pages/Admin chat page/AdminChatPage";
import InvoiceDetail from "./layout/components/invoice-component/InvoiceDetail";
import ImageGalleryPage from "./pages/image galery page/ImageGalleryPage";
import FAQPage from "./pages/FAQ page/FAQPage";
import FacilityDetailPage from "./pages/Facilities page/FacilityDetail";
import AdminSettingPage from "./pages/Admin Setting Page/AdminSettingPage";
import ReservationCalendarView from "./layout/components/calendar/ReservationCalendarView";
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
          <Route
            path="facilities/facility/:facilityId"
            element={<FacilityDetailPage />}
          />
          <Route path="event" element={<EventPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route
            path="cancelled-booking-policy"
            element={<CancelBookingPage />}
          />
          <Route path="image-gallery" element={<ImageGalleryPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="pending-booking" element={<PendingBookingPage />} />
          <Route path="reward-redemption" element={<RewardRedemptionPage />} />
        </Route>

        {/* User Login Route */}
        <Route element={<RouteProvider />}>
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/display-booking" element={<BookingDisplayPage />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
        </Route>

        {/* Admin and SuperAdmin Routes */}
        <Route
          element={
            <RoleBasedProvider allowedRoles={[ROLE.Admin, ROLE.SuperAdmin]} />
          }
        >
          <Route
            element={
              <NotificationProvider>
                <AdminPageMainLayout />{" "}
              </NotificationProvider>
            }
          >
            <Route path="/verify-admin-otp" element={<VerifyAdminOtpPage />} />
            <Route path="/admin-portal" element={<AdminMainPage />} />
            <Route path="/admin-profile" element={<ProfilePage />} />
            <Route path="/admin-facility" element={<AdminFacilityPage />} />
            <Route
              path="/admin-booking-calendar"
              element={<AdminBookingCalendarPage />}
            />
            <Route
              path="/admin-deactivation-room-calendar"
              element={<AdminRoomCalendarPage />}
            />
            <Route
              path="/admin-event-request-calendar"
              element={<AdminEventCalendarPage />}
            />
            <Route
              path="/admin-reservation-calendar"
              element={<ReservationCalendarView />}
            />
            <Route path="/admin-room" element={<AdminRoomPage />} />
            <Route path="/admin-event" element={<AdminEventsPage />} />
            <Route
              path="/admin-reward-setting"
              element={<AdminRewardSettingPage />}
            />
            <Route
              path="/admin-reward-redemption"
              element={<AdminRewardManagementPage />}
            />
            <Route
              path="/admin-reward-history"
              element={<AdminRewardHistoryPage />}
            />
            <Route path="/admin-chat" element={<AdminChatPage />} />
            <Route
              path="/admin-notification"
              element={<AdminNotificationPage />}
            />
            <Route path="/admin-setting" element={<AdminSettingPage />} />
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
