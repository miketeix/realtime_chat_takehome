import axios from 'axios';
import qs from 'qs';
import {
    useInfiniteQuery,
  } from '@tanstack/react-query'
import { MESSAGES_API_URL, MESSAGES_QUERY_KEY } from '../utilities/constants';


interface UseFetchMessagesProps {
  userId: string | undefined;
  contactNumber: string | undefined;
  fetchMessagesEnabled: boolean
}

  export const useFetchMessages = ( { userId, contactNumber, fetchMessagesEnabled }: UseFetchMessagesProps) => {
    return useInfiniteQuery({
        queryKey: [MESSAGES_QUERY_KEY],
        queryFn: async ({ pageParam }) => {
         try {
           const response = await axios.get(MESSAGES_API_URL, {
             params: {
               phoneNumberId: userId,
               participants: [contactNumber],
               maxResults: 10,
               ...pageParam && {
                 pageToken: pageParam
               }
             },
             paramsSerializer: params => {
               return qs.stringify(params, { arrayFormat: 'repeat' });
             }
           })
          return response.data;
        } catch (error: any) {
           console.log('error message', error.message);
           throw new Error('Unable to retrieve messages at this time.')
         }
          
        },
        enabled: fetchMessagesEnabled,
        initialPageParam: '',
        getNextPageParam: (lastPage) => lastPage.nextPageToken,
        select: (data) => ({
          pages: [...data.pages].reverse(),
          pageParams: [...data.pageParams].reverse(),
        }),
        retry: 1,
      })
}

