import { Download, FileText } from 'lucide-react';
import { Dispatch } from 'react';

interface ReportGeneratorSettingProps {
    reportType: string;
    setReportType: Dispatch<React.SetStateAction<string>>;
    reportDate: string;
    setReportDate: Dispatch<React.SetStateAction<string>>
    handleGenerateReport: () => void;
}

const ReportGeneratorSetting = ({ reportType, setReportType, reportDate, setReportDate, handleGenerateReport } : ReportGeneratorSettingProps) => {
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
            <option value="daily">Daily Occupancy Report</option>
            <option value="weekly">Weekly Revenue Report</option>
            <option value="monthly">Monthly Financial Summary</option>
            <option value="guest">Guest Stay History</option>
            <option value="cancellation">Cancellation Report</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Date Range
          </label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleGenerateReport}
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
}

export default ReportGeneratorSetting
