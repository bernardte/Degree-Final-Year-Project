import { useEffect, useRef } from "react";
import useNotificationStore from "@/stores/useNotificationStore";
//! using concurrency concept of producer and consumer concept, 
//! only one notification id can get the lock, 
//! and when the lock is done process(Mark as read), then release the lock.

// Shared queue to store notification IDs that should be marked as read
const readQueue: string[] = [];

// Flag to make sure only one notification is being marked at a time
let isReading = false;

// This function processes one notification at a time from the queue
const processQueue = (markAsRead: (id: string) => void) => {
  // If already processing or no notifications in the queue, do nothing
  if (isReading || readQueue.length === 0) return;

  // Lock the processing state to prevent overlapping
  isReading = true;

  // Get the next notification ID from the queue
  const nextId = readQueue.shift();

  if (nextId) {
    // Wait 1 second before marking it as read to simulate smooth user experience
    setTimeout(() => {
      markAsRead(nextId); // Mark the notification as read in the store
      isReading = false; // Unlock the state to allow the next one to process
      processQueue(markAsRead); // Continue to the next notification in the queue
    }, 1000);
  }
};

const useNotificationObserver = (notificationId: string, isRead: boolean) => {
  // Ref to access the DOM element for this specific notification
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  useEffect(() => {
    if (isRead) return;

    let observer: IntersectionObserver;

    // This function adds the notification ID to the queue when it becomes visible
    const onVisible = () => {
      if (!readQueue.includes(notificationId)) {
        readQueue.push(notificationId); // Add to the global queue
        processQueue(markAsRead); // Try to process (if not already processing)
      }
    };

    // Create an IntersectionObserver to detect when the element is at least 50% visible
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible(); // Start processing when the notification becomes visible
        }
      },
      { threshold: 0.5 }, // At least 50% of the element must be visible
    );

    // Start observing the element (if it exists)
    if (notificationRef.current) {
      observer.observe(notificationRef.current);
    }

    // Cleanup function when component unmounts or dependencies change
    return () => {
      if (observer) observer.disconnect(); // Stop observing to prevent memory leaks
    };
  }, [notificationId, markAsRead, isRead]);

  // Return the ref so the parent component can attach it to the DOM element
  return notificationRef;
};

export default useNotificationObserver;
