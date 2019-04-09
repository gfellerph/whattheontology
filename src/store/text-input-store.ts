import { Module } from 'vuex';
import mimeTypes from 'mime-types';
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

type TAPIError = string | false;
interface IAPIRequest<TResponse = any> {
  loading: boolean;
  error: TAPIError;
  response: TResponse | null;
}

class APIRequest<TResponse = any> implements IAPIRequest {
  public loading: boolean = false;
  public error: TAPIError = false;
  public response: TResponse | null = null;
}

interface ITextState {
  text: string;
  rdfType: ERdfTypes;
  folderPath: string;
  fileName: string;
  check: APIRequest;
  upload: APIRequest;
  index: APIRequest;
  uploadUrl: string;
}

const textInputState: ITextState = {
  // tslint:disable-next-line:max-line-length
  text: '@prefix owl: <http://www.w3.org/2002/07/owl#>. @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>. @prefix dcterms: <http://purl.org/dc/terms/>. : a owl:Ontology; dcterms:title "Test"@en; dcterms:description "A test ontology."@en. :Test a owl:Class; rdfs:label "Test Class"@en. :test a owl:ObjectProperty; rdfs:label "Test property"@en.',
  rdfType: ERdfTypes.TURTLE,
  fileName: '',
  folderPath: '',
  check: new APIRequest(),
  upload: new APIRequest(),
  index: new APIRequest(),
  uploadUrl: '',
};

export const textInput: Module<ITextState, any> = {
  state: textInputState,
  mutations: {
    SET_TEXT(state, text: string) {
      state.text = text;
    },
    SET_TYPE(state, rdfType: ERdfTypes) {
      state.rdfType = rdfType;
    },
    SET_FOLDER_PATH(state, path: string) {
      state.folderPath = path;
    },
    SET_FILENAME(state, filename: string) {
      state.fileName = filename;
    },
    SET_UPLOAD_URL(state, url: string) {
      state.uploadUrl = url;
    },
    BEFORE_REQUEST(state, request: string) {
      state[request].loading = true;
      state[request].error = false;
      state[request].response = null;
    },
    REQUEST_SUCCESS(state, payload: { request: string, response: {}}) {
      state[payload.request].loading = false;
      state[payload.request].response = payload.response;
    },
    REQUEST_ERROR(state, payload: { request: string, error: string }) {
      state[payload.request].error = payload.error;
      state[payload.request].loading = false;
    },
  },
  getters: {
    checkSuccessful(state) {
      return state.check.response && !state.check.response.hasErrors;
    },
    canUpload(state, getters) {
      return getters.checkSuccessful
        && state.fileName
        && state.folderPath;
    },
    canIndex(state, getters) {
      return getters.canUpload
        && state.upload.response
        && getters.uploadUrl;
    },
    uploadUrl(state) {
      if (!state.fileName || !state.folderPath) { return null; }
      const extension = mimeTypes.extension(state.rdfType);
      return `${state.folderPath}${state.fileName}.${extension}`;
    },
  },
  actions: {
    async CHECK_ONTOLOGY({ state, commit }) {
      commit('BEFORE_REQUEST', 'check');
      try {
        const response = await fetchJson({
          url: '/api/check/text',
          method: 'POST',
          body: {
            text: state.text,
            mimeType: state.rdfType,
          },
        });
        commit('REQUEST_SUCCESS', { request: 'check', response });
      } catch (error) {
        commit('REQUEST_ERROR', { request: 'check', error: error.message });
      }
    },
    async UPLOAD_ONTOLOGY({ state, commit, getters }) {
      commit('BEFORE_REQUEST', 'upload');
      try {
        const response = await SolidFileClient.updateFile(getters.uploadUrl, state.text);
        commit('REQUEST_SUCCESS', { request: 'upload', response });
      } catch (error) {
        commit('REQUEST_ERROR', { request: 'upload', error: error.message });
      }
    },
    async INDEX_ONTOLOGY({ state, commit, getters }) {
      commit('BEFORE_REQUEST', 'index');
      try {
        const response = await fetchJson({
          url: '/schema',
          method: 'POST',
          body: {
            url: getters.uploadUrl,
          },
        });
        commit('REQUEST_SUCCESS', { request: 'index', response });
      } catch (error) {
        commit('REQUEST_ERROR', { request: 'index', error: error.message });
      }
    },
  },
};
