import { TestingdappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTestingdappDecrementMutation } from '../data-access/use-testingdapp-decrement-mutation'

export function TestingdappUiButtonDecrement({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  const decrementMutation = useTestingdappDecrementMutation({ account, testingdapp })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
