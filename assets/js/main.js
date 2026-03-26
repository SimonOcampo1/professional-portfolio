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
        
        // Inner element movement (for text/icons inside button)
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

// --- 2.1 MOUSE-DRIVEN CAROUSELS (Position Based) ---
const carouselWrappers = document.querySelectorAll('.group\\/carousel'); 

carouselWrappers.forEach(wrapper => {
    let currentX = 0;
    let targetX = 0;
    let maxScroll = 0;
    
    const updateMax = () => {
        maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
    };
    
    // Initial calc
    updateMax();
    window.addEventListener('resize', updateMax);
    window.addEventListener('load', updateMax);

    wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        // Normalize 0 to 1
        let percentage = x / rect.width;
        
        // Clamp
        if(percentage < 0) percentage = 0;
        if(percentage > 1) percentage = 1;
        
        // Map to scroll range
        targetX = percentage * maxScroll;
    });
    
    // Animation Loop
    function animate() {
        // Smooth lerp for position
        currentX += (targetX - currentX) * 0.08;
        wrapper.scrollLeft = currentX;
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
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (typeof lenis !== 'undefined' && lenis) {
        lenis.scrollTo(0, { duration: 0, immediate: true });
    }
}

resetScrollToTop();

window.addEventListener('pageshow', () => {
    resetScrollToTop();
});

window.addEventListener('beforeunload', () => {
    resetScrollToTop();
});


// --- 2.2 PRELOADER SAFETY ---
// Fallback if load event doesn't fire (e.g. image error)
setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if(preloader && preloader.getBoundingClientRect().top === 0) {
        // It's still covering the screen
        console.warn("Forcing preloader removal due to timeout");
        gsap.to(preloader, {
             yPercent: -100,
             duration: 0.8,
             ease: "power2.out",
             onComplete: () => {
                 // Trigger hero animations if they haven't run
                 gsap.to("#hero h1, #hero .flex.flex-col.gap-6, header", {
                     opacity: 1, y: 0, duration: 0.5
                 });
             }
        });
    }
}, 3500);


// --- NAVBAR SMOOTH SCROLL (Lenis Integration) ---
function smoothScrollToHash(targetId) {
    if (!targetId || targetId === '#') return;
    const targetElement = document.querySelector(targetId);
    if (!targetElement) return;

    lenis.scrollTo(targetElement, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        e.preventDefault();

        if (isMenuOpen) {
            toggleMenu();
            setTimeout(() => smoothScrollToHash(targetId), 50);
            return;
        }

        smoothScrollToHash(targetId);
    });
});



// --- 3. PROJECT ACCORDION ---
const projectAccordions = document.querySelectorAll('.project-accordion');

projectAccordions.forEach((accordion) => {
    const header = accordion.querySelector('.project-header');
    const content = accordion.querySelector('.project-content');
    
    header.addEventListener('click', () => {
        // Check if currently active
        const isActive = accordion.classList.contains('active');
        
        // Close all other accordions
        projectAccordions.forEach(other => {
            if (other !== accordion) {
                other.classList.remove('active');
                const otherContent = other.querySelector('.project-content');
                const otherIcon = other.querySelector('.material-symbols-outlined');
                
                gsap.to(otherContent, {
                    height: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
                
                if(otherIcon) {
                    gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
                }
            }
        });
        
        // Toggle current
        if (!isActive) {
            accordion.classList.add('active');
            
            // Open animation
            gsap.to(content, {
                height: "auto",
                opacity: 1,
                duration: 0.6,
                ease: "power2.out"
            });
            
            const icon = header.querySelector('.material-symbols-outlined');
            if(icon) gsap.to(icon, { rotation: 90, duration: 0.3 });
            
        } else {
            accordion.classList.remove('active');
            
            // Close animation
            gsap.to(content, {
                height: 0,
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut"
            });
            
            const icon = header.querySelector('.material-symbols-outlined');
            if(icon) gsap.to(icon, { rotation: 0, duration: 0.3 });
        }
    });
});

// REMOVED OLD FLOATING PREVIEW LOGIC
// const projectItems = document.querySelectorAll('.project-item'); ...


// --- 4. MENU OVERLAY ---
const menuToggle = document.getElementById('menu-toggle');
const closeMenu = document.getElementById('close-menu'); // Not used in new HTML but kept for safety
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.nav-link');
const menuText = document.getElementById('menu-text');

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    if (isMenuOpen) {
        // Open
        menuOverlay.classList.remove('translate-y-full');
        menuOverlay.classList.add('translate-y-0');
        
        // Change text to CLOSE
        if(menuText) menuText.textContent = "CLOSE";
        
        // Animate links in
        gsap.fromTo(navLinks, 
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
        );
        
        lenis.stop();
        
    } else {
        // Close
        menuOverlay.classList.remove('translate-y-0');
        menuOverlay.classList.add('translate-y-full');
        
        // Change text back to MENU
        // We need to check language to know if it should be MENU or MENÚ, but for now simple toggle
        // Or re-apply i18n key?
        // Let's just use the current lang logic or hardcode for simplicity of animation first
        // Better: Use the i18n key again
        if(menuText) {
             const key = menuText.getAttribute('data-i18n');
             if(translations[currentLang][key]) {
                 menuText.textContent = translations[currentLang][key];
             } else {
                 menuText.textContent = "MENU";
             }
        }
        
        lenis.start();
    }
}

if(menuToggle) menuToggle.addEventListener('click', toggleMenu);
// if(closeMenu) closeMenu.addEventListener('click', toggleMenu); // Removed from HTML

// --- 5. LOCAL TIME (Removed) ---
/*
function updateTime() { ... }
setInterval(updateTime, 1000);
updateTime();
*/


// --- 6. HERO PARALLAX ---
if(document.querySelector(".hero-img-wrapper")) {
    gsap.to(".hero-img-wrapper img", {
        yPercent: 15, // Subtle parallax
        scale: 1.1,   // Slight zoom out effect on scroll
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}


// Parallax for the Text (move faster than normal scroll)
if(document.querySelector("#hero h1")) {
    gsap.to("#hero h1", {
        yPercent: 50,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
}

// --- 7. LANGUAGE TOGGLE (Bilingual) ---
const translations = {
    en: {
        'nav.menu': 'MENU',
        'nav.work': 'WORK',
        'nav.about': 'ABOUT',
        'nav.contact': 'CONTACT',
        'nav.close': 'CLOSE',
        'hero.title1': 'SIMÓN',
        'hero.title2': 'OCAMPO',
        'hero.role1': 'Systems Analyst',
        'hero.role2': 'Systems Engineering Student',
        'hero.role3': 'Full Stack Developer',
        'hero.role': 'Specializing in scalable web architectures and accessible software solutions. Independent Researcher in Philosophy & Theology.',
        'hero.available': 'Available for work',
        'work.title': 'Selected Works',
        'work.archive': 'View Archive',
        'work.project1.title': 'Data Acquisition Adaptability',
        'work.project1.meta': 'Software Dev / 2024',
        'work.project1.desc': 'Development of an adaptability module for data acquisition software, specifically designed to empower visually impaired users. This solution implements high-contrast interfaces, screen-reader compatibility, and auditory feedback loops.',
        'work.project1.card2': 'Details View',
        'work.project1.card3': 'Accessibility Mode',
        'work.project2.title': 'Kinesiology Management',
        'work.project2.meta': 'Web App / 2023',
        'work.project2.desc': 'A comprehensive web application for a kinesiology center, enabling secure management of patient medical records, appointment scheduling, and treatment history. Built with a robust Django backend and a reactive React frontend.',
        'academic.sectionLabel': 'Academic Research',
        'academic.title': 'Philosophy of Religion & Analytic Theology',
        'academic.desc': 'Independent research published in international journals and indexed repositories. Focusing on stage II cosmological arguments and historical reliability of religious texts.',
        'academic.orcid': 'ORCID Profile',
        'academic.pub1.type': 'Q1 Journal / 2024',
        'academic.pub1.lang': 'English',
        'academic.pub1.title': 'Strategies for stage II of cosmological arguments',
        'academic.pub1.source': 'International Journal for Philosophy of Religion, 96(1), 55-88.',
        'academic.pub2.type': 'Pre-print / 2023',
        'academic.pub2.lang': 'Spanish',
        'academic.pub2.title': 'Estrategias para la Fase II de los Argumentos Cosmológicos',
        'academic.pub2.source': 'Independent Research Repository',
        'academic.pub3.type': 'Essay / 2022',
        'academic.pub3.lang': 'Spanish',
        'academic.pub3.title': 'La Confiabilidad Histórica de los Evangelios',
        'academic.pub3.source': 'Historical Analysis',
        'about.label': '/ Arsenal',
        'about.title': 'The toolkit for modern digital craftsmanship.',
        'stack.frontend': 'Development',
        'stack.backend': 'Languages',
        'stack.analysis': 'Research & Philosophy',
        'stack.design': 'Design',
        'contact.title': 'Let\'s work<br>together',
        'contact.cta': 'Get in touch',
        'contact.form.name': 'Name',
        'contact.form.namePlaceholder': 'John Doe *',
        'contact.form.email': 'Email',
        'contact.form.emailPlaceholder': 'john@doe.com *',
        'contact.form.message': 'Message',
        'contact.form.messagePlaceholder': 'Tell me about your project...',
        'contact.submit': 'Send Message',
        'contact.details': 'Contact Details',
        // 'footer.time': 'Local Time', // Removed
        'footer.copyright': '© 2026 Simón Ocampo'
    },
    es: {
        'nav.menu': 'MENÚ',
        'nav.work': 'PROYECTOS',
        'nav.about': 'PERFIL',
        'nav.contact': 'CONTACTO',
        'nav.close': 'CERRAR',
        'hero.title1': 'SIMÓN',
        'hero.title2': 'OCAMPO',
        'hero.role1': 'Analista de Sistemas',
        'hero.role2': 'Estudiante de Ingeniería de Sistemas',
        'hero.role3': 'Desarrollador Full Stack',
        'hero.role': 'Especializado en arquitecturas web escalables y soluciones de software accesible. Investigador independiente en Filosofía y Teología.',
        'hero.available': 'Disponible para trabajar',
        'work.title': 'Trabajos Seleccionados',
        'work.archive': 'Ver Archivo',
        'work.project1.title': 'Adaptabilidad para Adquisición de Datos',
        'work.project1.meta': 'Desarrollo de Software / 2024',
        'work.project1.desc': 'Desarrollo de un módulo de adaptabilidad para software de adquisición de datos, diseñado específicamente para usuarios con discapacidad visual. Esta solución implementa interfaces de alto contraste, compatibilidad con lectores de pantalla y retroalimentación auditiva.',
        'work.project1.card2': 'Vista Detallada',
        'work.project1.card3': 'Modo Accesible',
        'work.project2.title': 'Gestión de Kinesiología',
        'work.project2.meta': 'Aplicación Web / 2023',
        'work.project2.desc': 'Aplicación web integral para un centro de kinesiología, que permite la gestión segura de historiales médicos, programación de turnos e historial de tratamientos. Construida con un backend robusto en Django y un frontend reactivo en React.',
        'academic.sectionLabel': 'Investigación Académica',
        'academic.title': 'Filosofía de la Religión y Teología Analítica',
        'academic.desc': 'Investigación independiente publicada en revistas internacionales y repositorios indexados. Centrada en la fase II de los argumentos cosmológicos y la confiabilidad histórica de textos religiosos.',
        'academic.orcid': 'Perfil ORCID',
        'academic.pub1.type': 'Revista Q1 / 2024',
        'academic.pub1.lang': 'Inglés',
        'academic.pub1.title': 'Estrategias para la fase II de los argumentos cosmológicos',
        'academic.pub1.source': 'International Journal for Philosophy of Religion, 96(1), 55-88.',
        'academic.pub2.type': 'Preprint / 2023',
        'academic.pub2.lang': 'Español',
        'academic.pub2.title': 'Estrategias para la Fase II de los Argumentos Cosmológicos',
        'academic.pub2.source': 'Repositorio de Investigación Independiente',
        'academic.pub3.type': 'Ensayo / 2022',
        'academic.pub3.lang': 'Español',
        'academic.pub3.title': 'La Confiabilidad Histórica de los Evangelios',
        'academic.pub3.source': 'Análisis Histórico',
        'about.label': '/ Arsenal',
        'about.title': 'El kit de herramientas para la artesanía digital moderna.',
        'stack.frontend': 'Desarrollo',
        'stack.backend': 'Idiomas',
        'stack.analysis': 'Investigación y Filosofía',
        'stack.design': 'Diseño',
        'contact.title': 'Trabajemos<br>juntos',
        'contact.cta': 'Hablemos',
        'contact.form.name': 'Nombre',
        'contact.form.namePlaceholder': 'Juan Pérez *',
        'contact.form.email': 'Correo',
        'contact.form.emailPlaceholder': 'juan@correo.com *',
        'contact.form.message': 'Mensaje',
        'contact.form.messagePlaceholder': 'Cuéntame sobre tu proyecto...',
        'contact.submit': 'Enviar Mensaje',
        'contact.details': 'Detalles de Contacto',
        // 'footer.time': 'Hora Local', // Removed
        'footer.copyright': '© 2026 Simón Ocampo'
    }
};

const langToggle = document.getElementById('lang-toggle-desktop'); // Updated ID
let currentLang = 'en';

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations[currentLang][key];
        if (!value) return;

        if (el.id === 'menu-text' && isMenuOpen) {
            el.textContent = translations[currentLang]['nav.close'] || 'CLOSE';
            return;
        }

        if (value.includes('<br>')) {
            el.innerHTML = value;
        } else {
            el.textContent = value;
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = translations[currentLang][key];
        if (value) el.setAttribute('placeholder', value);
    });
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'es' : 'en';
        langToggle.textContent = currentLang === 'en' ? 'EN' : 'ES';
        applyTranslations();
    });
}

applyTranslations();

console.log("Portfolio Interactions Loaded - Snellenberg Style");

// --- 8. SCROLL TO TOP (STO Logo) ---
const logoLink = document.querySelector('a[href="#"]');
if (logoLink) {
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo(0, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    });
}

// --- 9. PAGE LOAD & PRELOADER ANIMATION ---
window.addEventListener('load', () => {
    const tl = gsap.timeline();
    
    // 1. Text Reveal
    tl.to('.preloader-text', {
        y: '0%',
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
    })
    // 2. Line Fill
    .to('.preloader-line', {
        x: '0%',
        duration: 0.8,
        ease: "power2.inOut"
    }, "-=0.4")
    // 3. Pause
    .to({}, { duration: 0.3 })
    // 4. Slide Preloader Up
    .to('#preloader', {
        yPercent: -100,
        duration: 1.0,
        ease: "expo.inOut"
    })
    // 5. Hero Animations (Staggered Entrance)
    .from("#hero h1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    }, "-=0.8")
    .from("#hero .flex.flex-col.gap-6", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.9")
    // 6. Navbar Entrance
    .from("header", {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");
    
    // Force scroll reset
    window.scrollTo(0, 0);
    
    // Re-trigger global resize to fix any layout dependent calcs
    window.dispatchEvent(new Event('resize'));
    ScrollTrigger.refresh();
    
    // Stagger in sections on scroll (Setup) - REDUCED INTENSITY
    gsap.utils.toArray('section:not(#hero):not(#academic)').forEach((section, i) => {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 30, // Reduced from 60
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Academic section: subtle slide-up reveal
    gsap.fromTo('#academic .lg\\:col-span-4', {
        y: 24,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: {
            trigger: '#academic',
            start: "top 82%",
            once: true
        }
    });

    gsap.utils.toArray('#academic .group').forEach((card) => {
        gsap.fromTo(card, {
            y: 24,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true
            }
        });
    });

    // --- 12. ENHANCED SCROLL ANIMATIONS (MOVED INSIDE LOAD TO ENSURE AVAILABILITY) ---

    // Animate Headings (Subtle Fade Up)
    gsap.utils.toArray('h2, h3').forEach(heading => {
        gsap.from(heading, {
            y: 30, 
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: heading,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Mobile profile description (before Selected Works)
    gsap.utils.toArray('.mobile-profile-description').forEach(desc => {
        gsap.from(desc, {
            y: 30,
            opacity: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: desc,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Animate Separator Lines (Subtle Fade Up)
    gsap.utils.toArray('.border-t, .border-b, hr').forEach(sep => {
        gsap.from(sep, {
            y: 12,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: sep,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Reveal Images (Subtle Scale/Fade, no horizontal motion)
    const revealImages = document.querySelectorAll('.project-accordion img, .group img'); 
    revealImages.forEach(img => {
        if(img.closest('.hero-img-wrapper')) return; 

        gsap.fromTo(img, 
            { 
                scale: 1.1, 
                opacity: 0,
                filter: 'grayscale(100%)' 
            },
            { 
                scale: 1, 
                opacity: 1,
                filter: 'grayscale(0%)',
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
    
    ScrollTrigger.refresh();

});


// --- 10. HYPERLINK HOVER EFFECTS ---
// REMOVED PER USER REQUEST (No slide-in animations)
/*
const hyperlinks = document.querySelectorAll('a[href^="http"], a[href^="mailto"]');
hyperlinks.forEach(link => {
    // Removed GSAP hover effects
});
*/

// --- 11. ACADEMIC PUBLICATIONS CLICKABLE ---
const publicationCards = document.querySelectorAll('#academic .group');
publicationCards.forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', () => {
        const link = card.closest('a');
        if(link) link.click();
    });
});

// --- 12. ENHANCED SCROLL ANIMATIONS ---
// MOVED TO WINDOW.LOAD FUNCTION TO ENSURE PROPER INITIALIZATION


// --- 13. MOUSE FOLLOWER (Subtle Glow) ---
// Create the follower element
const follower = document.createElement('div');
follower.className = 'fixed w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[60] mix-blend-difference hidden md:block transition-transform duration-200 ease-out';
follower.style.transform = 'translate(-50%, -50%)';
document.body.appendChild(follower);

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Smooth follow
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    follower.style.left = `${cursorX}px`;
    follower.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Interactive states for cursor
const interactiveElements = document.querySelectorAll('a, button, [data-magnetic], .project-header, .group');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        follower.classList.add('scale-[2]', 'bg-white/10', 'backdrop-blur-[1px]');
        follower.style.border = '1px solid rgba(255,255,255,0)';
    });
    
    el.addEventListener('mouseleave', () => {
        follower.classList.remove('scale-[2]', 'bg-white/10', 'backdrop-blur-[1px]');
        follower.style.border = '1px solid rgba(255,255,255,0.3)';
    });
});

