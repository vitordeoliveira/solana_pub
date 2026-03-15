import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { TestingdappUiButtonInitialize } from './ui/testingdapp-ui-button-initialize'
import { TestingdappUiList } from './ui/testingdapp-ui-list'
import { TestingdappUiProgramExplorerLink } from './ui/testingdapp-ui-program-explorer-link'
import { TestingdappUiProgramGuard } from './ui/testingdapp-ui-program-guard'

export default function TestingdappFeature() {
  const { account } = useSolana()

  return (
    <TestingdappUiProgramGuard>
      <AppHero
        title="Testingdapp"
        subtitle={
          account
            ? "Initialize a new testingdapp onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <TestingdappUiProgramExplorerLink />
        </p>
        {account ? (
          <TestingdappUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <TestingdappUiList account={account} /> : null}
    </TestingdappUiProgramGuard>
  )
}
