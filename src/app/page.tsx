"use client"

import { motion, useInView } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import * as React from "react"
import Link from "next/link";
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
import { useTranslations } from "next-intl";

// AnimatedSection component for scroll-based animation
function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.2 } }
      }}
    >
      {children}
    </motion.section>
  );
}

function AccordionItem({ title, children, isInitiallyOpen = false }: { title: string, children: React.ReactNode, isInitiallyOpen?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(isInitiallyOpen);

  return (
    <div className={`bg-gray-900/50 rounded-lg border ${isOpen ? 'border-red-600' : 'border-gray-800'}`}>
      <button
        className="accordion-header flex justify-between items-center w-full p-6 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className={`transition-colors ${isOpen ? 'text-xl font-bold text-red-600' : 'text-lg font-semibold text-white'}`}>
          {title}
        </h3>
        <IconChevronDown className={`text-red-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className="accordion-content"
        style={{ maxHeight: isOpen ? '500px' : '0' }} // Use a fixed large value
      >
        <div className="p-6 pt-0 text-gray-400">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const t = useTranslations('LandingPage');

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
    <div className="relative overflow-hidden bg-black text-white font-sans">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <IconShield className="text-red-600 size-8" />
              <span className="ml-2 text-2xl font-bold text-white">PrivaClean</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a className="text-gray-400 hover:text-red-600 transition-colors" href="#services">{t('nav.services')}</a>
              <a className="text-gray-400 hover:text-red-600 transition-colors" href="#pricing">{t('nav.pricing')}</a>
              <a className="text-gray-400 hover:text-red-600 transition-colors" href="#faq">{t('nav.faq')}</a>
              <Link className="text-gray-400 hover:text-red-600 transition-colors" href="/login">{t('nav.clientAccess')}</Link>
              <div className="border-l border-border h-6"></div>
              <LanguageSwitcher />
            </nav>
            <div className="md:hidden">
              <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <IconX /> : <IconMenu2 />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-black" id="mobile-menu">
            <nav className="px-4 pt-2 pb-4 space-y-2">
              <a className="block text-white hover:text-red-600 transition-colors py-2" href="#services">{t('nav.services')}</a>
              <a className="block text-white hover:text-red-600 transition-colors py-2" href="#pricing">{t('nav.pricing')}</a>
              <a className="block text-white hover:text-red-600 transition-colors py-2" href="#faq">{t('nav.faq')}</a>
              <Link className="block text-white hover:text-red-600 transition-colors py-2" href="/login">{t('nav.clientAccess')}</Link>
              <div className="border-t border-gray-800 pt-4 mt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="pt-20">
        <motion.section
          className="py-20 md:py-32 bg-black flex items-center min-h-[calc(100vh-5rem)]"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-4xl md:text-6xl font-bold text-white leading-tight"
            >
              {t('hero.title')}<span className="text-red-600">{t('hero.titleHighlight')}</span>
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-gray-400"
            >
              {t('hero.subtitle')}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="mt-10"
            >
              <Link className="bg-red-600 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-red-700 transition-colors transform hover:scale-105 inline-block" href="/login">
                {t('hero.cta')}
              </Link>
            </motion.div>
          </div>
        </motion.section>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-red-600 to-red-600/50"></div>
              <p className="text-center text-lg font-semibold text-red-600">{t('mission.text')}</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-red-600 to-red-600/50"></div>
            </div>
          </div>
        </div>

        <AnimatedSection id="services" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">{t('process.title')}</h2>
            <motion.div
              className="relative roadmap"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <div className="absolute top-16 bottom-16 left-[calc(2.5rem-1px)] md:left-1/2 md:-translate-x-1/2 w-0.5 bg-border"></div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 relative">
                {[1, 2, 3, 4, 5, 6].map((step) => {
                  const isOdd = step % 2 !== 0;
                  const Icon = [IconUserCheck, IconSearch, IconGavel, IconTrash, IconRefresh, IconChartBar][step - 1];
                  const itemVariants = {
                    hidden: { opacity: 0, x: isOdd ? -30 : 30 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
                  };

                  const content = (
                    <motion.div variants={itemVariants}>
                      <div className={`flex items-center w-full ${isOdd ? 'md:flex-row-reverse' : 'flex-row'}`}>
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-red-600/20 text-red-600 flex items-center justify-center z-10">
                          <Icon size={36} />
                        </div>
                        {isOdd && (
                          <div className="text-left md:text-right pl-6 md:pl-0 md:pr-8">
                            <h3 className="text-xl font-bold text-white mb-2">{t(`process.step${step}_title`)}</h3>
                            <p className="text-gray-400">{t(`process.step${step}_desc`)}</p>
                          </div>
                        )}
                        {!isOdd && (
                          <div className="pl-6">
                            <h3 className="text-xl font-bold text-white mb-2">{t(`process.step${step}_title`)}</h3>
                            <p className="text-gray-400">{t(`process.step${step}_desc`)}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );

                  if (isOdd) {
                    return <React.Fragment key={step}><div className="md:text-right">{content}</div><div></div></React.Fragment>;
                  } else {
                    return <React.Fragment key={step}><div></div><div>{content}</div></React.Fragment>;
                  }
                })}
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-red-600 to-red-600/50"></div>
              <p className="text-center text-lg font-semibold text-red-600">{t('focus.text')}</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-red-600 to-red-600/50"></div>
            </div>
          </div>
        </div>

        <AnimatedSection id="pricing" className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">{t('pricing.title')}</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
            </div>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 flex flex-col h-full">
                <h3 className="text-xl font-bold text-white mb-2">{t('pricing.basic_title')}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{t('pricing.basic_desc')}</p>
                <p className="text-4xl font-bold mb-6">{t('pricing.basic_price')}<span className="text-lg font-normal text-gray-400">{t('pricing.per_month')}</span></p>
                <ul className="space-y-4 text-gray-400 mb-8">
                  {['basic.0', 'basic.1', 'basic.2'].map(key => (
                    <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                  ))}
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                  {t('pricing.choose_plan')}
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border-2 border-red-600 relative flex flex-col h-full shadow-2xl shadow-red-600/10 scale-105">
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                  <div className="bg-red-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">{t('pricing.most_popular')}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('pricing.professional_title')}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{t('pricing.professional_desc')}</p>
                <p className="text-4xl font-bold mb-6">{t('pricing.professional_price')}<span className="text-lg font-normal text-gray-400">{t('pricing.per_month')}</span></p>
                <ul className="space-y-4 text-gray-400 mb-8">
                  {['professional.0', 'professional.1', 'professional.2', 'professional.3'].map(key => (
                    <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                  ))}
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                  {t('pricing.choose_plan')}
                </Link>
              </motion.div>

              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 flex flex-col h-full md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-2">{t('pricing.agency_title')}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{t('pricing.agency_desc')}</p>
                <p className="text-4xl font-bold mb-6">{t('pricing.agency_price')}</p>
                <ul className="space-y-4 text-gray-400 mb-8">
                  {['agency.0', 'agency.1', 'agency.2', 'agency.3'].map(key => (
                    <li key={key} className="flex items-center gap-3"><IconCheck className="size-5 text-red-600" /> {t(`features.${key}`)}</li>
                  ))}
                </ul>
                <Link className="mt-auto w-full inline-block text-center bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg" href="/login">
                  {t('pricing.contact_sales')}
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <div className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-grow bg-gradient-to-r from-transparent via-red-600 to-red-600/50"></div>
              <p className="text-center text-lg font-semibold text-red-600">{t('trust.title')}</p>
              <div className="h-px flex-grow bg-gradient-to-l from-transparent via-red-600 to-red-600/50"></div>
            </div>
          </div>
        </div>

        <AnimatedSection className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('trust.stats_title')}</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">{t('trust.stats_subtitle')}</p>
            </div>
            <motion.div
              className="mt-16 grid md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            >
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                <IconUserShield className="text-red-600 size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 mt-4">{t('trust.stat1_value')}</p>
                <p className="text-gray-400 mt-2">{t('trust.stat1_desc')}</p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                <IconGauge className="text-red-500 size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400 mt-4">{t('trust.stat2_value')}</p>
                <p className="text-gray-400 mt-2">{t('trust.stat2_desc')}</p>
              </motion.div>
              <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-gray-900/50 p-8 rounded-lg text-center flex flex-col items-center">
                <IconTrendingUp className="text-red-400 size-12" />
                <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 mt-4">{t('trust.stat3_value')}</p>
                <p className="text-gray-400 mt-2">{t('trust.stat3_desc')}</p>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>

        <AnimatedSection id="faq" className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">{t('faq.title')}</h2>
              <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">{t('faq.subtitle')}</p>
            </div>
            <motion.div
              className="max-w-4xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <div className="space-y-4">
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <AccordionItem title={t('faq.q1_title')} isInitiallyOpen={true}>
                    <p>{t('faq.q1_answer_p1')}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {['0', '1', '2', '3', '4'].map(index => (
                        <li key={index} dangerouslySetInnerHTML={{ __html: t.raw(`faq.q1_answer_li.${index}`) }} />
                      ))}
                    </ul>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <AccordionItem title={t('faq.q2_title')}>
                    <p>{t('faq.q2_answer')}</p>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <AccordionItem title={t('faq.q3_title')}>
                    <p>{t('faq.q3_answer')}</p>
                  </AccordionItem>
                </motion.div>
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <AccordionItem title={t('faq.q4_title')}>
                    <p>{t('faq.q4_answer')}</p>
                  </AccordionItem>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </main>

      <footer className="bg-gray-900/50 text-gray-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p>{t('footer.copyright')}</p>
          <p className="text-sm mt-2 text-gray-500">{t('footer.privacy')}</p>
        </div>
      </footer>
    </div >
  )
}
