import { useState, useEffect } from "react";
import FiltersAndSearch from "@/layout/components/admin-page-component/suspecious dashboard component/FiltersAndSearch";
import { SuspiciousEvent } from "@/types/interface.type";
import NoEventFount from "@/layout/components/admin-page-component/suspecious dashboard component/NoEventFount";
import EventList from "@/layout/components/admin-page-component/suspecious dashboard component/EventList";
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { ChevronLeft, ChevronRight, Loader, AlertCircle } from "lucide-react";
import { debounce } from "lodash";

// Main component for the suspicious events dashboard
const AdminSuspeciousDashboardPage = () => {
  const [filteredEvents, setFilteredEvents] = useState<SuspiciousEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "severity">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const {
    fetchAllSuspiciousEvent,
    suspeciousEvents,
    suspeciousEventsIsLoading,
    suspeciousEventsTotalPage,
    suspeciousEventsError,
    suspeciousEventsTotalItems,
    setSuspiciousCurrentPage,
    suspeciousEventsCurrentPage,
    updateMarkAsSolved,
  } = useSystemSettingStore((state) => state);

  //fetch all suspicious event
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchAllSuspiciousEvent(
        suspeciousEventsCurrentPage,
        50,
        searchTerm,
        severityFilter,
        statusFilter,
        sortBy,
        sortOrder,
      );
    }, 1000)

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    }
  }, [
    fetchAllSuspiciousEvent,
    suspeciousEventsCurrentPage,
    searchTerm,
    severityFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  // Apply filters and search
  useEffect(() => {
    let result = suspeciousEvents;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (event) =>
          event.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.userId &&
            event.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (event.guestId &&
            event.guestId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          event.type?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      result = result.filter((event) => event.severity === severityFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (event) => event.handled === (statusFilter === "handled"),
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "severity") {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return sortOrder === "asc"
          ? severityOrder[a.severity] - severityOrder[b.severity]
          : severityOrder[b.severity] - severityOrder[a.severity];
      }
      return 0;
    });

    setFilteredEvents(result);
  }, [
    suspeciousEvents,
    searchTerm,
    severityFilter,
    statusFilter,
    sortBy,
    sortOrder,
  ]);

  // Toggle event details expansion
  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  // Show loading state
  if (suspeciousEventsIsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading suspicious events...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (suspeciousEventsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Error Loading Events
          </h2>
          <p className="mt-2 text-gray-600">{suspeciousEventsError}</p>
          <button
            onClick={() =>
              fetchAllSuspiciousEvent(
                suspeciousEventsCurrentPage,
                50,
                "",
                "all",
                "all",
                "date",
                "desc",
              )
            }
            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Suspicious Events Monitor
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage security events detected by the system
          </p>
        </div>

        {/* Filters and Search */}
        <FiltersAndSearch
          filteredEvents={filteredEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Events List */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          {filteredEvents.length === 0 ? (
            <NoEventFount />
          ) : (
            <ul className="divide-y divide-gray-200">
              {suspeciousEventsTotalPage > 1 && (
                <Pagination
                  currentPage={suspeciousEventsCurrentPage}
                  totalPages={suspeciousEventsTotalPage}
                  totalItems={suspeciousEventsTotalItems}
                  itemsPerPage={50}
                  onPageChange={setSuspiciousCurrentPage}
                />
              )}
              {filteredEvents.map((event) => (
                <EventList
                  key={event._id}
                  event={event}
                  expandedEvent={expandedEvent}
                  toggleExpand={toggleExpand}
                  markAsHandled={updateMarkAsSolved}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSuspeciousDashboardPage;

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (pageNumber: number) => void;
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  // Don't render pagination if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to{" "}
            <span className="font-medium">{endItem}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {pages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === page
                    ? "bg-blue-600 text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
