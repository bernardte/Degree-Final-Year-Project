import Carousel from "@/layout/components/carousel-section/Carousel";
import EventRoomList from "@/constant/eventRoomList";
import EventTypes from "@/layout/components/event-page-component/EventTypes";
import EventInquireForm from "@/layout/components/event-page-component/EventInquireForm";
import { Calendar, MapPin, Users } from "lucide-react";
import Testimonial from "@/layout/components/event-page-component/Testimonial";
import { useState } from "react";
import CTASection from "@/layout/components/event-page-component/CTASection";
import EventOverview from "@/layout/components/event-page-component/EventOverview";

const EventPage = () => {
    const [openForm, setOpenForm] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Carousel */}
      <div className="relative">
        <Carousel images={EventRoomList.map((event) => event.img)} />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-blue-900/80 to-transparent">
          <div className="mx-auto w-full max-w-7xl px-4 py-12">
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Host Your Dream Event
            </h1>
            <p className="max-w-2xl text-xl text-blue-100">
              Elegant venues and exceptional service for unforgettable
              experiences
            </p>
          </div>
        </div>
      </div>

      {/* Event Highlights */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
            <div className="mr-4 rounded-full bg-blue-100 p-4">
              <Users className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Versatile Spaces</h3>
              <p className="text-gray-600">Accommodate 10 to 500 guests</p>
            </div>
          </div>

          <div className="flex items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
            <div className="mr-4 rounded-full bg-blue-100 p-4">
              <MapPin className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Prime Location</h3>
              <p className="text-gray-600">Central downtown with easy access</p>
            </div>
          </div>

          <div className="flex items-center rounded-xl border border-blue-100 bg-white p-6 shadow-lg">
            <div className="mr-4 rounded-full bg-blue-100 p-4">
              <Calendar className="text-2xl text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Flexible Scheduling</h3>
              <p className="text-gray-600">24/7 availability for your needs</p>
            </div>
          </div>
        </div>
      </div>


      {/* Event Types */}
      <EventTypes events={EventRoomList} title="Our Event Spaces" />

      {/* Event Overview */}
        <EventOverview />

      {/* Inquiry Form */}
      {openForm === true && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpenForm(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl mt-7">
            <EventInquireForm title={"Event Request Form"} />
          </div>
        </>
      )}

      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        <Testimonial />
      </div>

      {/* CTA Section */}
      <CTASection setOpenForm={setOpenForm}/>
    </div>
  );
};

export default EventPage;
