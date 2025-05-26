import { Button } from "@/components/ui/button";
import AddNewFacilityDialog from "@/layout/components/admin-page-component/dialog-component/AddNewFacilityDialog";
import FacilityTable from "@/layout/components/admin-page-component/Facility-component/FacilityTable";
import Pagination from "@/layout/components/share-components/Pagination";
import useFacilityStore from "@/stores/useFacilityStore";
import { motion } from "framer-motion";
import { DoorClosed, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

// Animation constants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };
  
  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };
  
  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2,
      },
    },
  };

const AdminFacilityPage = () => {
    const { fetchPaginatedFacility, facilities, error, isLoading, totalPages, currentPage } = useFacilityStore();
    useEffect(() => {
      fetchPaginatedFacility(1);
    }, [fetchPaginatedFacility]);

    const [ openDialog, setOpenDialog ] = useState<boolean>(false);
    const handlePageChange = (page: number) => {
      fetchPaginatedFacility(page);
    }
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-3 text-3xl font-bold text-transparent drop-shadow-sm"
          >
            Facility Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-md text-gray-600"
          >
            Manage Facility listings, availability, and configurations
          </motion.p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="default"
            className="flex items-center gap-2 transition-all hover:shadow-md"
            onClick={() => setOpenDialog(true)}
          >
            <motion.span
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring" }}
            >
              <PlusCircle className="h-5 w-5" />
            </motion.span>
            <span className="font-semibold">Add New Facility</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Table card */}
      {facilities.length > 0 ? (
        <>
          <motion.div
            variants={cardVariants}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl shadow-blue-50/50 sm:p-6"
            whileHover={{
              boxShadow:
                "0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)",
            }}
          >
            <div className="before:animate-shine relative overflow-hidden rounded-lg before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
              <FacilityTable
                isLoading={isLoading}
                facilities={facilities}
                error={error}
              />
              {totalPages > 1 && (
                <Pagination
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </div>

            {/* Pagination section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
            >
              <span className="text-sm text-gray-500">
                Showing {facilities.length} results
              </span>
              <div className="flex space-x-2">{/* Pagination controls */}</div>
            </motion.div>
          </motion.div>
          <AddNewFacilityDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
          />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center px-4 py-12 text-center"
        >
          <div className="relative w-full max-w-md">
            {/* Background effect */}
            <div className="absolute -inset-2 rounded-3xl bg-blue-50/40 blur-xl" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
              {/* Animated icon */}
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="mb-6 inline-flex rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-4"
              >
                <DoorClosed className="h-12 w-12 animate-pulse text-blue-400/90" />
              </motion.div>

              {/* Content */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-blue-600/90">
                  No Facilities Found
                </h2>
                <p className="text-lg leading-relaxed text-blue-500/80">
                  Start to create a new Facilities
                </p>
              </div>

              {/* Animated decorative dots */}
              <div className="mt-6 flex justify-center space-x-2">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-blue-300"
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AdminFacilityPage
