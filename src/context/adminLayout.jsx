import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  LogOut,
  Menu
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCrudContextForms } from './CrudContextForms';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useCrudContextForms();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: Package, label: 'Inventario', path: '/admin/inventario' },
    { icon: Users, label: 'Proveedores', path: '/admin/providers' },
    { icon: ShoppingCart, label: 'Pedidos', path: '/admin/orders' },
    { icon: DollarSign, label: 'Compras', path: '/admin/purchases' },
    { icon: TrendingUp, label: 'Ventas', path: '/admin/sales' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
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
    logoutUser();
    navigate('/login');
    setIsConfirmOpen(false);
  };

  const handleLogoutCancel = () => {
    setIsConfirmOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">CyberCopias Admin</h1>
      </div>
      <nav className="flex-1 mt-6 overflow-y-auto">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start px-6 py-3 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 ${location.pathname === item.path ? 'bg-gray-200 text-gray-900' : ''}`}
            onClick={() => {
              navigate(item.path);
              setIsMobileMenuOpen(false);
            }}
          >
            <item.icon className="mr-4 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>
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
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 bg-white shadow-lg flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cerrar sesión?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleLogoutCancel}>Cancelar</Button>
            <Button variant="destructive" onClick={handleLogoutConfirm}>
              Cerrar Sesión
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminLayout;