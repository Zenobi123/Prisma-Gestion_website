import { useRegisterSW } from 'virtual:pwa-register/react'

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        // Checking for updates every 10 minutes
        setInterval(() => {
          r.update()
        }, 10 * 60 * 1000)
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })

  // Automatically update and reload when a new service worker is ready
  if (needRefresh) {
    updateServiceWorker(true)
  }

  return null
}