declare module 'v-clipboard';
declare module 'vue-collapsible/collapsible';
declare module 'vue-collapsible/collapsible-item';
declare module 'solid-auth-client';
declare module 'solid-file-client';
declare namespace SolidFileClient {
  function logout();
  function checkSession();
  function login(idp: string): Promise<any>;
  function popupLogin();
  function readFolder(url: string): Promise<any>;
  function createFolder(url: string): Promise<any>;
  function deleteFolder(url: string): Promise<any>;
  function updateFile(url: string, content: string, contentType?: string): Promise<any>;
}