import React, { useState, useContext, useEffect, useCallback } from 'react';
import { CrudContextForms } from '../context/CrudContextForms';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Lock, Unlock, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GestionUsuarios() {
  const { users, getAllUsers, toggleUserStatus, isLoading, error } = useContext(CrudContextForms);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToBlock, setUserToBlock] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const stableGetAllUsers = useCallback(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    stableGetAllUsers();
  }, [stableGetAllUsers]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (value) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const filteredUsers = users && Array.isArray(users) ? users.filter(user =>
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter) &&
    (statusFilter === 'all' || user.status === statusFilter)
  ) : [];

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleBlockToggle = (userId) => {
    const user = users.find(u => u._id === userId);
    if (!user) return;
  
    const updatedStatus = user.status === 'Active' ? 'Blocked' : 'Active';
    toggleUserStatus(userId, updatedStatus);
    setUserToBlock(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500 bg-red-100 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50">
          <CardTitle className="text-2xl font-bold text-gray-800">Gestión de Usuarios</CardTitle>
          <UserCog className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 mb-6">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Search className="h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={handleSearch}
                className="max-w-sm border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <Select onValueChange={handleRoleFilter} defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="Active">Activo</SelectItem>
                <SelectItem value="Blocked">Bloqueado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {currentUsers.length > 0 ? (
            <ScrollArea className="h-[600px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-600">Usuario</TableHead>
                    <TableHead className="font-semibold text-gray-600">Email</TableHead>
                    <TableHead className="font-semibold text-gray-600">Rol</TableHead>
                    <TableHead className="font-semibold text-gray-600">Estado</TableHead>
                    <TableHead className="font-semibold text-gray-600">Última Conexión</TableHead>
                    <TableHead className="font-semibold text-gray-600">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date().toLocaleDateString()}</TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant={user.status === 'Active' ? 'destructive' : 'outline'}
                              size="sm"
                              onClick={() => setUserToBlock(user)}
                            >
                              {user.status === 'Active' ? (
                                <><Lock className="h-4 w-4 mr-1" /> Bloquear</>
                              ) : (
                                <><Unlock className="h-4 w-4 mr-1" /> Desbloquear</>
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Acción</AlertDialogTitle>
                              <AlertDialogDescription>
                                {user.status === 'Active' 
                                  ? `¿Estás seguro que quieres bloquear a ${user.name}?` 
                                  : `¿Estás seguro que quieres desbloquear a ${user.name}?`
                                }
                                Esta acción puede ser revertida más tarde.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleBlockToggle(user._id)}>
                                Confirmar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">No hay usuarios para mostrar.</div>
          )}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Mostrando {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastUser >= filteredUsers.length}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}