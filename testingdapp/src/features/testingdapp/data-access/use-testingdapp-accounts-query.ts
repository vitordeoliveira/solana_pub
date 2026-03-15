import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getTestingdappProgramAccounts } from '@project/anchor'
import { useTestingdappAccountsQueryKey } from './use-testingdapp-accounts-query-key'

export function useTestingdappAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useTestingdappAccountsQueryKey(),
    queryFn: async () => await getTestingdappProgramAccounts(client.rpc),
  })
}
