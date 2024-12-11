import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 99,
      title: '系统管理',
    },
    name: 'manage',
    path: '/manage',
    children: [
      {
        name: 'ManageUser',
        path: '/manage/user',
        component: () => import('#/views/manage/user/index.vue'),
        meta: {
          icon: 'ic:round-manage-accounts',
          title: '用户管理',
        },
      },
    ],
  },
];

export default routes;
