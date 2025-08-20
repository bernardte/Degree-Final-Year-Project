import { DayPicker } from "react-day-picker";
import { useState, FormEvent } from "react";
import { CalendarDays, UserRound, Mail, Phone, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-day-picker/dist/style.css";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { motion } from "framer-motion";
import { phoneNumberValidation } from "@/utils/phoneNumberValidation";
import { emailValidation } from "@/utils/emailValidation";
import { formatMalaysianPhoneNumber } from "@/utils/formatPhoneNumber";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";

type FormData = {
  name: string;
  email: string;
  phone: string;
  guests: number;
  eventType: string;
  date: Date | undefined;
  message: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

const EventInquireForm = ({title} : { title: string }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    guests: 1,
    eventType: "",
    date: undefined,
    message: "",
  });
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const isSmallScreen = useIsSmallScreen();
  const { showToast } = useToast();

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (emailValidation(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (phoneNumberValidation(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    if (formData.guests < 1) newErrors.guests = "At least 1 guest required";
    if (!formData.eventType) newErrors.eventType = "Event type is required";
    if (!formData.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try{
      setIsSubmitting(true);
      const response = await axiosInstance.post("/api/event/event-enquiry", formData);
      console.log(formData);
      if(response.data){
        showToast("success", "successfully send!")
      }

      setFormData({ 
        message: "",
        name: "",
        email: "",
        phone: "",
        guests: 1,
        eventType: "",
        date: undefined,
      });
      
    }catch(error: any){
      console.log('Error in EventInquireForm: ', error?.response?.data?.error);
      showToast("error", error?.response?.data?.error);
    }finally{
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMalaysianPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  return (
    <section className="flex">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-[2.5rem] backdrop-blur-sm transition-all duration-300"
        >
          <span className="text-center text-2xl text-blue-400 font-bold mb-7">{title}</span>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* Name Input */}
            <div className="relative">
              <UserRound className="absolute top-6 left-4 h-5 w-5 -translate-y-1/2 text-blue-600/80" />
              <input
                type="text"
                aria-label="Full Name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full rounded-2xl border-2 ${errors.name ? "border-red-300" : "border-blue-100/80"} bg-white/90 py-3.5 pr-6 pl-12 text-gray-700 transition-all duration-300 placeholder:text-blue-300/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60`}
              />
              {errors.name && (
                <span className="absolute -bottom-2 left-0 text-sm text-red-500">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="relative space-y-3">
              <Mail className="absolute top-7 left-4 h-5 w-5 -translate-y-1/2 text-blue-600/80" />
              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full rounded-2xl border-2 ${errors.email ? "border-red-300" : "border-blue-100/80"} bg-white/90 py-3.5 pr-6 pl-12 text-gray-700 transition-all duration-300 placeholder:text-blue-300/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60`}
              />
              {errors.email && (
                <span className="absolute -bottom-2 left-0 text-sm text-red-500">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone Input */}
            <div className="relative space-y-3">
              <Phone className="absolute top-7 left-4 h-5 w-5 -translate-y-1/2 text-blue-600/80" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handlePhoneChange}
                className={`w-full rounded-2xl border-2 ${errors.phone ? "border-red-300" : "border-blue-100/80"} bg-white/90 py-3.5 pr-6 pl-12 text-gray-700 transition-all duration-300 placeholder:text-blue-300/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60`}
              />
              {errors.phone && (
                <span className="absolute -bottom-2 left-0 text-sm text-red-500">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Guests Input */}
            <div className="relative space-y-3">
              <Users className="absolute top-7 left-4 h-5 w-5 -translate-y-1/2 text-blue-600/80" />
              <input
                type="number"
                min={1}
                placeholder="Total Guests *"
                value={formData.guests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guests: Math.max(1, parseInt(e.target.value)),
                  })
                }
                className={`w-full rounded-2xl border-2 ${errors.guests ? "border-red-300" : "border-blue-100/80"} bg-white/90 py-3.5 pr-6 pl-12 text-gray-700 transition-all duration-300 placeholder:text-blue-300/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60`}
              />
              {errors.guests && (
                <span className="absolute -bottom-2 left-0 text-sm text-red-500">
                  {errors.guests}
                </span>
              )}
            </div>
          </div>

          {/* Event Type Select */}
          <div className="relative space-y-8">
            <Select
              value={formData.eventType}
              onValueChange={(value) =>
                setFormData({ ...formData, eventType: value })
              }
            >
              <SelectTrigger
                className={`w-full rounded-2xl border-2 ${errors.eventType ? "border-red-300" : "border-blue-100/80"} bg-white/90 py-6 pr-4 pl-5 text-gray-700 transition-all duration-300 hover:border-blue-400 focus:ring-4 focus:ring-blue-100/60`}
              >
                <SelectValue placeholder="Select Event Type *" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-blue-100/80 bg-white/95 backdrop-blur-sm">
                <SelectItem value="Wedding Ceremony">
                  Wedding Ceremony
                </SelectItem>
                <SelectItem value="Corporate Party">Corporate Party</SelectItem>
                <SelectItem value="Business Meeting">
                  Business Meeting
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.eventType && (
              <span className="absolute -bottom-6 left-0 text-sm text-red-500">
                {errors.eventType}
              </span>
            )}
          </div>

          {/* Date Picker */}
          <div className="relative space-y-5">
            <div
              className={`group relative flex cursor-pointer items-center justify-between rounded-2xl border-2 ${errors.date ? "border-red-300" : "border-blue-100/80"} bg-white/90 px-5 py-3.5 transition-all duration-300 hover:border-blue-400`}
              onClick={() => setOpenDatePicker(!openDatePicker)}
            >
              <span
                className={`text-md ${errors.date ? "border-red-400" : formData.date ? "text-gray-700" : "text-blue-300/90"}`}
              >
                {formData.date
                  ? formatDateInBookingCheckOut(formData.date)
                  : "Select Event Date *"}
              </span>
              <CalendarDays className="h-5 w-5 text-blue-600/80 transition-colors duration-300 group-hover:text-blue-500" />
            </div>
            {errors.date && (
              <span className="relative -top-5 left-0 text-sm text-red-500">
                {errors.date?.toString()}
              </span>
            )}

            {openDatePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 mt-3 -bottom-60 left-0"
              >
                <DayPicker
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({ ...formData, date });
                    setOpenDatePicker(false);
                  }}
                  mode="single"
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  disabled={(day) =>
                    day < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  defaultMonth={new Date()}
                  classNames={{
                    months:
                      "flex gap-6 bg-white/95 p-6 rounded-2xl shadow-xl border-2 border-blue-100 backdrop-blur-sm",
                    month: "w-full",
                    caption: "text-center font-bold mb-4 text-blue-600/90",
                    nav_button: "hover:bg-blue-50/80 rounded-lg p-2",
                    nav_button_previous: "absolute left-4",
                    nav_button_next: "absolute right-4",
                    table: "w-full border-collapse",
                    head_row: "text-blue-500/80",
                    head_cell: "text-sm font-semibold text-center py-2.5",
                    row: "text-center",
                    cell: "p-1",
                    day: "mx-auto h-10 w-10 rounded-full font-medium transition-colors hover:bg-blue-100/60",
                    day_selected: "!bg-blue-600/90 text-white font-semibold",
                    day_today: "border-2 border-blue-400/50",
                    day_disabled: "text-gray-300 hover:bg-transparent",
                  }}
                />
              </motion.div>
            )}
          </div>

          {/* Message Textarea */}
          <div className="relative">
            <textarea
              placeholder="Additional Requirement (Optional)"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className="w-full rounded-2xl border-2 border-blue-100/80 bg-white/90 px-5 py-3.5 text-gray-700 transition-all duration-300 placeholder:text-blue-300/90 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full cursor-pointer rounded-2xl bg-gradient-to-br from-blue-600/95 to-blue-500 py-4.5 text-lg font-bold text-white shadow-lg shadow-blue-300/40 transition-all duration-300 hover:shadow-blue-400/50 disabled:opacity-70"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing...
              </div>
            ) : (
              "Enquire Now"
            )}
          </motion.button>
        </motion.form>

    </section>
  );
};

export default EventInquireForm;

