// src/components/InvoiceDetail.js
import { useEffect } from "react";
import {
  Hotel,
  User,
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Bed,
  Wifi,
  Gift,
  BadgeCheck,
  Info,
} from "lucide-react";
import useInvoiceStore from "@/stores/useInvoiceStore";
import { useParams } from "react-router-dom";
import { Bookings, InvoiceWithBookingDetail, Room } from "@/types/interface.type";
import { formatDate, formatDateInBookingCheckOut } from "@/utils/formatDate";
import { differenceInCalendarDays } from "date-fns";

const InvoiceDetail = () => {
  // Hotel invoice data
  const invoiceData = {
    invoiceNumber: "HOTEL-INV-2023-00142",
    issueDate: "2023-11-15",
    dueDate: "2023-11-20",
    status: "Paid",
    hotel: {
      name: "The Seraphine Hotel",
      address: "George Town, Penang, Malaysia",
      email: "theSeraphineHotel@gmail.com",
      phone: "+60 123456789",
      website: "www.theseraphinehotel.com",
    },
    policies: [
      "Cancellation must be made 48 hours prior to arrival",
      "No-show fee equivalent to one night stay",
      "Check-in time: 3:00 PM, Check-out time: 12:00 PM",
    ],
  };

  const { fetchCurrentUserInvoice, invoice } = useInvoiceStore(
    (state) => state,
  );
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      fetchCurrentUserInvoice(id);
    }
  }, [fetchCurrentUserInvoice]);

  const handleCalculateStayNight = () => {
    const checkInDate = (invoice as unknown as InvoiceWithBookingDetail)
      ?.bookingId?.startDate;
    const checkoutDate = (invoice as unknown as InvoiceWithBookingDetail)
      ?.bookingId?.endDate;

    return differenceInCalendarDays(checkoutDate, checkInDate);
  };

  const nights = handleCalculateStayNight();

  const subtotal =
    (invoice?.bookingId as InvoiceWithBookingDetail["bookingId"])?.room?.reduce(
      (acc, rm) => acc + rm.pricePerNight * nights,
      0,
    ) || 0;

  const totalBreakfastVoucher = (invoice?.bookingId as Bookings)
                ?.breakfastIncluded || 0;
  return (
    <div className="p-6 print:p-0">
      {/* Header with hotel branding */}
      <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 pb-6 md:flex-row md:items-center">
        <div className="flex items-center">
          <div className="mr-4 rounded-xl bg-blue-100 p-3">
            <Hotel className="text-blue-700" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              The Seraphine Hotel
            </h1>
            <p className="font-medium text-blue-600">Reservation Invoice</p>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div className="flex items-center text-xl font-bold text-gray-800">
            <Hotel className="mr-2 text-blue-600" size={20} />
            Invoice #: {invoice?.invoiceNumber}
          </div>
          <div className="mt-1 flex items-center">
            <span
              className={`RM rounded-full px-3 py-1 text-sm font-medium ${
                invoiceData?.status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <BadgeCheck className="mr-1 inline" size={16} />
              {invoiceData.status}
            </span>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <CalendarDays className="mr-2 text-gray-500" size={16} />
            <span className="font-medium">Issued On:</span>&nbsp;
            {invoice?.invoiceDate ? formatDate(invoice.invoiceDate) : ""}
          </div>
        </div>
      </div>

      {/* Hotel & Guest Info */}
      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Hotel Info */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
          <div className="mb-3 flex items-center">
            <Hotel className="mr-2 text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              Hotel Information
            </h3>
          </div>
          <p className="font-bold text-gray-800">{invoiceData.hotel.name}</p>
          <div className="mt-3 flex items-start text-gray-600">
            <MapPin
              className="mt-0.5 mr-2 flex-shrink-0 text-gray-500"
              size={16}
            />
            <span>{invoiceData.hotel.address}</span>
          </div>
          <div className="mt-2 flex items-center text-gray-600">
            <Phone className="mr-2 text-gray-500" size={16} />
            {invoiceData.hotel.phone}
          </div>
          <div className="mt-2 flex items-center text-gray-600">
            <Mail className="mr-2 text-gray-500" size={16} />
            {invoiceData.hotel.email}
          </div>
          <div className="mt-2 flex items-center text-gray-600">
            <Wifi className="mr-2 text-gray-500" size={16} />
            {invoiceData.hotel.website}
          </div>
        </div>

        {/* Guest Info */}
        <div className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-teal-50 p-5">
          <div className="mb-3 flex items-center">
            <User className="mr-2 text-cyan-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              Guest Information
            </h3>
          </div>
          <p className="font-bold text-gray-800">{invoice?.billingName}</p>
          <div className="mt-3 flex items-center text-gray-600">
            <Mail className="mr-2 text-gray-500" size={16} />
            {invoice?.billingEmail}
          </div>
          {invoice?.billingPhoneNumber && (
            <div className="mt-2 flex items-center text-gray-600">
              <Phone className="mr-2 text-gray-500" size={16} />
              {invoice?.billingPhoneNumber}
            </div>
          )}
          <div className="mt-2 flex items-center text-gray-600 capitalize">
            <Gift className="mr-2 text-gray-500" size={16} />
            Loyalty Member: {invoice?.loyaltyTier}
          </div>
        </div>
      </div>

      {/* Booking Details */}
      <div className="mb-10 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-5">
        <div className="mb-4 flex items-center">
          <CalendarDays className="mr-2 text-teal-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Booking Details
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Reservation ID</p>
            <p className="font-medium text-gray-800">
              {invoice?.bookingReference}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Check-in Date</p>
            <p className="flex items-center font-medium text-gray-800">
              <CalendarDays className="mr-1 text-teal-500" size={16} />
              {formatDateInBookingCheckOut(
                (invoice as unknown as InvoiceWithBookingDetail)?.bookingId
                  ?.startDate,
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Check-out Date</p>
            <p className="flex items-center font-medium text-gray-800">
              <CalendarDays className="mr-1 text-teal-500" size={16} />
              {formatDateInBookingCheckOut(
                (invoice as unknown as InvoiceWithBookingDetail)?.bookingId
                  ?.endDate,
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div>
            <p className="text-sm text-gray-500">Nights</p>
            <p className="font-medium text-gray-800">{nights}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Room Type</p>
            <div className="flex flex-wrap items-center gap-2">
              <Bed className="text-teal-500" size={16} />
              {(
                invoice as unknown as InvoiceWithBookingDetail
              )?.bookingId?.room?.map((rm: Room) => (
                <span
                  key={rm?._id}
                  className="rounded-full bg-teal-100 px-2 py-1 text-sm text-teal-800 capitalize"
                >
                  {rm.roomType} Room
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500">Guests</p>
            <p className="font-medium text-gray-800">
              {
                (invoice as unknown as InvoiceWithBookingDetail)?.bookingId
                  ?.totalGuests?.adults
              }{" "}
              Adults,{" "}
              {
                (invoice as unknown as InvoiceWithBookingDetail)?.bookingId
                  ?.totalGuests.children
              }{" "}
              Children
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rooms</p>
            <p className="font-medium text-gray-800">{invoice?.roomCount}</p>
          </div>
        </div>
      </div>

      {/* Charges Table */}
      <div className="mb-10">
        <div className="mb-4 flex items-center">
          <CreditCard className="mr-2 text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            Charges Summary
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {(
                invoice?.bookingId as InvoiceWithBookingDetail["bookingId"]
              )?.room.map((rm) => (
                <tr key={rm._id}>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-800 capitalize">
                    {rm.roomType} Room ({nights} night @ RM{" "}
                    {rm.pricePerNight.toFixed(2)} / night)
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-800">
                    RM {(rm.pricePerNight * nights).toFixed(2)}
                  </td>
                </tr>
              ))}

              {totalBreakfastVoucher > 0 && (
                <tr>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-800 capitalize">
                    Breakfast Voucher ( {totalBreakfastVoucher} x RM 30.00 )
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-800">
                    RM {(30 * totalBreakfastVoucher).toFixed(2)}
                  </td>
                </tr>
              )}

              {invoice?.reward[0] > 0 && (
                <>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-800">
                      Subtotal
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-gray-800">
                      RM {subtotal?.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-800">
                      <div className="flex items-center">
                        <Gift className="mr-2 text-green-500" size={16} />
                        {invoice?.reward[0]?.reward?.name} (
                        {invoice?.reward[0]?.reward?.description})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap text-red-600">
                      -RM{invoice?.rewardDiscount.toFixed(2)}
                    </td>
                  </tr>
                </>
              )}

              <tr className="bg-blue-50">
                <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-gray-800">
                  Total Amount
                </td>
                <td className="px-6 py-4 text-right text-xl font-bold whitespace-nowrap text-blue-700">
                  RM {invoice?.invoiceAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment & Policies */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Payment Information */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-5">
          <div className="mb-3 flex items-center">
            <CreditCard className="mr-2 text-indigo-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Information
            </h3>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">
                {invoice?.paymentMethod?.toLowerCase() === "fpx"
                  ? "FPX Online Banking"
                  : invoice?.paymentMethod
                      ?.split(" ") //space split
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      ) //every start character become uppercase
                      .join(" ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{invoice?.paymentIntentId}</span>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-indigo-200 bg-white p-4">
            <div className="flex items-center">
              <Info className="mr-2 text-indigo-500" size={18} />
              <p className="text-sm text-gray-600">
                Payment processed successfully on{" "}
                {invoice?.paymentDate ? formatDate(invoice?.paymentDate) : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Hotel Policies */}
        <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
          <div className="mb-3 flex items-center">
            <Info className="mr-2 text-amber-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              Hotel Policies
            </h3>
          </div>

          <ul className="mt-4 space-y-3">
            {invoiceData.policies.map((policy, index) => (
              <li key={index} className="flex items-start">
                <span className="mt-1 mr-2 text-amber-500">•</span>
                <span className="text-gray-600">{policy}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-amber-200 bg-white p-4">
            <div className="flex items-center">
              <Info className="mr-2 text-amber-500" size={18} />
              <p className="text-sm text-gray-600">
                Please present this invoice at check-in along with your ID
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
        <p>
          Thank you for choosing The Seraphine Hotel! We look forward to serving
          you.
        </p>
        <p className="mt-4 text-xs">
          Invoice generated on {formatDate(new Date().toLocaleDateString())}
        </p>
      </div>
    </div>
  );
};

export default InvoiceDetail;
