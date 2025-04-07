import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { ChatParticipants, SelectedUser, User } from '../types';
import { useFetchNumbers } from '../hooks/useFetchNumbers';

interface ChatHeaderProps {
  chatParticipants: ChatParticipants
  setChatParticipants: Dispatch<SetStateAction<ChatParticipants>>,
  selectedUser: `${SelectedUser}` 
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatParticipants, setChatParticipants, selectedUser }) => {
  const { data: numbers, isLoading, isError, error: numbersError} =  useFetchNumbers();

  useEffect(()=> {
    if (numbers && numbers.data.length) {
      let user, contact;
      const [ user1, user2 ] = numbers.data
      user = user1
      contact = user2; //chat with secondary
      
      if (selectedUser === SelectedUser.Secondary) {
        user = user2
        contact = user1 //chat with primary
      }
      
      setChatParticipants({
        user,
        contact,
      })
    }
  }, [numbers, setChatParticipants])

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 min-h-[90px]">
      <div className="flex items-center">
        <div className="relative">
          <img 
            src={'src/client/assets/generic-avatar.svg'} 
            alt={chatParticipants?.contact?.name} 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className={`absolute bottom-0 right-3 w-3 h-3 ${isLoading ? 'bg-gray-400' : 'bg-green-500' }  rounded-full border-2 border-white`}></div>
          
        </div>
        <div className="flex flex-col">
          {
            isLoading ?
              <div className="animate-pulse">
                <div className="h-4 w-30 rounded-lg bg-gray-200"></div>
                <div className="h-2 w-18 rounded-lg bg-gray-200 mt-[10px]"></div>
              </div>
              : isError ? <div className="text-red-400">
                {numbersError.message}
              </div> : <>
                <h2 className="text-base font-semibold text-gray-800">{chatParticipants?.contact?.name}</h2>
                <h4 className="text-xs text-gray-400">{chatParticipants?.contact?.number}</h4>
              </>
          }
          <span className={`text-xs mt-[3px]  ${isLoading ? 'text-gray-400' : 'text-green-500' }`}>
            {isLoading ? "Offline" : "Online"}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-gray-500">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
          </svg>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>

        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 