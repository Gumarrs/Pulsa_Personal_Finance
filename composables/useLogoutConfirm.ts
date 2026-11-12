// State bersama untuk dialog konfirmasi keluar. Dipanggil dari sidebar, pengaturan, dan halaman welcome.
export const useLogoutConfirm = () => {
  const open = useState<boolean>('logout-confirm', () => false)
  return {
    open,
    ask: () => { open.value = true },
    close: () => { open.value = false }
  }
}
