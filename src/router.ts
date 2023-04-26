import VueRouter from 'vue-router';

import AccountView from './views/AccountView.vue';
import DashboardView from './views/DashboardView.vue';
import Sidebar from './components/sidebar/Sidebar.vue';
import TransactionSidebar from './components/sidebar/TransactionSidebar.vue';

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
      name: 'account-view',
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
                transactionId: Number(route.params.transactionId),
                accountId: Number(route.params.accountId)
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
