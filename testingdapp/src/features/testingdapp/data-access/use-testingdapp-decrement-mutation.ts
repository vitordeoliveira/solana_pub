import { TestingdappAccount, getDecrementInstruction } from '@project/anchor'
import { useMutation } from '@tanstack/react-query'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { toastTx } from '@/components/toast-tx'
import { useTestingdappAccountsInvalidate } from './use-testingdapp-accounts-invalidate'

export function useTestingdappDecrementMutation({
  account,
  testingdapp,
}: {
  account: UiWalletAccount
  testingdapp: TestingdappAccount
}) {
  const invalidateAccounts = useTestingdappAccountsInvalidate()
  const signer = useWalletUiSigner({ account })
  const signAndSend = useWalletUiSignAndSend()

  return useMutation({
    mutationFn: async () => await signAndSend(getDecrementInstruction({ testingdapp: testingdapp.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
