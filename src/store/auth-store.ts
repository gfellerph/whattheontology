
import ISession from '@/@types/ISession';
import { Module } from 'vuex';
import { SOLID_COMMUNITY_IDP, SOLID_AUTH_POPUP_URI } from '@/modules/constants';
const solid = SolidFileClient;

interface IAuthState {
  session: ISession | null;
}

export const authState: IAuthState = {
  session: null,
};

export const auth: Module<IAuthState, {}> = {
  state: authState,
  mutations: {
    LOGIN(state, session) {
      state.session = session;
    },
    LOGOUT(state) {
      state.session = null;
    },
  },
  getters: {
    authenticated: (state) => !!state.session,
    origin: (state, getters) => {
      if (!getters.authenticated) { return ''; }
      return new URL(state.session!.webId).origin;
    },
  },
  actions: {
    AUTO_LOGIN({ commit }) {
      return solid.checkSession()
        .then((session: ISession) => {
          if (session) {
            commit('LOGIN', session);
          }
        });
    },
    LOGIN({ commit }) {
      // Check if there is an authenticated session already existing
      return solid.checkSession()
        .then((session: ISession) => {
          // If there is, pass it to the next .then(), else log in using solid.community
          return session ? session : solid.login(SOLID_COMMUNITY_IDP);
        })
        .then((session: ISession) => {
          // If login was successful, commit the session to the store
          if (session) {
            commit('LOGIN', session);
          }
        });
    },
    POPUP_LOGIN({ commit }) {
      // Use the popup to log in
      return solid.popupLogin()
        .then((session: ISession) => {
          if (session) {
            commit('LOGIN', session);
          }
        });
    },
    LOGOUT({ commit }) {
      return solid.logout()
        .then(() => {
          commit('LOGOUT');
        });
    },
  },
};
