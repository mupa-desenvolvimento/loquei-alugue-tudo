import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  type: "pf" | "pj";
  profile: "locador" | "locatario";
  phone?: string;
  companyName?: string;
  cnpj?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("loquei_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        localStorage.removeItem("loquei_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulação de delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem("loquei_users") || "[]");
      const foundUser = users.find((u: any) => u.email === data.email && u.password === data.password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("loquei_user", JSON.stringify(userWithoutPassword));
        toast.success("Login realizado com sucesso!");
        return true;
      }
      
      toast.error("Email ou senha incorretos");
      return false;
    } catch (error) {
      toast.error("Erro ao realizar login");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const users = JSON.parse(localStorage.getItem("loquei_users") || "[]");
      
      if (users.some((u: any) => u.email === userData.email)) {
        toast.error("Email já cadastrado");
        return false;
      }

      const newUser = { 
        id: crypto.randomUUID(), 
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem("loquei_users", JSON.stringify(users));
      
      // Auto-login após cadastro
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("loquei_user", JSON.stringify(userWithoutPassword));
      
      toast.success("Conta criada com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro no registro:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("loquei_user", JSON.stringify(updatedUser));
    
    // Atualizar na lista de usuários
    const users = JSON.parse(localStorage.getItem("loquei_users") || "[]");
    const updatedUsers = users.map((u: any) => 
      u.email === user.email ? { ...u, ...data } : u
    );
    localStorage.setItem("loquei_users", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loquei_user");
    toast.info("Você saiu da conta");
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }}>
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
