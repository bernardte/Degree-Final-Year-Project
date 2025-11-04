import { Mail, Phone, MapPin } from "lucide-react";
import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { useEffect } from "react";

const ContactUsPage = () => {
  const { fetchAllHotelInformationInCustomerSide, hotelInformation } =
    useSystemSettingStore();

  useEffect(() => {
    fetchAllHotelInformationInCustomerSide();
  }, [fetchAllHotelInformationInCustomerSide]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-300 via-sky-200 to-white px-4 py-12 md:px-20">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow-2xl">
        <h2 className="mb-10 bg-gradient-to-r from-blue-500 to-sky-300 bg-clip-text text-center text-4xl font-extrabold text-transparent">
          Get in Touch with Us
        </h2>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-blue-700">
              Contact Information
            </h3>
            <p className="text-gray-600">
              We&apos;d love to hear from you! Whether you have a question or
              need assistance, feel free to reach out.
            </p>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <Mail className="text-blue-600" />
                <span>{hotelInformation?.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-600" />
                <span>{hotelInformation?.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <span>{hotelInformation?.address}</span>
              </li>
            </ul>

            <div className="mt-6 overflow-hidden rounded-xl shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d63553.16499015559!2d100.3093465!3d5.4058799!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304ac397ad2b7bd5%3A0x239ae45978a9b934!2sGeorge%20Town%2C%20Penang!5e0!3m2!1sen!2smy!4v1746538494732!5m2!1sen!2smy"
                width="100%"
                height="280"
                className="rounded-xl border-none"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <form
          //! Using getform for serverless contact us
            className="space-y-6"
            method="POST"
            action={"https://getform.io/f/awnywqkb"}
            encType="multipart/form-data"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                name="customer-name"
                placeholder="Your Name..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Subject of your message"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Write your message..."
                name="message"
                className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 text-lg font-medium text-white transition duration-200 hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
