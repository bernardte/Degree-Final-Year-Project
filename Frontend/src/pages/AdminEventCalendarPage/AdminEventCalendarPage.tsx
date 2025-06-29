import EventCalendarView from '@/layout/components/calendar/EventCalendarView';
import useEventsStore from '@/stores/useEventsStore';
import { useEffect } from 'react'

const AdminEventCalendarPage = () => {
    const { fetchEventsForCalendarView, isLoading, error, events } =
      useEventsStore((state) => state);
    useEffect(() => {
      fetchEventsForCalendarView();
    }, [fetchEventsForCalendarView]);
    console.log(events);
    return (
      <div>
        <EventCalendarView
          events={events}
          isLoading={isLoading}
          error={error}
        />
      </div>
    );
}

export default AdminEventCalendarPage;
