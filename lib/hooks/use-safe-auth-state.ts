import { useAuthState } from "react-firebase-hooks/auth";
import { Auth, User } from "firebase/auth";

// Create a dummy auth object to satisfy the hook requirement
const dummyAuth = {
  currentUser: null,
  app: {
    name: "[DEFAULT]",
    options: {},
    automaticDataCollectionEnabled: false,
  },
} as unknown as Auth;

export function useSafeAuthState(
  auth: Auth | undefined
): [User | null, boolean] {
  // Always call the hook (React rules), but use dummy auth if needed
  const [user, loading] = useAuthState(auth || dummyAuth);

  // If auth is undefined, return null user and false loading
  if (!auth) {
    return [null, false];
  }

  return [user ?? null, loading];
}
