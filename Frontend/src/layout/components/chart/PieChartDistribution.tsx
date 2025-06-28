import { useState } from 'react'
import BookingStatusDistributionRealTimeChart from './pie chart/BookingStatusDistributionRealTimeChart'
import RoomReviewDistributionRealTimeChart from './pie chart/RoomReviewDistributionRealTimeChart'

const PieChartDistribution = () => {
    const [chartType, setChartType] = useState<"rating" | "status">("status")
    return (
      <div>
        {chartType === "status" ? (
          <BookingStatusDistributionRealTimeChart
            chartType={chartType}
            setChartType={setChartType}
          />
        ) : (
          <RoomReviewDistributionRealTimeChart
            chartType={chartType}
            setChartType={setChartType}
          />
        )}
      </div>
    );
}

export default PieChartDistribution
