import { SuspiciousEvent } from "@/types/interface.type";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type FiltersAndSearchProps = {
  filteredEvents: SuspiciousEvent[];
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  severityFilter: string;
  setSeverityFilter: Dispatch<SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: Dispatch<SetStateAction<string>>;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  sortBy: "date" | "severity";
  setSortBy: Dispatch<SetStateAction<"date" | "severity">>;
};

const FiltersAndSearch = ({
  filteredEvents,
  searchTerm,
  setSearchTerm,
  severityFilter,
  setSeverityFilter,
  statusFilter,
  setStatusFilter,
  setSortBy,
  setSortOrder,
  sortBy,
  sortOrder,
}: FiltersAndSearchProps) => {

    const isSortByValue = (value: string): value is "date" | "severity" => {
        return value === "date" || value === "severity"
    };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by user, reason, or type..."
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 leading-5 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div>
          <select
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 leading-5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="all">All Severities</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium Severity</option>
            <option value="low">Low Severity</option>
          </select>
        </div>

        <div>
          <select
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-10 pl-3 leading-5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="handled">Resolved Only</option>
            <option value="unhandled">Pending Only</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredEvents.length} events found
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">Sort by:</span>
          <select
            className="block rounded-md border border-gray-300 bg-white py-1 pr-10 pl-3 text-sm leading-5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={sortBy}
            onChange={(e) => {
                if(isSortByValue(e.target.value)) setSortBy(e.target.value);
            }}
          >
            <option value="date">Date</option>
            <option value="severity">Severity</option>
          </select>
          <button
            className="ml-2 rounded p-1 hover:bg-gray-100"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersAndSearch
