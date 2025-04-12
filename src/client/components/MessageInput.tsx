import React, { useState, useRef, useEffect } from 'react';
import { ChatParticipants, Message, MessagePayload, MessageStatus } from '../types';
import { useSendMessage } from '../hooks/useSendMessage';
import { useQueryClient } from '@tanstack/react-query';
import { MAX_MESSAGE_LENGTH, MESSAGES_QUERY_KEY } from '../utilities/constants';
import { addMessageToQueryCache } from '../utilities';
import { useIncomingMessageEvent } from '../hooks/useIncomingMessageEvent';


interface MessageInputProps {
  chatParticipants: ChatParticipants | undefined;
  scrollToChatBottom: ()=> void;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatParticipants, scrollToChatBottom }) => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();
  const messageEventData = useIncomingMessageEvent(chatParticipants);

  const queryClient = useQueryClient()
  const addMessageToList = addMessageToQueryCache(queryClient, MESSAGES_QUERY_KEY);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {

    if ( messageEventData && messageEventData?.from === chatParticipants?.contact.number) {
      addMessageToList({...messageEventData, direction:"incoming"});
      const receiveSound = new Audio('src/client/assets/sounds/message_receive.mp3');
      receiveSound.play();
    }
  }, [messageEventData, chatParticipants]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isPending || !chatParticipants?.contact) return;

    const messagePayload: MessagePayload = {
      content: message.slice(0,MAX_MESSAGE_LENGTH).trim(),
      to: [chatParticipants?.contact?.number],
      from: chatParticipants?.user?.number,
    };

    const now = new Date().toISOString();
    const tempMessage = {
      ...messagePayload,
      id: `temp_id_${now}`, 
      text: messagePayload.content,
      createdAt: now
    };
    addMessageToList(tempMessage);

    const sendSound = new Audio('src/client/assets/sounds/message_send.wav');
    sendSound.play();

    setMessage('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    scrollToChatBottom();


    sendMessage(messagePayload, {
      onSuccess: ({ data: newMessage }) => {
        const replaceLastMessage = true;
        addMessageToList(newMessage, replaceLastMessage);
      },
      onError: (error) => {
        console.error('Error sending message:', error);
        const replaceLastMessage = true;
        //mark most recent message as error
        addMessageToList({
          ...tempMessage,
          status: MessageStatus.FAILED
        }, replaceLastMessage);
      },
    });

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex items-center px-4 py-3 bg-white border-t border-gray-200">
      <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
        </svg>
      </button>

      <form onSubmit={handleSubmit} className="flex flex-1 items-center bg-gray-100 rounded-full mx-2 px-3 text-gray-900">
        <input
          data-testid="message-input"
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          ref={inputRef}
          disabled={isPending}
          className="flex-1 bg-transparent py-2 px-2 text-sm outline-none"
          maxLength={MAX_MESSAGE_LENGTH}
        />

        <button type="button" className="p-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
        </button>
      </form>

      <button
        data-testid="send-button"
        className={`p-2 rounded-full ${ !message.trim() || !!isPending
          ? 'bg-gray-200 text-gray-400 !cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-colors`}
        onClick={handleSubmit}
        disabled={!message.trim() || !!isPending}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;