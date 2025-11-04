import EventCalendarView from '@/layout/components/calendar/EventCalendarView';
import useEventsStore from '@/stores/useEventsStore';
import { useEffect } from 'react'

const AdminEventCalendarPage = () => {
    const { fetchEventsForCalendarView, isLoading, error, events, totalEvents } =
      useEventsStore((state) => state);
      
    useEffect(() => {
      fetchEventsForCalendarView();
    }, [fetchEventsForCalendarView]);

    return (
      <div>
        <EventCalendarView
          events={events}
          isLoading={isLoading}
          error={error}
          totalEvents={totalEvents}
        />
      </div>
    );
}

export default AdminEventCalendarPage;
