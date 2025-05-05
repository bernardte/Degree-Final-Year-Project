import Carousel from "@/layout/components/carousel-section/Carousel";
import EventPageIntroduce from "@/layout/components/introduction/EventPageIntroduce";
import EventRoomList from "@/constant/eventRoomList";
import EventTypes from "@/layout/components/event-page-component/EventTypes";
import EventInquireForm from "@/layout/components/event-page-component/EventInquireForm";

const EventPage = () => {

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 via-white/45 to-gray-200">
        {/* Hero Carousel */}
        <Carousel images={EventRoomList.map((event) => event.img)} />

        {/* Event Overview */}
        <EventPageIntroduce />

        {/* Event Types */}
        <EventTypes events={EventRoomList} title="Event Types We Host" />

        {/* Upcoming Local Events */}
        {/* Inquiry Form */}
        <EventInquireForm title="Event Enquiry Form" />
        </div>
    );
};

export default EventPage;
