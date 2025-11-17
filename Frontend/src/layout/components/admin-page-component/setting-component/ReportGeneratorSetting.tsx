import { Download, FileText, Trash2 } from "lucide-react";
import { Dispatch, useState } from "react";
import { format } from "date-fns";
import { DayPicker, DateRange } from "react-day-picker";
import { parse } from "date-fns";
import "react-day-picker/dist/style.css";
import { Reports } from "@/types/interface.type";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import useSettingStore from "@/stores/useSettingStore";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import RequireRole from "@/permission/RequireRole";
import { ROLE } from "@/constant/roleList";

interface ReportGeneratorSettingProps {
  reports: Reports[];
  error: null | string;
  isLoading: boolean;
  reportType: string;
  setReportType: Dispatch<React.SetStateAction<string>>;
  reportDate: string;
  setReportDate: Dispatch<React.SetStateAction<string>>;
  handleGenerateReport: (
    startDate: Date,
    endDate: Date,
    type: string,
    exportFileFormat: string,
  ) => Promise<void>;
}

const ReportGeneratorSetting = ({
  reports,
  error,
  isLoading,
  reportType,
  setReportType,
  reportDate,
  setReportDate,
  handleGenerateReport,
}: ReportGeneratorSettingProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
  const [exportFileFormat, setExportFileFormat] = useState<string>("csv");
  const { handleDownloadReport } = useSettingStore();
  const { showToast } = useToast();

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

  const handleDeleteAllReport = async () => {
    try {
      const response = await axiosInstance.delete("/api/systemSetting/report");

      if(response?.data?.message){
        showToast("success", response?.data?.message)
        useSettingStore.setState((state) => ({ reports: [] }));
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || error?.response?.data?.message;

      if (message.includes("Access denied")) {
        showToast("warn", error?.response?.data?.message);
        return;
      }
      showToast("error", error?.response?.data?.error);
    }
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center">
        <FileText className="mr-3 text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">
          Report Generation
        </h2>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error: {error}</p>
          <p className="mt-1 text-sm">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
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
            onClick={() => !isLoading && setIsPickerOpen(!isPickerOpen)}
            className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 ${
              isLoading ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"
            }`}
          >
            {reportDate || "Select date range"}
          </div>

          {isPickerOpen && !isLoading && (
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
          onClick={async () => {
            handleGenerateReport(
              selectedRange?.from || new Date(),
              selectedRange?.to || new Date(),
              reportType,
              exportFileFormat,
            );
            setSelectedRange(undefined);
            setReportDate("");
          }}
          disabled={isLoading}
          className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-white transition ${
            isLoading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2" size={18} />
              Generate Report
            </>
          )}
        </button>
        <button
          disabled={isLoading}
          className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-white transition ${
            isLoading
              ? "cursor-not-allowed bg-green-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => {
            setExportFileFormat("csv");
            showToast("info", "You selcted to export CSV file");
          }}
        >
          <Download className="mr-2" size={18} />
          Export as CSV
        </button>
        <button
          disabled={isLoading}
          className={`flex cursor-pointer items-center rounded-lg px-4 py-2 text-white transition ${
            isLoading
              ? "cursor-not-allowed bg-purple-400"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
          onClick={() => {
            setExportFileFormat("pdf");
            showToast("info", "You selcted to export PDF file");
          }}
        >
          <Download className="mr-2" size={18} />
          Export as PDF
        </button>
        <RequireRole allowedRoles={[ROLE.SuperAdmin]}>
          <button
            disabled={isLoading || reports.length <= 0}
            className={`flex items-center rounded-lg px-4 py-2 text-white transition ${
              isLoading
                ? "cursor-not-allowed bg-rose-400"
                : reports.length <= 0
                  ? "cursor-not-allowed bg-gray-500"
                  : "cursor-pointer bg-rose-600 hover:bg-rose-700"
            }`}
            onClick={handleDeleteAllReport}
          >
            <Trash2 className="mr-2" size={18} />
            Delete All Reports
          </button>
        </RequireRole>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Recent Reports
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg border border-gray-200 bg-indigo-50">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Report Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">
                    File Format
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
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-gray-200 font-semibold hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 capitalize">{report.name}</td>
                      <td className="px-4 py-3 capitalize">{report.type}</td>
                      <td
                        className={`px-6 py-3 uppercase ${report.fileFormat === "pdf" ? "text-rose-400" : "text-emerald-400"}`}
                      >
                        {report.fileFormat} File
                      </td>
                      <td className="px-4 py-3">
                        {formatDateInBookingCheckOut(report.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {/* <button className="mr-3 cursor-pointer text-blue-600 hover:text-blue-800">
                          View
                        </button> */}
                        <button
                          onClick={() =>
                            handleDownloadReport(
                              report._id,
                              report.type,
                              report.fileFormat,
                            )
                          }
                          className="cursor-pointer text-green-600 hover:text-green-800"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No reports generated yet. Create your first report above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGeneratorSetting;

const SkeletonTable = () => (
  <div className="mt-8">
    <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200"></div>
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg border border-gray-200 bg-indigo-50">
        <thead>
          <tr className="bg-indigo-100">
            <th className="px-4 py-3 text-left">
              <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 animate-pulse rounded bg-gray-300"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-3">
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 animate-pulse rounded bg-gray-200"></div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-6 w-12 animate-pulse rounded bg-gray-300"></div>
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-300"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
