import Invoice from "../models/invoice.model.js"

const getInvoice = async (req, res) => {
    const { invoiceId } = req.params;

    try {
        const getCurrentUserInvoice = await Invoice.findOne({
          _id: invoiceId,
        }).populate({
          path: "bookingId",
          populate: {
            path: "room",
            select: "roomType",
            sun: ""
          },
        });

        
        console.log("invoice:  ", getCurrentUserInvoice);

        if (!getCurrentUserInvoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const roomCount = getCurrentUserInvoice.bookingId?.room?.length || 0;

        return res.status(200).json({
          ...getCurrentUserInvoice.toObject(),
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