import {
  BedDouble,
  BedSingle,
  ListChecks,
  Users2,
} from "lucide-react";
import useStatisticStore from "@/stores/useStatisticStore";

const getStatisticData = () => {
  const statistic =
    useStatisticStore((prevState) => prevState.statisticCardData) || {};

    return [
        {
        icon: ListChecks,
        label: "Total Bookings",
        value: (statistic.totalBooking || 0).toLocaleString(),
        bgColor: "bg-indigo-500/10",
        iconColor: "text-indigo-500",
        },
        {
        icon: Users2,
        label: "Total Users",
        value: (statistic.totalUsers || 0).toLocaleString(),
        bgColor: "bg-sky-500/10",
        iconColor: "text-sky-500",
        },
        {
        icon: BedDouble,
        label: "Total Rooms",
        value: (statistic.totalRoom || 0).toLocaleString(),
        bgColor: "bg-fuchsia-500/10",
        iconColor: "text-fuchsia-500",
        },
        {
        icon: BedSingle,
        label: "Rooms Available",
        value: (statistic.totalRoomAvailable || 0).toLocaleString(),
        bgColor: "bg-green-500/10",
        iconColor: "text-green-500",
        },
    ];
};

export default getStatisticData;
