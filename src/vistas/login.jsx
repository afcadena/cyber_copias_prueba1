import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useCrudContextForms } from "../context/CrudContextForms"; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import Header from './header';  
import Footer from './footer';  

export default function Login() {
  const { loginUser, error, currentUser } = useCrudContextForms(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation(); 
  const [justRegistered, setJustRegistered] = useState(false);

  const from = location.state?.from || '/homecli'; 

  useEffect(() => {
    if (currentUser) {
      if (justRegistered) {
        localStorage.removeItem('justRegistered');
        return;
      }
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
  }, [currentUser, navigate, from, justRegistered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await loginUser(email, password);
    
    if (user) {
      setUserRole(user.role); 
      setShowWelcome(true);
      console.log("Usuario autenticado:", user);
      setTimeout(() => {
        setShowWelcome(false);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(from, { replace: true });
        }
      }, 5000);
    } else {
      setFormError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow">
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Iniciar Sesión</CardTitle>
              <CardDescription className="text-sm sm:text-base">Ingresa a CyberCopias</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {(formError || error) && <p className="text-red-500 text-sm sm:text-base">{formError || error.statusText}</p>}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm sm:text-base">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-sm sm:text-base pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full mt-4 sm:mt-6 text-sm sm:text-base">Iniciar Sesión</Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-xs sm:text-sm text-gray-600">
                ¿No tienes una cuenta? <a href="./register" className="text-blue-600 hover:underline">Regístrate</a>
              </p>
            </CardFooter>
          </Card>

          {showWelcome && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
              <div className="bg-white p-6 sm:p-8 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">¡Bienvenido!</h2>
                <p className="text-sm sm:text-base mb-2">Has iniciado sesión con éxito. {userRole === 'admin' ? "Eres un Administrador" : "Eres un Cliente"}</p>
                <p className="text-sm sm:text-base">Serás redirigido en 5 segundos...</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}