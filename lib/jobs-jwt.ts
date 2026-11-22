import { randomUUID } from "node:crypto"
import { jwtVerify, SignJWT } from "jose"

const frontend = "mentorlagbe:frontend"
const backend = "mentorlagbe:jobs"
const algorithm = "HS256"
const lifetime = "30s"

export const jobsJwtCookie = "mentorlagbe_jobs"
export const jobsJwtReceiptHeader = "x-mentorlagbe-jobs-receipt"

export function getJobsJwtKey() {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret) return null
  const key = new TextEncoder().encode(secret)
  return key.byteLength >= 32 ? key : null
}

export async function signJobsRequest({
  key,
  method,
  resource,
  user,
}: {
  key: Uint8Array
  method: string
  resource: string
  user?: { id: string; role: string; adminVerified: boolean }
}) {
  const requestId = randomUUID()
  const jwt = new SignJWT({
    method,
    resource,
    ...(user && { role: user.role, adminVerified: user.adminVerified }),
  })
    .setProtectedHeader({ alg: algorithm, typ: "JWT" })
    .setIssuer(frontend)
    .setAudience(backend)
    .setJti(requestId)
    .setIssuedAt()
    .setExpirationTime(lifetime)

  if (user) jwt.setSubject(user.id)
  return { requestId, token: await jwt.sign(key) }
}

export async function verifyJobsReceipt(
  token: string | null,
  requestId: string,
  key: Uint8Array
) {
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: [algorithm],
      issuer: backend,
      audience: frontend,
      typ: "JWT",
      requiredClaims: ["iat", "exp", "jti"],
      maxTokenAge: lifetime,
      clockTolerance: 5,
    })
    return payload.jti === requestId
  } catch {
    return false
  }
}
