import useAuthStore from "@/stores/useAuthStore";
import { MessageCircle, X } from "lucide-react";
import React, { SetStateAction } from "react";

const ChatWidgetHeader = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { adminReceipentId } = useAuthStore();
  return (
    <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
      <div className="flex items-center">
        <div className="mr-3 rounded-full bg-blue-500 p-2">
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-semibold">Customer Support</h3>
          <div className="flex items-center text-xs opacity-80">
            <div className={`mr-1 h-2 w-2 rounded-full  ${adminReceipentId !== null ? "bg-green-400" : "bg-gray-300" }`}></div>
            <span>{adminReceipentId !== null ? "online" : "offline"}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="rounded-full p-1 text-white transition-colors hover:bg-blue-500"
        aria-label="Close chat"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatWidgetHeader;
