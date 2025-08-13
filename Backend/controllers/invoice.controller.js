import Invoice from "../models/invoice.model.js"
import ClaimedReward from "../models/claimedReward.model.js"
import Reward from "../models/reward.model.js";

const getInvoice = async (req, res) => {
    const { invoiceId } = req.params;
    const userId = req.user._id;

    try {
        const getCurrentUserInvoice = await Invoice.findOne({
          _id: invoiceId,
        }).populate({
          path: "bookingId",
          populate: {
            path: "room",
          },
        });

        console.log(getCurrentUserInvoice.bookingId.rewardCode)

        const rewardUsedInCurrentBooking = await ClaimedReward.find({ user: userId, status: "used", rewardCode: getCurrentUserInvoice.bookingId.rewardCode }).populate("reward")

        if (!getCurrentUserInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const roomCount = getCurrentUserInvoice.bookingId?.room?.length || 0;

        return res.status(200).json({
          ...getCurrentUserInvoice.toObject(),
          reward: rewardUsedInCurrentBooking,
          roomCount,
        });
    } catch (error) {
        console.log("Error in getInvoice", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default {
    getInvoice,

}