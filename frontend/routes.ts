import { Commands, Context, Route, Router  } from '@vaadin/router';
import './views/helloworld/hello-world-view';
import './views/main-layout';
import './views/accountscoping/accounts-coping-view';
import './views/balance/balance-view';
import './views/movements/movements-view';

import { appStore } from './stores/app-store';
import { autorun } from 'mobx';
import './views/login/login-view';


export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  {
    path: '/login',
    component: 'login-view'
  },
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'balance-view',
    icon: '',
    title: '',
  },
  {
    path: 'balance',
    component: 'balance-view',
    icon: 'la la-globe',
    title: 'Obroty i Salda',
  },
  {
    path: 'movements',
    component: 'movements-view',
    icon: 'la la-globe',
    title: 'Obroty i Salda 34',
  },
  {
    path: 'accounts',
    component: 'accounts-coping-view',
    icon: 'la la-globe',
    title: 'Kopiowanie kont',
  },
  // {
  //   path: 'hello',
  //   component: 'hello-world-view',
  //   icon: 'la la-globe',
  //   title: 'Hello World',
  // },
  {
    path: 'about',
    component: 'about-view',
    icon: 'la la-file',
    title: 'About',
    action: async (_context, _command) => {
      await import('./views/about/about-view');
      return;
    },
  }
];

const authGuard = async (context: Context, commands: Commands) => {
  if (!appStore.loggedIn) {
    // Save requested path
    sessionStorage.setItem('login-redirect-path', context.pathname);
    return commands.redirect('/login');
  }
  return undefined;
};

export const routes: ViewRoute[] = [
  {
    path: 'login',
    component: 'login-view',
  },
  {
    path: 'logout',
    action: (_: Context, commands: Commands) => {
      appStore.logout();
      return commands.redirect('/login');
    },
  },
  {
    path: '',
    component: 'main-layout',
    children: views,
  },
  {
    path: '',
    component: 'main-layout',
    children: [...views],
  },
  {
    path: '',
    component: 'main-layout',
    children: views,
    action: authGuard,
  },
];

autorun(() => {
  if (appStore.loggedIn) {
    Router.go(sessionStorage.getItem('login-redirect-path') || '/');
  } else {
    if (location.pathname !== '/login') {
      sessionStorage.setItem('login-redirect-path', location.pathname);
      Router.go('/login');
    }
  }
});

