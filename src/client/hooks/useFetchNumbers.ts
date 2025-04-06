import axios, { AxiosError } from 'axios';
import {
    useQuery,
  } from '@tanstack/react-query'
import { PHONE_NUMBERS_API_URL, PHONE_NUMBERS_QUERY_KEY } from '../utilities/constants';

export const useFetchNumbers = () => {
  return useQuery({
  queryKey: [PHONE_NUMBERS_QUERY_KEY], 
  queryFn:  async () => {
    try {
      const { data } = await axios.get(PHONE_NUMBERS_API_URL)
      return data;
    } catch (error: any) {
      console.log('error message', error.message)
      throw new Error("Unable to retrieve contact at this time");
    }
  },
  retry: 1
});
}