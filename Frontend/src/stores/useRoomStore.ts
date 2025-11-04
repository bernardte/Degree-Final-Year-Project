import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { Room, RoomDefaultWithBreakfast } from "@/types/interface.type";
import useBookingSessionStore from "./useBookingSessionStore";

interface roomStore {
  rooms: Room[];
  mostBookingRoom: Room[];
  room: Room;
  filterRoom: Room[];
  mostPopularBookedRoom: Room[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  error: string | null;
  searchParams: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
  };
  createNewRoom: (addNewRoom: Room) => void;
  removeRoomById: (roomId: string) => void;
  updateRoomById: (roomId: string, updatedRoomData?: Partial<Room>) => void;
  setRooms: (rooms: Room[]) => void;
  setSearchParams: (params: {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
  }) => void;
  fetchRooms: () => Promise<void>;
  fetchPaginatedRooms: (page: number) => Promise<void>;
  fetchEachRoomsType: () => Promise<void>;
  fetchRoomById: (id: string | undefined) => Promise<void>;
  removeRoomImage: (roomId: string, imageIndex: number) => void;
  //! record is a utility type that allow the definition of an
  //! object structure with specific key and value types.
  //! It is defined as Record<K, T>, where K represents
  //! the type of the keys and T represents the type of the values.
  fetchRoomsInFilter: (filter: Record<string, any>) => Promise<void>;
  fetchRoomRanking: () => Promise<void>;
  handleUpdateBreakfast: (
    breakfastCount: number,
    sessionId: string,
  ) => Promise<void>;
  updateSelectedRoomBreakfast: (roomId: string, sessionId: string) => void;
  fetchRoomCalendarView: () => Promise<void>;
}

const useRoomStore = create<roomStore>((set, get) => ({
  rooms: [],
  mostPopularBookedRoom: [],
  mostBookingRoom: [],
  room: {} as Room,
  filterRoom: [],
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  searchParams: {
    checkInDate: "",
    checkOutDate: "",
    adults: 1,
    children: 0,
  },
  error: null,
  setSearchParams: (params) => set({ searchParams: { ...params } }),
  fetchPaginatedRooms: async (page: number, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/rooms/?page=${page}&limit=${limit}`);
      const { rooms, totalPages, currentPage } = response?.data;
      set({ rooms, totalPages, currentPage });
    } catch (error: any) {
      set({ isLoading: false, error: error.message, rooms: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/rooms/get-all-rooms");
      set({
        rooms: response.data.map((room: Room) => ({
          ...room,
          defaultBreakfast: room.breakfastIncluded, // Record whether breakfast was originally served
        })),
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message, rooms: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEachRoomsType: async () => {
    set({ isLoading: true, error: null });
    try {

      const metadata = {
        page: "http://localhost:3000/room-suite",
        actionId: "view each room type",
        params: {},
        extra: {}
      };

      const response = await axiosInstance.get(`/api/rooms/get-each-room-type`, {
        params: {
          type: "page view",
          metadata: JSON.stringify(metadata)
        }
      });
      const data = response.data;
      set({ rooms: data });
    } catch (error: any) {
      set({ isLoading: false, error: error.mesage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoomById: async (id: string | undefined) => {
    set({ isLoading: true, error: null });
    try {
      const metadata = {
        page: `http://localhost:3000/room-suite/room/${id}`,
        actionId: "button view room",
        params: { roomId: id },
        extra: {}
      }

      const response = await axiosInstance.get(`/api/rooms/room/${id}`, {
        params: {
          type: "page view",
          metadata: JSON.stringify(metadata)
        },
      });
      const data = response.data;
      console.log(data);
      set({ room: data });
    } catch (error: any) {
      set({ isLoading: false, error: error.mesage });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRoomsInFilter: async (filters = {}) => {
    set({ isLoading: true, error: null });

    try {

      const metadata = {
        page: `http://localhost:3000/filter-room`,
        actionId: "filter rooms",
        params: filters,
        extra: {},
      };

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([Key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((URLParams) => params.append(Key, URLParams));
        } else if (value !== undefined && value !== null && value !== "") {
          params.append(Key, value.toString());
        }
      });

     params.append("type", "action");
     params.append("metadata", JSON.stringify(metadata));

      const response = await axiosInstance.get(`/api/rooms/filter?${params.toString()}`);
      console.log("testing:", response.data);
      set({ filterRoom: response.data.filteredRooms });
      set({
        mostPopularBookedRoom: response.data.topBookedRooms,
      }); //get the most booking room

      if (response.data.error) {
        set({ error: response.data.error });
      }
    } catch (error: any) {
      console.log("Error in the fetchRoomsInFilter", error.message);
      set({ error: error, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  setRooms: (rooms) => {
    set({ filterRoom: rooms });
  },

  removeRoomById: (roomId) => {
    set((prevState) => ({
      rooms: prevState.rooms.filter((room) => room._id !== roomId),
      filterRoom: prevState.rooms.filter((room) => room._id !== roomId),
    }));
  },

  removeRoomImage: (roomId: string, imageIndex: number) => {
    set((prevState) => {
      const updateRooms = prevState.rooms.map((room) =>
        room._id === roomId
          ? {
              ...room,
              images: room.images.filter((_, index) => index !== imageIndex),
            }
          : room,
      );

      return { rooms: updateRooms };
    });
  },

  updateRoomById: (roomId: string, updatedRoomData?: Partial<Room>) => {
    set((prevState) => ({
      rooms: prevState.rooms.map((room) =>
        room._id === roomId ? { ...room, ...updatedRoomData } : room,
      ),
      filterRoom: prevState.filterRoom.map((room) =>
        room._id === roomId ? { ...room, ...updatedRoomData } : room,
      ),
    }));
  },

  createNewRoom: (addNewRoom) => {
    set((prevState) => ({
      rooms: [addNewRoom, ...prevState.rooms],
      filterRoom: [addNewRoom, ...prevState.filterRoom],
    }));
  },

  fetchRoomRanking: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/rooms/most-booking-room");
      set({ mostBookingRoom: response?.data });
    } catch (error: any) {
      console.log("Error in fetchRoomRanking: ", error?.response?.data?.error);
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },

  handleUpdateBreakfast: async (breakfastCount: number, sessionId: string) => {
    try {
      const metadata = {
        page: "http://localhost:3000/booking/confirm/" + sessionId,
        actionId: "add breakfast",
        params: {
          bookingSessionId: sessionId,
          breakfastCount: breakfastCount
        },
      };
      const response = await axiosInstance.patch(
        "/api/bookings/update-breakfast-count/" + sessionId,
        {
          breakfastCount,
          type: "action",
          metadata: JSON.stringify(metadata),

        },
      );

      useBookingSessionStore.getState().setBreakfastCount(response.data);
    } catch (error: any) {
      console.log(
        "Error in handleUpdateBreakfast",
        error?.response?.data?.error,
      );
    }
  },

  updateSelectedRoomBreakfast: async (roomId: string, sessionId: string) => {
    let breakfastCount = 0
    set((prevState) => {
      const updatedRooms = prevState.rooms.map((room) =>
        room._id === roomId
          ? { ...room, breakfastIncluded: !room.breakfastIncluded }
          : room,
      );

      // calculate breakfast
       breakfastCount = updatedRooms.reduce((count, r) => {
         if (!(r as RoomDefaultWithBreakfast).defaultBreakfast && r.breakfastIncluded) {
           return count + 1;
         }
         return count;
       }, 0);


       useBookingSessionStore.getState().setBreakfastCount(breakfastCount);
      
      return { ...prevState, rooms: updatedRooms };
    });

      //send to backend and update booking session breakfast count
      await get().handleUpdateBreakfast(breakfastCount, sessionId);
  },

  fetchRoomCalendarView: async () => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/rooms/get-room-view-calendar")
      .then((response) => {
        if (response.data) {
          set({ rooms: response?.data });
        }
      })
      .catch((error) => set({ error: error?.response?.data?.error }))
      .finally(() => set({ isLoading: false }));
  },
}));

export default useRoomStore;


