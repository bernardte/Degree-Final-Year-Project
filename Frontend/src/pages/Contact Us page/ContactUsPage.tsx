const ContactUsPage = () => {
  return (
    <section className="min-h-screen bg-gray-50 px-4 py-12 md:px-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Contact Us
        </h2>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-xl font-semibold">Get in Touch</h3>
            <p className="mb-4 text-gray-600">
              We're happy to answer any questions you may have.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Email:</strong> support@yourhotel.com
              </li>
              <li>
                <strong>Phone:</strong> +60 123-456-789
              </li>
              <li>
                <strong>Address:</strong> 123 Beach Street, Kuala Lumpur,
                Malaysia
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700"
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
