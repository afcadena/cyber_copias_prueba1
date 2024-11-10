import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto py-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Términos y Condiciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh]">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Introducción</h2>
                <p>Bienvenido a nuestro sistema de información web de la papelería. Al utilizar nuestros servicios, usted acepta los siguientes términos y condiciones.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. Servicios Ofrecidos</h2>
                <p>Nuestro sistema permite a los clientes registrarse, iniciar sesión y realizar compras virtuales de productos de papelería. Además, los administradores pueden gestionar pedidos, verificar inventarios, analizar ventas y gestionar pedidos a proveedores.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. Registro e Inicio de Sesión</h2>
                <p>Para utilizar ciertos servicios, los usuarios deben registrarse proporcionando información precisa y completa. Es responsabilidad del usuario mantener la confidencialidad de su contraseña y cuenta.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Compras Virtuales</h2>
                <p>Los clientes pueden realizar compras de productos de papelería a través de nuestra plataforma. Todas las transacciones están sujetas a disponibilidad de stock y confirmación del pedido.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Gestión Administrativa</h2>
                <p>Los administradores tienen acceso a herramientas para verificar pedidos, gestionar inventarios, revisar ventas y hacer pedidos a proveedores. Estas acciones deben realizarse conforme a las políticas internas de la empresa.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Políticas de Privacidad</h2>
                <p>Respetamos la privacidad de nuestros usuarios y manejamos la información personal de acuerdo con nuestra política de privacidad.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">7. Responsabilidades del Usuario</h2>
                <p>El usuario se compromete a utilizar nuestra plataforma de manera responsable y a no realizar actividades fraudulentas. Cualquier incumplimiento de estos términos puede resultar en la suspensión o terminación de la cuenta del usuario.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Modificaciones de los Términos</h2>
                <p>Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Las modificaciones serán efectivas una vez publicadas en nuestra plataforma.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">9. Contacto</h2>
                <p>Si tiene alguna pregunta o inquietud sobre estos términos y condiciones, puede ponerse en contacto con nosotros a través de [correo electrónico de contacto].</p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}