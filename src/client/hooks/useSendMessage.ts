import axios from 'axios';
import {
  useMutation,
  } from '@tanstack/react-query'
import { MessagePayload } from '../types';

  export const useSendMessage = () => {
    return useMutation({
      mutationFn: async (payload: MessagePayload) => {
        const { data } = await axios.post('/openphone-api/messages', 
          payload
        )
        return data;
      }
    })
  };
