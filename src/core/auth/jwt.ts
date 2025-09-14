import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
const issuer = 'urn:example:issuer';
const audience = 'urn:example:audience';

export async function signToken(payload: { [key: string]: any }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('2h')
    .sign(secretKey);
}

export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer,
      audience,
    });
    return payload as T;
  } catch (error) {
    return null;
  }
}
