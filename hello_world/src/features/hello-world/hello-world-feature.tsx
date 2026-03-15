import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { HelloWorldUiProgramExplorerLink } from './ui/hello-world-ui-program-explorer-link'
import { HelloWorldUiCreate } from './ui/hello-world-ui-create'
import { HelloWorldUiProgram } from '@/features/hello-world/ui/hello-world-ui-program'

export default function HelloWorldFeature() {
  const { account } = useSolana()

  if (!account) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="hero py-[64px]">
          <div className="hero-content text-center">
            <WalletDropdown />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AppHero title="HelloWorld" subtitle={'Run the program by clicking the "Run program" button.'}>
        <p className="mb-6">
          <HelloWorldUiProgramExplorerLink />
        </p>
        <HelloWorldUiCreate account={account} />
      </AppHero>
      <HelloWorldUiProgram />
    </div>
  )
}
