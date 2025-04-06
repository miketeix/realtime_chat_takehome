import { QueryClient } from "@tanstack/react-query";
import { Message } from "../types";

export const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => () => {
  if (ref.current) {
    setTimeout(() => {
      ref?.current?.scrollTo(0, ref.current.scrollHeight);
    }, 100)
  }
}

export const addMessageToQueryCache =
  (queryClient: QueryClient, queryKey: string) =>
    (newMessage: Message, replace: boolean = false) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData) return oldData;
        const newData = structuredClone(oldData)
        if (replace) {
          newData.pages[0].data[0] = newMessage
        } else {
          newData.pages[0].data.unshift(newMessage)
        }
        return newData;
      });
    }

export const isDifferentDate = (dateString1: string, dateString2: string) => {
  const date1 = new Date(dateString1).toLocaleDateString();
  const date2 = new Date(dateString2).toLocaleDateString();
  return date1 !== date2;
}
export const getDateLabel = (dateStr: string): string => {
  const today = new Date().toLocaleDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString();

  const date = new Date(dateStr).toLocaleDateString()
  if (date === today) return 'Today';
  if (date === yesterdayStr) return 'Yesterday';
  return date;
};