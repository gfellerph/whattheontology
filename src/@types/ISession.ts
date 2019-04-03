export default interface ISession {
  authorization: {
    access_token: string,
    client_id: string,
    id_token: string,
  };
  credentialType: string;
  idClaims: {
    at_hash: string,
    aud: string,
    azp: string,
    exp: number,
    iat: number,
    iss: string,
    jti: string,
    nonce: string,
    sub: string,
  };
  idp: string;
  issuer: string;
  sessionKey: string;
  webId: string;
}
