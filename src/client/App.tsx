import React from 'react';
import ChatContainer from './components/ChatContainer';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { SelectedUser } from './types';

const queryClient1 = new QueryClient()
const queryClient2 = new QueryClient()

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-gray-50 px-4">
        <QueryClientProvider client={queryClient1}>
          <ChatContainer selectedUser={SelectedUser.Secondary}/>
        </QueryClientProvider>
      </div>
      <div className="bg-gray-50 px-4 ml-4">
        <QueryClientProvider client={queryClient2}>
          <ChatContainer selectedUser={SelectedUser.Primary}/>
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default App;