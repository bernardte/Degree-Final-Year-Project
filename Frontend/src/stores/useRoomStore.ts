import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { Room } from "@/types/interface.type";

interface roomStore {
  rooms: Room[];
  mostBookingRoom: Room[];
  room: Room;
  filterRoom: Room[];
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
  //! record is a utility type that allow the definition of an
  //! object structure with specific key and value types.
  //! It is defined as Record<K, T>, where K represents
  //! the type of the keys and T represents the type of the values.
  fetchRoomsInFilter: (filter: Record<string, any>) => Promise<void>;
  fetchRoomRanking: () => Promise<void>;
}

const useRoomStore = create<roomStore>((set) => ({
  rooms: [],
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
  fetchPaginatedRooms: async (page: number, limit = 5) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/api/rooms/?page=${page}&limit=${limit}`,
      );
      const { rooms, totalPages, currentPage } = response?.data
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
      const response = await axiosInstance.get("/api/rooms/");
      set({ rooms: response.data });
    } catch (error: any) {
      set({ isLoading: false, error: error.message, rooms: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEachRoomsType: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/rooms/get-each-room-type`);
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
      const response = await axiosInstance.get(`/api/rooms/room/${id}`);
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
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([Key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((URLParams) => params.append(Key, URLParams));
        } else if (value !== undefined && value !== null && value !== "") {
          params.append(Key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `/api/rooms/filter?${params.toString()}`,
      );
      set({ filterRoom: response.data });

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
}));

export default useRoomStore;