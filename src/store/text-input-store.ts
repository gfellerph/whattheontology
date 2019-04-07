import { Module } from 'vuex';
import fetchJson from '@/modules/fetch-json';

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
  uploadResponse: {} | null;
  indexResponse: {} | null;
}

const textInputState: ITextState = {
  // tslint:disable-next-line:max-line-length
  text: '@prefix owl: <http://www.w3.org/2002/07/owl#>. @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>. @prefix dcterms: <http://purl.org/dc/terms/>. : a owl:Ontology; dcterms:title "Test"@en; dcterms:description "A test ontology."@en. :Test a owl:Class; rdfs:label "Test Class"@en. :test a owl:ObjectProperty; rdfs:label "Test property"@en.',
  rdfType: ERdfTypes.TURTLE,
  response: null,
  loading: false,
  error: false,
  uploadUrl: '',
  uploadResponse: null,
  indexResponse: null,
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
    UPLOAD_ERROR(state, error: string) {
      state.error = error;
      state.loading = false;
    },
    UPLOAD_SUCCESS(state, response) {
      state.error = false;
      state.loading = false;
      state.uploadResponse = response;
    },
    INDEX_ERROR(state, error: string) {
      state.error = error;
      state.loading = false;
    },
    INDEX_SUCCESS(state, response) {
      state.error = false;
      state.loading = false;
      state.indexResponse = response;
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
      try {
        const response = await SolidFileClient.updateFile(state.uploadUrl, state.text);
        commit('UPLOAD_SUCCESS', response);
      } catch (error) {
        commit('UPLOAD_ERROR', error.message);
      }
    },
    async INDEX_ONTOLOGY({ state, commit }) {
      try {
        const response = await fetchJson({
          url: '/schema',
          method: 'POST',
          body: {
            url: state.uploadUrl,
          },
        });
      } catch (error) {

      }
    },
  },
};
