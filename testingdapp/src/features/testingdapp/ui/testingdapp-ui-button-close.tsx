import { TestingdappAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useTestingdappCloseMutation } from '@/features/testingdapp/data-access/use-testingdapp-close-mutation'

export function TestingdappUiButtonClose({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  const closeMutation = useTestingdappCloseMutation({ account, testingdapp })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
