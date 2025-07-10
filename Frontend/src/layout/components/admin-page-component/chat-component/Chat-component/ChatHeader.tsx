import { Conversation } from "@/types/interface.type";
import { User } from "lucide-react";

const ChatHeader = ({ activeConversation } : { activeConversation: Conversation}) => {
  return (
    <div className="flex items-center border-b border-gray-200 p-4">
      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
        <User className="h-6 w-6 text-gray-600" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="text-lg font-bold text-gray-900">
            {activeConversation.userCode}
          </h3>
          <span
            className={`ml-2 flex items-center rounded-full px-2 py-1 text-xs ${activeConversation?.status === "open" ? "bg-green-100 text-emerald-700" : "bg-gray-100 text-gray-800"}`}
          >
            {/*//TODO: adjust when have the receiptent ID this may change */}
            {activeConversation?.status}
          </span>
        </div>
      </div>
      {/* <button className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
        View Booking Details
      </button> */}
    </div>
  );
}

export default ChatHeader
