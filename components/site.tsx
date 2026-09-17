'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Eye,
  FileText,
  Heart,
  Menu,
  MessageCircle,
  Sprout,
  Target,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import { ScrollReveal } from './scroll-reveal';

const navItems = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Trabalho', href: '/#solucoes' },
  { label: 'Trilha', href: '/trilha-da-lideranca' },
  { label: 'RESET', href: '/reset' },
  { label: 'Palestras', href: '/palestras' },
  { label: 'ATA Inteligente', href: '/ata-inteligente' },
];

const mobileItems = [
  { label: 'Início', href: '/' },
  ...navItems.filter((item) => item.label !== 'Trabalho'),
  { label: 'Contato', href: '/contato' },
];

const HEADER_SCROLL_THRESHOLD = 52;

export function Eyebrow({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

type CtaProps = {
  href: string;
  children: ReactNode;
  ghost?: boolean;
  dark?: boolean;
  wine?: boolean;
  className?: string;
};

/** Shared accessible link-button used for both internal and checkout CTAs. */
export function Cta({
  href,
  children,
  ghost = false,
  dark = false,
  wine = false,
  className = '',
}: CtaProps) {
  const variant = ghost
    ? 'cta--ghost'
    : wine
      ? 'cta--wine'
      : dark
        ? 'cta--dark'
        : 'cta--gold';
  const classes = `cta ${variant} ${className}`.trim();
  const content = (
    <>
      <span>{children}</span>
      <ArrowRight className="cta__icon" size={16} aria-hidden="true" />
    </>
  );

  if (href.startsWith('http')) {
    return (
      <a className={classes} href={href}>
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {content}
    </Link>
  );
}

export function Hero({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`hero ${className}`}>{children}</section>;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = '',
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`section-header ${className}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{title}</h2>
      {description ? <p className="section-header__description">{description}</p> : null}
    </div>
  );
}

export type EditorialIcon =
  | 'chart'
  | 'book'
  | 'eye'
  | 'file'
  | 'heart'
  | 'message'
  | 'sprout'
  | 'target'
  | 'users'
  | 'zap';

const editorialIcons = {
  chart: BarChart3,
  book: BookOpenCheck,
  eye: Eye,
  file: FileText,
  heart: Heart,
  message: MessageCircle,
  sprout: Sprout,
  target: Target,
  users: UsersRound,
  zap: Zap,
} as const;

export function EditorialCard({
  index,
  title,
  description,
  icon,
  href,
  className = '',
}: {
  index: string;
  title: string;
  description?: string;
  icon: EditorialIcon;
  href?: string;
  className?: string;
}) {
  const Icon = editorialIcons[icon];
  const content = (
    <>
      <div className="editorial-card__top">
        <span className="editorial-card__index">{index}</span>
        <span className="editorial-card__icon" aria-hidden="true">
          <Icon size={21} strokeWidth={1.5} />
        </span>
      </div>
      <div className="editorial-card__body">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      {href ? (
        <span className="editorial-card__link">
          Conhecer <ArrowRight size={15} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link className={`editorial-card ${className}`} href={href}>
        {content}
      </Link>
    );
  }

  return <article className={`editorial-card ${className}`}>{content}</article>;
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame: number | undefined;
    const updateHeader = () => {
      const nextScrolled = window.scrollY > HEADER_SCROLL_THRESHOLD;
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };
    const onScroll = () => {
      if (frame !== undefined) return;
      frame = window.requestAnimationFrame(() => {
        frame = undefined;
        updateHeader();
      });
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
      <div className="header-inner">
        <Link className="logo" href="/" aria-label="Jamilla Salviano — página inicial">
          <strong>JAMILLA SALVIANO</strong>
          <span>LIDERANÇA &amp; EDUCAÇÃO</span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link
              className={`nav-link${pathname === item.href ? ' is-active' : ''}`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/contato">
          <span>Fale com a Jamilla</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>

        <button
          className="menu-btn"
          type="button"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Navegação mobile"
        aria-hidden={!isOpen}
        data-open={isOpen}
      >
        <div className="mobile-menu__inner">
          <p className="eyebrow">Navegação</p>
          {mobileItems.map((item, index) => (
            <Link
              href={item.href}
              key={item.label}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              style={{ '--menu-index': index } as CSSProperties}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item.label}
            </Link>
          ))}
          <Cta href="/contato" className="mobile-menu__cta">
            Fale com a Jamilla
          </Cta>
        </div>
      </nav>
    </header>
  );
}

export function FinalCta({
  eyebrow = 'Vamos conversar',
  title,
  description,
  href = '/contato',
  action = 'Falar com Jamilla',
  variant = 'wine',
  className = '',
  imageSrc,
  imageAlt,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  href?: string;
  action?: ReactNode;
  variant?: 'wine' | 'navy';
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <section
      className={`final-cta final-cta--${variant}${imageSrc ? ' final-cta--with-media' : ''} ${className}`}
    >
      {imageSrc ? (
        <div className="final-cta__media">
          <Image fill sizes="(max-width: 900px) 100vw, 50vw" src={imageSrc} alt={imageAlt ?? ''} />
        </div>
      ) : null}
      <div className="wrap final-cta__wrap">
        <ScrollReveal className="final-cta__content" variant="scale">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
          <Cta href={href} className="final-cta__button">
            {action}
          </Cta>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Link className="logo" href="/" aria-label="Jamilla Salviano — página inicial">
            <strong>JAMILLA SALVIANO</strong>
            <span>LIDERANÇA &amp; EDUCAÇÃO</span>
          </Link>
          <p>Educação, liderança e transformação de equipes.</p>
        </div>
        <div>
          <b>Institucional</b>
          <Link href="/">Início</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/contato">Contato</Link>
        </div>
        <div>
          <b>Soluções</b>
          <Link href="/trilha-da-lideranca">Trilha da Liderança</Link>
          <Link href="/reset">RESET</Link>
          <Link href="/palestras">Palestras</Link>
          <Link href="/ata-inteligente">ATA Inteligente</Link>
        </div>
        <div>
          <b>Redes</b>
          <span>Instagram</span>
          <span>LinkedIn</span>
          <span>YouTube</span>
        </div>
      </div>
      <div className="wrap copyright">© 2026 Jamilla Salviano. Todos os direitos reservados.</div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <Link aria-label="Conversar pelo WhatsApp" className="whatsapp" href="/contato">
      <MessageCircle size={21} aria-hidden="true" />
    </Link>
  );
}
