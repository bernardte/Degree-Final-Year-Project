import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Check, Zap, Sparkles } from "lucide-react";

interface RewardCodeInputProps {
  onApplyReward: (
    code: string,
  ) => Promise<{ success: boolean; discount?: number; message?: string }>;
  onRemoveReward: (code: string) => Promise<void>;
  appliedReward?: { code: string; discount: number } | null;
}

const RewardCodeInput = ({
  onApplyReward,
  onRemoveReward,
  appliedReward,
}: RewardCodeInputProps) => {
  const [rewardCode, setRewardCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleApply = async () => {
    if (!rewardCode.trim()) return;

    setIsLoading(true);
    try {
      const result = await onApplyReward(rewardCode);
      if (result.success) {
        setStatus("success");
        setRewardCode("");
      } else {
        setStatus("error");
        setMessage(result.message || "Invalid reward code");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to apply reward code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (code: string) => {
      setStatus("idle");
      setMessage("");
      await onRemoveReward(code);
  };

  useEffect(() => {
    if (appliedReward) {
      setStatus("success");
      setMessage(`${appliedReward.discount}% discount applied!`);
    }
  }, [appliedReward]);

  return (
    <div className="mt-4 mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center text-lg font-bold text-gray-800">
          <Gift className="mr-2 text-amber-500" size={20} />
          Reward Code
        </h3>
        {appliedReward && (
          <button
            onClick={() => handleRemove(appliedReward.code)}
            className="flex cursor-pointer items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <X className="mr-1" size={16} /> Remove
          </button>
        )}
      </div>

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-start rounded-lg border border-green-200 bg-green-50 p-3"
          >
            <Check className="mt-0.5 mr-2 flex-shrink-0 text-green-500" />
            <div>
              <p className="font-medium text-green-800">{message}</p>
              {appliedReward && (
                <p className="mt-1 text-sm text-green-700">
                  Applied reward: {appliedReward.code}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 flex items-start rounded-lg border border-red-200 bg-red-50 p-3"
          >
            <X className="mt-0.5 mr-2 flex-shrink-0 text-red-500" />
            <p className="font-medium text-red-800">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!appliedReward && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative rounded-lg border ${
            isFocused
              ? "border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.2)]"
              : "border-gray-300"
          } bg-white p-1 transition-all duration-200`}
        >
          <div className="flex">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={rewardCode}
                onChange={(e) => setRewardCode(e.target.value.toUpperCase())}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter reward code"
                className="w-full py-3 pr-12 pl-4 text-lg font-medium placeholder:text-gray-400 focus:outline-none"
              />
              <Zap
                className={`absolute top-1/2 right-3 -translate-y-1/2 text-amber-400 transition-opacity ${
                  rewardCode ? "opacity-100" : "opacity-30"
                }`}
                size={20}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              disabled={isLoading || !rewardCode.trim()}
              className={`ml-2 flex items-center rounded-lg px-5 font-bold transition-all ${
                rewardCode.trim()
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "cursor-not-allowed bg-gray-100 text-gray-400"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                </div>
              ) : (
                "Apply"
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      <div className="mt-3 flex items-center text-sm text-gray-500">
        <Sparkles className="mr-1.5 text-amber-400" size={16} />
        <p>
          Enter a valid reward code to receive discounts
        </p>
      </div>
    </div>
  );
};

export default RewardCodeInput;
