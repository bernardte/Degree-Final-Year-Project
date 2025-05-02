import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState, useEffect } from "react";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import LeftSidebar from "../../layout/components/Filter-page-component/LeftSidebar";
import useRoomStore from "@/stores/useRoomStore";
import FilterContent from "@/layout/components/Filter-page-component/FilterContent";
import useToast from "@/hooks/useToast";
import debounce from "lodash/debounce";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Room } from "@/types/interface.type";

const FilteredRoomsPage = () => {
  const isMobile = useIsSmallScreen();

  // Define the filters state
  const [filters, setFilters] = useState({});

  // Access required methods and states from Zustand store
  const { fetchRoomsInFilter, error, filterRoom, searchParams, isLoading, fetchRooms } =
    useRoomStore();
  const { showToast } = useToast();
  const [selectedRoom, setSelectedRoom] = useState<Room[]>([]);
  console.log(searchParams);

  const debouncedFetchRooms = debounce((filters) => {
    fetchRoomsInFilter(filters);
    fetchRooms();
  }, 500);

  // Effect to fetch filtered rooms when filters change
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      debouncedFetchRooms(filters);

      return () => {
        debouncedFetchRooms.cancel();
      };
    }
  }, [filters]); // Trigger on filters change

  if (error) {
    showToast("error", error);
    return;
  }

  return (
    <section className="h-screen w-screen bg-gray-50 text-gray-800">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Sidebar for filters */}
        <ResizablePanel
          defaultSize={20}
          minSize={isMobile ? 10 : 15}
          maxSize={25}
          className="flex h-full flex-col"
        >
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full overflow-y-auto">
              <LeftSidebar
                onFilterChange={setFilters}
                selectedRoom={selectedRoom}
              />
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-[3px] bg-blue-300 transition-all duration-200 hover:bg-blue-500" />

        {/* Main Content */}
        <ResizablePanel defaultSize={80} className="h-full">
          <FilterContent
            filterRoom={filterRoom}
            isLoading={isLoading}
            selectedRoom={selectedRoom}
            setSelectedRoom={setSelectedRoom}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  );
};

export default FilteredRoomsPage;
