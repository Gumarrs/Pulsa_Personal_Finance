const PUBLIC = ['/login', '/register', '/forgot-password', '/reset-password']
const GUEST_ONLY = ['/login', '/register', '/forgot-password']

export default defineNuxtRouteMiddleware(async (to) => {
  const { configured } = useSupabase()
  if (!configured) return
  const { user, init } = useAuth()
  await init()
  if (!user.value && !PUBLIC.includes(to.path)) return navigateTo('/login')
  if (user.value && GUEST_ONLY.includes(to.path)) return navigateTo('/')
})
