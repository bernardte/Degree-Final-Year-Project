import { Send, Smile, X } from "lucide-react";
import { SetStateAction, useEffect, useRef, useState } from "react";
import PaperClickDocumentPopover from "../admin-page-component/chat-component/Chat-component/PaperClickDocumentPopover";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface ChatWidgetInputAreaProps {
  newMessage: string;
  uploadImage: File | null;
  setNewMessage: React.Dispatch<SetStateAction<string>>;
  setUploadImage: React.Dispatch<SetStateAction<File | null>>;
  loading: boolean;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: () => Promise<void>;
}

const ChatWigetInputArea = ({
  newMessage,
  uploadImage,
  setNewMessage,
  loading,
  setUploadImage,
  handleKeyPress,
  handleSendMessage,
}: ChatWidgetInputAreaProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const handleEmojiSelect = (emoji: any) => {
    const emojiSymbol = emoji.native || emoji?.unified || emoji?.emoji;
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

  // preview image effect
  useEffect(() => {
    if (uploadImage) {
      const url = URL.createObjectURL(uploadImage);
      setImagePreviewUrl(url);

      // Cleanup to avoid memory leaks
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [uploadImage]);

  return (
    <div className="space-y-2 border-t border-gray-200 bg-white p-3">
      {/* Image preview */}
      {imagePreviewUrl && (
        <> 
          <div className="group relative mt-2 inline-block gap-2 overflow-hidden rounded-md border bg-gray-100 p-1 shadow-md">
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="max-h-40 max-w-40 rounded-md object-contain"
            />
            <button
              className="absolute top-1 right-1 z-50 cursor-pointer rounded-full text-red-500 opacity-0 shadow group-hover:opacity-100 hover:text-red-700 font-extrabold"
              onClick={() => setUploadImage(null)}
              aria-label="Remove image"
            >
              <X  />
            </button>
          </div>
          <div className="border-t-2 border-stone-300"/>
        </>
      )}

      <div className="flex items-center">
        <div className="flex gap-1 space-x-2">
          <PaperClickDocumentPopover setUploadImage={setUploadImage} />
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <Smile size={20} />
          </button>
          {showEmojiPicker && (
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
        <textarea
          value={newMessage}
          ref={textareaRef}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="max-h-20 flex-1 resize-none overflow-hidden border-none px-3 py-2 focus:ring-0"
          rows={1}
        />
        <button
          onClick={handleSendMessage}
          disabled={(!newMessage.trim() && !uploadImage) || loading}
          className={`ml-4 h-10 w-10 cursor-pointer rounded-full p-2 ${loading ? "opacity-70" : ""} ${newMessage.trim() || uploadImage ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-400"}`}
          aria-label="Send message"
        >
          <Send size={20} className="text-center" />
        </button>
      </div>
    </div>
  );
};

export default ChatWigetInputArea;
