import StatisticCard from "./StatistiCard";
import getStatisticData from "@/constant/statisticData";

const DashboardStatistic = () => {
  const statistics = getStatisticData();

  return (
    <div className="mb-8 grid grid-cols-3 grid-rows-2 gap-4">
      {statistics.map((stat, index) => {
        if (index === statistics.length - 1) {
          // 'e' takes full height of third column
          return (
            <div
              key={stat.label}
              className="col-start-3 col-end-4 row-span-2"
            >
              <StatisticCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                bgColor={stat.bgColor}
                iconColor={stat.iconColor}
              />
            </div>
          );
        } else {
          // Position a, b, c, d manually for the first two columns
          const positions = [
            "row-start-1 col-start-1", // a
            "row-start-1 col-start-2", // b
            "row-start-2 col-start-1", // c
            "row-start-2 col-start-2", // d
          ];
          return (
            <div key={stat.label} className={positions[index]}>
              <StatisticCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                bgColor={stat.bgColor}
                iconColor={stat.iconColor}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default DashboardStatistic;
