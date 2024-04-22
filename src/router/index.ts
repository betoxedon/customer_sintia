import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router'
import { auth, onAuthStateChanged } from '@/services/configs/firebase-config'
import { setInitialStore } from '@/services/handleStore'

import { useUserStore } from '@/stores/userStore'
import { useGlobalStore } from '@/stores/globalStore'
import { useInterfaceStore } from '@/stores/interfaceStore'
import { routes } from '@/router/routes'
const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
})
const { VITE_IS_DEV } = import.meta.env
const isDev: boolean = VITE_IS_DEV

//. auth handler
const authHandler = async () => {
   return new Promise((resolve) => {
      onAuthStateChanged(auth, async () => {
         resolve(true)
      })
   })
}

//. set screen width
const setScreenWidth = () => {
   useInterfaceStore().screenWidth = window.innerWidth
}

//. add event listeners
window.addEventListener('resize', setScreenWidth)

//. redirect if rule fails
const redirectIfRuleFails: Record<string, string> = {
   isAuthenticated: 'signIn',
   isAdmin: 'dashboard',
   isAnonymous: 'dashboard',
}

const nextRouteHandler = async (route: RouteLocationNormalized) => {
   let nextRoute: { name: string } | boolean | undefined
   const routeMeta = Object.assign(route.meta)
   const routeRules: string[] = Array.from(routeMeta.rules)
   const userRoles = useGlobalStore().userRoles

   const isDevFlow: boolean = false
   if (!isDev || !isDevFlow) {
      routeRules.some((routeRule) => {
         const isAllowed = userRoles[routeRule]
         if (!isAllowed) {
            nextRoute = { name: redirectIfRuleFails[routeRule] }
            return true
         } else {
            nextRoute = true
         }
      })
      return nextRoute
   } else {
      nextRoute = true
   }
}

router.beforeEach(async (route) => {
   let nextRoute: { name: string } | boolean | undefined

   await authHandler()

   if (!useUserStore().user.id) {

      const idStorage = localStorage.getItem('uid') 
      const id = idStorage ? JSON.parse(idStorage) : null

      if (!id) {         
        // await signOutFirebase()
      } else {     

         const user = await useUserStore().getUserById(id)   
         useUserStore().update(user)
         await setInitialStore(user)
      }
   }

   setScreenWidth()
   nextRoute = await nextRouteHandler(route)
   return nextRoute
})

export default router
