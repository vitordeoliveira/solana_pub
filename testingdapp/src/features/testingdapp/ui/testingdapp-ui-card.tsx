import { TestingdappAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { TestingdappUiButtonClose } from './testingdapp-ui-button-close'
import { TestingdappUiButtonDecrement } from './testingdapp-ui-button-decrement'
import { TestingdappUiButtonIncrement } from './testingdapp-ui-button-increment'
import { TestingdappUiButtonSet } from './testingdapp-ui-button-set'

export function TestingdappUiCard({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Testingdapp: {testingdapp.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={testingdapp.address} label={ellipsify(testingdapp.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <TestingdappUiButtonIncrement account={account} testingdapp={testingdapp} />
          <TestingdappUiButtonSet account={account} testingdapp={testingdapp} />
          <TestingdappUiButtonDecrement account={account} testingdapp={testingdapp} />
          <TestingdappUiButtonClose account={account} testingdapp={testingdapp} />
        </div>
      </CardContent>
    </Card>
  )
}
