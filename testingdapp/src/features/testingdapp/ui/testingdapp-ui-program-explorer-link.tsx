import { TESTINGDAPP_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function TestingdappUiProgramExplorerLink() {
  return <AppExplorerLink address={TESTINGDAPP_PROGRAM_ADDRESS} label={ellipsify(TESTINGDAPP_PROGRAM_ADDRESS)} />
}
