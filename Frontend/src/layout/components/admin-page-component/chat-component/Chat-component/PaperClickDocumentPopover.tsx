import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Paperclip, Image } from "lucide-react";
import { SetStateAction, useRef } from "react";

const PaperClickDocumentPopover = ({
  setUploadImage,
}: {
  setUploadImage: React.Dispatch<SetStateAction<File | null>>;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setUploadImage(file);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="mr-2 cursor-pointer rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <Paperclip className="h-5 w-5" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-2">
        {/* Option: Attach Photo */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
        >
          <Image className="h-4 w-4 text-blue-500" />
          <span>Attach Photo</span>
        </button>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </PopoverContent>
    </Popover>
  );
};

export default PaperClickDocumentPopover;
