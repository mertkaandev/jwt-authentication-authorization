## JSON Web Token / Authentication-Authorization

JSON Web Token allows us to check Authorization (Session Control). JSON Web Token (JWT) is an open standard defined in RFC 7519 based on JSON that enables data exchange and authentication between parties. For example, a server can generate a key (token) indicating that the user has administrative privileges and send it to the user. The user can then use the administrative authority defined for him with this key on a client and his authority can be verified by all parties.

JSON Web Token has 2 parts, encoded and decoded. Encoded means encrypted, decoded means decrypted. When encoded, 3 parts emerge:

1. Header specifies which algorithm will be used in the signature to be created. HS256 indicates that the algorithm is signed with HMAC-SHA256.

`header = '{"alg":"HS256","typ":"JWT"}'`

2. Payload contains unique information between parties. iat carries information including the time the key was created and is a suggested use in JWT. Signature, on the other hand, occurs when the header and payload are encoded with a base64url (RFC 4648 §5), combined with a dot symbol, and then encrypted with a secret key.

```
payload = '{"loggedInAs":"admin","iat":1422779638}'

key           = 'secretkey'
unsignedToken = encodeBase64Url(header) + '.' + encodeBase64Url(payload)
signature     = HMAC-SHA256(key, unsignedToken)
```

3. Verify Signature: When the three parts come together and the Signature is encoded with base64url, the key (token) emerges. Its output consists of reliable base64url-encoded characters that can be easily integrated into HTML and HTTP environments. Typical cryptographic algorithms are SHA-256 (HS256) with HMAC and SHA-256 (RS256) with RSA. In this part, the secret key that we have determined can also be used.

```
token = encodeBase64Url(header) + '.' + encodeBase64Url(payload) + '.' + encodeBase64Url(signature)  
key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN_oWnFSRgCzcmJmMjLiuyu5CSpyHI
```

**Usage**

During authentication, if the information sent by the user is also verified, a key (token) is generated and returned to the user and stored in this locale (for example, cookies or web storage). In cases where user authentication is required, an Authorization header with Bearer scheme is sent to the server by the client. Header content will look like this:

Authorization: Bearer eyJhbGci...<snip>...yu5CSpyHI

This is stateless authentication method and user state is never saved in server memory. The server always checks if the JWT sent from the Authorization header is valid and if it is, the user is allowed to access the protected resources. Since all the information is in the JWT, it reduces the need to query the database more than once.

**Override**

JWTs can actually be remotely overridden in a number of ways. The first of these methods is to define a lifetime for the token. When this time expires, the key is rejected and becomes invalid. If the system user decides that a key previously generated for them should no longer work, they will want to be able to disable it remotely. In such a scenario, a rather short lifetime should be defined for the keys. When the key expires, the client mechanism requests a key from the server by forwarding the old key for renewal. The server checks the validity of the old key. If it is trusted, it will check if it is on the black list. If it is not blacklisted, it generates and sends a new one from the same key. In such an operation, if the user accesses the system from another device and sends a key to the blacklist, the key will no longer be renewed and become invalid in the next renewal period. In this method, a key can be remotely invalidated after its lifetime (or less) at worst.

---
**Usage in this Project**

+ "jsonwebtoken" package is used in this repository and JSON Web Token operations are performed. 

+ At the `api/auth/register` endpoint the user registers and receives a token.
+ At the `api/auth/profile` endpoint the `getAccessToRoute` middleware runs and the user token is decrypted. If the token period is still valid, the pass is granted.
+ At the `api/auth/logout` endpoint, the user logs out and the token expires.

Read its documentation to learn how to use "jsonwebtoken".
