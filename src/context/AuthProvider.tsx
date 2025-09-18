/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import WhatsAppCommunityPopup from "../components/WhatsAppCommunityPopup";

const AuthContext = createContext<{
  session: any;
  user: any;
  isCheckingProfile: boolean;
  showWhatsAppPopup: boolean;
  setShowWhatsAppPopup: (show: boolean) => void;
}>({ 
  session: null, 
  user: null, 
  isCheckingProfile: false,
  showWhatsAppPopup: false,
  setShowWhatsAppPopup: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [hasShownPopupForUser, setHasShownPopupForUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserProfile = async (user: any) => {
    console.log('🔍 AuthProvider: Verificando perfil del usuario...', { userId: user?.id, currentPath: location.pathname });
    
    if (!user || location.pathname === '/complete-profile') {
      console.log('⏭️ AuthProvider: Saltando verificación', { hasUser: !!user, isCompletePage: location.pathname === '/complete-profile' });
      return;
    }
    
    setIsCheckingProfile(true);
    try {
      console.log('📡 AuthProvider: Consultando perfil en base de datos...');
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      console.log('📊 AuthProvider: Resultado de consulta', { profile, error });

      if (error || !profile || !profile.username) {
        console.log('❌ AuthProvider: Perfil incompleto, redirigiendo...', { error, profile, hasUsername: profile?.username });
        // Solo redirigir si no estamos ya en páginas de auth
        if (!['/login', '/register', '/complete-profile'].includes(location.pathname)) {
          console.log('🔄 AuthProvider: Redirigiendo a /complete-profile');
          navigate('/complete-profile');
        }
      } else {
        console.log('✅ AuthProvider: Perfil completo', { username: profile.username });
      }
    } catch (error) {
      console.error('❌ AuthProvider: Error checking user profile:', error);
    } finally {
      setIsCheckingProfile(false);
      console.log('🏁 AuthProvider: Verificación completada');
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserProfile(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const previousUser = user;
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserProfile(session.user);
        
        // Mostrar popup de WhatsApp solo si es un nuevo login/registro y no se ha mostrado antes para este usuario
        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && 
            previousUser?.id !== session.user.id && 
            hasShownPopupForUser !== session.user.id) {
          setTimeout(() => {
            setShowWhatsAppPopup(true);
            setHasShownPopupForUser(session.user.id);
          }, 2000); // Mostrar después de 2 segundos
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, navigate, user, hasShownPopupForUser]);

  const handleCloseWhatsAppPopup = () => {
    setShowWhatsAppPopup(false);
  };

  const handleJoinWhatsApp = () => {
    const message = encodeURIComponent('Me quiero unir al canal de WhatsApp');
    window.open(`https://wa.me/573004048012?text=${message}`, '_blank');
    setShowWhatsAppPopup(false);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isCheckingProfile, 
      showWhatsAppPopup, 
      setShowWhatsAppPopup 
    }}>
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
