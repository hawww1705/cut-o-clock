/* ==========================================================================
   Cut O' Clock Barbershop Website Javascript
   Interactions, Animations, Sliders, and Canvas Constellations
   Crafted by BenchCode Dev
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       01. PRELOADER & SCROLL PROGRESS
       -------------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('scroll-progress');
    const header = document.getElementById('header');
    const heroBg = document.getElementById('hero-bg');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    // Dismiss Preloader on Load
    window.addEventListener('load', () => {
        dismissPreloader();
    });

    // Fallback Preloader Timeout (3 seconds)
    setTimeout(() => {
        dismissPreloader();
    }, 3000);

    function dismissPreloader() {
        if (preloader && !preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            // Trigger auto-concierge popup after 5 seconds
            initConciergeAutoPopup();
        }
    }

    // Scroll Events
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Sticky Navbar
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Scroll Parallax Hero
        if (heroBg && scrollTop < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollTop * 0.4}px) scale(1.05)`;
        }

        // Scroll-to-Top visibility
        if (scrollTop > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to Top action
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* --------------------------------------------------------------------------
       02. MOBILE DRAWER NAVIGATION
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    function openMobileMenu() {
        navMenu.classList.add('open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.querySelector('i').className = 'fa-solid fa-xmark';
    }

    function closeMobileMenu() {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open')) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });


    /* --------------------------------------------------------------------------
       03. GOLD PARTICLES SYSTEM (HERO BACKGROUND)
       -------------------------------------------------------------------------- */
    const heroCanvas = document.getElementById('hero-particles');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let particles = [];
        let width = heroCanvas.width = heroCanvas.offsetWidth;
        let height = heroCanvas.height = heroCanvas.offsetHeight;

        window.addEventListener('resize', () => {
            if (heroCanvas.offsetWidth && heroCanvas.offsetHeight) {
                width = heroCanvas.width = heroCanvas.offsetWidth;
                height = heroCanvas.height = heroCanvas.offsetHeight;
            }
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.speedY = Math.random() * -0.5 - 0.2; // Move upwards
                this.opacity = Math.random() * 0.5 + 0.2;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset particle when out of bounds or faded
                if (this.y < 0 || this.x < 0 || this.x > width) {
                    this.y = height;
                    this.x = Math.random() * width;
                    this.opacity = Math.random() * 0.5 + 0.2;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(200, 169, 106, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor(width / 15), 60);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }


    /* --------------------------------------------------------------------------
       04. BEFORE / AFTER COMPARISON SLIDER
       -------------------------------------------------------------------------- */
    const baSlider = document.getElementById('ba-slider');
    const baHandle = document.getElementById('ba-handle');
    const afterImgContainer = document.getElementById('after-img-container');

    if (baSlider && baHandle && afterImgContainer) {
        let isDragging = false;

        function setSliderPosition(x) {
            const rect = baSlider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            baHandle.style.left = `${position}%`;
            afterImgContainer.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            baHandle.setAttribute('aria-valuenow', Math.round(position));
        }

        // Mouse Events
        baHandle.addEventListener('mousedown', () => { isDragging = true; });
        window.addEventListener('mouseup', () => { isDragging = false; });
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            setSliderPosition(e.clientX);
        });

        // Touch Events
        baHandle.addEventListener('touchstart', () => { isDragging = true; });
        window.addEventListener('touchend', () => { isDragging = false; });
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches && e.touches[0]) {
                setSliderPosition(e.touches[0].clientX);
            }
        });

        // Prevent default drag behaviors
        baSlider.addEventListener('dragstart', (e) => e.preventDefault());
    }


    /* --------------------------------------------------------------------------
       05. STATS COUNTER ANIMATION
       -------------------------------------------------------------------------- */
    const counterElements = document.querySelectorAll('.stat-num');
    
    function startCounting(el) {
        const target = parseFloat(el.getAttribute('data-target'));
        const isDecimal = el.classList.contains('stat-decimal');
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const value = ease * target;

            if (isDecimal) {
                el.textContent = value.toFixed(1);
            } else {
                el.textContent = Math.floor(value);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = isDecimal ? target.toFixed(1) : target;
            }
        }
        requestAnimationFrame(updateCounter);
    }


    /* --------------------------------------------------------------------------
       06. SCROLL REVEAL VIEWPORT OBSERVER
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    el.classList.add('revealed');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Observe stats grid specifically to trigger counters
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counterElements.forEach(el => startCounting(el));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsGrid);
    }


    /* --------------------------------------------------------------------------
       07. HAIRSTYLE INSPIRATION SLIDER & MODAL
       -------------------------------------------------------------------------- */
    const hairstyles = [
        {
            name: "Fade Cut",
            category: "Classic & Modern",
            image: "assets/images/hairstyle-fade.png",
            desc: "Potongan rambut presisi dengan gradasi halus pada bagian samping dan belakang yang memudar menyatu dengan kulit. Cocok untuk tampilan modern, bersih, dan maskulin.",
            face: "Oval, Square, Round",
            maintenance: "High (perlu touch-up setiap 1-2 minggu)",
            duration: "30-45 min"
        },
        {
            name: "French Crop",
            category: "Minimalist Style",
            image: "assets/images/hairstyle-crop.png",
            desc: "Model rambut minimalis dengan poni bertekstur pendek di bagian depan yang dipadukan dengan potongan samping tipis. Gaya kasual yang stylish dan mudah diatur.",
            face: "Oval, Heart, Long",
            maintenance: "Low to Medium (styling minimal)",
            duration: "30-45 min"
        },
        {
            name: "Pompadour",
            category: "Timeless Classic",
            image: "assets/images/hairstyle-pompadour.png",
            desc: "Gaya rambut retro klasik dengan volume tinggi di bagian depan yang disisir ke belakang. Memberikan kesan mewah, rapi, dan karismatik.",
            face: "Round, Oval, Triangular",
            maintenance: "High (memerlukan pomade & blowdry harian)",
            duration: "45 min"
        },
        {
            name: "Slick Back",
            category: "Executive Gentleman",
            image: "https://images.unsplash.com/photo-1517832606589-7a598b647192?auto=format&fit=crop&w=600&q=80",
            desc: "Rambut bagian atas disisir ke belakang secara klimis menggunakan pomade bersinar tinggi. Cocok untuk formal meeting maupun acara formal lainnya.",
            face: "Oval, Square, Diamond",
            maintenance: "Medium",
            duration: "30 min"
        },
        {
            name: "Middle Part",
            category: "Retro Flow",
            image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&w=600&q=80",
            desc: "Belahan rambut tepat di bagian tengah dengan volume jatuh natural di kedua sisi wajah. Gaya trendi ala Korea dan retro 90-an.",
            face: "Oval, Heart",
            maintenance: "Low (cukup rapikan dengan hair tonic/cream)",
            duration: "30 min"
        },
        {
            name: "Undercut",
            category: "Bold Disconnect",
            image: "https://images.unsplash.com/photo-1605497746444-ac9da58d7da0?auto=format&fit=crop&w=600&q=80",
            desc: "Pemisahan kontras yang jelas antara sisi rambut samping yang dipangkas habis dan bagian atas rambut yang dibiarkan panjang.",
            face: "Square, Oval",
            maintenance: "Medium to High",
            duration: "45 min"
        },
        {
            name: "Textured Crop",
            category: "Modern Casual",
            image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
            desc: "Gaya crop modern dengan tekstur acak di bagian atas. Memberikan volume ekstra dan kesan kasual yang stylish menggunakan matte clay.",
            face: "Oval, Round, Heart",
            maintenance: "Low",
            duration: "30-45 min"
        },
        {
            name: "Buzz Cut",
            category: "Minimalist Groomed",
            image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
            desc: "Potongan rambut super pendek yang dipotong merata menggunakan clipper. Pilihan terbaik bagi pria aktif yang menginginkan kepraktisan tanpa styling.",
            face: "Oval, Square, Diamond",
            maintenance: "Very Low (tanpa sisir, tanpa pomade)",
            duration: "15-20 min"
        }
    ];

    const slider = document.getElementById('inspiration-slider');
    const dotsContainer = document.getElementById('insp-dots');
    const prevBtn = document.getElementById('insp-prev');
    const nextBtn = document.getElementById('insp-next');

    // Modal elements
    const modal = document.getElementById('insp-modal');
    const modalOverlay = document.getElementById('insp-modal-overlay');
    const modalClose = document.getElementById('insp-modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalFace = document.getElementById('modal-face');
    const modalMaintenance = document.getElementById('modal-maintenance');
    const modalDuration = document.getElementById('modal-duration');
    const modalBookBtn = document.getElementById('modal-book-btn');

    if (slider) {
        // Generate Cards
        hairstyles.forEach((style, idx) => {
            const card = document.createElement('div');
            card.className = 'style-card reveal-fade-up';
            card.setAttribute('data-delay', (idx % 3) * 100);
            card.innerHTML = `
                <div class="style-img-wrap">
                    <img src="${style.image}" alt="${style.name}" class="style-img" loading="lazy">
                    <div class="style-card-overlay"></div>
                </div>
                <div class="style-info">
                    <span class="subheading" style="font-size:0.7rem;margin-bottom:5px;">${style.category}</span>
                    <h3 class="style-name">${style.name}</h3>
                    <p class="style-desc-preview">${style.desc.substring(0, 85)}...</p>
                    <span class="style-meta-preview">Lihat Detail <i class="fa-solid fa-arrow-right"></i></span>
                </div>
            `;
            card.addEventListener('click', () => openHairstyleModal(style));
            slider.appendChild(card);
        });

        // Setup dots navigation
        const cardCount = hairstyles.length;
        const visibleCards = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const maxScrollIdx = cardCount - visibleCards + 1;

        if (maxScrollIdx > 1) {
            for (let i = 0; i < maxScrollIdx; i++) {
                const dot = document.createElement('div');
                dot.className = `insp-dot ${i === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    const cardWidth = slider.querySelector('.style-card').offsetWidth + 30; // Card width + gap
                    slider.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            }
        }

        // Slider Navigation Buttons
        prevBtn.addEventListener('click', () => {
            const cardWidth = slider.querySelector('.style-card').offsetWidth + 30;
            slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = slider.querySelector('.style-card').offsetWidth + 30;
            slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        // Sync dots on scroll
        slider.addEventListener('scroll', () => {
            const cardWidth = slider.querySelector('.style-card').offsetWidth + 30;
            const scrollIndex = Math.round(slider.scrollLeft / cardWidth);
            const dots = dotsContainer.querySelectorAll('.insp-dot');
            dots.forEach((dot, idx) => {
                if (idx === scrollIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        });
    }

    // Modal Control Functions
    function openHairstyleModal(style) {
        modalImg.src = style.image;
        modalImg.alt = style.name;
        modalCategory.textContent = style.category;
        modalTitle.textContent = style.name;
        modalDesc.textContent = style.desc;
        modalFace.textContent = style.face;
        modalMaintenance.textContent = style.maintenance;
        modalDuration.textContent = style.duration;
        
        // Build customized WhatsApp link for style booking
        const waText = encodeURIComponent(`Halo Cut O' Clock, saya tertarik dengan model rambut *${style.name}*. Bolehkah saya berkonsultasi untuk booking jadwal haircut?`);
        modalBookBtn.href = `https://wa.me/6281548946625?text=${waText}`;

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeHairstyleModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeHairstyleModal);
        modalOverlay.addEventListener('click', closeHairstyleModal);
        
        // Escape key to close modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeHairstyleModal();
            }
        });
    }


    /* --------------------------------------------------------------------------
       08. CUSTOMER TESTIMONIALS CAROUSEL
       -------------------------------------------------------------------------- */
    const tCarousel = document.getElementById('testimonials-carousel');
    const tPrevBtn = document.getElementById('testimonial-prev');
    const tNextBtn = document.getElementById('testimonial-next');
    const tDotsContainer = document.getElementById('testimonial-dots');

    if (tCarousel) {
        const cards = tCarousel.querySelectorAll('.testimonial-card');
        const cardCount = cards.length;
        let activeIdx = 0;
        let autoSlideTimer;

        // Generate indicators
        cards.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `testimonial-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoSlide();
            });
            tDotsContainer.appendChild(dot);
        });

        function goToSlide(idx) {
            activeIdx = idx;
            if (activeIdx < 0) activeIdx = cardCount - 1;
            if (activeIdx >= cardCount) activeIdx = 0;

            tCarousel.style.transform = `translateX(-${activeIdx * 100}%)`;

            // Sync dots
            const dots = tDotsContainer.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, dIdx) => {
                if (dIdx === activeIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        tPrevBtn.addEventListener('click', () => {
            goToSlide(activeIdx - 1);
            resetAutoSlide();
        });

        tNextBtn.addEventListener('click', () => {
            goToSlide(activeIdx + 1);
            resetAutoSlide();
        });

        // Swipe Auto sliding
        function startAutoSlide() {
            autoSlideTimer = setInterval(() => {
                goToSlide(activeIdx + 1);
            }, 6000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideTimer);
            startAutoSlide();
        }

        startAutoSlide();
    }


    /* --------------------------------------------------------------------------
       09. MASONRY GALLERY LIGHTBOX
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (lightbox) {
        let currentItemIdx = 0;

        function openLightbox(idx) {
            currentItemIdx = idx;
            const item = galleryItems[currentItemIdx];
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-hover span');

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCaption.textContent = caption.textContent;

            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        function navigateLightbox(dir) {
            let nextIdx = currentItemIdx + dir;
            if (nextIdx < 0) nextIdx = galleryItems.length - 1;
            if (nextIdx >= galleryItems.length) nextIdx = 0;
            openLightbox(nextIdx);
        }

        galleryItems.forEach((item, idx) => {
            item.addEventListener('click', () => openLightbox(idx));
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
        lightboxNext.addEventListener('click', () => navigateLightbox(1));

        // Keyboard navigation
        window.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }


    /* --------------------------------------------------------------------------
       10. CONTACT FORM TO WHATSAPP PARSER
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate inputs
            const name = document.getElementById('contact-name').value.trim();
            const phone = document.getElementById('contact-phone').value.trim();
            const date = document.getElementById('contact-date').value;
            const time = document.getElementById('contact-time').value;
            const service = document.getElementById('contact-service').value;
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !phone || !date) {
                alert('Silakan isi field Name, Phone Number, dan Preferred Date.');
                return;
            }

            // Formatting Date to localized string
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            // Build Message String
            let waMessage = `Halo Cut O' Clock Barbershop Semarang,\n\nSaya ingin membuat booking jadwal haircut:\n`;
            waMessage += `• *Nama*: ${name}\n`;
            waMessage += `• *No. WhatsApp*: ${phone}\n`;
            waMessage += `• *Tanggal*: ${formattedDate}\n`;
            if (time) waMessage += `• *Jam*: ${time} WIB\n`;
            if (service) waMessage += `• *Layanan*: ${service}\n`;
            if (message) waMessage += `• *Pesan Tambahan*: ${message}\n`;

            // Redirect to WhatsApp Link
            const waUrl = `https://wa.me/6281548946625?text=${encodeURIComponent(waMessage)}`;
            window.open(waUrl, '_blank');
        });
    }


    /* --------------------------------------------------------------------------
       11. FLOATING CONCIERGE WIDGET
       -------------------------------------------------------------------------- */
    const waConcierge = document.getElementById('wa-concierge');
    const conciergeCard = document.getElementById('concierge-card');
    const waFloatBtn = document.getElementById('wa-float-btn');
    const conciergeClose = document.getElementById('concierge-close');
    const waFloatBadge = document.getElementById('wa-float-badge');

    if (waConcierge) {
        // Toggle concierge popup
        waFloatBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isVisible = conciergeCard.style.display === 'flex';
            if (isVisible) {
                closeConcierge();
            } else {
                openConcierge();
            }
        });

        conciergeClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeConcierge();
            // Remember user closure choice for this session
            sessionStorage.setItem('wa-concierge-closed', 'true');
        });

        // Close concierge when clicking outside
        document.addEventListener('click', (e) => {
            if (conciergeCard.style.display === 'flex') {
                if (!conciergeCard.contains(e.target) && !waFloatBtn.contains(e.target)) {
                    closeConcierge();
                }
            }
        });

        function openConcierge() {
            conciergeCard.style.display = 'flex';
            waFloatBadge.style.display = 'none';
        }

        function closeConcierge() {
            conciergeCard.style.display = 'none';
        }
    }

    function initConciergeAutoPopup() {
        const isClosedBefore = sessionStorage.getItem('wa-concierge-closed');
        if (waConcierge && isClosedBefore !== 'true') {
            setTimeout(() => {
                if (conciergeCard.style.display !== 'flex') {
                    openConcierge();
                }
            }, 5000); // Popup after 5 seconds
        }
    }


    /* --------------------------------------------------------------------------
       12. BENCHCODE DEV FOOTER CONSTELLATION & EASTER EGG
       -------------------------------------------------------------------------- */
    const footerCanvas = document.getElementById('footer-canvas');
    if (footerCanvas) {
        const ctx = footerCanvas.getContext('2d');
        let stars = [];
        let fWidth = footerCanvas.width = footerCanvas.offsetWidth;
        let fHeight = footerCanvas.height = footerCanvas.offsetHeight;

        window.addEventListener('resize', () => {
            if (footerCanvas.offsetWidth && footerCanvas.offsetHeight) {
                fWidth = footerCanvas.width = footerCanvas.offsetWidth;
                fHeight = footerCanvas.height = footerCanvas.offsetHeight;
            }
        });

        class Star {
            constructor() {
                this.x = Math.random() * fWidth;
                this.y = Math.random() * fHeight;
                this.radius = Math.random() * 1.5;
                this.alpha = Math.random() * 0.5 + 0.3;
                this.speed = Math.random() * 0.02 + 0.005;
                this.growing = Math.random() > 0.5;
            }

            draw() {
                ctx.fillStyle = `rgba(200, 169, 106, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }

            update() {
                if (this.growing) {
                    this.alpha += this.speed;
                    if (this.alpha >= 0.8) this.growing = false;
                } else {
                    this.alpha -= this.speed;
                    if (this.alpha <= 0.2) this.growing = true;
                }
            }
        }

        function initStars() {
            stars = [];
            const count = Math.min(Math.floor(fWidth / 25), 40);
            for (let i = 0; i < count; i++) {
                stars.push(new Star());
            }
        }

        function animateConstellations() {
            ctx.clearRect(0, 0, fWidth, fHeight);

            // Draw links
            ctx.strokeStyle = 'rgba(200, 169, 106, 0.04)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            stars.forEach(s => {
                s.update();
                s.draw();
            });

            requestAnimationFrame(animateConstellations);
        }

        initStars();
        animateConstellations();
    }

    // Easter Egg Timer on Hovering Constellations/Footer Dev Area
    const devText = document.getElementById('footer-dev-text');
    if (devText) {
        let hoverTimer;

        devText.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(() => {
                const nameEl = devText.querySelector('.dev-name');
                if (nameEl) {
                    nameEl.style.color = '#fff';
                    nameEl.textContent = 'Designed & Engineered by BenchCode Dev 🚀';
                }
            }, 3000); // 3 seconds hover triggers easter egg
        });

        devText.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            const nameEl = devText.querySelector('.dev-name');
            if (nameEl) {
                nameEl.style.color = 'var(--luxury-gold)';
                nameEl.textContent = 'BenchCode Dev';
            }
        });
    }

});
