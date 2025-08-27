/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext<{
  session: any;
  user: any;
  isCheckingProfile: boolean;
}>({ session: null, user: null, isCheckingProfile: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUserProfile = async (user: any) => {
    if (!user || location.pathname === '/complete-profile') return;
    
    setIsCheckingProfile(true);
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error || !profile || !profile.username) {
        // Solo redirigir si no estamos ya en páginas de auth
        if (!['/login', '/register', '/complete-profile'].includes(location.pathname)) {
          navigate('/complete-profile');
        }
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
    } finally {
      setIsCheckingProfile(false);
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ session, user, isCheckingProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
