import { Send, Smile, X } from "lucide-react";
import { SetStateAction, useRef, useState } from "react";
import PaperClickDocumentPopover from "./PaperClickDocumentPopover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useEffect } from "react";
import { Conversation } from "@/types/interface.type";

interface MessageInput {
  newMessage: string;
  setNewMessage: React.Dispatch<SetStateAction<string>>;
  loading: boolean;
  uploadImage: File | null;
  setUploadImage: React.Dispatch<SetStateAction<File | null>>;
  activeConversation: Conversation;
  handleSendMessage: () => void;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  activeConversation,
  loading,
  uploadImage,
  setUploadImage,
}: MessageInput) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const handleEmojiSelect = (emoji: any) => {
    const emojiSymbol = emoji.native;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = newMessage.slice(0, start);
    const after = newMessage.slice(end);
    const updated = `${before}${emojiSymbol}${after}`;

    setNewMessage(updated);

    // Move cursor after emoji
    setTimeout(() => {
      if (textarea) {
        const pos = start + emojiSymbol.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
        setShowEmojiPicker(false);
      }
    }, 0);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* imege preview*/}
      {uploadImage && activeConversation.status === "open" && (
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="relative">
            <img
              src={URL.createObjectURL(uploadImage)}
              alt="Preview"
              className="h-16 w-16 rounded-md border border-gray-200 object-cover"
            />
            <button
              onClick={() => setUploadImage(null)}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 hover:bg-red-600"
              aria-label="Remove image"
            >
              <X className="h-3 w-3 text-white" strokeWidth={3} />
            </button>
          </div>
          <div className="flex flex-col truncate text-sm text-gray-700">
            <span className="truncate font-medium">{uploadImage.name}</span>
            <span className="text-xs text-gray-500">
              {(uploadImage.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start">
        {/* input area */}
        <div className="relative flex-grow">
          <textarea
            ref={textareaRef}
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={activeConversation.status === "closed"}
            placeholder="Type your response to the guest..."
            className="focus:ring-opacity-30 w-full resize-none rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          {/* bottom operating button */}
          <div className="absolute right-3 bottom-2 flex items-center">
            {/* image attach button */}
            <PaperClickDocumentPopover
              setUploadImage={setUploadImage}
            />
            {/* emotion button */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-blue-600"
                aria-label="Select emoji"
              >
                <Smile className="h-5 w-5" />
              </button>

              {showEmojiPicker && activeConversation.status !== "closed" && (
                <div
                  ref={emojiPickerRef}
                  className="absolute right-0 bottom-10 z-50 overflow-hidden rounded-xl shadow-lg"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                    previewPosition="none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* right-side button */}
        <div className="ml-3 flex items-center gap-2">
          {/* send button */}
          <button
            onClick={handleSendMessage}
            disabled={
              (!newMessage.trim() && !uploadImage) ||
              loading ||
              activeConversation.status === "closed"
            }
            className={`my-5 flex items-center justify-center rounded-full p-3 transition-all ${
              newMessage.trim() || uploadImage || activeConversation.status === "open"
                ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg"
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            } ${loading ? "opacity-70" : ""}`}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* bottom hint */}
      {activeConversation.status === "open" && (
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <kbd className="mx-1 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5">
              Enter
            </kbd>{" "}
            to send
          </span>
          <span className="flex items-center">
            <kbd className="mx-1 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5">
              Shift
            </kbd>{" "}
            +
            <kbd className="mx-1 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5">
              Enter
            </kbd>{" "}
            for new line
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
