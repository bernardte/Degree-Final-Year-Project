import { useState, useRef } from "react";
import {
  Gift,
  Star,
  Coffee,
  ShoppingBag,
  Bed,
  Ticket,
  Zap,
  Hotel,
  Utensils,
  Sparkles,
  Mountain,
  Info,
  Percent,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { ClaimedReward } from "@/types/interface.type";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { differenceInCalendarDays } from "date-fns";

const iconComponents = {
  gift: Gift,
  star: Star,
  coffee: Coffee,
  shopping: ShoppingBag,
  ticket: Ticket,
  bed: Bed,
  zap: Zap,
  hotel: Hotel,
  dining: Utensils,
  experience: Sparkles,
  travel: Mountain,
  percent: Percent,
};

interface ClaimedRewardCardProps {
  claimedReward: ClaimedReward;
}

const ClaimedRewardCard = ({ claimedReward }: ClaimedRewardCardProps) => {
  const reward = claimedReward.reward;

  const IconComponent =
    reward && reward.icon
      ? iconComponents[
          reward.icon.toLowerCase() as keyof typeof iconComponents
        ] || Gift
      : Gift;

  const daysLeft = differenceInCalendarDays(
    new Date(claimedReward.expiredAt),
    new Date(),
  );

  const statusColor =
    claimedReward.status === "active"
      ? "bg-green-100 text-green-800"
      : claimedReward.status === "used"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800";

  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(claimedReward.rewardCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQRCode = () => {
    const canvas = qrRef.current;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${claimedReward.rewardCode}.png`;
      link.href = url;
      link.click();
    }
  };

  if (!reward) {
    return (
      <div className="p-4 text-center text-gray-500">
        ⚠️ Reward data not available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
      <div className="relative">
        <div className="flex h-40 items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="rounded-full bg-white p-4 shadow-md">
            <IconComponent
              className={
                claimedReward.status === "active"
                  ? "text-blue-600"
                  : "text-gray-300"
              }
              size={48}
            />
          </div>
        </div>

        <div
          className={`absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-bold ${statusColor}`}
        >
          {claimedReward.status.toUpperCase()}
        </div>
      </div>

      <div className="p-5">
        <div className="mb-3 flex justify-between">
          <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            {reward.category}
          </div>

          {claimedReward.status === "active" && daysLeft > 0 && (
            <div className="flex items-center text-sm text-amber-600">
              <span className="mr-1">⏳</span>
              {Math.floor(daysLeft)}{" "}
              {Math.floor(daysLeft) === 1 ? "day" : "days"} left
            </div>
          )}

          {claimedReward.status === "active" && daysLeft <= 0 && (
            <div className="flex items-center text-sm text-red-500">
              <span className="mr-1">Expired</span>
            </div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-800">{reward.name}</h3>

        <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Redeemed:</span>{" "}
            {formatDateInBookingCheckOut(claimedReward.redeemedAt)}
          </div>
          <div>
            <span className="font-medium">Expires:</span>{" "}
            {formatDateInBookingCheckOut(claimedReward.expiredAt)}
          </div>
        </div>

        {/* QR Code Block */}
        {claimedReward.status === "active" && (
          <div className="my-4 flex flex-col items-center gap-2">
            <QRCodeCanvas
              value={claimedReward.rewardCode}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin
              ref={qrRef}
            />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 italic">
              <Info size={16} />
              For walk-in redemption 
            </div>
            <button
              onClick={handleDownloadQRCode}
              className="text-sm text-blue-600 hover:underline"
            >
              Download
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          {claimedReward.status === "active" && (
            <button
              onClick={handleCopyCode}
              className={`cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${
                copied
                  ? "border-green-300 bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {copied ? `Copied!` : `Copy ${claimedReward.rewardCode}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimedRewardCard;
