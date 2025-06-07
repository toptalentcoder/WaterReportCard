import jwt, { JwtPayload } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!
export interface DecodedUser extends jwt.JwtPayload {
  sub: string // user ID
  email?: string
  permissions?: string[]
}


export function verifyJwt(token: string): DecodedUser {
  const decoded = jwt.verify(token, SECRET) as DecodedUser
  if (!decoded.sub) throw new Error('Invalid token: sub is missing')
  return decoded
}

