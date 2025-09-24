/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import WhatsAppCommunityPopup from "../components/WhatsAppCommunityPopup";

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
  const [hasShownPopupForUser, setHasShownPopupForUser] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const previousUser = user;
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Mostrar popup de WhatsApp solo si es un nuevo login/registro y no se ha mostrado antes para este usuario
        if (
          (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") &&
          previousUser?.id !== session.user.id &&
          hasShownPopupForUser !== session.user.id
        ) {
          setTimeout(() => {
            setShowWhatsAppPopup(true);
            setHasShownPopupForUser(session.user.id);
          }, 2000); // Mostrar después de 2 segundos
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, user, hasShownPopupForUser]);

  const handleCloseWhatsAppPopup = () => {
    setShowWhatsAppPopup(false);
  };

  const handleJoinWhatsApp = () => {
    const message = encodeURIComponent("Me quiero unir al canal de WhatsApp");
    window.open(`https://wa.me/573004048012?text=${message}`, "_blank");
    setShowWhatsAppPopup(false);
  };

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
      {showWhatsAppPopup && (
        <WhatsAppCommunityPopup
          isOpen={showWhatsAppPopup}
          onClose={handleCloseWhatsAppPopup}
          onJoinWhatsApp={handleJoinWhatsApp}
        />
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
