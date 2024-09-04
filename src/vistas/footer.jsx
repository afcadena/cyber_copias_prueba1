import React from 'react';
import { Clock, Truck, CreditCard, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Papelería Creativa</h3>
            <p className="text-sm mb-4">
              Nuestra papelería ofrece los mejores productos para todos tus proyectos creativos y necesidades de oficina.
            </p>
            <p className="text-sm mb-4">
              <Mail className="inline-block mr-2" /> info@papeleriacreativa.com
            </p>
            <p className="text-sm mb-4">
              <Phone className="inline-block mr-2" /> (123) 456-7890
            </p>
            <p className="text-sm">
              <MapPin className="inline-block mr-2" /> Calle Ficticia 123, Ciudad Creativa
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Horario</h3>
            <p className="text-sm mb-2">
              <Clock className="inline-block mr-2" /> Lunes a Viernes: 9:00 AM - 6:00 PM
            </p>
            <p className="text-sm">
              <Clock className="inline-block mr-2" /> Sábados: 10:00 AM - 4:00 PM
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-400">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Métodos de Pago</h3>
            <div className="flex space-x-4">
              <CreditCard className="h-6 w-6" />
              <Truck className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500">
          &copy; {currentYear} Papelería Creativa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
