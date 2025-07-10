import { CircleEllipsis, MessageSquare, Search, User } from 'lucide-react';
import { SetStateAction } from 'react';
import { Conversation } from '@/types/interface.type';
import { formatDate } from 'date-fns';

interface ConversationSidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<SetStateAction<string>>;
  filteredConversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: React.Dispatch<SetStateAction<Conversation | null>>;
}

const ConversationSidebar = ({
  searchTerm,
  setSearchTerm,
  filteredConversations,
  setActiveConversation,
  activeConversation,
}: ConversationSidebarProps) => {

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "open":
        return "bg-green-100 text-green-800";
      case "close":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    return (
      <div
        className={`flex h-[100vh] w-full flex-col overflow-y-auto rounded-xl bg-white shadow-md md:mr-4 md:h-auto md:w-1/3 `}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center text-xl font-bold text-gray-800">
              <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
              Customer Support
            </h2>
            <button className="rounded-full p-2 hover:bg-gray-100">
              <CircleEllipsis className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user code or username..."
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-grow overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <MessageSquare className="mx-auto mb-2 h-12 w-12 text-gray-300" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv._id}
                className={`cursor-pointer border-b-1 border-blue-300/50 p-4 transition-colors ${
                  activeConversation?._id === conv._id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setActiveConversation(conv)}
              >
                <div className="flex items-start">
                  <div className="relative mr-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-grow">
                    <div className="flex items-start justify-between">
                      <h3 className="truncate font-semibold text-gray-900">
                        {conv.userCode} {/* Using anonymized code */}
                      </h3>
                      <span className="text-xs whitespace-nowrap text-gray-500">
                        {formatDate(
                          new Date(conv.lastMessageAt),
                          "MMM d, yyyy h:mm a",
                        )}{" "}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-sm text-gray-600">
                      {conv.lastMessage}
                    </p>

                    <div className="mt-2 flex items-center">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusBadge(conv.status)}`}
                      >
                        {conv.status}
                      </span>
                    </div>
                    {/* Admin assignment section */}
                    <div className="mt-3 flex items-center md:justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2 text-gray-400">
                          Processed by:
                        </span>
                        <span className="font-medium text-gray-700">
                          {conv?.lockedBy?.name || "Unassigned"}
                        </span>
                      </div>
                      <span className="rounded-full bg-gray-100 text-xs px-2 py-0.5 font-medium text-gray-600 capitalize">
                        {conv?.lockedBy?.role === "superAdmin"
                          ? "super admin"
                          : conv?.lockedBy?.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
};

export default ConversationSidebar
