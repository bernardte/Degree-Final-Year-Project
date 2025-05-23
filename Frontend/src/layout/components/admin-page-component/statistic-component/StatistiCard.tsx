import { Card, CardContent } from "@/components/ui/card";

type StatisticCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
};

const StatisticCard = ({
  icon: Icon,
  label,
  bgColor,
  iconColor,
  value,
}: StatisticCardProps) => {
  return (
    <Card
      className={`border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${bgColor}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className={`rounded-xl p-3 ${bgColor}`}>
            <Icon className={`size-6 ${iconColor}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticCard;
