import { SuspiciousEvent } from "@/types/interface.type";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Server,
  User,
  UserCheck,
} from "lucide-react";
import { formatTime } from "@/utils/formatTime";

type EventListProps = {
  event: SuspiciousEvent;
  expandedEvent: string | null;
  toggleExpand: (id: string) => void;
  markAsHandled: (id: string, markAsHandled: boolean) => void;
};

// Handling Status Tag
const HandlingStatus = ({ handled }: { handled: boolean }) => {
  return handled ? (
    <div className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 whitespace-nowrap text-green-800">
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      <span className="ml-1 text-sm font-medium">Resolved</span>
    </div>
  ) : (
    <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 whitespace-nowrap text-amber-800">
      <Clock className="h-4 w-4 flex-shrink-0" />
      <span className="ml-1 text-sm font-medium">Pending</span>
    </div>
  );
};

// Severity Badge
const SeverityBadge = ({
  severity,
}: {
  severity: "high" | "medium" | "low";
}) => {
  const severityConfig = {
    high: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: "bg-red-100 text-red-800 border-red-200",
      text: "High",
    },
    medium: {
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      text: "Medium",
    },
    low: {
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      text: "Low",
    },
  };

  const config = severityConfig[severity] || severityConfig.low;

  return (
    <div
      className={`inline-flex items-center rounded-full border px-3 py-1 whitespace-nowrap ${config.color}`}
    >
      {config.icon}
      <span className="ml-1 text-sm font-medium">{config.text}</span>
    </div>
  );
};

const EventList = ({
  event,
  expandedEvent,
  toggleExpand,
  markAsHandled,
}: EventListProps) => {
  return (
    <li key={event._id} className="border-b p-6 hover:bg-gray-50">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          {/* Title + Severity */}
          <div className="flex flex-wrap items-start gap-2">
            <p className="text-lg leading-snug font-medium break-words text-gray-900">
              {event.reason}
            </p>
            <SeverityBadge severity={event.severity} />
          </div>

          {/* Sub Info */}
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm break-all text-gray-500">
            {event.userId ? (
              <>
                <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>User ID: {event.userId}</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <span>Guest ID: {event.guestId}</span>
              </>
            )}

            <span>•</span>

            <Server className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="break-all">{event.type}</span>

            <span>•</span>

            <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span>{formatTime(event.createdAt)}</span>
          </div>
        </div>

        {/* Status + Action */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <HandlingStatus handled={event.handled} />
          {!event.handled && (
            <button
              onClick={() => markAsHandled(event._id, true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white shadow-sm hover:bg-blue-700"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </div>

      {/* Expand Button */}
      <div className="mt-4">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          onClick={() => toggleExpand(event._id)}
        >
          {expandedEvent === event._id ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Hide details
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show details
            </>
          )}
        </button>

        {/* DETAILS */}
        {expandedEvent === event._id && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h5 className="mb-2 text-sm font-medium text-gray-700">
              Event Details:
            </h5>

            {/* Scrollable content instead of overflow */}
            <pre className="max-h-60 overflow-x-auto overflow-y-auto rounded border bg-white p-3 text-sm break-all whitespace-pre-wrap text-gray-600">
              {JSON.stringify(event.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </li>
  );
};

export default EventList;
