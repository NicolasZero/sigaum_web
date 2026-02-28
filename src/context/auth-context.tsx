"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie';
import api from '@/api/api_regiones';

type AuthContextType = {
  userState: any;
  setUserState: any;
  login: (user: string, pass: string) => void;
  logout: () => void;
  wrongCredentials: boolean;
  userNotActive: boolean;
  networkError: boolean;
  // userRole: number | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userState, setUserState] = useState(null);
  const [userNotActive, setUserNotActive] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  // const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ user, pass }: { user: string, pass: string }) => {
      const response = await api.post('/auth', { user, pass });
      return response.data;
    },
    onMutate: () => {
      setNetworkError(false);
    }
  });

  const login = (user: string, pass: string) => {
    // if (typeof navigator !== 'undefined' && !navigator.onLine) {
    //   console.warn('Sin conexión: no se realizará la llamada a la API');
    //   setNetworkError(true);
    //   return;
    // }

    mutation.mutate({ user, pass }, {
      onSuccess: (data) => {
        if (data.data) {
          setWrongCredentials(false);
          if (!data.data.is_active) {
            setUserNotActive(true);
            return;
          }
          if (data.data.role_id === 1) {
            router.push('/dashboard/achievements');
          } else if (data.data.role_id === 2) {
            router.push('/dashboard/register-achievements');
          }
          Cookies.set('user', JSON.stringify(data.data), { expires: 7 }); // Almacena el token en una cookie
          setUserState(data.data);
        }
        setUserNotActive(false);
        console.log('Credenciales correctas');
      },
      onError: (err: any) => {
        console.error('Error en login', err);
        if (err?.response) {
          setWrongCredentials(true);
        } else {
          setNetworkError(true);
        }
      }
    });
  };

  const logout = () => {
    Cookies.remove('user');
    setUserState(null);
    router.push('/login');
  };

  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      setUserState(JSON.parse(userCookie));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userState, login, logout, wrongCredentials, setUserState, userNotActive, networkError}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);