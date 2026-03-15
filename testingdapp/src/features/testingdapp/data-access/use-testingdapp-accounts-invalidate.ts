import { useQueryClient } from '@tanstack/react-query'
import { useTestingdappAccountsQueryKey } from './use-testingdapp-accounts-query-key'

export function useTestingdappAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useTestingdappAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
