import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Define currentYear aquí

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Acerca de CyberCopias</h3>
          <p className="text-sm">Somos tu tienda de confianza para todas tus necesidades de papelería y material de oficina.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-sm hover:underline">Inicio</a></li>
            <li><a href="#" className="text-sm hover:underline">Productos</a></li>
            <li><a href="#" className="text-sm hover:underline">Ofertas</a></li>
            <li><a href="#" className="text-sm hover:underline">Contacto</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contacto</h3>
          <p className="text-sm">Nueva Roma</p>
          <p className="text-sm">Tel: 320 2164404</p>
          <p className="text-sm">Email: cibercopiascapital@hotmail.com</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-300">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-gray-700 text-sm text-center">
        &copy; {currentYear} CyberCopias. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
