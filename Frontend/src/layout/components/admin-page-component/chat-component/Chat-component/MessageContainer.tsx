import { Conversation, Message } from "@/types/interface.type";
import RenderMessageItem from "./RenderMessageItem";
import useAuthStore from "@/stores/useAuthStore";
import { getChatFormattedDate } from "@/utils/formatDate";

const MessageContainer = ({
  messages,
  messagesEndRef,
  activeConversation,
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  activeConversation: Conversation;
}) => {
  const { user } = useAuthStore((state) => state);
  const adminId =
    user?.role === "admin" || user?.role === "superAdmin" ? user?._id : null;
  const messageSendDate = messages[messages.length - 1]?.createdAt;
  return (
    <div className="flex-grow overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-3xl">
        {/* Chatbot intro message */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-lg bg-blue-50 px-4 py-3 text-center text-sm text-gray-600">
            {activeConversation.userCode.startsWith("guest_") && (
              <p className="font-medium">Anonymous Chat Mode</p>
            )}
            <p className="mt-1">
              {!activeConversation.userCode.startsWith("guest_")
                ? `You're chatting with user ${activeConversation.userCode}.`
                : `You're chatting with a guest who has remained anonymous.`}
            </p>
          </div>
        </div>

        {messageSendDate && (
          <div className="mb-4 text-center">
            <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm">
              {getChatFormattedDate(messageSendDate)}
            </span>
          </div>
        )}

        {/* Render Each Message */}
        {messages.map((msg) => (
          <RenderMessageItem key={msg._id} msg={msg} adminId={adminId} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageContainer;
