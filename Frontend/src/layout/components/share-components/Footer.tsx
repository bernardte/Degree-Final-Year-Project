import { Link, NavLink } from "react-router-dom";
import list from "@/constant/navBarList";
import { Phone, Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import useSystemSettingStore from "@/stores/useSystemSettingStore";

const Footer = () => {
  const { fetchAllHotelInformationInCustomerSide, hotelInformation } = useSystemSettingStore();

  useEffect(() => {
    fetchAllHotelInformationInCustomerSide();
  }, [fetchAllHotelInformationInCustomerSide]);

  console.log(hotelInformation);

  return (
    <footer className="bg-blue-800 px-6 pt-10 pb-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">{hotelInformation?.name}</h2>
            <p className="max-w-xs text-sm text-blue-100">
              A luxurious escape in the heart of the city. Discover serenity and
              timeless elegance.
            </p>

            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-200" size={18} />
                <p className="text-sm text-blue-100">
                 {hotelInformation?.address}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-blue-200" size={18} />
                <p className="text-sm text-blue-100">{hotelInformation?.phone}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-blue-200" size={18} />
                <p className="text-sm text-blue-100">{hotelInformation?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 b-2 text-lg font-semibold">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {list.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-sm text-blue-100 transition-colors hover:text-white"
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies and Social */}
          <div>
            <h3 className="mb-4 pb-2 text-lg font-semibold">
              Policies & Info
            </h3>

            <div className="mb-6 space-y-3">
              <Link
                to="/cancelled-booking-policy"
                className="block text-sm text-blue-100 transition-colors hover:text-white"
              >
                Cancellation Policy
              </Link>

              <Link
                to="/faq"
                className="block text-sm text-blue-100 transition-colors hover:text-white"
              >
                FAQ
              </Link>

              <Link
                to="/privacy-policy"
                className="block text-sm text-blue-100 transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>

            <h3 className="mb-3 pb-2 text-lg font-semibold">
              Connect With Us
            </h3>

            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-blue-100 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-blue-100 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-blue-100 transition-colors hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-blue-700 pt-6 text-center text-sm text-blue-200">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              &copy; {new Date().getFullYear()} {hotelInformation?.name}. All rights
              reserved.
            </div>
            <div className="flex gap-4">
              <Link
                to="/terms"
                className="text-sm transition-colors hover:text-white"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                to="/sitemap"
                className="text-sm transition-colors hover:text-white"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
