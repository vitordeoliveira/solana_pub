import { TestingdappAccount, getIncrementInstruction } from '@project/anchor'
import { UiWalletAccount, useWalletUiSigner } from '@wallet-ui/react'
import { useWalletUiSignAndSend } from '@wallet-ui/react-gill'
import { useMutation } from '@tanstack/react-query'
import { toastTx } from '@/components/toast-tx'
import { useTestingdappAccountsInvalidate } from './use-testingdapp-accounts-invalidate'

export function useTestingdappIncrementMutation({
  account,
  testingdapp,
}: {
  account: UiWalletAccount
  testingdapp: TestingdappAccount
}) {
  const invalidateAccounts = useTestingdappAccountsInvalidate()
  const signAndSend = useWalletUiSignAndSend()
  const signer = useWalletUiSigner({ account })

  return useMutation({
    mutationFn: async () => await signAndSend(getIncrementInstruction({ testingdapp: testingdapp.address }), signer),
    onSuccess: async (tx) => {
      toastTx(tx)
      await invalidateAccounts()
    },
  })
}
