import { useEffect, useState } from "react";
import { SERVER_EVENTS_PATH } from "../utilities/constants.js";
import { ChatParticipants, Message } from "../types/index.js";

export const useIncomingMessageEvent = (chatParticipants: ChatParticipants | undefined) => {
    
    const [messageEventData, setMessageEventData] = useState<Message>();
    
    useEffect(() => {
        if (chatParticipants) {
            const {user: {id: phoneNumberId}, contact: {number: from}} = chatParticipants;
            
            const url = new URL(`http://localhost:3000${SERVER_EVENTS_PATH}`);
                url.searchParams.set('from', from);
            const source = new EventSource(url);

            source.onmessage = function logEvents(event) {
                setMessageEventData(JSON.parse(event.data));
            }

            source.onerror = function handleError(error) {
                console.error('EventSource failed:', error);
                source.close();
            }

            return () => {
                source.close();
            }
        }
    }, [chatParticipants]);

    return messageEventData;
}