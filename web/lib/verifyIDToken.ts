import firebaseAdmin from "./firebaseAdmin";

export default async function verifyIDToken(token?: string) {
  if (!token) return false;
  try {
    const response = await firebaseAdmin
      .auth()
      .verifyIdToken(token.replace("Bearer ", ""));
    return true;
  } catch (err) {
    return false;
  }
}
