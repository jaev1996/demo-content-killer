"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconShield,
  IconMenu2,
  IconX,
  IconUserCheck,
  IconSearch,
  IconGavel,
  IconTrash,
  IconRefresh,
  IconChartBar,
  IconUserShield,
  IconGauge,
  IconTrendingUp,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react"

function AccordionItem({ title, children, isInitiallyOpen = false }: { title: string, children: React.ReactNode, isInitiallyOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(isInitiallyOpen);

  return (
    <div className={`bg-background rounded-lg shadow-md ${isOpen ? 'faq-gradient-border' : ''}`}>
      <button
        className="accordion-header flex justify-between items-center w-full p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={`transition-colors ${isOpen ? 'text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary' : 'text-lg font-semibold text-foreground'}`}>
          {title}
        </h3>
        <IconChevronDown className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="accordion-content"
        style={{ maxHeight: isOpen ? '500px' : '0' }} // Use a fixed large value
      >
        <div className="p-6 pt-0 text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // Close menu on resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative overflow-hidden bg-background font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <IconShield className="text-primary size-8" />
              <span className="ml-2 text-2xl font-bold text-foreground">ContentGuard</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#services">Servicios</a>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#pricing">Precios</a>
              <a className="text-muted-foreground hover:text-primary transition-colors" href="#faq">Preguntas Frecuentes</a>
              <Link className="text-muted-foreground hover:text-primary transition-colors" href="/login">Acceso Clientes</Link>
            </nav>
            <div className="md:hidden">
              <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <IconX /> : <IconMenu2 />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-background" id="mobile-menu">
            <nav className="px-4 pt-2 pb-4 space-y-2">
              <a className="block text-foreground hover:text-primary transition-colors py-2" href="#services">Servicios</a>
              <a className="block text-foreground hover:text-primary transition-colors py-2" href="#pricing">Precios</a>
              <a className="block text-foreground hover:text-primary transition-colors py-2" href="#faq">Preguntas Frecuentes</a>
              <Link className="block text-foreground hover:text-primary transition-colors py-2" href="/login">Acceso Clientes</Link>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-20">
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Recupera el Control de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Tu Contenido.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground">
              Protegemos tu privacidad y tu carrera eliminando contenido filtrado de internet. Rápido, discreto y eficaz.
            </p>
            <div className="mt-10">
              <Link className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 px-10 rounded-full text-lg hover:opacity-90 transition-opacity transform hover:scale-105 inline-block" href="/login">
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </section>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary to-primary/50"></div>
              <p className="text-center text-lg font-semibold text-primary">Tu tranquilidad es nuestra misión.</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-primary to-primary/50"></div>
            </div>
          </div>
        </div>

        <section id="services" className="py-20 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-16">Nuestro Proceso Detallado</h2>
            <div className="relative roadmap">
              <div className="absolute top-16 bottom-16 left-[calc(2.5rem-1px)] md:left-1/2 md:-translate-x-1/2 w-0.5 bg-border"></div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                {/* Item 1 */}
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center w-full md:justify-end">
                    <div className="md:text-right md:pr-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">1. Registro y Configuración</h3>
                      <p className="text-muted-foreground">Comienzas con un registro sencillo y seguro. Configuramos tu perfil para iniciar la protección de inmediato.</p>
                    </div>
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center z-10"><IconUserCheck size={36} /></div>
                  </div>
                </div>
                <div></div>
                {/* Item 2 */}
                <div></div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-secondary/20 text-secondary flex items-center justify-center z-10"><IconSearch size={36} /></div>
                    <div className="pl-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">2. Detección Inteligente</h3>
                      <p className="text-muted-foreground">Nuestra IA escanea la web, redes sociales y sitios pirata 24/7 para encontrar tu contenido filtrado.</p>
                    </div>
                  </div>
                </div>
                {/* Item 3 */}
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center w-full md:justify-end">
                    <div className="md:text-right md:pr-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">3. Reclamación DMCA</h3>
                      <p className="text-muted-foreground">Iniciamos acciones legales inmediatas (DMCA Takedowns) contra las webs y plataformas infractoras.</p>
                    </div>
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-destructive/20 text-destructive flex items-center justify-center z-10"><IconGavel size={36} /></div>
                  </div>
                </div>
                <div></div>
                {/* Item 4 */}
                <div></div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center z-10"><IconTrash size={36} /></div>
                    <div className="pl-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">4. Eliminación Verificada</h3>
                      <p className="text-muted-foreground">Nos aseguramos de que el contenido sea eliminado permanentemente y desindexado de los buscadores.</p>
                    </div>
                  </div>
                </div>
                {/* Item 5 */}
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center w-full md:justify-end">
                    <div className="md:text-right md:pr-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">5. Monitoreo Continuo</h3>
                      <p className="text-muted-foreground">La protección no se detiene. Seguimos vigilando para evitar que el contenido reaparezca.</p>
                    </div>
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-secondary/20 text-secondary flex items-center justify-center z-10"><IconRefresh size={36} /></div>
                  </div>
                </div>
                <div></div>
                {/* Item 6 */}
                <div></div>
                <div className="flex flex-col items-start">
                  <div className="flex items-center w-full">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-destructive/20 text-destructive flex items-center justify-center z-10"><IconChartBar size={36} /></div>
                    <div className="pl-8">
                      <h3 className="text-xl font-bold text-foreground mb-2">6. Análisis de Estadísticas</h3>
                      <p className="text-muted-foreground">Recibes informes detallados sobre las eliminaciones y el impacto positivo en tu marca personal.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-secondary to-secondary/50"></div>
              <p className="text-center text-lg font-semibold text-secondary">Enfócate en crear, nosotros te protegemos.</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-secondary to-secondary/50"></div>
            </div>
          </div>
        </div>

        <section id="pricing" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planes Flexibles para Cada Necesidad</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Elige el plan que mejor se adapta a tu carrera. Sin contratos a largo plazo, cancela cuando quieras.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
              {/* Plan Básico */}
              <div className="bg-card p-8 rounded-lg border flex flex-col h-full">
                <h3 className="text-xl font-bold text-foreground mb-2">Básico</h3>
                <p className="text-muted-foreground mb-6 flex-grow">Ideal para empezar a proteger tu contenido.</p>
                <p className="text-4xl font-bold mb-6">$99<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
                <ul className="space-y-4 text-muted-foreground mb-8">
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Monitoreo 24/7</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Hasta 100 eliminaciones/mes</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Soporte por email</li>
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-background border border-input hover:bg-accent hover:text-accent-foreground transition-colors text-foreground font-semibold py-3 px-6 rounded-lg" href="/login">
                  Elegir Plan
                </Link>
              </div>

              {/* Plan Profesional (Destacado) */}
              <div className="bg-card p-8 rounded-lg border-2 border-primary relative flex flex-col h-full shadow-2xl shadow-primary/10">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">Más Popular</div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Profesional</h3>
                <p className="text-muted-foreground mb-6 flex-grow">La solución completa para creadores en crecimiento.</p>
                <p className="text-4xl font-bold mb-6">$249<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
                <ul className="space-y-4 text-muted-foreground mb-8">
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Todo lo del plan Básico</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Eliminaciones ilimitadas</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Búsqueda en foros y Telegram</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Soporte prioritario 24/7</li>
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-primary hover:opacity-90 transition-opacity text-primary-foreground font-semibold py-3 px-6 rounded-lg" href="/login">
                  Elegir Plan
                </Link>
              </div>

              {/* Plan Agencia */}
              <div className="bg-card p-8 rounded-lg border flex flex-col h-full md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-bold text-foreground mb-2">Agencia</h3>
                <p className="text-muted-foreground mb-6 flex-grow">Gestiona múltiples perfiles con herramientas avanzadas.</p>
                <p className="text-4xl font-bold mb-6">Contacto</p>
                <ul className="space-y-4 text-muted-foreground mb-8">
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Todo lo del plan Profesional</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Panel de gestión multi-perfil</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> API de integración</li>
                  <li className="flex items-center gap-3"><IconCheck className="size-5 text-primary" /> Manager de cuenta dedicado</li>
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-background border border-input hover:bg-accent hover:text-accent-foreground transition-colors text-foreground font-semibold py-3 px-6 rounded-lg" href="/login">
                  Contactar Ventas
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-primary to-primary/50"></div>
              <p className="text-center text-lg font-semibold text-primary">Resultados que inspiran confianza.</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-primary to-primary/50"></div>
            </div>
          </div>
        </div>

        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Confianza y Resultados Que Hablan Por Sí Mismos</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">Somos el aliado de confianza para creadoras de contenido. Nuestra misión es darte la tranquilidad que mereces.</p>
            </div>
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg text-center flex flex-col items-center">
                <IconUserShield className="text-primary size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mt-4">150,000+</p>
                <p className="text-muted-foreground mt-2">Archivos eliminados con éxito</p>
              </div>
              <div className="bg-card p-8 rounded-lg text-center flex flex-col items-center">
                <IconGauge className="text-secondary size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-destructive mt-4">&lt;24h</p>
                <p className="text-muted-foreground mt-2">Tiempo promedio de respuesta</p>
              </div>
              <div className="bg-card p-8 rounded-lg text-center flex flex-col items-center">
                <IconTrendingUp className="text-destructive size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-destructive to-primary mt-4">~25%</p>
                <p className="text-muted-foreground mt-2">Aumento de ingresos reportado</p>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 bg-card">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Preguntas que nos hacen a menudo</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Encuentra respuestas rápidas a tus dudas. Si no ves tu pregunta aquí, no dudes en contactarnos.</p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                <AccordionItem title="¿Cómo funciona el proceso de eliminación DMCA?" isInitiallyOpen={true}>
                  <p>Nuestro proceso es exhaustivo y se divide en varios pasos clave para garantizar la máxima eficacia:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Búsqueda:</strong> Utilizamos sistemas avanzados para encontrar tu contenido filtrado en toda la web.</li>
                    <li><strong>Categorización:</strong> Clasificamos los hallazgos para priorizar y agilizar el proceso.</li>
                    <li><strong>Investigación de sitios:</strong> Analizamos cada sitio infractor para determinar la mejor estrategia de eliminación.</li>
                    <li><strong>Envío de solicitudes:</strong> Enviamos notificaciones de eliminación DMCA formales y legalmente sólidas.</li>
                    <li><strong>Seguimiento constante:</strong> Monitoreamos cada caso hasta confirmar la eliminación permanente del contenido.</li>
                  </ul>
                </AccordionItem>
                <AccordionItem title="¿Cuál es el costo del servicio de eliminación?">
                  <p>Entendemos que cada caso es único. Por eso, ofrecemos un asesoramiento inicial sin compromiso para evaluar tus necesidades. A partir de ahí, te proporcionamos un presupuesto claro y detallado antes de iniciar cualquier acción. Nuestra prioridad es la transparencia total.</p>
                </AccordionItem>
                <AccordionItem title="¿Tengo que hacer algo una vez que contrato el servicio?">
                  <p>Absolutamente nada. Una vez que contratas nuestros servicios, nosotros nos encargamos de todo el proceso de principio a fin. No necesitas subir archivos, rellenar formularios complejos ni realizar ninguna acción. Tu única tarea es tener la tranquilidad de que tu contenido está siendo protegido.</p>
                </AccordionItem>
                <AccordionItem title="¿Por qué usar un servicio en lugar de hacerlo yo misma?">
                  <p>La principal ventaja es el ahorro de tiempo y la efectividad legal. Gestionar las eliminaciones DMCA por tu cuenta puede ser un proceso largo, frustrante y emocionalmente agotador. Nuestro equipo de expertos tiene la experiencia y las herramientas para hacerlo de manera rápida y eficiente, permitiéndote concentrarte en lo que mejor sabes hacer: crear contenido y hacer crecer tu negocio.</p>
                </AccordionItem>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-card text-muted-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>© 2024 ContentGuard. Todos los derechos reservados.</p>
          <p className="text-sm mt-2">Tu privacidad es nuestra prioridad.</p>
        </div>
      </footer>
    </div >
  )
}
