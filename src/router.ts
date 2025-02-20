import VueRouter from 'vue-router';

import AccountView from './views/AccountView.vue';
import DashboardView from './views/DashboardView.vue';
import AccountTypeView from './views/AccountTypeView.vue';
import Sidebar from './components/Sidebar.vue';

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
      }
    },
    {
      path: '/accountType/:accountTypeType',
      name: 'account-type-view',
      component: AccountTypeView,
      props: (route) => ({
        accountTypeType: Number(route.params.accountTypeType)
      })
    }
  ]
});

declare module 'vue-router' {
  interface RouteMeta {
    showSidebar: boolean;
  }
}
