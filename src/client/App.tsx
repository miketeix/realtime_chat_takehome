import React from 'react';
import ChatContainer from './components/ChatContainer';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

const App: React.FC = () => {

  return (
      <div className="h-full bg-gray-50 flex items-center justify-center px-4">
        <QueryClientProvider client={queryClient}>
          <ChatContainer/>
        </QueryClientProvider>
      </div>
  );
};

export default App;