// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// --- 1. SMOOTH SCROLL (Lenis) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});
lenis.on('scroll', () => {
    ScrollTrigger.update();
    revealMissedScrollAnimations();
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// --- 2. MAGNETIC BUTTONS ---
const magneticButtons = document.querySelectorAll('[data-magnetic]');

magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: "power2.out"
        });
        
        if(btn.children.length > 0) {
             Array.from(btn.children).forEach(child => {
                 gsap.to(child, {
                     x: x * 0.15,
                     y: y * 0.15,
                     duration: 0.3,
                     ease: "power2.out"
                 });
             });
        }
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.3)"
        });
        
        if(btn.children.length > 0) {
             Array.from(btn.children).forEach(child => {
                 gsap.to(child, {
                     x: 0,
                     y: 0,
                     duration: 0.8,
                     ease: "elastic.out(1, 0.3)"
                 });
             });
        }
    });
});

// --- 2.1 SCROLL-DRIVEN CAROUSELS (Wheel Desktop, Single-Item Mobile Gallery) ---
const carouselWrappers = document.querySelectorAll('.group\\/carousel');

carouselWrappers.forEach((wrapper) => {
    const track = wrapper.querySelector('.min-w-max');
    const cards = track ? Array.from(track.children) : [];
    if (!track || !cards.length) return;

    let currentX = 0;
    let targetX = 0;
    let maxScroll = 0;
    let currentMobileIndex = 0;
    let mobileControls = null;
    let mobilePrevButton = null;
    let mobileNextButton = null;
    let mobileCounter = null;
    let touchStartX = 0;
    let touchStartY = 0;

    const isMobileGallery = () => window.innerWidth < 768;

    const updateMax = () => {
        maxScroll = Math.max(0, wrapper.scrollWidth - wrapper.clientWidth);
        targetX = Math.min(maxScroll, Math.max(0, targetX));
    };

    const updateMobileCounter = () => {
        if (!mobileCounter) return;
        mobileCounter.textContent = `${currentMobileIndex + 1} / ${cards.length}`;
        if (mobilePrevButton) mobilePrevButton.disabled = currentMobileIndex === 0;
        if (mobileNextButton) mobileNextButton.disabled = currentMobileIndex === cards.length - 1;
    };

    const applyMobileSingleItem = () => {
        const mobile = isMobileGallery();
        wrapper.classList.toggle('is-mobile-gallery', mobile);

        if (!mobile) {
            cards.forEach((card) => {
                card.classList.remove('is-active');
                card.setAttribute('aria-hidden', 'false');
            });
            return;
        }

        currentMobileIndex = Math.max(0, Math.min(cards.length - 1, currentMobileIndex));
        cards.forEach((card, index) => {
            const isActive = index === currentMobileIndex;
            card.classList.toggle('is-active', isActive);
            card.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        wrapper.scrollLeft = 0;
        currentX = 0;
        targetX = 0;
        updateMobileCounter();
    };

    const goToMobileIndex = (index) => {
        currentMobileIndex = Math.max(0, Math.min(cards.length - 1, index));
        applyMobileSingleItem();
    };

    const resetCarouselPosition = () => {
        currentX = 0;
        targetX = 0;
        wrapper.scrollLeft = 0;
    };

    wrapper.resetCarouselPosition = resetCarouselPosition;

    const buildMobileGalleryNav = () => {
        if (!isMobileGallery()) {
            if (mobileControls) mobileControls.remove();
            mobileControls = null;
            mobilePrevButton = null;
            mobileNextButton = null;
            mobileCounter = null;
            return;
        }

        if (mobileControls) {
            updateMobileCounter();
            return;
        }

        mobileControls = document.createElement('div');
        mobileControls.className = 'carousel-mobile-controls';

        mobilePrevButton = document.createElement('button');
        mobilePrevButton.className = 'carousel-mobile-nav';
        mobilePrevButton.type = 'button';
        mobilePrevButton.setAttribute('aria-label', 'Previous image');
        mobilePrevButton.innerHTML = '<span class="material-symbols-outlined">arrow_back</span>';
        mobilePrevButton.addEventListener('click', () => goToMobileIndex(currentMobileIndex - 1));

        mobileCounter = document.createElement('span');
        mobileCounter.className = 'carousel-mobile-counter';

        mobileNextButton = document.createElement('button');
        mobileNextButton.className = 'carousel-mobile-nav';
        mobileNextButton.type = 'button';
        mobileNextButton.setAttribute('aria-label', 'Next image');
        mobileNextButton.innerHTML = '<span class="material-symbols-outlined">arrow_forward</span>';
        mobileNextButton.addEventListener('click', () => goToMobileIndex(currentMobileIndex + 1));

        mobileControls.appendChild(mobilePrevButton);
        mobileControls.appendChild(mobileCounter);
        mobileControls.appendChild(mobileNextButton);
        wrapper.insertAdjacentElement('afterend', mobileControls);
        updateMobileCounter();
    };

    const handleResponsiveGallery = () => {
        updateMax();
        buildMobileGalleryNav();
        applyMobileSingleItem();
    };

    handleResponsiveGallery();
    window.addEventListener('resize', handleResponsiveGallery);
    window.addEventListener('load', handleResponsiveGallery);

    wrapper.addEventListener('wheel', (e) => {
        if (isMobileGallery()) return;
        if (maxScroll <= 0) return;
        e.preventDefault();
        targetX += e.deltaY + e.deltaX;
        if (targetX < 0) targetX = 0;
        if (targetX > maxScroll) targetX = maxScroll;
    }, { passive: false });

    wrapper.addEventListener('touchstart', (e) => {
        if (!isMobileGallery() || !e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isMobileGallery() || !e.touches || e.touches.length === 0) return;
        const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
        const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
        if (deltaX > deltaY) e.preventDefault();
    }, { passive: false });

    function animate() {
        if (!isMobileGallery()) {
            currentX += (targetX - currentX) * 0.1;
            wrapper.scrollLeft = currentX;
        } else if (wrapper.scrollLeft !== 0) {
            wrapper.scrollLeft = 0;
        }
        requestAnimationFrame(animate);
    }

    animate();
});

// --- SCROLL RESET ON RELOAD ---
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

function resetScrollToTop() {
    window.scrollTo(0, 0);
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true });
    }
}

resetScrollToTop();
document.addEventListener('DOMContentLoaded', resetScrollToTop);
window.addEventListener('pageshow', resetScrollToTop);
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// --- 3. PROJECT ACCORDION ---
const projectAccordions = document.querySelectorAll('.project-accordion');

projectAccordions.forEach((accordion) => {
    const header = accordion.querySelector('.project-header');
    const content = accordion.querySelector('.project-content');
    
    header.addEventListener('click', () => {
        const isActive = accordion.classList.contains('active');
        
        projectAccordions.forEach(other => {
            if (other !== accordion) {
                other.classList.remove('active');
                const otherContent = other.querySelector('.project-content');
                const otherIcon = other.querySelector('.material-symbols-outlined');
                gsap.to(otherContent, { height: 0, opacity: 0, duration: 0.5, ease: "power2.inOut" });
                if(otherIcon) gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
            }
        });
        
        if (!isActive) {
            accordion.classList.add('active');
            gsap.to(content, { height: "auto", opacity: 1, duration: 0.6, ease: "power2.out" });
            const icon = header.querySelector('.material-symbols-outlined');
            if(icon) gsap.to(icon, { rotation: 90, duration: 0.3 });

            const accordionCarousels = content.querySelectorAll('.group\\/carousel');
            accordionCarousels.forEach((carousel) => {
                if (typeof carousel.resetCarouselPosition === 'function') {
                    carousel.resetCarouselPosition();
                } else {
                    carousel.scrollLeft = 0;
                }
            });
        } else {
            accordion.classList.remove('active');
            gsap.to(content, { height: 0, opacity: 0, duration: 0.5, ease: "power2.inOut" });
            const icon = header.querySelector('.material-symbols-outlined');
            if(icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
        }
    });
});

// --- 4. MENU OVERLAY ---
const menuToggle = document.getElementById('menu-toggle');
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const menuText = document.getElementById('menu-text');

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        menuOverlay.classList.remove('translate-y-full');
        menuOverlay.classList.add('translate-y-0');
        if(menuText) menuText.textContent = "CLOSE";
        gsap.fromTo(navLinks, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" });
        lenis.stop();
    } else {
        menuOverlay.classList.remove('translate-y-0');
        menuOverlay.classList.add('translate-y-full');
        if(menuText) applyTranslations();
        lenis.start();
    }
}

if(menuToggle) menuToggle.addEventListener('click', toggleMenu);

// --- 6. HERO PARALLAX ---
if(document.querySelector(".hero-img-wrapper")) {
    gsap.to(".hero-img-wrapper img", {
        yPercent: 15,
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
}

if(document.querySelector("#hero h1")) {
    gsap.to("#hero h1", {
        yPercent: 50,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
}

// --- 7. LANGUAGE TOGGLE & TRANSLATIONS ---
const translations = {
    en: {
        'nav.menu': 'MENU', 'nav.work': 'WORK', 'nav.about': 'ABOUT', 'nav.contact': 'CONTACT', 'nav.close': 'CLOSE',
        'hero.title1': 'SIMÓN', 'hero.title2': 'OCAMPO', 'hero.role1': 'Systems Analyst', 'hero.role2': 'Systems Engineering Student',
        'hero.role3': 'Full Stack Developer', 'hero.role': 'Specializing in scalable web architectures and accessible software solutions. Independent Researcher in Philosophy & Theology.',
        'hero.available': 'Available for work', 'work.title': 'Selected Works', 'work.archive': 'View All', 'work.collapse': 'View Less',
        'mobile.about': 'About Me',
        'work.project1.title': 'Software for the Visually Impaired', 'work.project1.meta': 'Software Development / 2023-Present',
        'work.project1.desc': 'Development of an adaptability module for data acquisition software, aimed at visually impaired users.',
        'work.project2.title': 'Web App for Kinesiology Center', 'work.project2.meta': 'Web App / 2024-2025',
        'work.project2.desc': 'Development of a web app using Django + React for a kinesiology center, allowing management of medical records.',
        'work.project3.title': 'Atlas Automotriz Platform', 'work.project3.meta': 'Product Design / 2024-2025',
        'work.project3.desc': 'Automotive marketplace platform concept with catalog, premium vehicle showcase, and sales workflow screens.',
        'hero.downloadCV': 'Download CV',
        'work.viewLive': 'View Live',
        'work.viewOnGithub': 'View on GitHub',
        'work.project1.title': 'Software for the Visually Impaired', 'work.project1.meta': 'Software Development / 2023-Present',
        'work.project1.desc': 'Development of an adaptability module for data acquisition software, aimed at visually impaired users.',
        'work.project2.title': 'Web App for Kinesiology Center', 'work.project2.meta': 'Web App / 2024-2025',
        'work.project2.desc': 'Development of a web app using Django + React for a kinesiology center, allowing management of medical records.',
        'work.project3.title': 'Atlas Automotriz Platform', 'work.project3.meta': 'Product Design / 2024-2025',
        'work.project3.desc': 'Automotive marketplace platform concept with catalog, premium vehicle showcase, and sales workflow screens.',
        'work.project4.title': 'Architecture Studio Landing', 'work.project4.meta': 'Web Design / 2024',
        'work.project4.desc': 'A monumental, brutalist landing page for an architecture studio featuring high-contrast typography, complex GSAP scroll animations, and ultra-smooth Lenis scrolling.',
        'work.project5.title': 'STORM — Atmospheric Monitor', 'work.project5.meta': 'Web Experience / 2024',
        'work.project5.desc': 'A cinematic web experience for monitoring the Catatumbo Lightning phenomenon. Cyber-noir aesthetic with React, dynamic video backgrounds, real-time telemetry panels, and GSAP choreography.',
        'work.project6.title': 'SCENT — Botanical Lab Landing', 'work.project6.meta': 'Web Design / 2024',
        'work.project6.desc': 'An immersive landing for an olfactory memory laboratory preserving extinct species\' fragrances. Premium botanical aesthetic with parallax backgrounds, GSAP cinematic entries, and dynamic ScrollSpy navigation.',
        'about.label': 'Arsenal', 'about.title': 'Technical and academic competencies applied to software and research.',
        'stack.frontend': 'Technical Skills', 'stack.backend': 'Languages', 'stack.analysis': 'Academic Skills', 'stack.design': 'Tools',
        'contact.form.name': 'Name', 'contact.form.email': 'Email', 'contact.form.message': 'Message',
        'contact.form.namePlaceholder': 'John Doe *', 'contact.form.emailPlaceholder': 'john@doe.com *', 'contact.form.messagePlaceholder': 'Tell me about your project...',
        'contact.error.name': 'Please enter your name', 'contact.error.email': 'Please enter a valid email', 'contact.error.message': 'Please write your message',
        'contact.success': '— Message sent successfully.', 'contact.error.send': '— Failed to send. Please try again.',
        'contact.sending': 'Sending...',
        'contact.details': 'Contact Details',
        'contact.title': 'Let\'s work<br>together', 'contact.cta': 'Get in touch', 'contact.submit': 'Send Message',
        'footer.copyright': '© 2026 Simón Ocampo'
    },
    es: {
        'nav.menu': 'MENÚ', 'nav.work': 'PROYECTOS', 'nav.about': 'PERFIL', 'nav.contact': 'CONTACTO', 'nav.close': 'CERRAR',
        'hero.title1': 'SIMÓN', 'hero.title2': 'OCAMPO', 'hero.role1': 'Analista de Sistemas', 'hero.role2': 'Estudiante de Ingeniería de Sistemas',
        'hero.role3': 'Desarrollador Full Stack', 'hero.role': 'Especializado en arquitecturas web escalables y soluciones de software accesible. Investigador independiente en Filosofía y Teología.',
        'hero.available': 'Disponible para trabajar', 'work.title': 'Trabajos Seleccionados', 'work.archive': 'Ver Todos', 'work.collapse': 'Ver Menos',
        'mobile.about': 'Sobre Mí',
        'work.project1.title': 'Software para No-videntes', 'work.project1.meta': 'Desarrollo de Software / 2023-Presente',
        'work.project1.desc': 'Desarrollo de un módulo de adaptabilidad para un software adquisidor de datos, orientado a usuarios no-videntes.',
        'work.project2.title': 'Web App para Centro de Kinesiología', 'work.project2.meta': 'Aplicación Web / 2024-2025',
        'work.project2.desc': 'Desarrollo de web app utilizando Django + React para un centro de kinesiología, permitiendo administrar historias clínicas.',
        'work.project3.title': 'Plataforma Atlas Automotriz', 'work.project3.meta': 'Diseño de Producto / 2024-2025',
        'work.project3.desc': 'Concepto de plataforma automotriz con catálogo, exhibición de vehículos premium y pantallas de flujo comercial.',
        'hero.downloadCV': 'Descargar CV',
        'work.viewLive': 'Ver en Vivo',
        'work.viewOnGithub': 'Ver en GitHub',
        'work.project1.title': 'Software para No-videntes', 'work.project1.meta': 'Desarrollo de Software / 2023-Presente',
        'work.project1.desc': 'Desarrollo de un módulo de adaptabilidad para un software adquisidor de datos, orientado a usuarios no-videntes.',
        'work.project2.title': 'Web App para Centro de Kinesiología', 'work.project2.meta': 'Aplicación Web / 2024-2025',
        'work.project2.desc': 'Desarrollo de web app utilizando Django + React para un centro de kinesiología, permitiendo administrar historias clínicas.',
        'work.project3.title': 'Plataforma Atlas Automotriz', 'work.project3.meta': 'Diseño de Producto / 2024-2025',
        'work.project3.desc': 'Concepto de plataforma automotriz con catálogo, exhibición de vehículos premium y pantallas de flujo comercial.',
        'work.project4.title': 'Landing de Estudio de Arquitectura', 'work.project4.meta': 'Diseño Web / 2024',
        'work.project4.desc': 'Una landing brutalista monumental para un estudio de arquitectura con tipografía de alto contraste, animaciones GSAP complejas y scroll suave.',
        'work.project5.title': 'STORM — Monitor Atmosférico', 'work.project5.meta': 'Experiencia Web / 2024',
        'work.project5.desc': 'Una experiencia web cinematográfica dedicada al monitoreo del Relámpago del Catatumbo. Estética cyber-noir con React, fondos de video dinámicos y paneles de telemetría.',
        'work.project6.title': 'SCENT — Landing Laboratorio Botánico', 'work.project6.meta': 'Diseño Web / 2024',
        'work.project6.desc': 'Una landing inmersiva para un laboratorio de memoria olfativa que preserva fragancias de especies extintas. Estética botánica premium con fondos parallax y entradas cinematográficas GSAP.',
        'about.label': 'Arsenal', 'about.title': 'Competencias técnicas y académicas aplicadas al desarrollo de software y la investigación.',
        'stack.frontend': 'Habilidades Técnicas', 'stack.backend': 'Idiomas', 'stack.analysis': 'Habilidades Académicas', 'stack.design': 'Herramientas',
        'contact.form.name': 'Nombre', 'contact.form.email': 'Email', 'contact.form.message': 'Mensaje',
        'contact.form.namePlaceholder': 'Juan García *', 'contact.form.emailPlaceholder': 'juan@ejemplo.com *', 'contact.form.messagePlaceholder': 'Cuéntame sobre tu proyecto...',
        'contact.error.name': 'Por favor ingresa tu nombre', 'contact.error.email': 'Por favor ingresa un email válido', 'contact.error.message': 'Por favor escribe tu mensaje',
        'contact.success': '— Mensaje enviado con éxito.', 'contact.error.send': '— Error al enviar. Por favor intenta de nuevo.',
        'contact.sending': 'Enviando...',
        'contact.details': 'Detalles de Contacto',
        'contact.title': 'Trabajemos<br>juntos', 'contact.cta': 'Hablemos', 'contact.submit': 'Enviar Mensaje',
        'footer.copyright': '© 2026 Simón Ocampo'
    }
};

let currentLang = 'en';
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations[currentLang][key];
        if (!value) return;
        if (el.id === 'menu-text' && isMenuOpen) { el.textContent = translations[currentLang]['nav.close']; return; }
        if (value.includes('<br>')) { el.innerHTML = value; } else { el.textContent = value; }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = translations[currentLang][key];
        if (value) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('.project-cover').forEach(img => {
        const enSrc = img.getAttribute('data-cover-en');
        const esSrc = img.getAttribute('data-cover-es');
        img.src = currentLang === 'es' && esSrc ? esSrc : enSrc;
    });
}

const langToggle = document.getElementById('lang-toggle-desktop');
const langToggleMobile = document.getElementById('lang-toggle-mobile');

function syncLangButtons() {
    const label = currentLang === 'en' ? 'EN' : 'ES';
    if (langToggle) langToggle.textContent = label;
    if (langToggleMobile) langToggleMobile.textContent = label;
}

function handleLangToggle() {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    syncLangButtons();
    applyTranslations();
    updateCVLinks();
}

if (langToggle) langToggle.addEventListener('click', handleLangToggle);
if (langToggleMobile) langToggleMobile.addEventListener('click', handleLangToggle);

function updateCVLinks() {
    const cvFile = currentLang === 'es' ? './assets/cv/cv-es.pdf' : './assets/cv/cv-en.pdf';
    const btn = document.getElementById('cv-download-btn');
    if (btn) btn.setAttribute('href', cvFile);
}

// --- 12. SCROLL TO TOP ---
const logoLink = document.querySelector('a[href="#"]');
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.5 });
    });
}

// --- 9. PAGE LOAD & ANIMATIONS ---
const revealTargetSelector = [
    'section:not(#hero) h2',
    'section:not(#hero) h3',
    '.project-accordion',
    'section:not(#hero) .grid > div',
    '#contact form > div',
    '#contact .lg\\:col-span-4 > div',
    'footer'
].join(', ');

const revealTargets = gsap.utils.toArray(revealTargetSelector);

// Set initial state immediately before any animations
gsap.set(revealTargets, { autoAlpha: 0, y: 30 });
revealTargets.forEach((el) => { el.dataset.revealed = 'false'; });

function revealMissedScrollAnimations() {
    const revealThreshold = window.innerHeight * 1.02;

    revealTargets.forEach((el) => {
        if (el.dataset.revealed === 'true') return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= revealThreshold) {
            el.dataset.revealed = 'true';
            gsap.to(el, {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
                overwrite: "auto"
            });
        }
    });
}

function initScrollRevealAnimations() {
    // Animate section headings
    gsap.utils.toArray('section:not(#hero) h2, section:not(#hero) h3').forEach((heading) => {
        gsap.to(heading, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            onStart: () => { heading.dataset.revealed = 'true'; },
            scrollTrigger: {
                trigger: heading,
                start: "top bottom",
                once: true,
                fastScrollEnd: true
            }
        });
    });
    
    // Animate project cards — use batch to group simultaneous entries and prevent competing animations
    const projectCards = gsap.utils.toArray('.project-accordion');
    ScrollTrigger.batch(projectCards, {
        onEnter: (batch) => {
            batch.forEach(el => { el.dataset.revealed = 'true'; });
            gsap.to(batch, {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                stagger: 0.07,
                ease: "power3.out",
                overwrite: true
            });
        },
        start: "top 95%",
        once: true
    });
    
    // Animate grid items
    document.querySelectorAll('section:not(#hero) .grid').forEach((grid) => {
        const items = grid.querySelectorAll(':scope > div');
        items.forEach((item, index) => {
            gsap.to(item, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.08,
                ease: "power3.out",
                onStart: () => { item.dataset.revealed = 'true'; },
                scrollTrigger: {
                    trigger: grid,
                    start: "top bottom",
                    once: true,
                    fastScrollEnd: true
                }
            });
        });
    });
    
    // Animate contact form fields
    const formFields = document.querySelectorAll('#contact form > div');
    formFields.forEach((field, index) => {
        gsap.to(field, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power3.out",
            onStart: () => { field.dataset.revealed = 'true'; },
            scrollTrigger: {
                trigger: '#contact form',
                start: "top bottom",
                once: true,
                fastScrollEnd: true
            }
        });
    });
    
    // Animate contact sidebar
    const contactSidebar = document.querySelector('#contact .lg\\:col-span-4');
    if (contactSidebar) {
        const sidebarItems = contactSidebar.querySelectorAll(':scope > div');
        sidebarItems.forEach((item, index) => {
            gsap.to(item, {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power3.out",
                onStart: () => { item.dataset.revealed = 'true'; },
                scrollTrigger: {
                    trigger: contactSidebar,
                    start: "top bottom",
                    once: true,
                    fastScrollEnd: true
                }
            });
        });
    }
    
    // Animate footer
    const footer = document.querySelector('footer');
    if (footer) {
        gsap.to(footer, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            onStart: () => { footer.dataset.revealed = 'true'; },
            scrollTrigger: {
                trigger: footer,
                start: "top bottom",
                once: true,
                fastScrollEnd: true
            }
        });
    }

    ScrollTrigger.refresh();
    revealMissedScrollAnimations();
}

window.addEventListener('load', () => {
    initScrollRevealAnimations();
    revealMissedScrollAnimations();

    const tl = gsap.timeline();
    tl.to('.preloader-text', { y: '0%', duration: 0.8, stagger: 0.1, ease: "power3.out" })
      .to('.preloader-line', { x: '0%', duration: 0.8, ease: "power2.inOut" }, "-=0.4")
      .to('#preloader', { yPercent: -100, duration: 1.0, ease: "expo.inOut" })
      .from("#hero h1", { y: 100, opacity: 0, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .from("#hero .flex.flex-col.gap-6", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.9")
      .from("header", { y: -50, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.8");
});

// --- 13. MOUSE FOLLOWER ---
const follower = document.createElement('div');
follower.className = 'custom-cursor-follower';
document.body.appendChild(follower);

let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    follower.style.left = `${cursorX}px`;
    follower.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
}
animateCursor();

const interactiveElements = document.querySelectorAll('a, button, [data-magnetic], .project-header, .group');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('is-active'));
    el.addEventListener('mouseleave', () => follower.classList.remove('is-active'));
});

// --- 14. MEDIA LIGHTBOX LOGIC ---
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxContainer = document.getElementById('lightbox-container');
const lightboxNavButtons = document.querySelectorAll('[data-lightbox-nav]');
const lightboxPrevIcon = document.querySelector('#lightbox-prev .material-symbols-outlined');
const lightboxNextIcon = document.querySelector('#lightbox-next .material-symbols-outlined');
let currentMediaItems = [];
let currentMediaIndex = -1;

function renderLightboxMedia(src, type) {
    if (!lightboxContent) return;
    lightboxContent.innerHTML = '';
    
    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'w-full h-full object-cover rounded-[1.5rem]';
        lightboxContent.appendChild(img);
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = false;
        video.loop = false;
        video.muted = false;
        video.setAttribute('controls', '');
        video.setAttribute('controlsList', 'nodownload');
        video.playsInline = true;
        video.className = 'w-full h-full object-cover rounded-[1.5rem]';
        lightboxContent.appendChild(video);
    }
}

function updateLightboxNavigationVisibility() {
    const hasMultipleItems = currentMediaItems.length > 1;
    lightboxNavButtons.forEach(button => {
        button.classList.toggle('opacity-0', !hasMultipleItems);
        button.classList.toggle('pointer-events-none', !hasMultipleItems);
    });
}

function syncLightboxNavDirection() {
    if (lightboxPrevIcon) {
        lightboxPrevIcon.textContent = 'arrow_back';
    }
    if (lightboxNextIcon) {
        lightboxNextIcon.textContent = 'arrow_forward';
    }
}

function openLightbox(cardElement) {
    if (!lightbox || !lightboxContent) return;

    const parentTrack = cardElement ? cardElement.parentElement : null;
    const siblingCards = parentTrack ? Array.from(parentTrack.children) : [];
    currentMediaItems = siblingCards.map(card => {
        const video = card.querySelector('video');
        const image = card.querySelector('img');
        if (video) return { src: video.src, type: 'video' };
        if (image) return { src: image.src, type: 'image' };
        return null;
    }).filter(Boolean);

    currentMediaIndex = siblingCards.indexOf(cardElement);
    if (currentMediaIndex < 0 || !currentMediaItems[currentMediaIndex]) return;
    renderLightboxMedia(currentMediaItems[currentMediaIndex].src, currentMediaItems[currentMediaIndex].type);
    updateLightboxNavigationVisibility();
    syncLightboxNavDirection();

    lightbox.classList.remove('hidden');
    gsap.to(lightbox, { opacity: 1, duration: 0.4, onStart: () => lenis.stop() });
    gsap.fromTo(lightboxContainer, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
}

function closeLightbox() {
    if (!lightbox) return;
    const activeVideo = lightboxContent ? lightboxContent.querySelector('video') : null;
    if (activeVideo) {
        activeVideo.pause();
        activeVideo.currentTime = 0;
    }
    gsap.to(lightbox, { opacity: 0, duration: 0.3, onComplete: () => {
        lightbox.classList.add('hidden');
        lightboxContent.innerHTML = '';
        currentMediaItems = [];
        currentMediaIndex = -1;
        lenis.start();
    }});
}

function navigateLightbox(step) {
    if (!currentMediaItems.length) return;
    currentMediaIndex = (currentMediaIndex + step + currentMediaItems.length) % currentMediaItems.length;
    const media = currentMediaItems[currentMediaIndex];
    renderLightboxMedia(media.src, media.type);
}

lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox && !lightbox.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    }
});

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;

applyTranslations();

// --- 15. CONTACT FORM — CUSTOM VALIDATION & RESEND SUBMIT ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('contact-submit');
    const submitLabel = document.getElementById('contact-submit-label');
    const successMsg = document.getElementById('contact-success');
    const errorMsg = document.getElementById('contact-error-msg');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showFieldError(fieldId, show) {
        const errorEl = contactForm.querySelector(`[data-error-for="${fieldId}"]`);
        const wrapper = errorEl ? errorEl.closest('.border-b') : null;
        if (errorEl) errorEl.classList.toggle('hidden', !show);
        if (wrapper) wrapper.classList.toggle('border-[#7c9885]/30', show);
    }

    function validateField(input) {
        if (input.id === 'email') {
            return input.value.trim() !== '' && emailRegex.test(input.value.trim());
        }
        return input.value.trim() !== '';
    }

    [nameInput, emailInput, messageInput].forEach(input => {
        if (!input) return;
        input.addEventListener('input', () => {
            if (validateField(input)) showFieldError(input.id, false);
        });
        input.addEventListener('blur', () => {
            if (!validateField(input)) showFieldError(input.id, true);
        });
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let isValid = true;
        [nameInput, emailInput, messageInput].forEach(input => {
            if (!input) return;
            if (!validateField(input)) { showFieldError(input.id, true); isValid = false; }
        });
        if (!isValid) return;

        successMsg.classList.add('hidden');
        errorMsg.classList.add('hidden');
        submitBtn.disabled = true;
        if (submitLabel) submitLabel.setAttribute('data-i18n', 'contact.sending');
        applyTranslations();

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    message: messageInput.value.trim()
                })
            });

            if (response.ok) {
                contactForm.reset();
                successMsg.classList.remove('hidden');
                gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' });
            } else {
                errorMsg.classList.remove('hidden');
                gsap.from(errorMsg, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' });
            }
        } catch (_) {
            errorMsg.classList.remove('hidden');
            gsap.from(errorMsg, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out' });
        } finally {
            submitBtn.disabled = false;
            if (submitLabel) submitLabel.setAttribute('data-i18n', 'contact.submit');
            applyTranslations();
        }
    });
}

// --- 16. VIEW ALL PROJECTS ---
const viewAllBtn = document.getElementById('view-all-btn');
const projectsExtra = document.getElementById('projects-extra');
let projectsExpanded = false;

if (viewAllBtn && projectsExtra) {
    const btnLabel = viewAllBtn.querySelector('[data-i18n]');

    viewAllBtn.addEventListener('click', () => {
        const extraCards = Array.from(projectsExtra.querySelectorAll('.project-accordion'));

        if (!projectsExpanded) {
            projectsExpanded = true;
            if (btnLabel) {
                btnLabel.setAttribute('data-i18n', 'work.collapse');
                btnLabel.textContent = translations[currentLang]['work.collapse'] || 'View Less';
            }
            projectsExtra.style.display = 'block';
            gsap.fromTo(extraCards,
                { autoAlpha: 0, y: 40 },
                {
                    autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
                    onComplete: () => {
                        extraCards.forEach(el => { el.dataset.revealed = 'true'; });
                        ScrollTrigger.refresh();
                    }
                }
            );
        } else {
            projectsExpanded = false;
            if (btnLabel) {
                btnLabel.setAttribute('data-i18n', 'work.archive');
                btnLabel.textContent = translations[currentLang]['work.archive'] || 'View All';
            }
            projectsExtra.style.overflow = 'hidden';
            gsap.timeline()
                .to(extraCards, {
                    autoAlpha: 0, y: -15, duration: 0.35,
                    stagger: { each: 0.04, from: 'end' },
                    ease: 'power2.in'
                })
                .to(projectsExtra, {
                    height: 0, duration: 0.5, ease: 'power3.inOut',
                    onComplete: () => {
                        projectsExtra.style.display = 'none';
                        projectsExtra.style.height = '';
                        projectsExtra.style.overflow = '';
                        extraCards.forEach(el => {
                            gsap.set(el, { clearProps: 'all' });
                            delete el.dataset.revealed;
                        });
                    }
                }, '-=0.05');
        }
    });
}

console.log("Portfolio Loaded");
