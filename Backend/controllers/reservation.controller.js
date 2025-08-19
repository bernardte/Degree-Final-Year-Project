import Reservation from "../models/reservation.model.js"

const handleNewReservation = async (req, res) => {
    const { name, email, phone, totalGuest, date, time, category } = req.body;
    if(!name || !email || !phone || !totalGuest || !date || !time || !category){
        return res.status(400).json({ error: "All field required" });
    }

    try {
        const newReservation = new Reservation({
            name, 
            email, 
            phone,
            date,
            time,
            numberOfGuest: totalGuest,
            category
        })
        await newReservation.save()
        return res.status(201).json({ success: true });
    } catch (error) {
        console.log("Error in handleNewReservation: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export default {
    handleNewReservation,
}