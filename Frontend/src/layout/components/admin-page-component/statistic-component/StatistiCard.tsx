import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className={`border border-gray-200 bg-white shadow-sm transition-all ${bgColor} hover:shadow-lg`}
      >
        <CardContent className="p-3">
          <motion.div
            className="flex items-center gap-4"
            whileHover={{
              transition: { staggerChildren: 0.1 },
            }}
          >
            {/* Icon container with subtle pulse animation */}
            <motion.div
              className={`rounded-xl p-3 ${bgColor}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <Icon
                className={`size-6 ${iconColor}`}
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 15 }}
              />
            </motion.div>

            {/* Text content with staggered animation */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.p
                className="text-sm font-medium text-gray-600"
                whileHover={{ x: 2 }}
              >
                {label}
              </motion.p>
              <motion.p
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                {value}
              </motion.p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatisticCard;
