import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCrudContextForms } from './CrudContextForms'; // Asegúrate de que esta ruta sea correcta
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useCrudContextForms(); // Usa el hook correcto
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const menuItems = [
    { icon: Package, label: 'Inventario', path: '/admin/inventario' },
    { icon: Users, label: 'Proveedores', path: '/admin/providers' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/orders' },
    { icon: DollarSign, label: 'Compras', path: '/admin/purchases' },
    { icon: TrendingUp, label: 'Ventas', path: '/admin/sales' },
  ];

  useEffect(() => {
    if (location.pathname === '/admin') {
      navigate('/admin/inventario');
    }
  }, [location.pathname, navigate]);

  const handleLogoutClick = () => {
    setIsConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    logoutUser(); // Llama a la función logoutUser para cerrar sesión
    navigate('/login');
    setIsConfirmOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Header del sidebar */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">CyberCopias Administración</h1>
        </div>
        {/* Menú */}
        <nav className="flex-1 mt-6 overflow-y-auto">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`w-full justify-start px-6 py-3 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${location.pathname === item.path ? 'bg-gray-200 text-gray-900' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="mr-4 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
        {/* Footer con el botón de cerrar sesión */}
        <div className="p-6">
          <Button 
            variant="outline" 
            className="w-full justify-start" 
            onClick={handleLogoutClick}
          >
            <LogOut className="mr-4 h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido al Panel de Administración</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent aria-labelledby="confirm-title" aria-describedby="confirm-description">
          <DialogHeader>
            <DialogTitle id="confirm-title">Confirmar Cierre de Sesión</DialogTitle>
            <DialogDescription id="confirm-description">
              ¿Estás seguro de cerrar sesión?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleLogoutCancel}>Cancelar</Button>
            <Button onClick={handleLogoutConfirm} className="bg-blue-500 text-white hover:bg-blue-600">
              Cerrar Sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLayout;
