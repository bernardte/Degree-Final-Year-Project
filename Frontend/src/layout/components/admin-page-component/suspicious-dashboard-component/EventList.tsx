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

const EventList = ({
  event,
  expandedEvent,
  toggleExpand,
  markAsHandled,
}: EventListProps) => {
  return (
    <li key={event._id} className="p-6 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="ml-4">
            <div className="flex items-center">
              <h4 className="text-lg font-medium text-gray-900">
                {event.reason}
              </h4>
              <div className="ml-3">
                <SeverityBadge severity={event.severity} />
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {event.userId ? (
                <>
                  <User className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>User ID: {event.userId}</span>
                </>
              ) : (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                  <span>Guest ID: {event.guestId}</span>
                </>
              )}
              <span className="mx-2">•</span>
              <Server className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <span>{event.type}</span>
              <span className="mx-2">•</span>
              <Clock className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
              <span>{formatTime(event.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <HandlingStatus handled={event.handled} />
          {!event.handled && (
            <button
              onClick={() => markAsHandled(event._id, true)}
              className="ml-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Mark as Resolved
            </button>
          )}
        </div>
      </div>

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

        {expandedEvent === event._id && (
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h5 className="mb-2 text-sm font-medium text-gray-700">
              Event Details:
            </h5>
            <pre className="overflow-x-auto rounded border bg-white p-3 text-sm text-gray-600">
              {JSON.stringify(event.details, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </li>
  );
};

export default EventList;

  // Component to display handling status
  const HandlingStatus = ({ handled }: { handled: boolean }) => {
    return handled ? (
      <div className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1 text-green-800">
        <CheckCircle className="h-4 w-4" />
        <span className="ml-1 text-sm font-medium">Resolved</span>
      </div>
    ) : (
      <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-amber-800">
        <Clock className="h-4 w-4" />
        <span className="ml-1 text-sm font-medium">Pending</span>
      </div>
    );
  };

  // Component to display severity with appropriate icon and color
  const SeverityBadge = ({ severity } : { severity: "high" | "medium" | "low"} ) => {
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
        className={`inline-flex items-center rounded-full border px-3 py-1 ${config.color}`}
      >
        {config.icon}
        <span className="ml-1 text-sm font-medium">{config.text}</span>
      </div>
    );
  };


