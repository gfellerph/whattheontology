import { Module } from 'vuex';
import fetchJson from '@/modules/fetch-json';
import solidFileClient from 'solid-file-client/dist/browser/solid-file-client.bundle';

enum ERdfTypes {
  JSONLD = 'application/ld+json',
  N_QUADS = 'application/n-quads',
  NTRIPLES = 'application/n-triples',
  APPLICATION_N3 = 'application/n3',
  NQUADS = 'application/nquads',
  XML = 'application/rdf+xml',
  XTURTLE = 'application/x-turtle',
  N3 = 'text/n3',
  TURTLE = 'text/turtle',
}

interface ICheckResult {

}

interface ITextState {
  text: string;
  rdfType: ERdfTypes;
  response: ICheckResult | null;
  loading: boolean;
  error: string | false;
  uploadUrl: string;
}

const textInputState: ITextState = {
  text: '',
  rdfType: ERdfTypes.TURTLE,
  response: null,
  loading: false,
  error: false,
  uploadUrl: '',
};

export const textInput: Module<ITextState, {}> = {
  state: textInputState,
  mutations: {
    SET_TEXT(state, text: string) {
      state.text = text;
    },
    SET_TYPE(state, rdfType: ERdfTypes) {
      state.rdfType = rdfType;
    },
    SET_UPLOAD_URL(state, url: string) {
      state.uploadUrl = url;
    },
    BEFORE_CHECK(state) {
      state.loading = true;
      state.error = false;
      state.response = null;
    },
    CHECK_ERROR(state, error: string) {
      state.error = error;
      state.loading = false;
    },
    CHECK_SUCCESS(state, response: ICheckResult) {
      state.loading = false;
      state.error = false;
      state.response = response;
    },
  },
  actions: {
    async CHECK_ONTOLOGY({ state, commit }) {
      commit('BEFORE_CHECK');
      try {
        const response = await fetchJson({
          url: '/api/check/text',
          method: 'POST',
          body: {
            text: state.text,
            mimeType: state.rdfType,
          },
        });
        commit('CHECK_SUCCESS', response);
      } catch (error) {
        commit('CHECK_ERROR', error.message);
      }
    },
    async UPLOAD_ONTOLOGY({ state, commit, getters }) {
      const contents = await solidFileClient.readFolder(getters.origin);
      console.log(contents);
    },
  },
};
