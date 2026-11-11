import type { Transaction } from '~/types'

export const useTxModal = () => {
  const state = useState<{ open: boolean; tx: Transaction | null }>('tx-modal', () => ({ open: false, tx: null }))
  return {
    state,
    open: (tx: Transaction | null = null) => { state.value = { open: true, tx } },
    close: () => { state.value = { open: false, tx: null } }
  }
}
