import React from 'react'
import { Clock, Truck, CreditCard, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 text-gray-600 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-lg mb-4">Papelería Creativa</h3>
            <p className="text-sm mb-4">
              Tu destino para todos los suministros de oficina y escolares. 
              Inspirando creatividad desde 1995.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Nuestros Servicios</h3>
            <ul className="text-sm space-y-2">
              <li>Venta de útiles escolares</li>
              <li>Materiales de oficina</li>
              <li>Artículos de arte y manualidades</li>
              <li>Impresión y fotocopias</li>
              <li>Encuadernación</li>
              <li>Personalización de productos</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Información de Compra</h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-center">
                <Clock size={18} className="mr-2 text-primary" />
                <span>Entrega en 24-48 horas</span>
              </li>
              <li className="flex items-center">
                <Truck size={18} className="mr-2 text-primary" />
                <span>Envío gratis en compras +$50</span>
              </li>
              <li className="flex items-center">
                <CreditCard size={18} className="mr-2 text-primary" />
                <span>Pago seguro garantizado</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Contáctanos</h3>
            <ul className="text-sm space-y-3">
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span>info@papeleriacreativa.com</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 text-primary" />
                <span>Calle Principal #123, Ciudad</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-center">
            &copy; {currentYear} CyberCopias Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}