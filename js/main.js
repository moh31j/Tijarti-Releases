document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let glowX = mouseX;
        let glowY = mouseY;
        let isDesktop = window.innerWidth > 1024;

        window.addEventListener('resize', () => {
            isDesktop = window.innerWidth > 1024;
            if (!isDesktop) cursorGlow.style.opacity = '0';
            else cursorGlow.style.opacity = '1';
        });

        window.addEventListener('mousemove', (e) => {
            if (isDesktop) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });

        const animateCursor = () => {
            if (isDesktop) {
                // Smooth easing
                glowX += (mouseX - glowX) * 0.1;
                glowY += (mouseY - glowY) * 0.1;
                // Center the glow on the cursor
                cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
            }
            requestAnimationFrame(animateCursor);
        };
        animateCursor();
    }

    // 12. Scroll Progress Indicator
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.height = '3px';
    progressBar.style.width = '0%';
    progressBar.style.zIndex = '10001';
    progressBar.style.background = 'var(--gradient-primary, linear-gradient(to left, #cba153, #e5ca8a))'; // Fallback gradient
    progressBar.style.transition = 'width 0.1s ease-out';
    document.body.appendChild(progressBar);

    // 3. Navbar Scroll Effects & Progress Bar Update
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    const updateScrollEffects = () => {
        const scrollY = window.scrollY;

        // Navbar Scrolled Class
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Scroll Progress
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight > 0) {
            const scrollPercent = (scrollY / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrollEffects);
    }, { passive: true });
    updateScrollEffects();

    // Active Nav Link Highlighting (Intersection Observer)
    const sectionObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, sectionObserverOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (mobileMenuToggle && navLinksContainer) {
        const toggleMenu = () => {
            navLinksContainer.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            
            // Transform hamburger icon (optional visual feedback)
            const icon = mobileMenuToggle.querySelector('i');
            if (icon && navLinksContainer.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else if (icon) {
                icon.setAttribute('data-lucide', 'menu');
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close when a link is clicked
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksContainer.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                toggleMenu();
            }
        });
    }

    // 5. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // One-shot animation
            }
        });
    }, revealObserverOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. 3D Tilt Effect on Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        let rafId;

        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 1024) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Max rotation: ±8 degrees
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8; 

            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth <= 1024) return;
            
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
            });
        });
    });

    // 7. Counter Animation
    const counterElements = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const targetCount = parseFloat(el.getAttribute('data-count'));
                let currentCount = 0;
                let startTime = null;
                const duration = 2000; // 2 seconds

                const animateCounter = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const ratio = Math.min(progress / duration, 1);
                    
                    // Ease out cubic
                    const easeRatio = 1 - Math.pow(1 - ratio, 3);
                    currentCount = targetCount * easeRatio;

                    // Format with Arabic locale if needed, or just standard numbers
                    el.textContent = Math.floor(currentCount).toLocaleString('ar-SA');

                    if (ratio < 1) {
                        requestAnimationFrame(animateCounter);
                    } else {
                        el.textContent = targetCount.toLocaleString('ar-SA');
                    }
                };
                
                requestAnimationFrame(animateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));

    // 8. Gallery Population
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryImages = [
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184506.png', caption: 'نقطة بيع التجزئة' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184519.png', caption: 'نقطة بيع الجملة' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184530.png', caption: 'تأكيد الدفع' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184555.png', caption: 'بون التسليم' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184600.png', caption: 'تيكت POS' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184606.png', caption: 'سجل المعاملات' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184613.png', caption: 'الصندوق والورديات' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184618.png', caption: 'إدارة المنتجات' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184626.png', caption: 'العروض الترويجية' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184631.png', caption: 'المشتريات' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184658.png', caption: 'طلبات التوريد' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184836.png', caption: 'استوديو الصور' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184852.png', caption: 'إعدادات المتجر' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184904.png', caption: 'صلاحيات المستخدمين' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184911.png', caption: 'إحصائيات المبيعات' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184943.png', caption: 'العملاء' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184953.png', caption: 'الموردون' },
        { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 185009.png', caption: 'تفعيل الترخيص' }
    ];

    if (galleryGrid) {
        galleryImages.forEach((imgData, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item reveal fade-in-up';
            // Staggered delay for every set of 3 images
            const delayIndex = (index % 3) + 1;
            if ((index % 3) !== 0) item.classList.add(`delay-${delayIndex}`);
            
            item.setAttribute('data-index', index);

            item.innerHTML = `
                <img src="${imgData.src}" alt="${imgData.caption}" loading="lazy">
                <div class="gallery-overlay">
                    <span class="gallery-title">${imgData.caption}</span>
                    <i data-lucide="maximize-2"></i>
                </div>
            `;
            
            galleryGrid.appendChild(item);
            revealObserver.observe(item); // Observe newly added elements
        });

        // Initialize icons for newly added gallery items
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 9. Lightbox
    const lightbox = document.getElementById('lightbox');
    let currentImageIndex = 0;

    if (lightbox) {
        const lightboxImg = lightbox.querySelector('img');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeBtn = document.getElementById('lightboxClose');
        const prevBtn = document.getElementById('lightboxPrev');
        const nextBtn = document.getElementById('lightboxNext');

        const openLightbox = (index) => {
            currentImageIndex = index;
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        };

        const closeLightboxModal = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const updateLightboxContent = () => {
            if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
            if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
            
            lightboxImg.src = galleryImages[currentImageIndex].src;
            lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
        };

        // Event Delegation for Gallery Items
        if (galleryGrid) {
            galleryGrid.addEventListener('click', (e) => {
                const item = e.target.closest('.gallery-item');
                if (item) {
                    const index = parseInt(item.getAttribute('data-index'), 10);
                    openLightbox(index);
                }
            });
        }

        // Lightbox Controls
        if (closeBtn) closeBtn.addEventListener('click', closeLightboxModal);
        
        // Next/Prev Buttons Logic (accounting for Arabic RTL - usually visual flow is reversed)
        // In RTL: Next is visually Left, Prev is visually Right.
        const goNext = () => { currentImageIndex++; updateLightboxContent(); };
        const goPrev = () => { currentImageIndex--; updateLightboxContent(); };

        if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNext(); });
        if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrev(); });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightboxModal();
            }
        });

        // Keyboard Navigation (RTL awareness)
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightboxModal();
            // RTL Context: ArrowRight is moving to the "previous" item in LTR array order
            else if (e.key === 'ArrowRight') goPrev();
            // ArrowLeft is moving to the "next" item in array order
            else if (e.key === 'ArrowLeft') goNext();
        });

        // Mobile Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const threshold = 50;
            if (touchEndX < touchStartX - threshold) {
                // Swipe Left (In RTL, this usually means 'Next')
                goNext();
            }
            if (touchEndX > touchStartX + threshold) {
                // Swipe Right (In RTL, this usually means 'Prev')
                goPrev();
            }
        };
    }

    // 10. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 11. Parallax-lite on Background Orbs
    const orbs = document.querySelectorAll('.orb');
    if (orbs.length > 0) {
        let lastScrollY = window.scrollY;
        
        const parallaxOrbs = () => {
            if (window.innerWidth <= 1024) return; // Desktop only

            const scrollY = window.scrollY;
            
            orbs.forEach((orb, index) => {
                // Different factors for different orbs to create depth
                const factors = [0.05, -0.03, 0.04];
                const factor = factors[index % factors.length];
                const yPos = scrollY * factor;
                
                orb.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', () => {
            requestAnimationFrame(parallaxOrbs);
        }, { passive: true });
    }

    // === PARTICLE CANVAS BACKGROUND ===
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 60;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = Math.random() > 0.5 ? '0, 212, 255' : '168, 85, 247';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.06 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // === HERO TYPING EFFECT ===
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const phrases = [
            'مصمم خصيصاً ليعمل بدون إنترنت (Offline-First)',
            'واجهة مذهلة وسرعة لا مثيل لها',
            'يدعم بيع التجزئة والجملة',
            'إدارة المخزون والفوترة المتقدمة',
            'العروض الترويجية والتقارير الشاملة'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 50;

        const typeEffect = () => {
            const currentPhrase = phrases[phraseIndex];

            if (!isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 40 + Math.random() * 40;

                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    typingSpeed = 2000; // Pause at end
                }
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 25;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 500; // Pause before new phrase
                }
            }

            setTimeout(typeEffect, typingSpeed);
        };
        setTimeout(typeEffect, 1000);
    }

    // === HORIZONTAL CAROUSEL POPULATION ===
    const carouselTrack = document.getElementById('carouselTrack');
    if (carouselTrack) {
        const carouselImages = [
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184506.png', caption: 'نقطة بيع التجزئة' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184519.png', caption: 'نقطة بيع الجملة' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184530.png', caption: 'تأكيد الدفع' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184555.png', caption: 'بون التسليم' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184600.png', caption: 'تيكت POS' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184606.png', caption: 'سجل المعاملات' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184613.png', caption: 'الصندوق والورديات' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184618.png', caption: 'إدارة المنتجات' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184626.png', caption: 'العروض الترويجية' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184631.png', caption: 'المشتريات' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184658.png', caption: 'طلبات التوريد' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184836.png', caption: 'استوديو الصور' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184852.png', caption: 'إعدادات المتجر' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184904.png', caption: 'صلاحيات المستخدمين' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184911.png', caption: 'إحصائيات المبيعات' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184943.png', caption: 'العملاء' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 184953.png', caption: 'الموردون' },
            { src: '../01_Stage1_POS_Only/Screenshot 2026-07-26 185009.png', caption: 'تفعيل الترخيص' }
        ];

        // Duplicate for infinite scroll
        const allSlides = [...carouselImages, ...carouselImages];
        allSlides.forEach(img => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `
                <img src="${img.src}" alt="${img.caption}" loading="lazy">
                <div class="carousel-caption">${img.caption}</div>
            `;
            carouselTrack.appendChild(slide);
        });
    }

    // === FAQ ACCORDION ===
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const faqItem = btn.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) item.classList.remove('active');
            });

            // Toggle current
            faqItem.classList.toggle('active', !isActive);
            btn.setAttribute('aria-expanded', !isActive);
        });
    });

    // === MAGNETIC BUTTON EFFECT ===
    if (window.innerWidth > 1024) {
        document.querySelectorAll('.btn-primary.glowing').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // === OFFLINE SIMULATOR ===
    const simBtn = document.getElementById('simBtn');
    const simScreen = document.getElementById('simScreen');
    const simStatusIcon = document.querySelector('#simStatus .status-icon');
    const simStatusText = document.querySelector('#simStatus .status-text');
    const simMessage = document.getElementById('simMessage');

    if (simBtn && simScreen) {
        let isOffline = false;
        simBtn.addEventListener('click', () => {
            isOffline = !isOffline;
            
            if (isOffline) {
                simBtn.innerHTML = '<i data-lucide="wifi"></i> إعادة الاتصال';
                simBtn.style.background = 'var(--accent-green)';
                simBtn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
                
                simScreen.classList.add('offline-mode');
                simStatusIcon.setAttribute('data-lucide', 'wifi-off');
                simStatusIcon.classList.replace('text-green', 'text-red');
                simStatusText.textContent = 'غير متصل (Offline)';
                
                simMessage.innerHTML = `
                    <h3 style="color: var(--accent-green); font-size: 1.5rem; margin-bottom: 10px;">
                        <i data-lucide="check-circle" style="display:inline-block; vertical-align:middle;"></i> 
                        لم يتغير شيء!
                    </h3>
                    <p style="color: var(--text-secondary);">لا يزال النظام يعمل بفضل قاعدة البيانات المحلية. المبيعات مستمرة كالمعتاد.</p>
                `;
            } else {
                simBtn.innerHTML = '<i data-lucide="wifi-off"></i> اقطع الإنترنت الآن';
                simBtn.style.background = 'var(--accent-red)';
                simBtn.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
                
                simScreen.classList.remove('offline-mode');
                simStatusIcon.setAttribute('data-lucide', 'wifi');
                simStatusIcon.classList.replace('text-red', 'text-green');
                simStatusText.textContent = 'متصل';
                
                simMessage.innerHTML = `
                    <h3 style="color: var(--text-primary); font-size: 1.5rem; margin-bottom: 10px;">النظام يعمل بشكل ممتاز</h3>
                    <p style="color: var(--text-secondary);">سرعة الاستجابة: 0.2 ثانية</p>
                `;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    }

    // === SOCIAL PROOF NOTIFICATIONS ===
    const socialProofContainer = document.getElementById('socialProofContainer');
    if (socialProofContainer) {
        const notifications = [
            { name: 'أحمد من وهران', action: 'بدأ باستخدام Tijarti الآن', time: 'منذ دقيقة' },
            { name: 'متجر الهلال', action: 'طبع 150 فاتورة بدون إنترنت', time: 'منذ 5 دقائق' },
            { name: 'يوسف من العاصمة', action: 'قام بترقية نظامه إلى Tijarti', time: 'منذ 12 دقيقة' },
            { name: 'سوبر ماركت البركة', action: 'باع أكثر من 500 منتج اليوم', time: 'منذ نصف ساعة' },
            { name: 'خالد من قسنطينة', action: 'حمّل النسخة التجريبية للتو', time: 'الآن' }
        ];

        const showRandomNotification = () => {
            const notif = notifications[Math.floor(Math.random() * notifications.length)];
            
            const toast = document.createElement('div');
            toast.className = 'social-proof-toast';
            toast.innerHTML = `
                <div class="toast-icon"><i data-lucide="bell"></i></div>
                <div class="toast-content">
                    <h5>${notif.name}</h5>
                    <p>${notif.action} • ${notif.time}</p>
                </div>
            `;
            
            socialProofContainer.appendChild(toast);
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            // Animate in
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 5000);

            // Schedule next notification (between 10 and 20 seconds)
            setTimeout(showRandomNotification, Math.random() * 10000 + 10000);
        };

        // Start first notification after 5 seconds
        setTimeout(showRandomNotification, 5000);
    }

    // === ORDER FORM LOGIC ===
    const packageCards = document.querySelectorAll('.package-card');
    const submitBtnSpan = document.querySelector('#btnSubmitOrder span');
    const submitBtn = document.getElementById('btnSubmitOrder');
    const orderForm = document.getElementById('orderForm');
    
    // Admin WhatsApp Number (change this to your actual number)
    const adminPhone = "213775977227"; // Tijarti Support Number

    if (packageCards.length > 0) {
        packageCards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');
            
            card.addEventListener('click', () => {
                // Remove selected class from all
                packageCards.forEach(c => c.classList.remove('selected'));
                // Add to current
                card.classList.add('selected');
                radio.checked = true;
                
                // Update Button Text & Style
                if (radio.value === 'trial') {
                    submitBtnSpan.textContent = 'طلب النسخة التجريبية (مجاناً)';
                    submitBtn.classList.add('btn-trial');
                } else {
                    submitBtnSpan.textContent = 'شراء الآن — 12,000 دج فقط';
                    submitBtn.classList.remove('btn-trial');
                }
            });
        });
        
        // Handle Form Submission
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('orderName').value;
                const phone = document.getElementById('orderPhone').value;
                const province = document.getElementById('orderProvince').value;
                const activity = document.getElementById('orderActivity').value;
                const packageType = document.querySelector('input[name="package"]:checked').value;
                
                const typeText = packageType === 'full' ? 'شراء الرخصة الكاملة (12,000 دج)' : 'النسخة التجريبية (مجانية)';
                
                // Construct WhatsApp Message
                let message = `*طلب جديد - Tijarti Suite* 🛒\n\n`;
                message += `👤 *الاسم/المحل:* ${name}\n`;
                message += `📱 *رقم الهاتف:* ${phone}\n`;
                message += `📍 *الولاية:* ${province}\n`;
                if (activity) message += `🏪 *النشاط:* ${activity}\n`;
                message += `📦 *الطلب:* ${typeText}\n`;
                
                // Encode and open WhatsApp
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            });
        }
    }

    // Re-initialize all icons after DOM changes
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

