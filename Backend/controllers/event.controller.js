import Event from "../models/event.model.js";

const enquireEvents = async (req, res) => {
    const { name, email, phone, guests, eventType, date: eventDate, message } = req.body;

    console.log(req.body);
    try {
        
    if (!name || !email || !phone || !guests || !eventType || !eventDate) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const newEvents = new Event({
      fullname: name,
      email: email,
      phoneNumber: phone,
      totalGuests: guests,
      eventType: eventType,
      eventDate: eventDate,
      additionalInfo: message,
    });
    await newEvents.save();

    res.status(201).json({ event: newEvents });
    } catch (error) {
        console.log("Error in enquireEvents: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllEventRequestForCalendarView = async (req, res) => {
  try {
    const eventsData = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(eventsData);
  } catch (error) {
    console.log("Error in getAllEventRequestForCalendarView: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default {
  enquireEvents,
  getAllEventRequestForCalendarView,
};