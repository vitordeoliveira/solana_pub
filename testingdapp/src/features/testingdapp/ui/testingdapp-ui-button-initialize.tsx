import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useTestingdappInitializeMutation } from '@/features/testingdapp/data-access/use-testingdapp-initialize-mutation'

export function TestingdappUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useTestingdappInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Testingdapp {mutationInitialize.isPending && '...'}
    </Button>
  )
}
