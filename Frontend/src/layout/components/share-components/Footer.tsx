import { NavLink } from "react-router-dom";
import list from "@/constant/navBarList";

const Footer = () => {
  return (
    <footer className="bg-[#3d60ca] px-6 pt-10 pb-6 text-white shadow-inner sm:px-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        {/* Brand Info */}
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold tracking-wide">
            The Seraphine Hotel
          </h2>
          <p className="text-sm text-blue-100">
            A luxurious escape in the heart of the city. Discover serenity and
            timeless elegance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            {list.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className="transition-colors hover:text-white hover:underline"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            Connect With Us
          </h3>
          <div className="flex space-x-5">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="transition-transform hover:scale-110 hover:text-blue-300"
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

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-transform hover:scale-110 hover:text-pink-300"
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

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-transform hover:scale-110 hover:text-blue-400"
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
      <div className="mt-10 border-t border-blue-400 pt-4 text-center text-sm text-blue-200">
        &copy; {new Date().getFullYear()} The Seraphine Hotel. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
