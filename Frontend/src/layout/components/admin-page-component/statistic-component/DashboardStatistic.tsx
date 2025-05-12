import StatisticCard from "./StatistiCard";
import getStatisticData from "@/constant/statisticData";

const DashboardStatistic = () => {
    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {getStatisticData().map((stat) => (
            <StatisticCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
            />
        ))}
        </div>
    );
};

export default DashboardStatistic;
