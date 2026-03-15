import { TestingdappUiCard } from './testingdapp-ui-card'
import { useTestingdappAccountsQuery } from '@/features/testingdapp/data-access/use-testingdapp-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function TestingdappUiList({ account }: { account: UiWalletAccount }) {
  const testingdappAccountsQuery = useTestingdappAccountsQuery()

  if (testingdappAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!testingdappAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {testingdappAccountsQuery.data?.map((testingdapp) => (
        <TestingdappUiCard account={account} key={testingdapp.address} testingdapp={testingdapp} />
      ))}
    </div>
  )
}
