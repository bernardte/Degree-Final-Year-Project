import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingTabContent from "@/layout/components/admin-page-component/booking-component/BookingTabContent";
import UserTabContent from "@/layout/components/admin-page-component/user-component/UserTabContent";
import useBookingStore from "@/stores/useBookingStore";
import useUserStore from "@/stores/useUserStore";
import useStatisticStore from "@/stores/useStatisticStore";
import { useEffect } from "react";
import DashboardStatistic from "@/layout/components/admin-page-component/statistic-component/DashboardStatistic";

const UserManagePage = () => {
  const { fetchUser } = useUserStore();
  const { fetchAllBooking } = useBookingStore();
  const { fetchAllStatisticCardData } = useStatisticStore();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUser(), fetchAllBooking(), fetchAllStatisticCardData()]);
    }
    fetchData();
  }, [fetchUser, fetchAllBooking, fetchAllStatisticCardData]);

  return (
    <div className="min-h-screen bg-blue-300/10 px-4 py-10 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <DashboardStatistic />
        </div>
        <Tabs defaultValue="Booking" className="space-y-6">
          {/* Tabs Switcher */}
          <TabsList className="mx-auto flex w-fit gap-2 rounded-full bg-blue-100/70 px-1 py-5 shadow-inner">
            <TabsTrigger
              value="Booking"
              className="rounded-full px-6 py-5 text-base font-medium transition-all duration-300 hover:bg-blue-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Booking
            </TabsTrigger>
            <TabsTrigger
              value="Users"
              className="rounded-full px-6 py-5 text-base font-medium transition-all duration-300 hover:bg-blue-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div>
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
