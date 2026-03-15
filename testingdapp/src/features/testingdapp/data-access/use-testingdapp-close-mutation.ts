import { TestingdappAccount, getCloseInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useTestingdappAccountsInvalidate } from './use-testingdapp-accounts-invalidate'

export function useTestingdappCloseMutation({ account, testingdapp }: { account: UiWalletAccount; testingdapp: TestingdappAccount }) {
  const invalidateAccounts = useTestingdappAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => {
      return await signAndSend(getCloseInstruction({ payer: signer, testingdapp: testingdapp.address }), signer)
    },
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
