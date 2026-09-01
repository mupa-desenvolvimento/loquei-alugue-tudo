import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Profile, UserProfile, UserRole, UserType } from "@/types/database";

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  profile: UserProfile;
  phone?: string;
  companyName?: string;
  cnpj?: string;
  avatar?: string;
  role: UserRole;
  isBlocked: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  type: UserType;
  profile: UserProfile;
  companyName?: string;
  cnpj?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Retorna o perfil autenticado, ou null se as credenciais falharem. */
  login: (data: { email: string; password: string }) => Promise<User | null>;
  register: (data: RegisterData) => Promise<boolean>;
  /** Redireciona para o provedor; a sessão volta pela URL de callback. */
  signInWithProvider: (provider: "google" | "facebook", redirectTo?: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_KEY = "loquei_demo_user";

function fromProfile(row: Profile): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    type: row.type,
    profile: row.profile,
    phone: row.phone ?? undefined,
    companyName: row.company_name ?? undefined,
    cnpj: row.cnpj ?? undefined,
    avatar: row.avatar_url ?? undefined,
    role: row.role,
    isBlocked: Boolean(row.blocked_at),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase!
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erro ao carregar perfil:", error);
      return null;
    }
    return data ? fromProfile(data as Profile) : null;
  }, []);

  // Restaura a sessão e reage a login/logout em outras abas.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(DEMO_KEY);
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          localStorage.removeItem(DEMO_KEY);
        }
      }
      setIsLoading(false);
      return;
    }

    let active = true;

    supabase!.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      setUser(data.session ? await loadProfile(data.session.user.id) : null);
      setIsLoading(false);
    });

    const { data: sub } = supabase!.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      setUser(session ? await loadProfile(session.user.id) : null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login: AuthContextType["login"] = async ({ email, password }) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const demo: User = {
          id: "demo-user",
          name: email.split("@")[0],
          email,
          type: "pf",
          profile: "locatario",
          role: "user",
          isBlocked: false,
        };
        setUser(demo);
        localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
        toast.success("Entrou em modo demo (sem backend configurado)");
        return demo;
      }

      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(
          error.message === "Invalid login credentials"
            ? "Email ou senha incorretos"
            : error.message,
        );
        return null;
      }

      const profile = await loadProfile(data.user.id);
      setUser(profile);
      toast.success("Login realizado com sucesso!");
      return profile;
    } finally {
      setIsLoading(false);
    }
  };

  const register: AuthContextType["register"] = async (data) => {
    setIsLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const demo: User = {
          id: "demo-user",
          name: data.name,
          email: data.email,
          type: data.type,
          profile: data.profile,
          phone: data.phone,
          companyName: data.companyName,
          cnpj: data.cnpj,
          role: "user",
          isBlocked: false,
        };
        setUser(demo);
        localStorage.setItem(DEMO_KEY, JSON.stringify(demo));
        toast.success("Conta demo criada (sem backend configurado)");
        return true;
      }

      // A senha vai direto para o GoTrue, que guarda só o hash.
      // O trigger `on_auth_user_created` cria a linha em `profiles`.
      const { data: signUp, error } = await supabase!.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            type: data.type,
            profile: data.profile,
            phone: data.phone ?? null,
            company_name: data.companyName ?? null,
            cnpj: data.cnpj ?? null,
          },
        },
      });

      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "Email já cadastrado"
            : error.message,
        );
        return false;
      }

      // Com confirmação de email ligada no projeto, ainda não há sessão.
      if (!signUp.session) {
        toast.success("Conta criada! Confirme o email para entrar.");
        return true;
      }

      setUser(await loadProfile(signUp.user!.id));
      toast.success("Conta criada com sucesso!");
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider: AuthContextType["signInWithProvider"] = async (
    provider,
    redirectTo,
  ) => {
    if (!isSupabaseConfigured) {
      toast.error("Login social indisponível no modo demo");
      return;
    }

    const { error } = await supabase!.auth.signInWithOAuth({
      provider,
      options: {
        // O provedor devolve o usuário para cá; `detectSessionInUrl` no
        // cliente lê o token do endereço e abre a sessão.
        redirectTo: `${window.location.origin}${redirectTo ?? "/"}`,
      },
    });

    // Só chega aqui se falhar antes de sair da página. Provedor desligado no
    // projeto não cai neste ramo: o navegador já foi para o Supabase, que
    // responde com erro na própria página de destino. Por isso o botão só
    // aparece quando o provedor está de fato habilitado — ver useAuthProviders.
    if (error) toast.error(error.message);
  };

  const updateUser: AuthContextType["updateUser"] = async (data) => {
    if (!user) return;

    const next = { ...user, ...data };
    setUser(next);

    if (!isSupabaseConfigured) {
      localStorage.setItem(DEMO_KEY, JSON.stringify(next));
      return;
    }

    const { error } = await supabase!
      .from("profiles")
      .update({
        name: next.name,
        phone: next.phone ?? null,
        company_name: next.companyName ?? null,
        cnpj: next.cnpj ?? null,
        avatar_url: next.avatar ?? null,
        profile: next.profile,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      toast.error("Não foi possível salvar o perfil");
      setUser(user); // desfaz o update otimista
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) await supabase!.auth.signOut();
    localStorage.removeItem(DEMO_KEY);
    setUser(null);
    toast.info("Você saiu da conta");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        signInWithProvider,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
