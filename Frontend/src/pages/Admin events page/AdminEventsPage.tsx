import EventTable from "@/layout/components/admin-page-component/Event-component/EventTable";
import useEventsStore from "@/stores/useEventsStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
};

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

const AdminEventsPage = () => {
    const { events, isLoading, error, fetchAllEvents } = useEventsStore();

    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents])

    return (
        <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-8 lg:px-16"
        >
        {/* Header section */}
        <motion.div
            variants={headerVariants}
            className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
            <div className="space-y-1">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent drop-shadow-sm pb-3"
            >
                Events Management
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-md text-gray-600"
            >
                Manage event listings, availability, and configurations
            </motion.p>
            </div>
        </motion.div>

        {/* Table card */}
        <motion.div
            variants={cardVariants}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl shadow-blue-50/50 sm:p-6"
            whileHover={{
            boxShadow:
                "0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)",
            }}
        >
            <div className="before:animate-shine relative overflow-hidden rounded-lg before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
                <EventTable isLoading={isLoading} events={events} error={error}/>
            </div>

            {/* Pagination section */}
            <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
            >
            <span className="text-sm text-gray-500">Showing {events.length} results</span>
            <div className="flex space-x-2">{/* Pagination controls */}</div>
            </motion.div>
        </motion.div>
        </motion.div>
    );
};

export default AdminEventsPage;
