/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext<{
  session: any;
  user: any;
  showWhatsAppPopup: boolean;
  setShowWhatsAppPopup: (show: boolean) => void;
}>({
  session: null,
  user: null,
  showWhatsAppPopup: false,
  setShowWhatsAppPopup: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const shownPopupForUserRef = useRef<string | null>(null);
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      previousUserIdRef.current = session?.user?.id ?? null;
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const prevUserId = previousUserIdRef.current;
      setSession(session);
      setUser(session?.user ?? null);
      previousUserIdRef.current = session?.user?.id ?? null;

      if (session?.user) {
        if (
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
          prevUserId !== session.user.id &&
          shownPopupForUserRef.current !== session.user.id
        ) {
          setTimeout(() => {
            setShowWhatsAppPopup(true);
            shownPopupForUserRef.current = session.user.id;
          }, 2000);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // const handleCloseWhatsAppPopup = () => {
  //   setShowWhatsAppPopup(false);
  // };

  // const handleJoinWhatsApp = () => {
  //   const message = encodeURIComponent("Me quiero unir al canal de WhatsApp");
  //   window.open(`https://wa.me/573004048012?text=${message}`, "_blank");
  //   setShowWhatsAppPopup(false);
  // };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        showWhatsAppPopup,
        setShowWhatsAppPopup,
      }}
    >
      {children}
      {/* {showWhatsAppPopup && (
        <WhatsAppCommunityPopup
          isOpen={showWhatsAppPopup}
          onClose={handleCloseWhatsAppPopup}
          onJoinWhatsApp={handleJoinWhatsApp}
        />
      )} */}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
