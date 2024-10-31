import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from 'lucide-react';
import { useCrudContextForms } from "../context/CrudContextForms";
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

export default function Register() {
  const { registerUser, error } = useCrudContextForms();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      length: password.length >= minLength,
      upperCase: hasUpperCase,
      lowerCase: hasLowerCase,
      number: hasNumber,
      specialChar: hasSpecialChar,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }
  
    const passwordValidation = validatePassword(password);
    if (!Object.values(passwordValidation).every(Boolean)) {
      setFormError("La contraseña no cumple con todos los requisitos.");
      return;
    }
  
    const newUser = { name, surname, email, password };
    const response = await registerUser(newUser);
  
    if (response) {
      setJustRegistered(true);
      navigate('/login', { replace: true });
    } else {
      setFormError("Ocurrió un error al registrar el usuario.");
    }
  };

  const passwordValidation = validatePassword(password);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      <main className="flex-grow flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl font-bold">Crear Cuenta</CardTitle>
            <CardDescription className="text-sm sm:text-base">Regístrate a CyberCopias</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {(formError || error) && (
                <p className="text-red-500 text-center text-sm sm:text-base">
                  {formError || error.message || error.response?.data?.message || 'Ocurrió un error inesperado.'}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-sm sm:text-base"
                  />  
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname" className="text-sm sm:text-base">Apellidos</Label>
                  <Input
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="text-sm sm:text-base pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs sm:text-sm font-medium mb-2">Requisitos de la contraseña:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    {Object.entries(passwordValidation).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        {value ? (
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-2" />
                        )}
                        {key === 'length' ? 'Al menos 8 caracteres' :
                         key === 'upperCase' ? 'Una letra mayúscula' :
                         key === 'lowerCase' ? 'Una letra minúscula' :
                         key === 'number' ? 'Un número' :
                         'Un símbolo especial'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button type="submit" className="w-full text-sm sm:text-base">Registrarse</Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              ¿Ya tienes una cuenta? <a href="/login" className="text-primary hover:underline">Inicia Sesión</a>
            </p>
          </CardFooter>
        </Card>

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 sm:px-0">
            <Card className="w-full max-w-xs sm:max-w-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">¡Registro Exitoso!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base">El usuario ha sido registrado con éxito.</p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setShowSuccess(false)} className="w-full text-sm sm:text-base">Cerrar</Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}