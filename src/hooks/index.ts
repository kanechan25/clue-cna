import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post-query', id],
    queryFn: async () => await axios.get('https://api.example.com/data' + 'example' + id),
    staleTime: Infinity,
    enabled: !!id,
  })
}
