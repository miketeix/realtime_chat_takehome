import React, { useState, useRef } from 'react';

import { ChatParticipants } from '../types';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
const ChatContainer: React.FC = () => {
  const messageListRef = useRef<HTMLDivElement>(null);
  
  const [ chatParticipants, setChatParticipants]  = useState<ChatParticipants>()

  return (
    <div className="flex flex-col h-screen md:min-w-lg max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md bg-white">
      <ChatHeader chatParticipants={chatParticipants} setChatParticipants={setChatParticipants}/>
      <MessageList chatParticipants={chatParticipants}  listRef={messageListRef}/>
    </div>
  );
};

export default ChatContainer; 