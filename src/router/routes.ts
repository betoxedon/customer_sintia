import AnonymousLayout from '@/layouts/AnonymousLayout.vue'
import SignInView from '@/views/SignInView.vue'
import CreateUserView from '@/views/CreateUserView.vue'

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import AgentView from '@/views/AgentView.vue'
import PlansView from '@/views/PlansView.vue'
import TrainingView from '@/views/TrainingView.vue'
import AdminIconsView from '@/views/AdminIconsView.vue'
import NeutralLayout from '@/layouts/NeutralLayout.vue'
import NotFoundView from '@/views/NotFoundView.vue'

export const routes = [
   {
      path: '/',
      component: AuthenticatedLayout,
      children: [
         {
            path: '',
            component: DashboardView,
            name: 'dashboard',
            meta: {
               rules: ['isAuthenticated'],
            },
         },
         {
            path: 'agente',
            component: AgentView,
            name: 'agent',
            meta: {
               rules: ['isAuthenticated'],
            },
         },
         {
            path: 'planos',
            component: PlansView,
            name: 'plans',
            meta: {
               rules: ['isAuthenticated'],
            },
         },
         {
            path: 'treinamento',
            component: TrainingView,
            name: 'training',
            meta: {
               rules: ['isAuthenticated'],
            },
         },
         {
            path: 'admin-icons',
            component: AdminIconsView,
            name: 'adminIcons',
            meta: {
               rules: ['isAuthenticated', 'isAdmin'],
            },
         },
      ],
   },
   {
      path: '/',
      component: AnonymousLayout,
      children: [
         {
            path: 'registro',
            component: CreateUserView,
            name: 'createUser',
            meta: {
               rules: ['isAnonymous'],
            },
         },
         {
            path: 'login',
            component: SignInView,
            name: 'signIn',
            meta: {
               rules: ['isAnonymous'],
            },
         },
      ],
   },
   {
      path: '/',
      component: NeutralLayout,
      children: [
         {
            path: ':pathMatch(.*)*',
            component: NotFoundView,
            name: 'NotFoundView',
            meta: {
               rules: [],
            },
         },
      ],
   },
]
