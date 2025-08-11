import axiosInstance from "@/lib/axios";
import { Invoice } from "@/types/interface.type";
import { create } from "zustand";

interface InvoiceStore {
  invoice: Invoice | null;
  isLoading: boolean;
  error: null | string;
  fetchCurrentUserInvoice: (invoiceId: string) => Promise<void>;
}

const useInvoiceStore = create<InvoiceStore>()((set) => ({
  invoice: null,
  error: null,
  isLoading: false,
  fetchCurrentUserInvoice: async (invoiceId: string) => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/invoices/invoice/" + invoiceId)
      .then((response) => set({ invoice: response?.data }))
      .catch((error) => set({ error: error?.response?.data?.error }))
      .finally(() => set({ isLoading: false }));
  },
}));

export default useInvoiceStore;
