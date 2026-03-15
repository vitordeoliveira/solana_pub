import { TestingdappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useTestingdappIncrementMutation } from '../data-access/use-testingdapp-increment-mutation'

export function TestingdappUiButtonIncrement({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  const incrementMutation = useTestingdappIncrementMutation({ account, testingdapp })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
