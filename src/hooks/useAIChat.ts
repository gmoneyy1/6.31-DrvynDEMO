import { useState, useCallback } from 'react';
import { ai, AIResponse, AICommand } from '@/lib/api';
import { useSchedule } from '@/contexts/ScheduleContext';
import { toast } from 'sonner';

export const useAIChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const { createEvent, deleteEvent } = useSchedule();

  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim()) return;

    setIsLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('Sending message to AI:', input);
      const response: AIResponse = await ai.sendMessage(input);
      console.log('AI Response:', response);
      
      // Process AI commands
      let hasMessage = false;
      for (const command of response.commands) {
        console.log('Processing command:', command);
        switch (command.command) {
          case 'ADD':
            if (command.title && command.start && command.end) {
              console.log('Creating event:', command);
              await createEvent(command.title, command.start, command.end);
              toast.success(`Scheduled: ${command.title}`);
            }
            break;
          case 'REMOVE':
            // Handle event removal if needed
            break;
          case 'MESSAGE':
            if (command.text) {
              setMessages(prev => [...prev, { role: 'assistant', content: command.text! }]);
              hasMessage = true;
            }
            break;
        }
      }
      
      // If no MESSAGE command was provided, add a default confirmation
      if (!hasMessage && response.commands.some(cmd => cmd.command === 'ADD')) {
        const addedEvents = response.commands.filter(cmd => cmd.command === 'ADD');
        const eventNames = addedEvents.map(cmd => cmd.title).join(', ');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `I've successfully scheduled: ${eventNames}` 
        }]);
      }
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [createEvent]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
}; 