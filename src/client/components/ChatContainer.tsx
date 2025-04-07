import React, { useState, useRef } from 'react';

import { ChatParticipants, SelectedUser } from '../types';

import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import { scrollToBottom } from '../utilities';

interface ChatContainerProps {
  selectedUser:`${SelectedUser}`
}

const ChatContainer: React.FC<ChatContainerProps> = ({ selectedUser }) => {
  const messageListRef = useRef<HTMLDivElement>(null);
  
  const [ chatParticipants, setChatParticipants]  = useState<ChatParticipants>()
  return (
    <div className="flex flex-col h-screen xl:min-w-lg xs:max-w-xs sm:max-w-xs md:max-w-sm lg:max-w-md  max-w-3xl mx-auto rounded-lg overflow-hidden shadow-md bg-white">
      <ChatHeader chatParticipants={chatParticipants} setChatParticipants={setChatParticipants} selectedUser={selectedUser}/>
      {chatParticipants && <MessageList chatParticipants={chatParticipants}  listRef={messageListRef}/>}
      <MessageInput chatParticipants={chatParticipants} scrollToChatBottom={scrollToBottom(messageListRef)} />
    </div>
  );
};

export default ChatContainer; 