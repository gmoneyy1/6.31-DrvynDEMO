import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { events, Event, formatDateTime } from '@/lib/api';
import { toast } from 'sonner';

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  category: string;
  color: string;
  date: string;
}

interface ScheduleContextType {
  scheduledBlocks: TimeBlock[];
  backendEvents: Event[];
  isLoading: boolean;
  addScheduledBlocks: (blocks: TimeBlock[]) => void;
  updateScheduledBlock: (id: string, updatedBlock: Partial<TimeBlock>) => void;
  removeScheduledBlock: (id: string) => void;
  loadEvents: () => Promise<void>;
  createEvent: (title: string, start: string, end: string) => Promise<void>;
  updateEvent: (eventId: number, title: string, start: string, end: string) => Promise<void>;
  deleteEvent: (eventId: number) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduledBlocks, setScheduledBlocks] = useState<TimeBlock[]>([]);
  const [backendEvents, setBackendEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadEvents = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('ScheduleContext: Already loading events, skipping...');
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('ScheduleContext: Loading events...');
      const response = await events.getAll();
      console.log('ScheduleContext: Events loaded successfully:', response.events);
      setBackendEvents(response.events);
    } catch (error) {
      console.error('ScheduleContext: Failed to load events:', error);
      // Don't show error toast for authentication failures or network errors
      if (error.message !== 'Failed to fetch events' && !error.message.includes('network')) {
        toast.error('Failed to load events');
      }
      // Set empty array instead of leaving undefined
      setBackendEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove isLoading from dependencies to prevent infinite loop

  // Don't automatically load events on mount - wait for user to be authenticated
  // useEffect(() => {
  //   loadEvents();
  // }, []);

  const addScheduledBlocks = (blocks: TimeBlock[]) => {
    setScheduledBlocks(prev => [...prev, ...blocks]);
  };

  const updateScheduledBlock = (id: string, updatedBlock: Partial<TimeBlock>) => {
    setScheduledBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, ...updatedBlock } : block
      )
    );
  };

  const removeScheduledBlock = (id: string) => {
    setScheduledBlocks(prev => prev.filter(block => block.id !== id));
  };

  const createEvent = async (title: string, start: string, end: string) => {
    try {
      const response = await events.create(title, start, end);
      if (response.success) {
        setBackendEvents(prev => [...prev, response.event]);
        toast.success('Event created successfully');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      toast.error('Failed to create event');
    }
  };

  const updateEvent = async (eventId: number, title: string, start: string, end: string) => {
    try {
      const response = await events.update(eventId, title, start, end);
      if (response.success) {
        setBackendEvents(prev => 
          prev.map(event => 
            event.id === eventId ? response.event : event
          )
        );
        toast.success('Event updated successfully');
      }
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event');
    }
  };

  const deleteEvent = async (eventId: number) => {
    try {
      const response = await events.delete(eventId);
      if (response.success) {
        setBackendEvents(prev => prev.filter(event => event.id !== eventId));
        toast.success('Event deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  return (
    <ScheduleContext.Provider value={{
      scheduledBlocks,
      backendEvents,
      isLoading,
      addScheduledBlocks,
      updateScheduledBlock,
      removeScheduledBlock,
      loadEvents,
      createEvent,
      updateEvent,
      deleteEvent
    }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}