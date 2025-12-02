import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, MapPin, Phone, Clock, Instagram, Star, Sparkles, Scissors, 
  Droplet, Heart, Palette, ShieldCheck, Gem, UserCheck, ChevronRight, 
  BookOpen, Layout, Users, Zap, Mail, ArrowUp, Send, Loader2, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logoImage from '@assets/IMG-20251201-WA0024_1764618421640.jpg';

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// --- SITE DATA ---
const SITE_TITLE = "ANAROS";
const SITE_SUBTITLE = "Beauty Lounge";

const navigation = [
  { name: 'Accueil', id: 'home', icon: Layout },
  { name: 'Services', id: 'services', icon: Scissors },
  { name: 'Galerie', id: 'gallery', icon: Palette },
  { name: 'À Propos', id: 'about', icon: Users },
  { name: 'Actualités', id: 'news', icon: Zap },
  { name: 'Contact', id: 'contact', icon: Phone },
];

const team = [
  { name: "Samira", role: "Experte Massage & Coiffure", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
  { name: "Saliha & Amel", role: "Esthétique & Soins Visage", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
  { name: "Dounia & Safa", role: "Artistes Ongulaires", image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" },
  { name: "Amina", role: "Réception & Management", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }
];

const commitments = [
  { icon: ShieldCheck, title: "Marques Premium", description: "Nous sélectionnons rigoureusement les produits haut de gamme (Kérastase, OPI, etc.) pour des résultats durables et sains." },
  { icon: Gem, title: "Hygiène Irréprochable", description: "Protocoles stricts de stérilisation et d'hygiène. Votre sécurité et votre bien-être sont notre priorité absolue." },
  { icon: UserCheck, title: "Approche Personnalisée", description: "Un diagnostic beauté complet avant chaque soin pour adapter la prestation à vos besoins uniques et à votre nature." },
];

const services = [
  {
    id: "coiffure",
    title: "Haute Coiffure",
    description: "De la coupe structurée au balayage lumineux, nos expertes subliment votre chevelure. Spécialistes du Botox capillaire et des colorations soins.",
    icon: Scissors,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    details: ["Coupes & Brushing", "Coloration & Balayage", "Soins Botox & Kératine", "Coiffures Mariées"],
    content: "L'art de la coiffure chez Anaros dépasse la simple coupe. Nous vous proposons une consultation approfondie pour définir le style, la couleur et le traitement idéal pour la santé et l'éclat de vos cheveux. Notre expertise en colorimétrie assure des nuances parfaites."
  },
  {
    id: "hammam",
    title: "Hammam & Spa",
    description: "Un voyage sensoriel au cœur de la tradition. Le rituel Royal est notre signature, une expérience de purification et de détente profonde.",
    icon: Droplet,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    details: ["Rituel Traditionnel", "Rituel Royal", "Rituel Sultana", "Gommage au Savon Noir"],
    content: "Plongez dans un havre de paix. Notre hammam, conçu dans le respect de l'architecture orientale, utilise des produits naturels et bio pour le gommage et l'enveloppement. C'est le secret d'une peau douce et d'un esprit apaisé."
  },
  {
    id: "onglerie",
    title: "Onglerie d'Art",
    description: "Vos mains disent tout de vous. Dounia, Safa et Chahinez transforment vos ongles en bijoux avec une précision chirurgicale.",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    details: ["Vernis Semi-Permanent", "Pose Gel & Remplissage", "Nail Art", "Pédicure Spa"],
    content: "De la manucure express aux créations Nail Art les plus complexes, nos artistes ongulaires utilisent uniquement des marques de qualité professionnelle pour garantir une tenue et une brillance parfaites, dans le respect de la santé de vos ongles."
  },
  {
    id: "bien-etre",
    title: "Soins & Bien-être",
    description: "Technologies de pointe et mains expertes. De l'Hydrafacial pour l'éclat à la Madérothérapie pour la silhouette.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    details: ["Massage Relaxant", "Madérothérapie", "Hydrafacial Coréen", "Épilation"],
    content: "Nous proposons une gamme de soins corps et visage personnalisés. Que ce soit pour une séance de Madérothérapie drainante ou un soin Hydrafacial coréen pour un nettoyage en profondeur, nos protocoles sont conçus pour un résultat visible et immédiat."
  }
];

const galleryImages = [
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwBjdptOS-x1r2ewMBm4N4oi1Zp1XYqTF9JoYt5SNU1O4BpbaOwhvKBrHaIEpUO3W04N951rkHlAga99YuSVCCsVRjXQ3CkjOmbv5zOPyn5JWbxomHBVlKTqNiUVTsq1HikBlZkc7EUGCk=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwJU3ha3bEdXoHRhffCnER_sdomUjw3bovcTcDVNkideOX8JXmBmIPtJ-l3q-_p9C-6i25rE35-2QMxllxoalhneZsieuRauYHI-Qq1gcpC3nq9hw5vptowbCZS_D6-Vd3ugGVU=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/p/AF1QipPD4p7euESqNrvSRjR9BVSpc71lBQpborYMOyIf=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSznz7G9wJLMurwW9eDLRZrEj9roRPzYLB0AAqRtBFwANRmG1t9cUuVic3s4_OSeCJlqOaRS4ODz9t2zNvFc4NrpAi5b3WHWw7Yb77n4YJN6riumFac16at2WqTse8Y4L_o9jeKp=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwdIjumssSPjnsoaA66uqrQAdUJiH46O1Gko_9zPNLA6IluJr9VMNvbf8iG15aigjQUr14gpr-pfbiQPC7OP8eDQxHp2gID_uKvxJkFkScSiuaSfKxYARxmwYIR8cAO6CQ9Fx-WqKab0nAC=w141-h176-n-k-no-nu",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxCKLeyRjzTF1znRouOjN9cenHF6nZxfHuR3PZIQqIN_3GCN2rTT54sKVFk_7_oF4DB638qUfs6E54pTJffy7oVHkFb1Z2e-Bu1j2UBlG5eE4-HGOyQtHIzEffTECmhIbe7olMl_g=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSyBlnZRsKg7cSHf-iAEn21vdeF2vHj2XOAo7wJZWqkX6-EhKXjXIFJ441V1wd_JibK1faBmZ6qFwTDDLtsOEscJkrKRMD_572hXHzwELcCJ_h7lcUjq1BATmzIyHD63dlxnBOdx=w141-h235-n-k-no-nu",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSycjWgYCqe64WIdSrFRQyvO-ZfIeR7as6hxPvkYxBCUjBMKpeI8sHmouAmcieX4uGVs_BzDHlb5u098tTRwyyqlBUZoCWipQYhsMetBkFs5eLQYMgfwMj0wC9jjcBPFpNCP2bMN_A=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/p/AF1QipOGKTSSijai-YU4AQb4KdYK3inA2oIkH0NmWdj9=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSwZv3dHr0_CvGHqElI7ZqBbikWPqyCnL3_iQZlMl3FttrZmSmvVZXQcL46ktqGkavIsaqvZ1Rxp_y8qrt8nxiqL8YDulw3KYhVQDVTLpG7Ve6uswE0ncIGH6IYhdfL3lTXLvAU=s680-w680-h510-rw",
  "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx3w68hDMc2YKIkg_d23lBytew43HdBBTNcCHoeaXYKF0Xoi8bCHJ0P0x_VbGel1UzWGlc3kDhbgzCwKlS0an3xj_yLSl2UUsXzbOS6C4e-rjruVGL2uXWFv8sBXXLfFp573vUd=s680-w680-h510-rw",
];

const newsArticles = [
  {
    id: 1,
    title: "Le Soin Hydrafacial Coréen Arrive chez Anaros",
    category: "Nouveau Soin",
    date: "10 Septembre 2025",
    image: "https://images.unsplash.com/photo-1627914445839-813e31649988?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Découvrez la révolution du soin du visage ! Le protocole Hydrafacial, désormais disponible dans notre institut, offre un nettoyage, une exfoliation et une hydratation en profondeur pour une peau éclatante et sans imperfection."
  },
  {
    id: 2,
    title: "Renforcement du Partenariat avec Kérastase Paris",
    category: "Partenariat",
    date: "22 Août 2025",
    image: "https://images.unsplash.com/photo-1628172778817-0243e80f5549?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    excerpt: "Anaros est fier d'annoncer son statut de salon partenaire \"Prestige\" avec Kérastase. Cela nous permet de vous proposer des diagnostics capillaires ultra-précis et des gammes de soins exclusives."
  }
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
};

// --- NAVIGATION COMPONENT ---
function Navigation({ currentPage, onNavigate, isScrolled }: {
  currentPage: string;
  onNavigate: (id: string) => void;
  isScrolled: boolean;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navClass = currentPage === 'home' 
    ? (isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5')
    : 'bg-white shadow-md py-3';
  
  const titleClass = currentPage === 'home' && !isScrolled
    ? 'text-white'
    : 'text-stone-800';

  const linkClass = (id: string) => {
    if (currentPage === id) {
      return 'bg-amber-600 text-white font-medium';
    }
    return currentPage === 'home' && !isScrolled 
      ? 'text-white/90 hover:text-white hover:bg-white/10' 
      : 'text-stone-600 hover:text-amber-600 hover:bg-amber-50';
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navClass}`} role="navigation" aria-label="Navigation principale">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          <button 
            type="button"
            onClick={() => onNavigate('home')} 
            className={`flex items-center gap-3 transition-colors ${titleClass}`}
            aria-label="Retour à l'accueil ANAROS Beauty Lounge"
            data-testid="link-home-logo"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-600/50">
              <img src={logoImage} alt="ANAROS Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif tracking-wider font-bold">{SITE_TITLE}</span>
              <span className="text-xs tracking-widest opacity-70">{SITE_SUBTITLE}</span>
            </div>
          </button>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button 
                  type="button"
                  key={item.id} 
                  onClick={() => onNavigate(item.id)}
                  className={`text-xs uppercase tracking-widest transition-all flex items-center gap-2 px-4 py-2 rounded-full ${linkClass(item.id)}`}
                  aria-label={`Aller à ${item.name}`}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                  role="menuitem"
                  data-testid={`link-nav-${item.id}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={titleClass}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg lg:hidden overflow-hidden"
            role="menu"
            aria-label="Menu de navigation mobile"
          >
            <div className="p-4 flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button 
                    type="button"
                    key={item.id} 
                    onClick={() => { onNavigate(item.id); setIsMenuOpen(false); }}
                    className="text-stone-600 uppercase tracking-widest text-sm py-3 px-4 rounded-lg flex items-center gap-3 hover:bg-stone-100 transition-colors"
                    role="menuitem"
                    aria-label={`Aller à ${item.name}`}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                    data-testid={`link-mobile-nav-${item.id}`}
                  >
                    <Icon className="w-5 h-5 text-amber-600" aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- FOOTER COMPONENT ---
function Footer() {
  return (
    <footer id="contact" className="bg-stone-50 pt-24 pb-12 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Contact */}
          <motion.div variants={fadeInUp} className="text-center md:text-left">
            <h4 className="text-lg font-serif text-stone-800 mb-6">Nous Trouver</h4>
            <ul className="space-y-4 text-stone-600">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                <span>123 Boulevard des Martyrs<br/>Alger, Algérie</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>+213 550 00 00 00</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Mail className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>contact@anaros.dz</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Instagram className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>@anaros_beautylounge</span>
              </li>
            </ul>
          </motion.div>

          {/* Logo Center */}
          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-600/30 mb-4">
              <img src={logoImage} alt="ANAROS Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2 tracking-widest">{SITE_TITLE}</h2>
            <p className="text-sm text-amber-600 font-medium tracking-wider">{SITE_SUBTITLE}</p>
            <div className="w-12 h-0.5 bg-amber-600 my-4"></div>
            <p className="text-sm text-stone-500 italic">L'excellence de la beauté</p>
          </motion.div>

          {/* Hours */}
          <motion.div variants={fadeInUp} className="text-center md:text-right">
            <h4 className="text-lg font-serif text-stone-800 mb-6">Horaires d'Ouverture</h4>
            <ul className="space-y-2 text-stone-600">
              <li className="flex justify-center md:justify-end items-center gap-3">
                <span>Samedi - Jeudi</span>
                <Clock className="w-4 h-4 text-stone-400" />
              </li>
              <li className="font-semibold text-lg">09:00 - 19:00</li>
              <li className="mt-4 text-stone-400 text-sm">Fermé le Vendredi</li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="border-t border-stone-200 pt-8 text-center text-stone-400 text-sm">
          <p>&copy; 2025 {SITE_TITLE} {SITE_SUBTITLE}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

// --- HOME VIEW ---
function HomeView({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Intérieur spa luxueux ANAROS"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white pt-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p 
            variants={fadeInUp}
            className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-white/80"
          >
            Institut de Beauté & Bien-être
          </motion.p>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6"
          >
            Révélez votre éclat
          </motion.h1>
          
          <motion.div 
            variants={fadeInUp}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mb-6"
          ></motion.div>
          
          <motion.p 
            variants={fadeInUp}
            className="max-w-2xl text-lg md:text-xl font-light text-white/90 mb-10 leading-relaxed"
          >
            Plus qu'un institut, Anaros est une expérience sensorielle. 
            Coiffure, Spa, Esthétique : l'excellence au service de votre beauté.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Button
              onClick={() => onNavigate('services')}
              variant="outline"
              className="border-white/50 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-stone-900 px-8 py-6 uppercase tracking-widest text-sm transition-all duration-300"
              data-testid="button-discover-services"
            >
              Découvrir nos univers
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white/60 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <motion.div 
          className="max-w-4xl mx-auto px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Sparkles className="w-8 h-8 text-amber-600 mx-auto mb-6" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif text-stone-800 mb-8">
            L'Expérience Anaros
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-stone-600 leading-loose text-lg font-light">
            Bienvenue dans un sanctuaire dédié à la féminité. Chez Anaros, nous croyons que la beauté est un art qui se cultive. 
            Notre équipe de spécialistes passionnées vous accueille dans un cadre raffiné, où chaque détail a été pensé pour votre apaisement.
            Des rituels ancestraux du hammam aux techniques modernes de l'Hydrafacial, nous allions tradition et innovation.
          </motion.p>
        </motion.div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Notre Promesse</span>
            <h3 className="text-4xl font-serif text-stone-800">Nos Engagements Qualité</h3>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {commitments.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="flex flex-col items-center text-center p-8 h-full border-none shadow-lg bg-white">
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-amber-600" />
                    </div>
                    <h4 className="text-xl font-serif text-stone-800 mb-3">{item.title}</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}

// --- SERVICES VIEW ---
function ServicesDetailView({ service, onBack }: { 
  service: typeof services[0]; 
  onBack: () => void;
}) {
  const Icon = service.icon;
  
  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.button 
        variants={fadeInUp}
        onClick={onBack} 
        className="flex items-center gap-2 text-stone-600 hover:text-amber-600 transition-colors mb-8"
        data-testid="button-back-services"
      >
        <ChevronRight className="w-4 h-4 transform rotate-180" /> 
        Retour au menu des services
      </motion.button>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div variants={fadeInUp}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-amber-600">{service.title}</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6">{service.title} Expertise</h3>
          <p className="text-stone-600 text-lg leading-loose mb-8">{service.content}</p>

          <h4 className="text-xl font-serif text-stone-800 mb-4">Prestations Clés</h4>
          <ul className="space-y-3">
            {service.details.map((detail, idx) => (
              <motion.li 
                key={idx} 
                className="text-stone-600 flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
                {detail}
              </motion.li>
            ))}
          </ul>
          
          <Button 
            className="mt-8 bg-amber-600 hover:bg-amber-700 text-white px-8"
            data-testid="button-book-service"
          >
            Prendre Rendez-vous
          </Button>
        </motion.div>
        
        <motion.div 
          variants={scaleIn}
          className="rounded-lg overflow-hidden shadow-2xl"
        >
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-full object-cover min-h-[400px]"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ServicesView() {
  const [currentService, setCurrentService] = useState<string | null>(null);

  if (currentService) {
    const serviceData = services.find(s => s.id === currentService);
    if (serviceData) {
      return <ServicesDetailView service={serviceData} onBack={() => setCurrentService(null)} />;
    }
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Notre Savoir-Faire</span>
          <h3 className="text-4xl font-serif text-stone-800">Explorez nos Univers</h3>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={scaleIn}>
                <Card 
                  className="group cursor-pointer flex flex-col items-center text-center p-6 border-2 border-stone-200 hover:border-amber-600 hover:bg-amber-600 transition-all duration-300 h-full overflow-visible"
                  onClick={() => setCurrentService(service.id)}
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="p-4 bg-amber-50 rounded-full mb-4 group-hover:bg-white transition-colors">
                    <Icon className="w-6 h-6 text-amber-600 group-hover:text-amber-600" />
                  </div>
                  <h4 className="text-xl font-serif text-stone-800 mb-3 group-hover:text-white transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-sm text-stone-600 group-hover:text-white/80 mb-4 line-clamp-3 transition-colors">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1 text-amber-600 group-hover:text-white font-medium text-sm uppercase mt-auto transition-colors">
                    Découvrir <ChevronRight className="w-3 h-3" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

// --- GALLERY VIEW ---
function GalleryView() {
  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Beauté en Images</span>
          <h3 className="text-4xl font-serif text-stone-800">Galerie d'Inspiration</h3>
          <p className="mt-4 text-stone-600 font-light max-w-2xl mx-auto">
            Découvrez nos réalisations et l'atmosphère apaisante de notre institut en images.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {galleryImages.map((src, index) => (
            <motion.div 
              key={index} 
              variants={scaleIn}
              className="aspect-square overflow-hidden rounded-lg shadow-lg group cursor-pointer"
              data-testid={`gallery-image-${index}`}
            >
              <img 
                src={src} 
                alt={`Institut Anaros - Image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <a 
            href="https://www.instagram.com/anaros_beautylounge" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-amber-600 hover:text-amber-700 transition-colors font-medium"
            data-testid="link-instagram"
          >
            Suivez-nous sur Instagram <Instagram className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// --- ABOUT VIEW ---
function AboutView() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Notre Histoire</span>
          <h3 className="text-4xl font-serif text-stone-800">À Propos d'Anaros</h3>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1557685601-2a62831f2284?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="Accueil Institut Anaros"
              className="w-full h-full object-cover min-h-[400px]"
            />
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h4 variants={fadeInUp} className="text-3xl font-serif text-stone-800 mb-6">
              Un Rêve de Beauté et de Sérénité
            </motion.h4>
            <motion.p variants={fadeInUp} className="text-stone-600 text-lg leading-loose mb-6">
              Fondé en 2022, Anaros est né de la vision d'offrir un lieu unique où l'excellence du service rencontre le luxe discret. Notre mission est simple : fournir des prestations de haute qualité, dans un environnement où le bien-être est la priorité absolue.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-stone-600 leading-relaxed mb-8">
              Nous sommes fiers d'être devenus une référence en matière de beauté et de soins en Algérie.
            </motion.p>
            
            <motion.h4 variants={fadeInUp} className="text-2xl font-serif text-stone-800 mb-4">
              Notre Équipe, Notre Force
            </motion.h4>
            <motion.p variants={fadeInUp} className="text-stone-600 mb-8">
              Notre équipe est composée de professionnelles passionnées, chacune experte dans son domaine. Nous investissons constamment dans la formation et les technologies pour vous garantir les meilleurs résultats.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={staggerContainer}
            >
              {team.map((member, index) => (
                <motion.div 
                  key={index}
                  variants={scaleIn}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
                >
                  <Avatar className="w-12 h-12 border-2 border-amber-600/30">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h5 className="text-sm font-medium text-stone-800">{member.name}</h5>
                    <p className="text-xs text-amber-600">{member.role.split(' ')[0]}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- NEWS VIEW ---
function NewsView() {
  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 pt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Nouveautés</span>
          <h3 className="text-4xl font-serif text-stone-800">Actualités & Événements</h3>
          <p className="mt-4 text-stone-600 font-light max-w-2xl mx-auto">
            Restez informés de nos nouveaux soins, technologies et événements exclusifs.
          </p>
        </motion.div>

        <motion.div 
          className="space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {newsArticles.map((article) => (
            <motion.div key={article.id} variants={fadeInUp}>
              <Card className="p-0 overflow-hidden border-none shadow-lg">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden flex-shrink-0">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover min-h-[200px]"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
                      {article.category} | {article.date}
                    </span>
                    <h4 className="text-2xl font-serif text-stone-800 mt-2 mb-3">{article.title}</h4>
                    <p className="text-stone-600 mb-4">{article.excerpt}</p>
                    <button 
                      className="flex items-center gap-1 text-sm text-stone-800 hover:text-amber-600 font-medium transition-colors"
                      data-testid={`link-news-${article.id}`}
                    >
                      Lire la suite <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- CONTACT VIEW ---
function ContactView() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: '',
      message: '',
    }
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // Normalize empty optional fields to undefined for backend compatibility
      const normalizedData = {
        ...data,
        phone: data.phone?.trim() || undefined,
        service: data.service?.trim() || undefined,
      };
      const response = await apiRequest('POST', '/api/contact', normalizedData);
      return response;
    },
    onSuccess: () => {
      setIsSubmitted(true);
      reset();
      toast({
        title: "Message envoyé",
        description: "Nous vous contacterons dans les plus brefs délais.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  if (isSubmitted) {
    return (
      <section className="py-24 bg-white min-h-[60vh] flex items-center">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-4xl font-serif text-stone-800 mb-4">Merci pour votre message</h3>
            <p className="text-stone-600 mb-8 text-lg">
              Notre équipe vous contactera dans les plus brefs délais.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
              data-testid="button-send-another"
            >
              Envoyer un autre message
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12 pt-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <span className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-2 block">Prenez Rendez-vous</span>
          <h3 className="text-4xl font-serif text-stone-800">Contactez-nous</h3>
          <p className="mt-4 text-stone-600 font-light max-w-2xl mx-auto">
            Remplissez le formulaire ci-dessous et nous vous recontacterons dans les plus brefs délais.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-8 h-full bg-stone-50 border-none">
              <h4 className="text-2xl font-serif text-stone-800 mb-6">Informations</h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 mb-1">Adresse</h5>
                    <p className="text-stone-600">123 Boulevard des Martyrs<br/>Alger, Algérie</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 mb-1">Téléphone</h5>
                    <p className="text-stone-600">+213 550 00 00 00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 mb-1">Email</h5>
                    <p className="text-stone-600">contact@anaros.dz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-stone-800 mb-1">Horaires</h5>
                    <p className="text-stone-600">Samedi - Jeudi: 09:00 - 19:00<br/>Fermé le Vendredi</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200">
                <h5 className="font-medium text-stone-800 mb-4">Suivez-nous</h5>
                <a 
                  href="https://www.instagram.com/anaros_beautylounge" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
                  data-testid="link-instagram-contact"
                >
                  <Instagram className="w-5 h-5" />
                  @anaros_beautylounge
                </a>
              </div>

              {/* Google Maps */}
              <div className="mt-8 pt-6 border-t border-stone-200">
                <h5 className="font-medium text-stone-800 mb-4">Nous Trouver</h5>
                <div className="rounded-lg overflow-hidden shadow-md">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d799.1762157391818!2d2.9949676999999997!3d36.7536547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb1bb86fbd45d%3A0x5e401253e70e89f5!2sANAROS%20Institut!5e0!3m2!1sfr!2sfr!4v1764664761790!5m2!1sfr!2sfr" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localisation ANAROS Institut sur Google Maps"
                    data-testid="map-google-embed"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-8 border-none shadow-lg">
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
                aria-label="Formulaire de contact"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-stone-700">Nom complet *</Label>
                    <Input
                      id="name"
                      placeholder="Votre nom"
                      aria-label="Votre nom complet"
                      aria-required="true"
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                      data-testid="input-name"
                    />
                    {errors.name && (
                      <p id="name-error" className="text-xs text-red-500" role="alert">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-stone-700">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      aria-label="Votre adresse email"
                      aria-required="true"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      {...register('email')}
                      className={errors.email ? 'border-red-500' : ''}
                      data-testid="input-email"
                    />
                    {errors.email && (
                      <p id="email-error" className="text-xs text-red-500" role="alert">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-stone-700">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+213 5XX XX XX XX"
                      aria-label="Votre numéro de téléphone (optionnel)"
                      {...register('phone')}
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-stone-700">Service souhaité</Label>
                    <Select onValueChange={(value) => setValue('service', value)}>
                      <SelectTrigger aria-label="Sélectionner un service" data-testid="select-service">
                        <SelectValue placeholder="Choisir un service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coiffure">Haute Coiffure</SelectItem>
                        <SelectItem value="hammam">Hammam & Spa</SelectItem>
                        <SelectItem value="onglerie">Onglerie d'Art</SelectItem>
                        <SelectItem value="soins">Soins & Bien-être</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-stone-700">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Décrivez votre demande..."
                    rows={5}
                    aria-label="Votre message"
                    aria-required="true"
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    {...register('message')}
                    className={`resize-none ${errors.message ? 'border-red-500' : ''}`}
                    data-testid="input-message"
                  />
                  {errors.message && (
                    <p id="message-error" className="text-xs text-red-500" role="alert">{errors.message.message}</p>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6"
                  disabled={contactMutation.isPending}
                  aria-label={contactMutation.isPending ? "Envoi du message en cours" : "Envoyer le message"}
                  data-testid="button-submit-contact"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- TESTIMONIALS SECTION ---
function TestimonialsSection() {
  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <motion.div 
        className="max-w-4xl mx-auto px-4 text-center relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="flex justify-center mb-6 gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
          ))}
        </motion.div>
        
        <motion.blockquote variants={fadeInUp} className="text-2xl md:text-3xl font-serif italic leading-relaxed mb-8">
          "Un moment hors du temps. L'équipe est d'un professionnalisme rare et le cadre est tout simplement somptueux. Je recommande le soin Hydrafacial les yeux fermés."
        </motion.blockquote>
        
        <motion.cite variants={fadeInUp} className="not-italic text-stone-400 uppercase tracking-widest text-sm">
          - Une cliente fidèle
        </motion.cite>
      </motion.div>
    </section>
  );
}

// --- SCROLL TO TOP BUTTON ---
function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-amber-700 transition-colors z-40"
          data-testid="button-scroll-top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// --- MAIN APP COMPONENT ---
export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = useCallback((pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} />;
      case 'services':
        return <ServicesView />;
      case 'gallery':
        return <GalleryView />;
      case 'about':
        return <AboutView />;
      case 'news':
        return <NewsView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="font-sans text-stone-800 bg-stone-50 min-h-screen">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isScrolled={isScrolled} 
      />
      
      <main className={currentPage !== 'home' ? 'pt-20' : ''}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <TestimonialsSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
