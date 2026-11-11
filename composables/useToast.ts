export interface ToastItem { id: number; type: 'success' | 'error' | 'info'; message: string }

export const useToast = () => {
  const toasts = useState<ToastItem[]>('toasts', () => [])
  function remove(id: number) {
    toasts.value = toasts.value.filter(x => x.id !== id)
  }
  function push(type: ToastItem['type'], message: string) {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, type, message }]
    setTimeout(() => remove(id), 4000)
  }
  return {
    toasts,
    remove,
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
    info: (m: string) => push('info', m)
  }
}
