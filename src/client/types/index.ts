export interface User {
    id: string;
    name: string;
    number: string;
  }

  export interface ChatParticipants {
    user: User;
    contact: User;
  }
