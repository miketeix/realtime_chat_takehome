import React from 'react';
import { MessageDirection, Message, MessageStatus } from '../types';

interface MessageBubbleProps {
  message: Message;
}

// Format timestamp
const formatTime = (timestamp: string) => {
return new Date(timestamp).toLocaleTimeString([], { 
  hour: '2-digit', 
  minute: '2-digit'
});

}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
}) => {

  const messageIncoming = message.direction === MessageDirection.Incoming;
  return (
    <div className={`flex items-end mb-3 ${messageIncoming ? '' : 'justify-end'}`}>
      
        <div className={`flex-shrink-0 mx-2 ${messageIncoming ? 'order-1' : 'order-2'}`}>
          <img 
            src={'src/client/assets/generic-avatar.svg'} 
            alt={messageIncoming? message.from :  "You"} 
            className="w-7 h-7 rounded-full object-cover"
          />
        </div>
      
      
      <div className={`max-w-xs sm:max-w-sm md:max-w-md} ${messageIncoming ? 'order-2' : 'order-1'}`}>
        <div className={`text-xs text-gray-500 mb-1 ${messageIncoming ? "" : "text-end"}`} >{messageIncoming ? message.from :  "You"}</div>
        
        <div className={`
          px-4 py-3 rounded-2xl relative
          ${messageIncoming 
            ?  'bg-gray-200 text-gray-800 rounded-bl-md'
            : 'bg-blue-600 text-white rounded-br-md'}
        `}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
          
          <div className={`flex justify-end items-center gap-1 mt-1 text-xs
            ${messageIncoming ? 'text-gray-500': 'text-blue-100'}
          `}>
            <span>{formatTime(message.createdAt)}</span>
            {( message.status === MessageStatus.DELIVERED || message.status === MessageStatus.SENT) && (
              <span className={`flex items-center ${ message.status === MessageStatus.DELIVERED ? "text-green-500" :"text-gray-500"}`}>
                <svg className="double-check w-3 h-3 fill-current" viewBox="0 0 16 15">
                  <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.267c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                </svg>
              </span>
            )}
            {message.status === MessageStatus.FAILED && (
              <span className="text-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 exclamation">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;