import { useSolana } from '@/components/solana/use-solana'

export function useTestingdappAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['testingdapp', 'accounts', { cluster }]
}
