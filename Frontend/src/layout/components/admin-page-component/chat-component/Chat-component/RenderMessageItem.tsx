import { Message } from "@/types/interface.type";
import { format } from "date-fns";
import { Clock, Shield, User, CheckCheck, Check } from "lucide-react";

const RenderMessageItem = (msg: Message, adminId: string | null) => {
  const isAdmin = msg.senderId === adminId;

  return (
      <div
        className={`mb-4 flex ${isAdmin ? "justify-end" : "justify-start"}`}
        key={msg._id}
      >
        {!isAdmin && (
          <div className="mr-2 flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        )}

        <div
          className={`max-w-[75%] rounded-xl px-4 py-2 ${
            isAdmin
              ? "rounded-tr-none bg-blue-500 text-white"
              : "rounded-tl-none bg-gray-100 text-gray-800"
          }`}
        >
          {/* Render Image if present */}
          {msg.image && (
            <img
              src={typeof msg.image === "string" ? msg.image : msg.image[0]}
              alt="attached"
              className="mb-2 max-h-48 w-full rounded-md object-cover"
            />
          )}

          {/* Render Text */}
          <div className="whitespace-pre-wrap">{msg.content}</div>

          {/* Timestamp and Read Status */}
          <div
            className={`mt-1 flex items-center text-xs ${
              isAdmin ? "text-blue-100" : "text-gray-500"
            }`}
          >
            <Clock className="mr-1 h-3 w-3" />
            {format(new Date(msg.createdAt), "h:mm a")}

            {/* Read indicator shown only for admin-sent messages */}
            {isAdmin && msg.isRead !== undefined && (
              <span className="ml-2 flex items-center">
                {msg.isRead ? (
                  <CheckCheck className="h-4 w-4 text-green-300" />
                ) : (
                  <Check className="h-4 w-4 text-white/50" />
                )}
              </span>
            )}
          </div>
        </div>

        {isAdmin && (
          <div className="ml-2 flex items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        )}
      </div>
  );
};

export default RenderMessageItem;
