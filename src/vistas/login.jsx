import React, { useState, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { CrudContextForm } from "../context/CrudContextForms";

export default function Login() {
  const { loginUser, error, currentUser } = useContext(CrudContextForm);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);  // Estado para mostrar el mensaje de bienvenida

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await loginUser(email, password);
    
    if (user) {
      console.log("Usuario autenticado:", user);
      setShowWelcome(true);  // Muestra el mensaje de bienvenida
      setTimeout(() => {
        setShowWelcome(false);
        // Aquí puedes redirigir o hacer otra acción según sea necesario
      }, 3000);  // Oculta el mensaje después de 3 segundos
    } else {
      setFormError("Credenciales incorrectas. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
          <CardDescription>Ingresa a CyberCopias</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {(formError || error) && <p className="text-red-500">{formError || error.statusText}</p>}
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
            </div>
            <Button type="submit" className="w-full mt-6">Iniciar Sesión</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta? <a href="./register" className="text-blue-600 hover:underline">Regístrate</a>
          </p>
        </CardFooter>
      </Card>

      {/* Ventana emergente de bienvenida */}
      {showWelcome && currentUser && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-semibold">¡Bienvenido, {currentUser.name}!</h2>
            <p>Has iniciado sesión con el rol de: <strong>{currentUser.role}</strong></p>
          </div>
        </div>
      )}
    </div>
  );
}