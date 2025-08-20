import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingTabContent from "@/layout/components/admin-page-component/booking-component/BookingTabContent";
import UserTabContent from "@/layout/components/admin-page-component/user-component/UserTabContent";
import useBookingStore from "@/stores/useBookingStore";
import useUserStore from "@/stores/useUserStore";
import useStatisticStore from "@/stores/useStatisticStore";
import { useEffect, useState } from "react";
import DashboardStatistic from "@/layout/components/admin-page-component/statistic-component/DashboardStatistic";
import CancelBookingRequest from "@/layout/components/admin-page-component/cancel-booking-request/CancelBookingRequest";
import {
  Users,
  Calendar,
  BarChart4,
  LayoutDashboard,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"; 
import AcceptCancellationBookingTable from "@/layout/components/cancel-booking-page-component/Accepted Cancellation Booking/AcceptCancellationBookingTable";
import RequireRole from "@/permission/RequireRole";
import { ROLE } from "@/constant/roleList";
import { Button } from "@/components/ui/button";
import BookingTrendRealtimeChart from "@/layout/components/chart/BookingTrendRealTimeChart";
import BookingRoomTypeRealTimeChart from "@/layout/components/chart/BookingRoomTypeRealTimeChart";
import PieChartDistribution from "@/layout/components/chart/PieChartDistribution";

const UserManagePage = () => {
  // State management hooks
  const { fetchUser } = useUserStore();
  const fetchAllBooking = useBookingStore((state) => state.fetchAllBooking);

  const { fetchAllStatisticCardData } = useStatisticStore();
  const {
    handleDeleteAllAcceptCancelledBooking,
    acceptCancelledBookingsRequest,
  } = useBookingStore((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("Booking");

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchUser(1),
        fetchAllBooking(1),
        fetchAllStatisticCardData(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Loading state display with spinner icon
  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
        <p className="mt-4 text-md text-gray-600">
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50/50 px-4 py-8">
      <div className="mx-auto max-w-7xl overflow-hidden relative">
        {/* HEADER SECTION WITH TITLE AND DESCRIPTION */}
        <div className="mb-8 flex items-start">
          <div className="mr-4 rounded-lg bg-blue-100 p-3">
            <LayoutDashboard className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              Admin Dashboard
            </h1>
            <p className="text-blue-600/80">
              Manage bookings, users, and platform statistics
            </p>
          </div>
        </div>

        {/* STATISTICS GRID */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center">
            <BarChart4 className="mr-2 h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-blue-900">
              Dashboard Metrics
            </h2>
          </div>
          <DashboardStatistic />
        </div>

        {/* BOOKING TREND CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-10">
            <PieChartDistribution />
            <BookingTrendRealtimeChart />
        </div>
        
        <div className="mb-8 rounded-xl border border-blue-200 shadow-sm">
            <BookingRoomTypeRealTimeChart />
        </div>

        {/* CANCEL REQUESTS SECTION */}
        <div className="mb-8 rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center">
            <ShieldAlert className="mr-2 h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-blue-900">
              Booking Cancellation Requests
            </h2>
          </div>
          <CancelBookingRequest />
        </div>

        {/* ACCEPTED CANCELLATION SECTION (SUPER ADMIN ONLY) */}
        <RequireRole allowedRoles={[ROLE.SuperAdmin]}>
          <div className="mb-8 rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-green-500" />
                <h2 className="text-xl font-semibold text-blue-900">
                  Accepted Cancellation Bookings
                </h2>
              </div>
              {acceptCancelledBookingsRequest.length > 0 && (
                <Button
                  className="cursor-pointer bg-rose-600 hover:bg-rose-500"
                  onClick={handleDeleteAllAcceptCancelledBooking}
                >
                  Delete All Records
                </Button>
              )}
            </div>
            <div className="mt-4">
              <AcceptCancellationBookingTable />
            </div>
          </div>
        </RequireRole>

        {/* MAIN CONTENT TABS */}
        <Tabs
          defaultValue="Booking"
          className="rounded-xl bg-white p-6 shadow-sm"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
        >
          {/* TAB NAVIGATION */}
          <TabsList className="mb-6 flex h-full w-full border-b border-blue-100 bg-transparent">
            <TabsTrigger
              value="Booking"
              className="font-md mr-4 flex items-center rounded-lg px-6 py-3 text-base text-blue-500 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Calendar className="mr-2 size-4 stroke-[1.5]" />
              <span className="text-lg">Bookings</span>
            </TabsTrigger>
            <TabsTrigger
              value="Users"
              className="flex items-center rounded-lg px-4 py-3 text-base font-medium text-blue-500 transition-all hover:bg-blue-50 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <Users className="mr-2 size-4 stroke-[1.5]" />
              <span className="text-lg">Users</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB CONTENT AREAS */}
          <div className="rounded-lg bg-blue-50/30 p-4">
            {/* BOOKING MANAGEMENT TAB */}
            {activeTab === "Booking" && (
              <TabsContent value="Booking">
                <BookingTabContent fetchAllBooking={fetchAllBooking} />
              </TabsContent>
            )}

            {/* USER MANAGEMENT TAB */}
            {activeTab === "Users" && (
              <TabsContent value="Users">
                <UserTabContent fetchUser={fetchUser} />
              </TabsContent>
            )}
          </div>
        </Tabs>
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="pointer-events-none h-5 w-5 rounded-full bg-blue-400/30 absolute z-100"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${7 + Math.random() * 3}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserManagePage;
