import { TestingdappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTestingdappSetMutation } from '@/features/testingdapp/data-access/use-testingdapp-set-mutation'

export function TestingdappUiButtonSet({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  const setMutation = useTestingdappSetMutation({ account, testingdapp })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', testingdapp.data.count.toString() ?? '0')
        if (!value || parseInt(value) === testingdapp.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
