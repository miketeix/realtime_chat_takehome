export interface User {
    id: string;
    name: string;
    number: string;
  }

  export interface ChatParticipants {
    user: User;
    contact: User;
  }
  export interface Message {
    id: string;
    to: string[];
    from: string;
    text: string;
    phoneNumberId?: string;
    direction?: `${MessageDirection}`;
    userId?: string;
    status?:  `${MessageStatus}` ;
    createdAt: string;
    updatedAt?: string;
    content?: string;
  }

  export interface MessagesResponse {
    data: Message[];
    totalItems: number;
    nextPageToken: string | null;
  }
  export enum MessageStatus {
    QUEUED = 'queued',
    SENT = 'sent',
    DELIVERED = 'delivered',
    UNDELIVERED = 'undelivered',
    FAILED = 'failed'
  };

  export enum MessageDirection {
    Incoming =   'incoming' ,
    Outgoing = 'outgoing'
  }

 
