import Carousel from "@/layout/components/carousel-section/Carousel";
import RoomList from "@/layout/components/room-page-components/RoomList";
import RoomPageIntroduce from "@/layout/components/introduction/RoomPageIntroduce";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect } from "react";
import RoomRanking from "@/layout/components/room-page-components/RoomRanking";


const About = () => {
  const { rooms, fetchEachRoomsType, isLoading, error } = useRoomStore();
  console.log(rooms);
  useEffect(() => {
    fetchEachRoomsType();
  }, [fetchEachRoomsType]);
  
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-cyan-100 to-white" />
      <div className="relative z-10 flex flex-col">
        <Carousel category="room" />
        <RoomPageIntroduce />
        <RoomRanking />
        <RoomList rooms={rooms} title="Room" isLoading={isLoading} error={error}/>
      </div>
    </div>
  );
  
}
export default About;
