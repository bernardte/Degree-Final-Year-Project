import { Message } from "@/types/interface.type";
import { format } from "date-fns";
import React from "react";
import { CheckCheck, Check } from "lucide-react"; // Optional: Lucide icons

const ChatWidgetMessageList = ({
  messages,
  messagesEndRef,
}: {
  messages: Message[];
  messagesEndRef: React.Ref<HTMLDivElement> | null;
}) => {
  return (
    <div className="space-y-4">
      {messages.map((message: Message) => {
        const isUser =
          message.senderType === "guest" || message.senderType === "user";

        return (
          <div
            key={message._id}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-2xl px-4 py-2 ${
                isUser
                  ? "rounded-tr-none bg-blue-500 text-white"
                  : "rounded-tl-none bg-gray-200 text-gray-800"
              }`}
            >
              <div className="flex flex-col gap-1">
                {/* Image if exists */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="uploaded"
                    className="max-w-[180px]"
                  />
                )}

                {/* Text content if exists */}
                {message.content && (
                  <div className="text-sm">{message.content}</div>
                )}

                {/* Timestamp and read status */}
                <div className="flex items-center justify-end gap-1 text-[0.6em]">
                  <span className={isUser ? "text-blue-100" : "text-gray-500"}>
                    {format(new Date(message.createdAt), "h:mm a")}
                  </span>

                  {/* Read indicator */}
                  {isUser &&
                    message.isRead !== undefined &&
                    (message.isRead ? (
                      <CheckCheck
                        className="h-3 w-3 text-green-200"
                      />
                    ) : (
                      <Check className="h-3 w-3 text-gray-300" />
                    ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Auto scroll to bottom */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWidgetMessageList;
