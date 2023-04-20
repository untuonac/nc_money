import VueRouter from 'vue-router';

import AccountView from './views/AccountView.vue';
import DashboardView from './views/DashboardView.vue';
import Sidebar from './components/Sidebar.vue';
import TransactionSidebar from './components/TransactionSidebar.vue';

export default new VueRouter({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/account/:accountId',
      components: {
        default: AccountView,
        sidebar: Sidebar
      },
      props: {
        default: (route) => {
          return {
            accountId: Number(route.params.accountId)
          };
        }
      },
      children: [
        {
          path: 'transaction/:transactionId/details',
          name: 'transaction-details',
          meta: {
            showSidebar: true
          },
          components: {
            sidebar: TransactionSidebar
          },
          props: {
            sidebar: (route) => {
              return {
                transactionId: Number(route.params.transactionId)
              };
            }
          }
        }
      ]
    }
  ]
});

declare module 'vue-router' {
  interface RouteMeta {
    showSidebar: boolean;
  }
}
