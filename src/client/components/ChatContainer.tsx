import React, { useState, useRef } from 'react';

import { ChatParticipants } from '../types';
import ChatHeader from './ChatHeader';
const ChatContainer: React.FC = () => {
  
  const [ chatParticipants, setChatParticipants]  = useState<ChatParticipants>()

  return (
    <div className="flex flex-col h-screen md:min-w-lg max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md bg-white">
      <ChatHeader chatParticipants={chatParticipants} setChatParticipants={setChatParticipants}/>
    </div>
  );
};

export default ChatContainer; 