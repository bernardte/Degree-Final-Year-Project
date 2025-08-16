import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    intent: { type: String, default: "faq", required: true},
    category: { type: String, default: "", required: true },
    question_embedding: { type: [Number], default: [] }, //vector use in ai chatbot
  },
  { timestamps: true }
);

const FAQ = mongoose.model("faqs", FAQSchema);
export default FAQ;
