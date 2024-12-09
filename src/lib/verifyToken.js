import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY="SEO_ENGINE"

export const verifyToken=(token) =>{
  try {
    const decoded = jwt.verify(token,JWT_SECRET_KEY);
    console.log("This is the user", decoded)
    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: 'Invalid token' };
  }
}
