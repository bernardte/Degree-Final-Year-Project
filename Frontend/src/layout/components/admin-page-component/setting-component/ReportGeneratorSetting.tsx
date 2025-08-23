import { Download, FileText } from "lucide-react";
import { Dispatch, useState } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import { parse } from "date-fns"
import "react-day-picker/dist/style.css";

interface ReportGeneratorSettingProps {
  reportType: string;
  setReportType: Dispatch<React.SetStateAction<string>>;
  reportDate: string;
  setReportDate: Dispatch<React.SetStateAction<string>>;
  handleGenerateReport: (
    startDate: Date,
    endDate: Date,
    type: string,
  ) => Promise<void>;
}

const ReportGeneratorSetting = ({
  reportType,
  setReportType,
  reportDate,
  setReportDate,
  handleGenerateReport,
}: ReportGeneratorSettingProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);

    if (range?.from && range?.to) {
      const fromStr = format(range.from, "dd MMM yyyy");
      const toStr = format(range.to, "dd MMM yyyy");
      if (fromStr === toStr) {
        setReportDate(`${fromStr}`);
      } else {
        setReportDate(`${fromStr} - ${toStr}`);
      }
      setIsPickerOpen(false);
    } else if (range?.from && !range?.to) {
      const fromStr = format(range.from, "yyyy-MM-dd");
      setReportDate(`${fromStr}`);
    }
  };

  // Parse an existing date string 
  const parseExistingDate = () => {
    if (reportDate && reportDate.includes(" - ")) {
      const [fromStr, toStr] = reportDate.split(" - ");
      return {
        from: parse(fromStr, "dd MMM yyyy", new Date()),
        to: parse(toStr, "dd MMM yyyy", new Date()),
      };
    } else if (reportDate) {
      return { from: new Date(reportDate) }; // Only startDate case
    }
    return undefined;
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <FileText className="mr-3 text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Report Generation
        </h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="occupancy">Occupancy Report</option>
            <option value="revenue">Revenue Report</option>
            <option value="financial">Financial Report</option>
            <option value="cancellation">Cancellation Report</option>
          </select>
        </div>

        <div className="relative">
          <label className="mb-2 block font-medium text-gray-700">
            Date Range
          </label>
          <div
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            {reportDate || "Select date range"}
          </div>

          {isPickerOpen && (
            <div className="absolute z-10 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg">
              <DayPicker
                mode="range"
                defaultMonth={new Date()}
                selected={selectedRange || parseExistingDate()}
                onSelect={handleRangeSelect}
                numberOfMonths={2}
                classNames={{
                  months: "sm:flex gap-6",
                  month: "w-full",
                  caption: "text-center font-semibold mb-2",
                  table: "w-full border-collapse",
                  head_row: "text-gray-500",
                  head_cell: "text-xs font-medium text-center py-1",
                  row: "text-center",
                  cell: "p-1",
                  day: "w-10 h-10 rounded-full hover:bg-blue-100 transition",
                  day_selected: "bg-blue-600 text-white",
                  day_today: "border border-blue-500",
                  day_range_middle: "bg-blue-100",
                  day_range_start: "bg-blue-600 text-white",
                  day_range_end: "bg-blue-600 text-white",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={() =>
            handleGenerateReport(
              selectedRange?.from || new Date(),
              selectedRange?.to || new Date(),
              reportType,
            )
          }
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          <FileText className="mr-2" size={18} />
          Generate Report
        </button>
        <button className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">
          <Download className="mr-2" size={18} />
          Export as CSV
        </button>
        <button className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700">
          <Download className="mr-2" size={18} />
          Export as PDF
        </button>
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          Recent Reports
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Report Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">Daily Occupancy - Aug 10, 2023</td>
                <td className="px-4 py-3">Daily</td>
                <td className="px-4 py-3">Aug 10, 2023</td>
                <td className="px-4 py-3">
                  <button className="mr-3 text-blue-600 hover:text-blue-800">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    Download
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">Weekly Revenue - Week 32</td>
                <td className="px-4 py-3">Weekly</td>
                <td className="px-4 py-3">Aug 7-13, 2023</td>
                <td className="px-4 py-3">
                  <button className="mr-3 text-blue-600 hover:text-blue-800">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    Download
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  Monthly Financial Summary - July 2023
                </td>
                <td className="px-4 py-3">Monthly</td>
                <td className="px-4 py-3">July 1-31, 2023</td>
                <td className="px-4 py-3">
                  <button className="mr-3 text-blue-600 hover:text-blue-800">
                    View
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportGeneratorSetting;
