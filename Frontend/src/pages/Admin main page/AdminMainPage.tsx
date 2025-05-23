import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingTabContent from "@/layout/components/admin-page-component/booking-component/BookingTabContent";
import UserTabContent from "@/layout/components/admin-page-component/user-component/UserTabContent";
import useBookingStore from "@/stores/useBookingStore";
import useUserStore from "@/stores/useUserStore";
import useStatisticStore from "@/stores/useStatisticStore";
import { useEffect } from "react";
import DashboardStatistic from "@/layout/components/admin-page-component/statistic-component/DashboardStatistic";
import CancelBookingRequest from "@/layout/components/admin-page-component/cancel-booking-request/CancelBookingRequest";
import { Users, Calendar, AlertCircle } from "lucide-react";

const UserManagePage = () => {
  // State management hooks
  const { fetchUser } = useUserStore();
  const { fetchAllBooking, fetchAllCancelBookingRequest } = useBookingStore();
  const { fetchAllStatisticCardData } = useStatisticStore();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchUser(),
        fetchAllBooking(),
        fetchAllStatisticCardData(),
        fetchAllCancelBookingRequest(),
      ]);
    };
    fetchData();
  }, [
    fetchUser,
    fetchAllBooking,
    fetchAllStatisticCardData,
    fetchAllCancelBookingRequest,
  ]);

  return (
    <div className="min-h-screen overflow-hidden bg-blue-50/50 px-4 py-8">
      <div className="mx-auto max-w-7xl overflow-hidden">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900">Admin Dashboard</h1>
          <p className="text-blue-600/80">
            Manage bookings, users, and platform statistics
          </p>
        </div>

        {/* Statistics Grid */}
        <DashboardStatistic />

        {/* Cancel Requests Section */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-white p-6 shadow-sm" >
          <h2 className="mb-4 flex items-center text-xl font-semibold text-blue-900">
            <AlertCircle className="mr-2 h-6 w-6 stroke-[1.5] text-blue-500" />
            Booking Cancellation Requests
          </h2>
          <CancelBookingRequest />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          defaultValue="Booking"
          className="rounded-xl bg-white p-6 shadow-sm"
        >
          <TabsList className="mb-6 flex h-full w-full border-b border-blue-100 bg-transparent">
            <TabsTrigger
              value="Booking"
              className="font-md mr-4 rounded-lg px-6 py-3 text-base text-blue-500 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Calendar className="mr-2 size-4 stroke-[1.5]" />
              <span className="text-lg">Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="Users"
              className="rounded-lg px-4 py-3 text-base font-medium text-blue-500 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="mr-2 size-6 stroke-[1.5]" />
              <span className="text-lg">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content Areas */}
          <div className="rounded-lg bg-blue-50/30 p-4">
            <TabsContent value="Booking">
              <BookingTabContent />
            </TabsContent>
            <TabsContent value="Users">
              <UserTabContent />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default UserManagePage;
