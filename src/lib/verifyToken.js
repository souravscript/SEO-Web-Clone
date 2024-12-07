import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY="SEO_ENGINE"

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token,JWT_SECRET_KEY);
    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid token' };
  }
}
