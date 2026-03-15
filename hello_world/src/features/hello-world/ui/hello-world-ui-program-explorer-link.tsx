import { HELLO_WORLD_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function HelloWorldUiProgramExplorerLink() {
  return <AppExplorerLink address={HELLO_WORLD_PROGRAM_ADDRESS} label={ellipsify(HELLO_WORLD_PROGRAM_ADDRESS)} />
}
