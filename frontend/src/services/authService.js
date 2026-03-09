import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const signin = async (credentials) => {
  try {
    const auth = getAuth();
    const response = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password,
    );

    return { user: response.user, error: null };
  } catch (err) {
    return { user: null, error: err };
  }
};

export const signout = async () => {
  try {
    const auth = getAuth();
    await auth.signOut();

    return { signedOut: true, message: "Signed out successfully!" };
  } catch (err) {
    return { signedOut: false, message: err };
  }
};