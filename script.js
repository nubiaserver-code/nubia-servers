document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // --- 1. INTRO ANIMATION ---
    const intro = document.getElementById('intro');
    const progressBar = document.getElementById('intro-progress');
    const loadingText = document.getElementById('loading-text');
    const hasPlayed = sessionStorage.getItem('introPlayed');

    if (!hasPlayed) {
        document.body.style.overflow = 'hidden'; // prevent scrolling during intro
        const messages = ["Initializing...", "Loading Assets...", "Connecting to Server...", "Fetching Server Status...", "Ready."];
        let progress = 0;
        let msgIndex = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 5;
            if (progress >= 100) progress = 100;

            progressBar.style.width = progress + '%';

            if (progress > 20 && msgIndex === 0) { loadingText.innerText = messages[++msgIndex]; }
            if (progress > 50 && msgIndex === 1) { loadingText.innerText = messages[++msgIndex]; }
            if (progress > 80 && msgIndex === 2) { loadingText.innerText = messages[++msgIndex]; }
            if (progress === 100 && msgIndex === 3) { loadingText.innerText = messages[++msgIndex]; }

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    intro.style.opacity = '0';
                    setTimeout(() => {
                        intro.style.display = 'none';
                        document.body.style.overflow = 'auto';
                        sessionStorage.setItem('introPlayed', 'true');
                    }, 1000);
                }, 800);
            }
        }, 300);
    } else {
        intro.style.display = 'none';
    }

    // --- 2. CUSTOM CURSOR (desktop / mouse only) ---
    const cursor = document.querySelector('.cursor');
    const cursorGlow = document.querySelector('.cursor-glow');
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer && cursor && cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursor.classList.add('visible');
            cursorGlow.classList.add('visible');
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            setTimeout(() => {
                cursorGlow.style.left = e.clientX + 'px';
                cursorGlow.style.top = e.clientY + 'px';
            }, 50);
        });

        const interactables = document.querySelectorAll('a, button, .glass');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hover-effect'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hover-effect'));
        });
    }

    // --- 3. FLOATING PARTICLES ---
    if (!reduceMotion) {
        const particlesContainer = document.getElementById('particles-js');
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            let particle = document.createElement('div');
            particle.classList.add('particle');

            let size = Math.random() * 5 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + 'vw';

            let duration = Math.random() * 10 + 5;
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';

            particlesContainer.appendChild(particle);
        }
    }

    // --- 4. SCROLL PROGRESS & NAVBAR ---
    const scrollProgress = document.querySelector('.scroll-progress');
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY;
        let docHeight = document.body.scrollHeight - window.innerHeight;
        let scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = scrollPercent + '%';

        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            scrollTopBtn.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        hamburger.querySelector('i').className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.querySelector('i').className = 'fas fa-bars';
        });
    });

    // --- 5. SCROLL REVEAL ANIMATION ---
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // --- 6. COPY IP FUNCTIONALITY ---
    const copyBtn = document.getElementById('copyIp');
    const ipEl = document.getElementById('server-ip');
    const portEl = document.getElementById('server-port');

    copyBtn.addEventListener('click', () => {
        const connectionString = `${ipEl.innerText}:${portEl.innerText}`;
        const originalHTML = copyBtn.innerHTML;

        const onCopied = () => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.style.background = '#00ff88';
            copyBtn.style.color = '#000';
            copyBtn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.6)';
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
                copyBtn.style.boxShadow = '';
            }, 2000);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(connectionString).then(onCopied).catch(() => {
                copyBtn.innerHTML = '<i class="fas fa-xmark"></i> Gagal, salin manual';
                setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
            });
        } else {
            copyBtn.innerHTML = '<i class="fas fa-xmark"></i> Gagal, salin manual';
            setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
        }
    });

    // --- 7. ACCORDION (RULES) ---
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(acc => {
        const header = acc.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            accordions.forEach(item => {
                if (item !== acc) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = null;
                    item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });

            acc.classList.toggle('active');
            const isOpen = acc.classList.contains('active');
            header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            const content = acc.querySelector('.accordion-content');
            if (isOpen) {
                content.style.maxHeight = content.scrollHeight + 40 + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- 8. BACKGROUND MUSIC TOGGLE ---
    const musicBtn = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.2;

    musicBtn.addEventListener('click', () => {
        const icon = musicBtn.querySelector('i');
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {});
            icon.className = 'fas fa-volume-high';
            musicBtn.style.color = 'var(--red-primary)';
            musicBtn.style.textShadow = '0 0 10px var(--red-glow)';
        } else {
            bgMusic.pause();
            icon.className = 'fas fa-volume-mute';
            musicBtn.style.color = '';
            musicBtn.style.textShadow = '';
        }
    });

    // --- 9. SERVER STATUS SIMULATION (ping + player count drift) ---
    // Placeholder client-side flavor only — swap with a real fetch() to a
    // Bedrock status API when one is available.
    setInterval(() => {
        const pingElement = document.getElementById('server-ping');
        const currentPing = parseInt(pingElement.innerText, 10) || 34;
        const newPing = currentPing + (Math.floor(Math.random() * 5) - 2);
        pingElement.innerText = (newPing > 10 ? newPing : 10) + 'ms';

        const playerEl = document.getElementById('player-count');
        if (playerEl) {
            const currentPlayers = parseInt(playerEl.innerText, 10) || 124;
            const drift = Math.floor(Math.random() * 7) - 3;
            playerEl.innerText = Math.max(40, Math.min(500, currentPlayers + drift));
        }
    }, 5000);

});
