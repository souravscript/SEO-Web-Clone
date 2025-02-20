import jwt from 'jsonwebtoken';
//const JWT_SECRET_KEY="m/qSCET7a65mNNqMCUH+MAuLUUXGVFNvcYVcKdilI0KShxKQnv2C1D6Ej0h8O/crrY8csRnTnBJzp/IJM79/9Q=="

export const verifyToken= (token) => {
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    console.log("This is the user", decoded)
    return { user: decoded, error: null };
  } catch (error) {
    return { user: null, error: error };
  }
}
