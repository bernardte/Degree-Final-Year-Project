import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    question_embedding: { type: [Number], default: [] }, //vector use in ai chatbot
  },
  { timestamps: true }
);

const FAQ = mongoose.model("faqs", FAQSchema);
export default FAQ;
