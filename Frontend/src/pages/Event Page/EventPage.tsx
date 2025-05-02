import Carousel from "@/layout/components/carousel-section/Carousel";
import EventPageIntroduce from "@/layout/components/introduction/EventPageIntroduce";
import EventRoomList from "@/constant/eventRoomList";
import EventTypes from "@/layout/components/event-page-component/EventTypes";
import UpcommingLocalEvents from "@/layout/components/event-page-component/UpcommingLocalEvents";
import EventInquireForm from "@/layout/components/event-page-component/EventInquireForm";
import useAuthStore from "@/stores/useAuthStore";

const EventPage = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 via-white/15 to-gray-200">
        {/* Hero Carousel */}
        <Carousel images={EventRoomList.map((event) => event.img)} />

        {/* Event Overview */}
        <EventPageIntroduce />

        {/* Event Types */}
        <EventTypes events={EventRoomList} title="Event Types We Host" />

        {/* Upcoming Local Events */}
        <UpcommingLocalEvents title=" Upcoming Local Events" />
        {/* Inquiry Form */}
        {user && <EventInquireForm title="Submit an Event Inquiry" /> }
        </div>
    );
};

export default EventPage;
