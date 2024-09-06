import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Search,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();  // Hook de navegación

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-8">
            <Button onClick={() => navigate('/admin/overview')} variant="ghost">
              <BarChart className="mr-2 h-4 w-4" />
              Vista General
            </Button>
            <Button onClick={() => navigate('/admin/inventario')} variant="ghost">
              <Package className="mr-2 h-4 w-4" />
              Inventario
            </Button>
            <Button onClick={() => navigate('/admin/providers')} variant="ghost">
              <Users className="mr-2 h-4 w-4" />
              Proveedores
            </Button>
            <Button onClick={() => navigate('/admin/orders')} variant="ghost">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Pedidos
            </Button>
            <Button onClick={() => navigate('/admin/purchases')} variant="ghost">
              <DollarSign className="mr-2 h-4 w-4" />
              Compras
            </Button>
            <Button onClick={() => navigate('/admin/sales')} variant="ghost">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ventas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
