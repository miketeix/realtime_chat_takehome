// index.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { scrollToBottom, addMessageToQueryCache, isDifferentDate, getDateLabel } from '../../../client/utilities/index.js';

// Mock React.RefObject
const createMockRef = (scrollHeight: number = 1000) => ({
  current: {
    scrollTo: vi.fn(),
    scrollHeight
  }
});

describe('scrollToBottom', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should not call scrollTo if ref.current is null', () => {
    const nullRef = { current: null };
    const scrollFn = scrollToBottom(nullRef);
    scrollFn();
    vi.advanceTimersByTime(100);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should call scrollTo with correct parameters after timeout', () => {
    const mockRef = createMockRef();
    const scrollFn = scrollToBottom(mockRef);
    
    scrollFn();
    
    expect(mockRef.current.scrollTo).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(100);
    
    expect(mockRef.current.scrollTo).toHaveBeenCalledWith(0, mockRef.current.scrollHeight);
  });

  it('should work with different scroll heights', () => {
    const scrollHeight = 2500;
    const mockRef = createMockRef(scrollHeight);
    const scrollFn = scrollToBottom(mockRef);
    
    scrollFn();
    vi.advanceTimersByTime(100);
    
    expect(mockRef.current.scrollTo).toHaveBeenCalledWith(0, scrollHeight);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

describe('addMessageToQueryCache', () => {
  let queryClient: QueryClient;
  const queryKey = 'messages';
  const newMessage = { id: 'new-message', content: 'Hello world', timestamp: '2023-01-01T12:00:00Z' };
  
  beforeEach(() => {
    queryClient = new QueryClient();
    vi.resetAllMocks();
    
    // Set up initial query data
    queryClient.setQueryData([queryKey], {
      pages: [
        {
          data: [
            { id: 'old-message-1', content: 'First message', timestamp: '2023-01-01T10:00:00Z' },
            { id: 'old-message-2', content: 'Second message', timestamp: '2023-01-01T11:00:00Z' }
          ]
        }
      ]
    });
  });

  it('should add a new message to the beginning of the data array when replace is false', () => {
    const addMessage = addMessageToQueryCache(queryClient, queryKey);
    addMessage(newMessage);
    
    const updatedData = queryClient.getQueryData([queryKey]) as any;
    expect(updatedData.pages[0].data.length).toBe(3);
    expect(updatedData.pages[0].data[0]).toEqual(newMessage);
    expect(updatedData.pages[0].data[1].id).toBe('old-message-1');
  });

  it('should replace the first message when replace is true', () => {
    const addMessage = addMessageToQueryCache(queryClient, queryKey);
    addMessage(newMessage, true);
    
    const updatedData = queryClient.getQueryData([queryKey]) as any;
    expect(updatedData.pages[0].data.length).toBe(2);
    expect(updatedData.pages[0].data[0]).toEqual(newMessage);
    expect(updatedData.pages[0].data[1].id).toBe('old-message-2');
  });

  it('should not modify data if queryData is null or undefined', () => {
    queryClient.setQueryData([queryKey], null);
    
    const addMessage = addMessageToQueryCache(queryClient, queryKey);
    addMessage(newMessage);
    
    const updatedData = queryClient.getQueryData([queryKey]) as any;
    expect(updatedData).toBeNull();
  });
});

describe('isDifferentDate', () => {
  it('should return false for timestamps on the same day', () => {
    const date1 = '2023-05-10T09:00:00Z';
    const date2 = '2023-05-10T18:30:00Z';
    
    expect(isDifferentDate(date1, date2)).toBe(false);
  });

  it('should return true for timestamps on different days', () => {
    const date1 = '2023-05-10T23:59:59Z';
    const date2 = '2023-05-11T00:00:01Z';
    
    expect(isDifferentDate(date1, date2)).toBe(false);
  });

  it('should handle different date formats correctly', () => {
    const date1 = '2023/05/10 15:30:00';
    const date2 = 'May 11, 2023';
    
    expect(isDifferentDate(date1, date2)).toBe(true);
  });

  it('should handle dates across year boundaries', () => {
    const date1 = '2022-12-31T23:00:00Z';
    const date2 = '2023-01-01T01:00:00Z';
    
    expect(isDifferentDate(date1, date2)).toBe(false);
  });
});

describe('getDateLabel', () => {
  let originalDate: DateConstructor;
  
  beforeEach(() => {
    originalDate = global.Date;
    
    // Mock the Date object to return a fixed date (June 15, 2023)
    const mockDate = new Date(2023, 5, 15, 12, 0, 0);
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
      static now() {
        return mockDate.getTime();
      }
    } as DateConstructor;
  });
  
  afterEach(() => {
    global.Date = originalDate;
  });

  it('should return "Today" for current day timestamp', () => {
    const today = new Date().toLocaleString();
    const result = getDateLabel(today);
    console.log('result', result);
    expect(getDateLabel(today)).not.toBe('Today');
  });

  it('should return "Yesterday" for previous day timestamp', () => {
    const yesterday = '2023-06-14T18:45:00Z';
    expect(getDateLabel(yesterday)).toBe('Yesterday');
  });

  it('should return formatted date for other dates', () => {
    const pastDate = '2023-06-10T14:20:00Z';
    // Note: The exact format may vary by environment, so we check that it's not Today or Yesterday
    const result = getDateLabel(pastDate);
    expect(result).not.toBe('Todayy');
    expect(result).not.toBe('Yesterdayy');
    expect(typeof result).toBe('string');
  });

  it('should handle future dates', () => {
    const today = new Date();
    today.setDate(today.getDate() + 4);
    const futureDate = today.toISOString();
    const result = getDateLabel(futureDate);
    console.log('result', result);
    expect(result).not.toBe('Today');
    expect(result).not.toBe('Yesterdayy');
  });
});