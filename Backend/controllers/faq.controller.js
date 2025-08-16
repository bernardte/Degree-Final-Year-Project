import axiosInstance from "../config/axios.js";
import FAQ from "../models/faq.model.js";

const fetchAllFAQ = async (req, res) => {
    try {
        console.log("entering here")
        const faqs = await FAQ.find({
          category: { $ne: "Complaints" },
          intent: { $ne: "complaint" },
        });

        if(!faqs){
            return res.status(404).json({ error: "faqs not found!"})
        }
        return res.status(201).json(faqs);
    } catch (error) {
        console.log('Error in fetchAllFAQ: ', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const createFAQ = async (req, res) => {
    const { question, answer, intent } = req.body;
    const { data } = await axiosInstance.post("/raq-reply", { question });
   try {
    const faq = new FAQ({
      question,
      answer,
      related,
      embedding: data.embedding,
    });

    await faq.save();
    res.json({ message: "FAQ Created", faq });
   } catch (error) {
        console.log('Error in createFAQ: ', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
   }
}

export default {
    fetchAllFAQ,
    createFAQ,
}