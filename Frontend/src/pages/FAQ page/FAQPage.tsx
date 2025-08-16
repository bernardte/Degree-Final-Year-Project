import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Hotel,
  Utensils,
  MessageSquare,
  Heart,
  Info,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useFaqStore from "@/stores/useFaqStore";

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { fetchAllFAQ, faqs, error, isLoading } = useFaqStore();

  useEffect(() => {
    fetchAllFAQ();
  }, [fetchAllFAQ]);

  const categories = [
    {
      id: "all",
      name: "All FAQs",
      icon: <Info size={18} />,
      count: faqs.length,
    },
    {
      id: "Chit Chat",
      name: "Chat",
      icon: <MessageSquare size={18} />,
      count: faqs.filter((f) => f.category === "Chit Chat").length,
    },
    {
      id: "Cancellation",
      name: "Cancellation",
      icon: <Heart size={18} />,
      count: faqs.filter((f) => f.category === "Cancellation").length,
    },
    {
      id: "Booking",
      name: "Reservations",
      icon: <Hotel size={18} />,
      count: faqs.filter((f) => f.category === "Booking").length,
    },
    {
      id: "Goodbye",
      name: "Goodbye",
      icon: <MessageSquare size={18} />,
      count: faqs.filter((f) => f.category === "Goodbye").length,
    },
    {
      id: "General Info",
      name: "General",
      icon: <Info size={18} />,
      count: faqs.filter((f) => f.category === "General Info").length,
    },
  ];

  // Filter faqs
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Toggle FAQ expand
  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const faqVariants = {
    open: { height: "auto", opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-indigo-50 to-sky-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-700">
            Find answers to common questions about our hotel services, policies,
            and amenities.
          </p>
        </motion.div>

        {/* Search and Categories */}
        <motion.div
          className="mb-10 rounded-2xl bg-white p-6 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Search Box */}
          <div className="relative mb-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="text-blue-500" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full rounded-xl border-2 border-blue-100 bg-blue-50 px-12 py-4 text-blue-900 placeholder-blue-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500 hover:text-blue-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-blue-800">
              Categories
            </h2>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  variants={itemVariants}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
                    activeCategory === category.id
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md"
                      : "bg-white text-blue-800 shadow-sm hover:bg-blue-50"
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-blue-500" />
            <p className="text-lg text-blue-700">Loading FAQs...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            className="mb-8 rounded-xl bg-red-50 p-6 text-center shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-red-800">
              Error Loading Data
            </h3>
            <p className="text-red-600">
              {error || "Failed to fetch FAQs. Please try again later."}
            </p>
            <button
              onClick={fetchAllFAQ}
              className="mt-4 rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* FAQ List */}
        {!isLoading && !error && (
          <motion.div
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {filteredFaqs.length === 0 ? (
              <motion.div
                className="rounded-xl bg-white py-12 text-center shadow"
                variants={itemVariants}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Info className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-blue-800">
                  No FAQs found
                </h3>
                <p className="mx-auto max-w-md text-blue-600">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
              </motion.div>
            ) : (
              filteredFaqs.map((faq) => (
                <motion.div
                  key={faq._id}
                  className="overflow-hidden rounded-xl bg-white shadow transition-all duration-300 hover:shadow-lg"
                  variants={itemVariants}
                  layout
                >
                  <button
                    onClick={() => toggleFaq(faq._id)}
                    className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <h3 className="text-lg font-medium text-blue-900">
                      {faq.question}
                    </h3>
                    <div className="ml-4 flex-shrink-0 text-blue-500">
                      {expandedId === faq._id ? (
                        <ChevronUp size={24} />
                      ) : (
                        <ChevronDown size={24} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedId === faq._id && (
                      <motion.div
                        className="overflow-hidden px-6"
                        variants={faqVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="border-t border-blue-100 py-4">
                          <p className="mb-4 text-blue-700">{faq.answer}</p>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                              {faq.category.charAt(0).toUpperCase() +
                                faq.category.slice(1)}
                            </span>
                            <div className="flex gap-2">
                              <button className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                Helpful
                              </button>
                              <button className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                                Not Helpful
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {/* Contact Section */}
        <motion.div
          className="mt-16 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-2 text-2xl font-bold">Still have questions?</h2>
              <p className="max-w-md opacity-90">
                Our support team is available 24/7 to assist you with any
                inquiries.
              </p>
            </div>
            <motion.button
              className="rounded-xl bg-white px-8 py-3 font-medium text-blue-600 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Resources */}
        <motion.div
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Hotel className="text-blue-500" size={20} />
              Hotel Policies
            </h3>
            <p className="text-blue-600">
              Learn about our check-in/check-out times, cancellation policies,
              and more.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Utensils className="text-blue-500" size={20} />
              Dining Options
            </h3>
            <p className="text-blue-600">
              Explore our restaurants, room service, and special dining
              experiences.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-blue-800">
              <Heart className="text-blue-500" size={20} />
              Special Requests
            </h3>
            <p className="text-blue-600">
              Have a special request? Learn how we can accommodate your needs.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
