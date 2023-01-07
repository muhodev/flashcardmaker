import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthModal } from "@components";
import { auth } from "@lib";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";

interface FormInput {
  email: string;
  password: string;
}

interface IUser {
  displayName?: string | null;
  email: string | null;
  emailVerified: boolean | null;
  photoURL: string | null;
}

interface IState {
  isVisibleAuthModal: boolean;
  isLoggedIn: boolean;
  user?: IUser | null;
  isMounted: boolean;
}

const initialState = {
  isVisibleAuthModal: false,
  isLoggedIn: false,
  user: null,
  isMounted: false,
};

interface IAuthContext extends IState {
  openAuthModal: () => void;
  closeAuthModal: () => void;
  registerWithEmailAndPassword:
    | ((payload: FormInput) => Promise<UserCredential>)
    | ((payload: FormInput) => void);
  loginWithEmailAndPassword:
    | ((payload: FormInput) => Promise<UserCredential>)
    | ((payload: FormInput) => void);
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({
  ...initialState,
  openAuthModal: () => {},
  closeAuthModal: () => {},
  registerWithEmailAndPassword: async (payload: FormInput) => {},
  loginWithEmailAndPassword: async (payload: FormInput) => {},
  logout: async () => {},
});

export default function AuthProvider({ children }: { children?: ReactNode }) {
  const [state, setState] = useState<IState>(initialState);

  const openAuthModal = () => {
    setState((prev) => ({ ...prev, isVisibleAuthModal: true }));
  };

  const closeAuthModal = () => {
    setState((prev) => ({ ...prev, isVisibleAuthModal: false }));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userState) => {
      if (!userState) return setState({ ...initialState, isMounted: true });

      setState({
        isVisibleAuthModal: false,
        isLoggedIn: true,
        user: {
          displayName: userState.displayName,
          email: userState.email,
          emailVerified: userState.emailVerified,
          photoURL: userState.photoURL,
        },
        isMounted: true,
      });
    });
    return () => unsubscribe();
  }, []);

  const registerWithEmailAndPassword = async ({
    email,
    password,
  }: FormInput) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithEmailAndPassword = async ({ email, password }: FormInput) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        openAuthModal,
        closeAuthModal,
        loginWithEmailAndPassword,
        registerWithEmailAndPassword,
        logout,
      }}
    >
      <AuthModal />
      <>{children}</>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("AuthContext must be within <AuthProvider /> component");

  return context;
}
