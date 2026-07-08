/* ==========================================================================
   Cut O' Clock Barbershop Website Javascript
   Interactions, Animations, Sliders, and Canvas Constellations
   Crafted by BenchCode Dev
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       01. PRELOADER
       -------------------------------------------------------------------------- */
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 800); // Allow shimmer to run and load smoothly
    });
    // Fallback in case load event takes too long
    setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
        }
    }, 3000);

    /* --------------------------------------------------------------------------
       02. STICKY NAVBAR & SCROLL PROGRESS INDICATOR
       -------------------------------------------------------------------------- */
    const header = document.getElementById('header');
    const progressBar = document.getElementById('scroll-progress');
    const heroBg = document.getElementById('hero-bg');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Sticky Header class toggle
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll progress percentage calculation
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Hero Background Parallax Effect
        if (heroBg && scrollTop < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrollTop * 0.4}px)`;
        }
    });

    /* --------------------------------------------------------------------------
       03. MOBILE NAVIGATION MENU
       -------------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-item');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const icon = mobileToggle.querySelector('i');
        if (navMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });

    // Active Navigation Item Highlighter on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    /* --------------------------------------------------------------------------
       04. CUSTOM CURSOR FOLLOWER
       -------------------------------------------------------------------------- */
    const cursorFollower = document.getElementById('cursor-follower');
    const cursorDot = document.getElementById('cursor-dot');
    const hoverableElements = document.querySelectorAll('a, button, input, textarea, select, .gallery-item, .slider-handle, .why-card');

    if (window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            // Instant dot placement
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            // Smooth lagged follower ring animation
            cursorFollower.animate({
                left: `${e.clientX}px`,
                top: `${e.clientY}px`
            }, { duration: 250, fill: 'forwards' });
        });

        hoverableElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.classList.add('cursor-hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.classList.remove('cursor-hovering');
            });
        });
    }

    /* --------------------------------------------------------------------------
       05. SCROLL REVEAL (FADE IN ON SCROLL)
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a small stagger delay if present
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                observer.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --------------------------------------------------------------------------
       06. ANIMATED COUNTER STATISTICS
       -------------------------------------------------------------------------- */
    const statsSection = document.querySelector('.why-us-text');
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const startCounters = () => {
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'), 10);
            const duration = 2000; // Counter runtime duration in ms
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    num.innerText = target + '+';
                    clearInterval(timer);
                } else {
                    num.innerText = current + '+';
                }
            }, stepTime);
        });
    };

    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            startCounters();
        }
    }, { threshold: 0.3 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    /* --------------------------------------------------------------------------
       07. BEFORE & AFTER IMAGE SLIDER
       -------------------------------------------------------------------------- */
    const baSlider = document.getElementById('ba-slider');
    const baHandle = document.getElementById('ba-handle');
    const afterImgContainer = document.getElementById('after-img-container');
    let sliderActive = false;

    const setSliderPosition = (clientX) => {
        const rect = baSlider.getBoundingClientRect();
        let offset = clientX - rect.left;
        let percentage = (offset / rect.width) * 100;
        
        // Boundaries restriction
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        
        afterImgContainer.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        baHandle.style.left = `${percentage}%`;
    };

    // Mouse Listeners
    baSlider.addEventListener('mousedown', (e) => {
        sliderActive = true;
        e.preventDefault();
        setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        sliderActive = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!sliderActive) return;
        setSliderPosition(e.clientX);
    });

    // Touch Listeners (Mobile compatibility)
    baSlider.addEventListener('touchstart', (e) => {
        sliderActive = true;
        setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        sliderActive = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!sliderActive) return;
        setSliderPosition(e.touches[0].clientX);
    });

    /* --------------------------------------------------------------------------
       08. MASONRY GALLERY & LIGHTBOX
       -------------------------------------------------------------------------- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentImgIndex = 0;
    const galleryImagesList = [];

    // Map images and captions
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-hover span').innerText;
        galleryImagesList.push({ src: img.src, alt: img.alt, caption: caption });
        
        item.addEventListener('click', () => {
            currentImgIndex = index;
            openLightbox(currentImgIndex);
        });
    });

    const openLightbox = (index) => {
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Lock scrolling
        updateLightboxContent(index);
    };

    const updateLightboxContent = (index) => {
        lightboxImg.src = galleryImagesList[index].src;
        lightboxImg.alt = galleryImagesList[index].alt;
        lightboxCaption.innerText = galleryImagesList[index].caption;
    };

    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    });

    lightboxPrev.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex - 1 + galleryImagesList.length) % galleryImagesList.length;
        updateLightboxContent(currentImgIndex);
    });

    lightboxNext.addEventListener('click', () => {
        currentImgIndex = (currentImgIndex + 1) % galleryImagesList.length;
        updateLightboxContent(currentImgIndex);
    });

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content-container')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Keypress navigation support
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') lightboxPrev.click();
            if (e.key === 'ArrowRight') lightboxNext.click();
            if (e.key === 'Escape') lightboxClose.click();
        }
    });

    /* --------------------------------------------------------------------------
       09. TESTIMONIAL REVIEWS SLIDER
       -------------------------------------------------------------------------- */
    const reviewSlides = document.querySelectorAll('.review-slide');
    const dotsContainer = document.getElementById('slider-dots');
    let activeSlideIndex = 0;
    let reviewTimer;

    // Generate testimonial indicators dynamically
    reviewSlides.forEach((slide, idx) => {
        const dot = document.createElement('div');
        dot.className = `dot ${idx === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            goToSlide(idx);
            resetReviewTimer();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const goToSlide = (index) => {
        reviewSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        reviewSlides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Apply transform scroll logic to slides list
        const sliderWrapper = document.getElementById('reviews-slider');
        sliderWrapper.style.transform = `translateX(-${index * 100}%)`;
        activeSlideIndex = index;
    };

    const nextSlide = () => {
        let nextIndex = (activeSlideIndex + 1) % reviewSlides.length;
        goToSlide(nextIndex);
    };

    const startReviewTimer = () => {
        reviewTimer = setInterval(nextSlide, 5000);
    };

    const resetReviewTimer = () => {
        clearInterval(reviewTimer);
        startReviewTimer();
    };

    startReviewTimer();

    /* --------------------------------------------------------------------------
       10. HERO CURSOR SPOTLIGHT EFFECT
       -------------------------------------------------------------------------- */
    const heroSection = document.getElementById('home');
    const heroSpotlight = document.getElementById('hero-spotlight');

    if (heroSection && heroSpotlight) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroSpotlight.style.background = `radial-gradient(circle 350px at ${x}px ${y}px, rgba(200, 163, 95, 0.08), transparent 80%)`;
        });
    }

    /* --------------------------------------------------------------------------
       11. SCROLL TO TOP BUTTON
       -------------------------------------------------------------------------- */
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    /* --------------------------------------------------------------------------
       12. FLOATING WHATSAPP CONCIERGE WIDGET
       -------------------------------------------------------------------------- */
    const waConcierge = document.getElementById('wa-concierge');
    const conciergeClose = document.getElementById('concierge-close');

    // Trigger concierge widget after 5 seconds delay
    setTimeout(() => {
        // Only show if user hasn't closed it yet in this session
        if (!sessionStorage.getItem('wa-concierge-closed')) {
            waConcierge.classList.add('visible');
        }
    }, 5000);

    conciergeClose.addEventListener('click', () => {
        waConcierge.classList.remove('visible');
        sessionStorage.setItem('wa-concierge-closed', 'true');
    });

    /* --------------------------------------------------------------------------
       13. CONSTELLATION CANVAS DRAWING (FOOTER BACKGROUND)
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('constellation-canvas');
    const footerSection = document.getElementById('luxury-footer');
    
    if (canvas && footerSection) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let numStars = 40;
        let connectionDistance = 110;

        const resizeCanvas = () => {
            canvas.width = footerSection.offsetWidth;
            canvas.height = footerSection.offsetHeight;
        };

        class Star {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.25;
                this.vy = (Math.random() - 0.5) * 0.25;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Rebound off canvas boundaries
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 163, 95, 0.45)';
                ctx.fill();
            }
        }

        const initStars = () => {
            stars = [];
            resizeCanvas();
            // Adapt stars count to canvas width
            if (canvas.width < 768) {
                numStars = 20;
                connectionDistance = 80;
            } else {
                numStars = 40;
                connectionDistance = 110;
            }

            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(200, 163, 95, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        };

        const animateConstellation = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            drawConnections();
            requestAnimationFrame(animateConstellation);
        };

        // Initialize and listen to resize
        initStars();
        animateConstellation();
        window.addEventListener('resize', () => {
            resizeCanvas();
            initStars();
        });
    }

    /* --------------------------------------------------------------------------
       14. BENCHCODE DEV EASTER EGG (3 SECONDS HOVER)
       -------------------------------------------------------------------------- */
    const devSignatureArea = document.getElementById('dev-signature-area');
    let signatureHoverTimer;

    if (devSignatureArea) {
        devSignatureArea.addEventListener('mouseenter', () => {
            signatureHoverTimer = setTimeout(() => {
                devSignatureArea.classList.add('reveal-egg');
            }, 3000); // 3 seconds trigger
        });

        devSignatureArea.addEventListener('mouseleave', () => {
            clearTimeout(signatureHoverTimer);
            devSignatureArea.classList.remove('reveal-egg');
        });
    }

    /* --------------------------------------------------------------------------
       15. APPOINTMENT FORM SUBMISSION -> WHATSAPP LINK REDIRECT
       -------------------------------------------------------------------------- */
    const appointmentForm = document.getElementById('appointment-form');

    if (appointmentForm) {
        // Set default minimum date to today
        const dateInput = document.getElementById('form-date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;

        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const date = document.getElementById('form-date').value;
            const message = document.getElementById('form-message').value.trim();
            
            // Format custom date string
            const formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Construct WhatsApp Text Message
            const whatsappText = `Hello Cut O' Clock! 👋\n\nI would like to book a grooming appointment:\n\n*Name:* ${name}\n*WhatsApp Number:* ${phone}\n*Preferred Date:* ${formattedDate}\n*Grooming Info / Special Instructions:* ${message || '-'}\n\nPlease confirm availability. Thank you!`;
            
            // Encode message components for URL redirection
            const encodedText = encodeURIComponent(whatsappText);
            const whatsappURL = `https://wa.me/6281548946625?text=${encodedText}`;
            
            // Open WA in a new tab
            window.open(whatsappURL, '_blank');
        });
    }

    /* --------------------------------------------------------------------------
       16. HERO FLOATING PARTICLES
       -------------------------------------------------------------------------- */
    const heroParticlesContainer = document.getElementById('hero-particles');
    if (heroParticlesContainer) {
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            particle.className = 'gold-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 80 + 10}%`; // Keep within vertical bounds
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${Math.random() * 12 + 8}s`;
            heroParticlesContainer.appendChild(particle);
        }
    }

});
