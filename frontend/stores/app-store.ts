import { RouterLocation } from '@vaadin/router';
import { makeAutoObservable } from 'mobx';
import {login as serverLogin, logout as serverLogout} from "@hilla/frontend";

export class AppStore {
  applicationName = 'nap-kg2-app';

  // The location, relative to the base path, e.g. "hello" when viewing "/hello"
  location = '';

  currentViewTitle = '';

  loggedIn = true;

  constructor() {
    makeAutoObservable(this);
  }

  setLocation(location: RouterLocation) {
    const serverSideRoute = location.route?.path == '(.*)';
    if (location.route && !serverSideRoute) {
      this.location = location.route.path;
    } else if (location.pathname.startsWith(location.baseUrl)) {
      this.location = location.pathname.substr(location.baseUrl.length);
    } else {
      this.location = location.pathname;
    }
    if (serverSideRoute) {
      this.currentViewTitle = document.title; // Title set by server
    } else {
      this.currentViewTitle = (location?.route as any)?.title || '';
    }
  }

  async login(username: string, password: string) {
    const result = await serverLogin(username, password);
    console.log(result);
    if (!result.error) {
      this.setLoggedIn(true);
    } else {
      throw new Error(result.errorMessage || 'Login failed');
    }
  }

  async logout() {
    await serverLogout();
    this.setLoggedIn(false);
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn) {
      //this.initFromServer();
    }
  }


}





export const appStore = new AppStore();
