import React, { useRef  } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Lock,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface RoomCalendarViewProps {
  events: EventInput[];
  isLoading: boolean;
  error: null | string;
  onRefresh?: () => void;
}

const RoomCalendarView: React.FC<RoomCalendarViewProps> = ({
  events,
  isLoading,
  error,
  onRefresh,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // navigate to last month
  const goToPreviousMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  // navigate to next month
  const goToNextMonth = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  // navidate to today
  const goToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  // customize title
  const renderHeaderTitle = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const view = calendarApi.view;
      return view.title;
    }
    return (
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm font-semibold text-transparent">
        Room Deactivation Calendar
      </span>
    );
  };

  return (
    <div className="rounded-xl bg-white p-4 shadow-lg">
      {/* customize calendar header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToToday}
            className="rounded-lg px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="ml-2 flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              <span>Refresh</span>
            </button>
          )}
        </div>
        <h2 className="text-lg font-bold text-gray-800">
          {renderHeaderTitle()}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-sm">
            <div className="h-3 w-3 rounded bg-red-500"></div>
            <span>Deactivated</span>
          </div>
        </div>
      </div>

      {/* loading */}
      {isLoading && (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
            <p className="mt-2 text-gray-400">
              Loading Room Deactivation Calendar...
            </p>
          </div>
        </div>
      )}

      {/* error */}
      {error && !isLoading && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-red-50 p-6">
          <AlertCircle size={48} className="text-red-500" />
          <h3 className="mt-4 text-lg font-bold text-red-800">
            Failed to load data
          </h3>
          <p className="mt-2 text-center text-red-600">{error}</p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* calendar content */}
      {!isLoading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            headerToolbar={false}
            events={events}
            eventDisplay="block"
            dayHeaderClassNames="text-gray-700 font-medium"
            dayCellClassNames="hover:bg-gray-50"
            eventContent={(arg) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded bg-red-100 p-1 text-red-800"
              >
                <div className="flex items-center gap-1">
                  <Lock size={14} />
                  <span className="truncate font-medium">
                    Room Number {arg.event.title}
                  </span>
                </div>
              </motion.div>
            )}
          />
        </motion.div>
      )}

      {/* customize styles */}
      <style>
        {`
        .fc .fc-toolbar {
          display: none;
        }

        .fc .fc-col-header-cell {
          background-color: #f9fafb;
          padding: 10px 0;
          border-color: #e5e7eb;
        }

        .fc .fc-col-header-cell-cushion {
          color: #4b5563;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .fc .fc-daygrid-day {
          border-color: #e5e7eb;
        }

        .fc .fc-daygrid-day.fc-day-today {
          background-color: #f0f9ff;
        }

        .fc .fc-daygrid-day-top {
          padding: 8px;
        }

        .fc .fc-daygrid-day-number {
          color: #4b5563;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .fc .fc-day-today .fc-daygrid-day-number {
          color: #0ea5e9;
          font-weight: 700;
        }

        .fc .fc-daygrid-event {
          margin-top: 4px;
        }

        .fc .fc-scrollgrid {
          border-radius: 0.5rem;
        }
        `}
      </style>
    </div>
  );
};

export default RoomCalendarView;
