// JavaScript for LastFight RP website

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Tab Switcher
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    // Tab switching logic
    function switchTab(tabId) {
        // Deactivate all tabs and links
        tabContents.forEach(content => content.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        // Activate clicked tab
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Activate corresponding navigation links
        const correspondingLinks = document.querySelectorAll(`[data-tab="${tabId}"]`);
        correspondingLinks.forEach(link => link.classList.add('active'));

        // Scroll to top of content
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Close mobile nav drawer if open
        if (mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                switchTab(tabId);
                // Update URL hash
                history.pushState(null, null, href);
            }
        });
    });

    // Handle initial load with hash in URL
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const validTabs = ['home', 'lore', 'rules', 'connect'];
        if (validTabs.includes(hash)) {
            switchTab(hash);
        }
    }

    // Scroll trigger links (e.g. from buttons on homepage)
    document.querySelectorAll('.scroll-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const href = trigger.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const tabId = href.substring(1);
                switchTab(tabId);
                history.pushState(null, null, href);
            }
        });
    });

    // Mobile Menu Toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const isActive = mobileNav.classList.contains('active');
        mobileMenuToggle.innerHTML = isActive 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });


    // 2. Copy IP Address & Command Functionality
    const copyIpBtn = document.getElementById('copy-ip-btn');
    const ipAddressText = document.getElementById('ip-address');

    if (copyIpBtn && ipAddressText) {
        copyIpBtn.addEventListener('click', () => {
            const textToCopy = ipAddressText.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const originalIcon = copyIpBtn.innerHTML;
                copyIpBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
                copyIpBtn.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    copyIpBtn.innerHTML = originalIcon;
                    copyIpBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    const copyConsoleBtn = document.getElementById('copy-console-btn');
    const consoleCodeText = document.getElementById('console-code');

    if (copyConsoleBtn && consoleCodeText) {
        copyConsoleBtn.addEventListener('click', () => {
            const textToCopy = consoleCodeText.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Visual feedback
                const originalHTML = copyConsoleBtn.innerHTML;
                copyConsoleBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i> Zkopírováno!';
                copyConsoleBtn.style.borderColor = '#10b981';
                
                setTimeout(() => {
                    copyConsoleBtn.innerHTML = originalHTML;
                    copyConsoleBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }


    // 3. Interactive Lore Chapters Switcher
    const loreNavBtns = document.querySelectorAll('.lore-nav-btn');
    const loreChapters = document.querySelectorAll('.lore-chapter-text');

    loreNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const chapterId = btn.getAttribute('data-chapter');
            
            // Toggle active state in nav buttons
            loreNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle active state in chapter contents
            loreChapters.forEach(chap => {
                chap.classList.remove('active');
                if (chap.id === chapterId) {
                    chap.classList.add('active');
                }
            });
        });
    });


    // 4. Rules Accordion Toggle
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Optional: Close other items (if you want single-item opening)
            // document.querySelectorAll('.accordion-item').forEach(otherItem => {
            //     if (otherItem !== item) otherItem.classList.remove('active');
            // });

            item.classList.toggle('active');
        });
    });


    // 5. Rules Live Search Filter
    const rulesSearchInput = document.getElementById('rules-search');
    const clearSearchBtn = document.getElementById('clear-search-btn');
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (rulesSearchInput) {
        rulesSearchInput.addEventListener('input', () => {
            const query = rulesSearchInput.value.toLowerCase().trim();
            
            // Toggle clear button visibility
            if (query.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }

            accordionItems.forEach(item => {
                const searchTerms = item.getAttribute('data-search-terms').toLowerCase();
                const itemHeader = item.querySelector('.accordion-header').innerText.toLowerCase();
                
                // Get all rule details inside content
                const ruleDetails = item.querySelectorAll('.rule-detail');
                let matchesInside = false;

                ruleDetails.forEach(detail => {
                    const title = detail.querySelector('h4').innerText.toLowerCase();
                    const text = detail.querySelector('p').innerText.toLowerCase();
                    
                    if (title.includes(query) || text.includes(query)) {
                        detail.style.display = 'block';
                        matchesInside = true;
                    } else {
                        detail.style.display = 'none';
                    }
                });

                if (searchTerms.includes(query) || itemHeader.includes(query) || matchesInside) {
                    item.style.display = 'block';
                    // Automatically expand item if searching specifically and it matches
                    if (query.length > 1) {
                        item.classList.add('active');
                    }
                } else {
                    item.style.display = 'none';
                    item.classList.remove('active');
                }

                // If query is cleared, reset visibility of all nested rules
                if (query === '') {
                    ruleDetails.forEach(detail => detail.style.display = 'block');
                    item.classList.remove('active');
                }
            });
        });

        // Clear button action
        clearSearchBtn.addEventListener('click', () => {
            rulesSearchInput.value = '';
            clearSearchBtn.style.display = 'none';
            rulesSearchInput.focus();
            
            // Reset search state
            accordionItems.forEach(item => {
                item.style.display = 'block';
                item.classList.remove('active');
                const ruleDetails = item.querySelectorAll('.rule-detail');
                ruleDetails.forEach(detail => detail.style.display = 'block');
            });
        });
    }


    // 6. Interactive Canvas Background (Particles)
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust size on resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1; // small particles
            this.speedX = Math.random() * 0.4 - 0.2; // slow drift
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce off boundaries
            if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > height) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = `rgba(79, 209, 197, ${this.alpha})`; // primary cyan #4fd1c5
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
    }

    function init() {
        particlesArray = [];
        const numberOfParticles = Math.floor((width * height) / 15000); // density scale
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        const maxDistance = 120;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                const dx = particlesArray[a].x - particlesArray[b].x;
                const dy = particlesArray[a].y - particlesArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.15;
                    ctx.strokeStyle = `rgba(79, 209, 197, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particlesArray.forEach(particle => {
            particle.update();
            particle.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    init();
    animate();
});
