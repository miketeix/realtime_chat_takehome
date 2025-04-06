import axios from 'axios';
import {
  useMutation,
  } from '@tanstack/react-query'
import { MessagePayload } from '../types';
import { MESSAGES_API_URL } from '../utilities/constants';

  export const useSendMessage = () => {
    return useMutation({
      mutationFn: async (payload: MessagePayload) => {
        const { data } = await axios.post(MESSAGES_API_URL, 
          payload
        )
        return data;
      }
    })
  };
