import React, { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import { ChatParticipants, Message } from '../types';
import { useFetchMessages } from '../hooks/useFetchMessages';
import { getDateLabel, isDifferentDate } from '../utilities';

interface MessageListProps {
  chatParticipants: ChatParticipants | undefined;
  listRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ 
  chatParticipants,
  listRef,
}) => {
  const [lastScrollHeight, setLastScrollHeight] = useState<number>(listRef?.current?.scrollHeight || 0);

  const {
    data: msgData,
    error: messagesError,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingMessages,
    isFetching,
    isRefetching,
    isError: isMessagesError,
  } =  useFetchMessages({
    userId: chatParticipants?.user?.id,
    contactNumber: chatParticipants?.contact?.number,
    fetchMessagesEnabled: !!chatParticipants
  });

  // Fetch next page on scroll top
  useEffect(() => {
    const handleScroll = async () => {
      if (listRef?.current?.scrollTop && listRef?.current?.scrollTop <= 30 && hasNextPage) {
        if (!isFetching && !isRefetching) {
          await fetchNextPage();

          const newScrollHeight = listRef?.current?.scrollHeight!;
          if (newScrollHeight !== lastScrollHeight) {
            listRef?.current?.scrollTo(0, newScrollHeight - lastScrollHeight);
            setLastScrollHeight(newScrollHeight);
          }
        }
      }
    };

    listRef?.current?.addEventListener('scroll', handleScroll);

    return () => {
      listRef?.current?.removeEventListener('scroll', handleScroll);
    };
  }, [listRef, hasNextPage, isFetching, isRefetching, fetchNextPage, lastScrollHeight, setLastScrollHeight]);

  //  Scroll to bottom on load
  useEffect(() => {
    if (msgData?.pages.length === 1) {
      const newScrollHeight = listRef?.current?.scrollHeight!;
      listRef?.current?.scrollTo(0, newScrollHeight);
    }
  }, [msgData, listRef]);

  return (
    <div 
      data-testid="message-list"
      className="flex-1 overflow-y-auto p-4 bg-gray-100" 
      ref={listRef}
    >
        {isLoadingMessages ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            Loading conversation...
          </div>
        ):  isMessagesError ? (
          <div className="flex justify-center items-center h-full text-red-400 text-lg">
            {messagesError.message}
          </div>
        ): (
          <>
            {msgData?.pages.map((group, i) => (
              <React.Fragment key={`group_${i}`}>
                {
                group.data && group.data.length 
                  && group.data.toReversed().map((message: Message, msgIndex: number, messageGroup: []) => (
                  <div key={message.id}>
                    {
                      messageGroup[msgIndex-1] && isDifferentDate(message.createdAt, (messageGroup[msgIndex-1] as Message).createdAt) &&
                      (<div className="relative flex py-4 items-center" key={`divider_${message.id}`}>
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-500 bg-gray-100 px-2 z-10">
                          {getDateLabel(message.createdAt)}
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>)
                    }
                    <MessageBubble
                      key={`message_${message.id}`}
                      message={message}
                    />
                  </div>
                ))}
              </React.Fragment>
            ))}
          </>
        )}

      </div>
  );
};

export default MessageList;