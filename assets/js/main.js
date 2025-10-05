// FemiNova Website JavaScript
// Handles affirmation fetching, team rendering, search, accordions, and UI interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality when DOM is ready
    loadAffirmation();
    renderTeam();
    initAccordion();
    initSmoothScrolling();
    initScrollAnimations();
    initNavbarAnimation();
    initDynamicCounter();
    initHorizontalScroll();
    createSearchModal(); // Initialize search modal
});

// Loading screen management
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Minimum loading time for better UX (2 seconds)
        const minLoadingTime = 2000;
        const startTime = Date.now();

        // Function to hide loading screen
        const hideLoadingScreen = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            setTimeout(() => {
                // Add hide animation class
                loadingScreen.classList.add('loading-screen-hide');

                // Remove from DOM after animation completes (1.5 seconds)
                setTimeout(() => {
                    loadingScreen.remove();
                }, 1500);
            }, remainingTime);
        };

        // Start hiding process
        hideLoadingScreen();
    }
});

// Team data - edit this array to update team members
const team = [
    'Nianga, Reinna Flor P.|reinnaflorpepitonianga@gmail.com',
    'Marquiso, Rean Alexa B.|mreanalexa@gmail.com',
    'Abanggan, Eljann R.|eljannabanggan1@gmail.com',
    'Arañez, Jethro T.|Akositroy17@gmail.com',
    'Cagna-an, Aian Rey B.|aianrey577@gmail.com',
    'Mamaran, Chester Ivan B.|navirethsehc@gmail.com',
    'Moniset, Rj Angelo M.|rjangelomoniset1@gmail.com',
    'Pilar, Kent Dave R.|kentdavepilar341@gmail.com',
    'Reloj, Lurense V.|lurensereloj@gmail.com',
    'Resma, Kurt Dave B.|resmakurt63@gmail.com',
    'Wasquin, Christine Mae A.|christinemaewasquin@gmail.com'
];

// Affirmation of the Day functionality
async function loadAffirmation() {
    const affirmationElement = document.getElementById('affirmationText');
    
    try {
        const response = await fetch('https://www.affirmations.dev/');
        const data = await response.json();
        
        if (data && data.affirmation) {
            affirmationElement.textContent = `"${data.affirmation}"`;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        // Fallback affirmations when API is unavailable
        const fallbackAffirmations = [
            "You are capable of amazing things.",
            "Your voice matters and deserves to be heard.",
            "You have the strength to overcome any challenge.",
            "You are worthy of love, respect, and success.",
            "Your dreams are valid and achievable.",
            "You are making a positive difference in the world.",
            "You have the power to create the change you want to see.",
            "You are resilient, brave, and unstoppable."
        ];
        
        const randomAffirmation = fallbackAffirmations[Math.floor(Math.random() * fallbackAffirmations.length)];
        affirmationElement.textContent = `"${randomAffirmation}"`;
    }
}

// Mobile menu panel toggle (for the mobile navbar added in index.html)
(function initMobileNavToggle() {
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobileMenuBtn');
        const panel = document.getElementById('mobileMenuPanel');
        const icon = document.getElementById('mobileMenuIcon');

        if (!btn || !panel || !icon) return;

        function openPanel() {
            // set a max-height large enough to fit items; uses scrollHeight for smoothness
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.classList.add('open');
            // replace hamburger with X icon
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
            btn.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            panel.style.maxHeight = '0';
            panel.classList.remove('open');
            // restore hamburger icon
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
            btn.setAttribute('aria-expanded', 'false');
        }

        function toggle() {
            if (panel.classList.contains('open')) closePanel(); else openPanel();
        }

        // Make closePanel globally available for onclick handlers
        window.closeMobileMenu = closePanel;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggle();
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.classList.contains('open')) return;
            const withinPanel = panel.contains(e.target) || btn.contains(e.target);
            if (!withinPanel) closePanel();
        });

        // Close panel when resizing to md and above
        window.addEventListener('resize', () => {
            try {
                if (window.innerWidth >= 768) {
                    closePanel();
                }
            } catch (e) {}
        });
    });
})();

// Team rendering functionality
function renderTeam() {
    const teamContainer = document.getElementById('teamContainer');
    if (!teamContainer) return;
    
    teamContainer.innerHTML = team.map(member => {
        const [name, email] = member.split('|');
        const initials = name.split(' ').map(part => part[0]).join('').substring(0, 2);
        
        return `
            <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow reveal">
                <div class="text-center">
                    <div class="w-20 h-20 bg-pink-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                        ${initials}
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${name}</h3>
                    <a href="mailto:${email}" class="text-pink-600 hover:text-pink-800 transition-colors text-sm">
                        ${email}
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// Scroll reveal using IntersectionObserver
function initScrollAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // debug: log visibility changes
            try { console.debug('scroll-reveal:', entry.target, 'isIntersecting=', entry.isIntersecting); } catch (e) {}
            if (entry.isIntersecting) {
                const target = entry.target;

                // If the element is a stagger container, reveal its children with delays
                if (target.classList && target.classList.contains('reveal-stagger')) {
                    const children = Array.from(target.children || []);
                    children.forEach((child, i) => {
                        setTimeout(() => child.classList.add('revealed'), i * 80);
                    });
                } else {
                    target.classList.add('revealed');
                }

                // Unobserve default elements to avoid repeated work
                try { observer.unobserve(target); } catch (e) {}
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.06
    });

    // Delay observing a tick to allow layout to stabilize (helps when content is injected)
    setTimeout(() => {
        const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-stagger');
        els.forEach(el => {
            // If reveal-stagger, observe the container; observer will stagger children
            observer.observe(el);
            try { console.debug('scroll-reveal: observing', el); } catch (e) {}
        });
    }, 50);
}

// Navbar scroll animation
function initNavbarAnimation() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const desktopNav = document.querySelector('.navbar-elegant');
    const mobileNav = document.querySelector('.mobile-nav');

    let lastScrollY = window.scrollY;
    let isVisible = true;

    // Set initial state for desktop nav
    if (desktopNav) {
        desktopNav.classList.add('navbar-visible');
        desktopNav.classList.add('navbar-initial');
    }

    // Set initial state for mobile nav
    if (mobileNav) {
        mobileNav.classList.add('mobile-nav-visible');
    }

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 50;

        // Handle desktop navbar (only on larger screens)
        if (desktopNav && window.innerWidth >= 768) {
            // Handle navbar visibility (hide/show on scroll)
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling down - hide navbar
                if (isVisible) {
                    desktopNav.classList.add('navbar-hidden');
                    desktopNav.classList.remove('navbar-visible');
                    isVisible = false;
                }
            } else {
                // Scrolling up or at top - show navbar
                if (!isVisible) {
                    desktopNav.classList.add('navbar-visible');
                    desktopNav.classList.remove('navbar-hidden');
                    isVisible = true;
                }
            }

            // Handle background opacity change
            if (currentScrollY > scrollThreshold) {
                desktopNav.classList.remove('navbar-initial');
                desktopNav.classList.add('navbar-scrolled');
            } else {
                desktopNav.classList.remove('navbar-scrolled');
                desktopNav.classList.add('navbar-initial');
            }
        }

        // Handle mobile navbar (only on small screens)
        if (mobileNav && window.innerWidth < 768) {
            if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
                // Scrolling down - hide navbar
                if (isVisible) {
                    mobileNav.classList.add('mobile-nav-hidden');
                    mobileNav.classList.remove('mobile-nav-visible');
                    isVisible = false;
                }
            } else {
                // Scrolling up or at top - show navbar
                if (!isVisible) {
                    mobileNav.classList.add('mobile-nav-visible');
                    mobileNav.classList.remove('mobile-nav-hidden');
                    isVisible = true;
                }
            }
        }

        lastScrollY = currentScrollY;
    }

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Handle window resize to switch between desktop and mobile behavior
    window.addEventListener('resize', function() {
        // Reset visibility state on resize
        isVisible = true;
        if (desktopNav) {
            desktopNav.classList.remove('navbar-hidden', 'navbar-scrolled');
            desktopNav.classList.add('navbar-visible', 'navbar-initial');
        }
        if (mobileNav) {
            mobileNav.classList.remove('mobile-nav-hidden');
            mobileNav.classList.add('mobile-nav-visible');
        }
        updateNavbar(); // Update immediately on resize
    });

    // Initial call
    updateNavbar();
}

// Search functionality
// Comprehensive search index for all website content
const searchIndex = [
    // Homepage content
    {
        title: "FemiNova - Home",
        content: "FemiNova empowering women's voices against gender-based violence karahasan domestic abuse violence against women support help resources Philippines",
        url: "index.html",
        section: "home",
        type: "page"
    },
    {
        title: "About FemiNova",
        content: "About us mission vision FemiNova organization dedicated to empowering women survivors of gender-based violence karahasan domestic violence abuse support advocacy Philippines",
        url: "index.html#about",
        section: "about",
        type: "section"
    },
    {
        title: "Team Members",
        content: "Team members staff volunteers FemiNova organization leaders advocates for women's rights gender equality violence prevention karahasan support",
        url: "index.html#team",
        section: "team",
        type: "section"
    },
    {
        title: "Mga Adhilain - Campaigns",
        content: "Campaigns awareness education gender-based violence karahasan domestic abuse prevention advocacy Philippines women's rights empowerment",
        url: "campaigns.html",
        section: "campaigns",
        type: "page"
    },
    {
        title: "Ano nga ba ang karahasan?",
        content: "What is violence karahasan gender-based violence domestic violence abuse types forms physical emotional psychological sexual violence against women Philippines",
        url: "campaigns.html#campaign1",
        section: "campaign1",
        type: "campaign"
    },
    {
        title: "Know your rights",
        content: "Legal rights protection Republic Act 9262 anti-violence against women law legal protection domestic violence abuse rights Philippines justice legal aid",
        url: "campaigns.html#campaign2",
        section: "campaign2",
        type: "campaign"
    },
    {
        title: "Myths vs Facts",
        content: "Myths facts misconceptions gender-based violence karahasan domestic abuse stereotypes false beliefs education awareness Philippines women's rights",
        url: "campaigns.html#campaign3",
        section: "campaign3",
        type: "campaign"
    },
    {
        title: "Kwentong Survivor",
        content: "Survivor stories testimonials courage resilience hope inspiration gender-based violence karahasan domestic abuse recovery healing Philippines",
        url: "campaigns.html#campaign4",
        section: "campaign4",
        type: "campaign"
    },
    {
        title: "Get free professional consultation",
        content: "Professional help counseling support services crisis intervention domestic violence abuse survivors help hotline counseling therapy Philippines",
        url: "campaigns.html#campaign5",
        section: "campaign5",
        type: "campaign"
    },
    {
        title: "Paano magvolunteer, donate, advocate",
        content: "Volunteer donate advocate support FemiNova organization contribute help survivors gender-based violence karahasan domestic abuse prevention Philippines",
        url: "campaigns.html#campaign6",
        section: "campaign6",
        type: "campaign"
    },
    {
        title: "Emergency Help",
        content: "Emergency crisis help immediate assistance danger violence abuse domestic violence karahasan urgent help support Philippines emergency services",
        url: "index.html#help",
        section: "help",
        type: "section"
    },
    {
        title: "Contact Us",
        content: "Contact information reach out FemiNova organization support questions inquiries gender-based violence karahasan domestic abuse help Philippines",
        url: "index.html#contact",
        section: "contact",
        type: "section"
    },
    {
        title: "Daily Affirmation",
        content: "Daily affirmation positive messages empowerment strength courage women survivors gender-based violence karahasan domestic abuse healing recovery",
        url: "index.html#home",
        section: "affirmation",
        type: "feature"
    }
];

// Search results modal
function createSearchModal() {
    const modal = document.createElement('div');
    modal.id = 'searchModal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 hidden animate-fade-in';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden transform transition-all duration-300 scale-95 animate-scale-in">
            <!-- Elegant Header with Gradient -->
            <div class="relative bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 p-8 text-white">
                <div class="absolute inset-0 bg-gradient-to-r from-pink-500/90 via-pink-600/90 to-purple-600/90 backdrop-blur-sm"></div>
                <div class="relative flex justify-between items-center">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-2xl font-bold">Search Results</h2>
                            <p class="text-pink-100 text-sm">Discover what you're looking for</p>
                        </div>
                    </div>
                    <button onclick="closeSearchModal()" class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200 backdrop-blur-sm group">
                        <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Results Container with Elegant Styling -->
            <div id="searchResults" class="p-8 overflow-y-auto max-h-96 bg-gradient-to-b from-gray-50/50 to-white">
                <!-- Results will be inserted here -->
            </div>
        </div>
    `;

    // Add custom CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scale-in {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s ease-out;
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out;
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(modal);
    return modal;
}

function showSearchModal() {
    let modal = document.getElementById('searchModal');
    if (!modal) {
        modal = createSearchModal();
    }
    modal.classList.remove('hidden');
}

function closeSearchModal() {
    const modal = document.getElementById('searchModal');
    if (modal) {
        // Add closing animation
        const modalContent = modal.querySelector('div');
        modalContent.classList.add('scale-95', 'opacity-0');
        modal.classList.add('opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('opacity-0');
            // Reset modal content for next open
            modalContent.classList.remove('scale-95', 'opacity-0');
        }, 300);
    }
}

// Search algorithm with relevance scoring
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        alert('Please enter a search term');
        return;
    }

    // Perform comprehensive search
    const results = searchContent(query);

    if (results.length === 0) {
        showSearchModal();
        document.getElementById('searchResults').innerHTML = `
            <div class="text-center py-8">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-600 mb-2">No results found</h3>
                <p class="text-gray-500">Try searching for: campaigns, team, about, contact, violence, help, rights</p>
            </div>
        `;
    } else {
        displaySearchResults(results, query);
    }

    searchInput.value = '';
}

function searchContent(query) {
    const results = [];
    const queryWords = query.split(' ').filter(word => word.length > 0);

    searchIndex.forEach(item => {
        let relevanceScore = 0;
        const content = item.content.toLowerCase();
        const title = item.title.toLowerCase();

        // Check for exact phrase match (highest relevance)
        if (content.includes(query)) {
            relevanceScore += 100;
        }
        if (title.includes(query)) {
            relevanceScore += 50;
        }

        // Check for individual word matches
        queryWords.forEach(word => {
            if (word.length < 2) return; // Skip very short words

            // Title matches are more important
            const titleMatches = (title.match(new RegExp(word, 'g')) || []).length;
            relevanceScore += titleMatches * 20;

            // Content matches
            const contentMatches = (content.match(new RegExp(word, 'g')) || []).length;
            relevanceScore += contentMatches * 10;

            // Bonus for word at start of title
            if (title.startsWith(word)) {
                relevanceScore += 15;
            }
        });

        if (relevanceScore > 0) {
            results.push({
                ...item,
                relevanceScore,
                matchedWords: queryWords.filter(word =>
                    content.includes(word) || title.includes(word)
                )
            });
        }
    });

    // Sort by relevance score (highest first)
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

function displaySearchResults(results, query) {
    showSearchModal();

    const resultsContainer = document.getElementById('searchResults');
    const resultsHtml = results.map((result, index) => {
        const highlightedTitle = highlightMatches(result.title, query);
        const snippet = createSnippet(result.content, query);

        let typeIcon = '';
        let typeColor = '';
        let gradientBg = '';
        let iconBg = '';

        switch (result.type) {
            case 'page':
                typeIcon = '📄';
                typeColor = 'bg-blue-100 text-blue-800 border-blue-200';
                gradientBg = 'from-blue-50 to-blue-100/50';
                iconBg = 'bg-blue-500';
                break;
            case 'section':
                typeIcon = '📋';
                typeColor = 'bg-green-100 text-green-800 border-green-200';
                gradientBg = 'from-green-50 to-green-100/50';
                iconBg = 'bg-green-500';
                break;
            case 'campaign':
                typeIcon = '🎯';
                typeColor = 'bg-purple-100 text-purple-800 border-purple-200';
                gradientBg = 'from-purple-50 to-purple-100/50';
                iconBg = 'bg-purple-500';
                break;
            case 'feature':
                typeIcon = '⭐';
                typeColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                gradientBg = 'from-yellow-50 to-yellow-100/50';
                iconBg = 'bg-yellow-500';
                break;
            default:
                typeIcon = '📄';
                typeColor = 'bg-gray-100 text-gray-800 border-gray-200';
                gradientBg = 'from-gray-50 to-gray-100/50';
                iconBg = 'bg-gray-500';
        }

        return `
            <div class="mb-4 animate-fade-in" style="animation-delay: ${index * 0.1}s; animation-fill-mode: both;">
                <a href="${result.url}" class="block group" onclick="closeSearchModal()">
                    <div class="bg-gradient-to-r ${gradientBg} rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] backdrop-blur-sm">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-4 flex-1">
                                <div class="w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <span class="text-white text-lg">${typeIcon}</span>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors duration-300">${highlightedTitle}</h3>
                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${typeColor} border shadow-sm">
                                        ${result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                                    </span>
                                </div>
                            </div>
                            <div class="flex-shrink-0 ml-4">
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>

                        <p class="text-gray-700 text-sm leading-relaxed mb-4 pl-16">${snippet}</p>

                        <div class="flex items-center justify-between pl-16">
                            <div class="flex items-center text-xs text-gray-500 bg-white/60 rounded-lg px-3 py-1">
                                <svg class="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                                </svg>
                                ${result.url}
                            </div>
                            <div class="text-xs text-pink-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Click to visit →
                            </div>
                        </div>
                    </div>
                </a>
            </div>
        `;
    }).join('');

    const noResultsHtml = `
        <div class="text-center py-12 animate-fade-in">
            <div class="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg class="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">No results found</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">We couldn't find anything matching your search. Try different keywords or check your spelling.</p>
            <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-pink-100">
                <p class="text-sm text-gray-700 font-medium mb-2">Popular searches:</p>
                <div class="flex flex-wrap gap-2 justify-center">
                    <span class="px-3 py-1 bg-white rounded-full text-xs text-pink-700 border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors">violence</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs text-pink-700 border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors">rights</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs text-pink-700 border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors">help</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs text-pink-700 border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors">campaigns</span>
                    <span class="px-3 py-1 bg-white rounded-full text-xs text-pink-700 border border-pink-200 hover:bg-pink-50 cursor-pointer transition-colors">support</span>
                </div>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = results.length === 0 ? noResultsHtml : `
        <div class="mb-6 text-center animate-fade-in">
            <div class="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-white/50">
                <svg class="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm font-semibold text-gray-700">
                    Found ${results.length} result${results.length !== 1 ? 's' : ''} for "<span class="text-pink-600">${query}</span>"
                </span>
            </div>
        </div>
        ${resultsHtml}
    `;
}

function highlightMatches(text, query) {
    const words = query.split(' ').filter(word => word.length > 0);
    let highlightedText = text;

    words.forEach(word => {
        const regex = new RegExp(`(${word})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-gradient-to-r from-pink-200 to-purple-200 text-pink-900 px-2 py-0.5 rounded-md font-semibold shadow-sm">$1</mark>');
    });

    return highlightedText;
}

function createSnippet(content, query) {
    const words = query.split(' ').filter(word => word.length > 0);
    const contentLower = content.toLowerCase();

    // Find the first occurrence of any query word
    let bestIndex = -1;
    words.forEach(word => {
        const index = contentLower.indexOf(word.toLowerCase());
        if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
            bestIndex = index;
        }
    });

    if (bestIndex === -1) return content.substring(0, 150) + '...';

    // Extract snippet around the match
    const start = Math.max(0, bestIndex - 75);
    const end = Math.min(content.length, bestIndex + 75);
    let snippet = content.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return highlightMatches(snippet, query);
}

// Allow search on Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'searchInput') {
        performSearch();
    }
});

// Flip card functionality for Myths vs Facts
function flipCard(card) {
    card.classList.toggle('flipped');
}

// Accordion functionality for campaigns page
function initAccordion() {
    // Set up accordion animations
    const campaignContents = document.querySelectorAll('.campaign-content');
    campaignContents.forEach(content => {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
    });
}

function toggleCampaign(campaignId) {
    const content = document.getElementById(campaignId);
    const icon = document.getElementById(`${campaignId}-icon`);
    
    if (!content || !icon) return;
    
    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
    
    if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// New accordion functionality for campaign cards
function toggleCampaignCard(campaignId) {
    const content = document.getElementById(campaignId);
    const icon = document.getElementById(`${campaignId}-icon`);
    const textElement = document.getElementById(`${campaignId}-text`);

    if (!content || !icon) return;

    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';

    // Close all other accordions first
    for (let i = 1; i <= 6; i++) {
        const otherCampaignId = `campaign${i}`;
        if (otherCampaignId !== campaignId) {
            const otherContent = document.getElementById(otherCampaignId);
            const otherIcon = document.getElementById(`${otherCampaignId}-icon`);
            const otherTextElement = document.getElementById(`${otherCampaignId}-text`);
            if (otherContent && otherIcon) {
                otherContent.style.maxHeight = '0';
                otherIcon.style.transform = 'rotate(0deg)';
                if (otherTextElement) {
                    otherTextElement.textContent = 'Click to expand';
                }
            }
        }
    }

    if (isExpanded) {
        // Collapse the clicked accordion
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
        if (textElement) {
            textElement.textContent = 'Click to expand';
        }
    } else {
        // Expand the clicked accordion
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        if (textElement) {
            textElement.textContent = 'Click to shrink';
        }
    }
}

// Modal functionality
function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function showSignup() {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.getElementById('loginModal').classList.remove('flex');
    document.getElementById('signupModal').classList.add('hidden');
    document.getElementById('signupModal').classList.remove('flex');
    document.body.style.overflow = 'auto';
}

function showSignupFromLogin() {
    closeModal();
    setTimeout(showSignup, 100);
}

function showLoginFromSignup() {
    closeModal();
    setTimeout(showLogin, 100);
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const menuItems = document.querySelectorAll('.mobile-menu-item');

    // Toggle hamburger icon animation
    hamburgerIcon.classList.toggle('active');

    // Toggle mobile menu animation
    mobileMenu.classList.toggle('active');

    // Handle menu items stagger animation
    if (mobileMenu.classList.contains('active')) {
        // Menu is opening - add active class to items with delay
        menuItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('active');
            }, index * 50);
        });
    } else {
        // Menu is closing - remove active class immediately
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
    }
}

// Form handlers (demo functionality)
function handleContactSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Demo handler - in production, this would send to a backend
    alert(`Thank you, ${name}! Your message has been received. We'll get back to you at ${email} soon.`);
    
    // Reset form
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    
    // Demo handler - in production, this would authenticate with backend
    alert(`Login successful! Welcome back, ${email}`);
    closeModal();
    event.target.reset();
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    
    // Demo handler - in production, this would create account via backend
    alert(`Welcome to FemiNova, ${name}! Your account has been created with email: ${email}`);
    closeModal();
    event.target.reset();
}

function handleDonation() {
    showDonationModal();
}

function handleVolunteer() {
    showVolunteerModal();
}

function handleShare() {
    const shareText = "Join FemiNova in the fight against gender-based violence! Together we can create positive change for women everywhere. #FemiNova #EndGBV";
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        // Use native Web Share API if available
        navigator.share({
            title: 'FemiNova - Empowering Women Against Violence',
            text: shareText,
            url: shareUrl
        }).catch(console.error);
    } else {
        // Fallback: copy to clipboard or open share dialog
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                alert('Share link copied to clipboard! Share it on your favorite social media platform.');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = `${shareText} ${shareUrl}`;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Share link copied to clipboard! Share it on your favorite social media platform.');
            });
        } else {
            // Basic fallback
            alert('Share this message: ' + shareText + ' ' + shareUrl);
        }
    }
}

// Modal functions
function showDonationModal() {
    const modal = document.getElementById('donationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    initDonationModal();
}

function showVolunteerModal() {
    const modal = document.getElementById('volunteerModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function showHelpConfirmationModal() {
    const modal = document.getElementById('helpConfirmationModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modals = document.querySelectorAll('[id$="Modal"]');
    modals.forEach(modal => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });
    document.body.style.overflow = 'auto';
}

// Donation form handlers
function selectAmount(amount) {
    document.getElementById('customAmount').value = amount;
    updatePaymentAmounts(amount);
    // Remove selected class from all buttons
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.classList.remove('border-pink-600', 'bg-pink-50');
        btn.classList.add('border-pink-200');
    });
    // Add selected class to clicked button
    event.target.classList.remove('border-pink-200');
    event.target.classList.add('border-pink-600', 'bg-pink-50');
}

function selectPaymentMethod(method) {
    // Hide all payment forms
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
    });

    // Remove selected class from all payment method buttons
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('border-pink-400', 'bg-pink-50');
        btn.classList.add('border-gray-200');
    });

    // Show selected payment form and highlight button
    document.getElementById(method + '-form').classList.remove('hidden');
    document.getElementById(method + '-method').classList.remove('border-gray-200');
    document.getElementById(method + '-method').classList.add('border-pink-400', 'bg-pink-50');

    // Update amounts in payment forms
    const amount = document.getElementById('customAmount').value || 0;
    updatePaymentAmounts(amount);
}

function updatePaymentAmounts(amount) {
    // Update amounts in all payment method displays
    const amountElements = ['gcash-amount', 'bank-amount'];
    amountElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = amount || '0';
        }
    });
}

// Initialize donation modal when shown
function initDonationModal() {
    // Add event listener to custom amount input
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            updatePaymentAmounts(this.value);
        });
    }

    // Reset payment method selection
    document.querySelectorAll('.payment-form').forEach(form => {
        form.classList.add('hidden');
    });
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('border-pink-400', 'bg-pink-50');
        btn.classList.add('border-gray-200');
    });
}

function handleDonationSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const phone = document.getElementById('donorPhone').value;
    const amount = document.getElementById('customAmount').value;
    const anonymous = document.getElementById('anonymous').checked;

    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    // Demo success message
    const displayName = anonymous ? 'Anonymous Donor' : name;
    alert(`Thank you ${displayName} for your generous donation of ₱${amount}! We will send a confirmation email to ${email} shortly.`);

    closeModal();
    event.target.reset();
}

// Volunteer form handler
function handleVolunteerSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('volunteerName').value;
    const email = document.getElementById('volunteerEmail').value;
    const phone = document.getElementById('volunteerPhone').value;
    const availability = document.getElementById('availability').value;
    const message = document.getElementById('volunteerMessage').value;

    const interests = Array.from(document.querySelectorAll('input[name="interests"]:checked')).map(cb => cb.value);

    if (interests.length === 0) {
        alert('Please select at least one area of interest.');
        return;
    }

    // Demo success message
    alert(`Thank you ${name} for your interest in volunteering! We will review your application and contact you at ${email} within 3-5 business days.`);

    closeModal();
    event.target.reset();
}

// Help/Emergency form handler
function handleHelpSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('helpName').value;
    const phone = document.getElementById('helpPhone').value;
    const address = document.getElementById('helpAddress').value;
    const situation = document.getElementById('helpSituation').value;

    // Validate required fields
    if (!name.trim() || !phone.trim() || !address.trim() || !situation.trim()) {
        alert('Please fill in all required fields. Your safety is our priority.');
        return;
    }

    // Emergency contact information
    const emergencyMessage = `
EMERGENCY ASSISTANCE REQUEST
Name: ${name}
Phone: ${phone}
Address: ${address}
Situation: ${situation}

This is an urgent request for help. Please respond immediately.
Time: ${new Date().toLocaleString()}
    `.trim();

    // In a real implementation, this would send to emergency services
    // For demo purposes, show confirmation modal
    console.log('Emergency Alert:', emergencyMessage); // Log for debugging

    // Reset form and show confirmation modal
    event.target.reset();
    showHelpConfirmationModal();
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (e.target === loginModal || e.target === signupModal) {
        closeModal();
    }
});

// Close modals with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Dynamic Counter for Women Impacted
function initDynamicCounter() {
    const counterElement = document.querySelector('[data-counter="women-impacted"]');
    if (!counterElement) return;

    // Date-based counter initialization
    // Reference launch date (fixed) - Set to past date so counter shows meaningful numbers
    const launchDate = new Date('2025-09-01T00:00:00'); // September 1, 2025 (past date)
    
    // Calculate value purely from launch date with fixed subtraction for thousands display
    function calculateBaseValue() {
        const now = new Date();
        const secondsSinceLaunch = Math.max(0, (now - launchDate) / 1000);
        // Fixed subtraction to bring into thousands range
        const adjustedValue = Math.floor(secondsSinceLaunch) - 2000000; // Fixed subtraction of 2M
        return Math.max(0, adjustedValue); // Ensure never negative
    }

    let currentImpacted = calculateBaseValue();

    // State for expanded view
    let isExpanded = false;

    // Format number with K/M abbreviations or full numbers
    function formatNumber(num, forceExpanded = false) {
        if (isExpanded || forceExpanded) {
            return num.toLocaleString(); // Full number with commas
        }
        
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // 1.2M
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'; // 1.2K
        }
        return num.toString();
    }

    // Enhanced scrolling animation with more visible effects
    function animateCounter(from, to, duration = 1200) {
        const start = Date.now();
        const fromNum = typeof from === 'number' ? from : parseFloat(from.replace(/[K+,]/g, '')) * (from.includes('K+') ? 1000 : 1);
        const toNum = typeof to === 'number' ? to : parseFloat(to.replace(/[K+,]/g, '')) * (to.includes('K+') ? 1000 : 1);
        const parent = counterElement.closest('.bg-white\\/10');

        // Add updating class for visual effects
        parent.classList.add('counter-enhanced', 'updating');

        // Create digit-by-digit animation effect with enhanced visibility
        function createDigitAnimation(targetText) {
            const digits = targetText.split('');
            let animatedText = '';

            digits.forEach((digit, index) => {
                if (!isNaN(digit) || digit === ',') {
                    animatedText += `<span class="counter-digit">${digit}</span>`;
                } else {
                    animatedText += digit;
                }
            });

            return animatedText;
        }

        function update() {
            const now = Date.now();
            const progress = Math.min((now - start) / duration, 1);

            // Enhanced easing function for more noticeable motion
            const easeOutBack = 1 - Math.pow(1 - progress, 3) * (1 - Math.sin(progress * Math.PI * 2) * 0.1);
            const currentNum = Math.floor(fromNum + (toNum - fromNum) * easeOutBack);
            const displayText = formatNumber(currentNum);

            // Add motion blur effect during animation
            if (progress < 1) {
                // Create scrolling effect with individual digit animations
                counterElement.innerHTML = createDigitAnimation(displayText);

                // Trigger digit animations with more visible delays and longer duration
                const digitElements = counterElement.querySelectorAll('.counter-digit');
                digitElements.forEach((digit, index) => {
                    setTimeout(() => {
                        digit.classList.add('scrolling');
                        // Remove class after animation with longer duration
                        setTimeout(() => digit.classList.remove('scrolling'), 1200);
                    }, index * 120);
                });

                requestAnimationFrame(update);
            } else {
                // Final state - clean text without spans
                counterElement.textContent = displayText;
                parent.classList.remove('updating');
            }
        }

        requestAnimationFrame(update);
    }

    // Handle click to expand/collapse between abbreviated and full format
    function handleCounterClick() {
        const parent = counterElement.closest('.bg-white\\/10');
        const currentValue = currentImpacted;

        isExpanded = !isExpanded;

        // Add enhanced click animation feedback
        parent.classList.add('click-animate');
        setTimeout(() => {
            parent.classList.remove('click-animate');
        }, 600);

        // Animate between abbreviated and full format
        if (isExpanded) {
            // Expanding: show full number
            animateCounter(formatNumber(currentValue, false), currentValue, 800);
            parent.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        } else {
            // Collapsing: show abbreviated format
            animateCounter(currentValue, formatNumber(currentValue, false), 800);
            parent.style.backgroundColor = '';
        }
    }

    // Set initial value
    counterElement.textContent = formatNumber(currentImpacted);

    // Add click listener
    counterElement.addEventListener('click', handleCounterClick);
    counterElement.style.cursor = 'pointer';
    counterElement.title = 'Click to toggle between abbreviated and full numbers';

    // Update counter at random intervals (4-9 seconds) with 3 per second growth
    function scheduleNextUpdate() {
        // Random interval between 4-9 seconds
        const randomDelay = 4000 + Math.random() * 5000;

        setTimeout(() => {
            const oldValue = currentImpacted;
            // Growth of 3 per second, multiplied by actual seconds elapsed
            const secondsElapsed = randomDelay / 1000;
            const growthAmount = Math.floor(3 * secondsElapsed);
            currentImpacted += growthAmount;

            animateCounter(oldValue, currentImpacted, 1200);
            scheduleNextUpdate(); // Schedule next update
        }, randomDelay);
    }

    // Start the random updates
    scheduleNextUpdate();
}

// Horizontal scrolling for campaign previews
function initHorizontalScroll() {
    const scrollContainer = document.getElementById('campaignsScroll');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;

    // Scroll left
    scrollLeftBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: -320, // Scroll by card width + gap
            behavior: 'smooth'
        });
    });

    // Scroll right
    scrollRightBtn.addEventListener('click', () => {
        scrollContainer.scrollBy({
            left: 320, // Scroll by card width + gap
            behavior: 'smooth'
        });
    });

    // Update button visibility based on scroll position
    function updateButtonVisibility() {
        const isAtStart = scrollContainer.scrollLeft <= 0;
        const isAtEnd = scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth - 1;

        scrollLeftBtn.style.opacity = isAtStart ? '0.5' : '1';
        scrollRightBtn.style.opacity = isAtEnd ? '0.5' : '1';
        scrollLeftBtn.style.pointerEvents = isAtStart ? 'none' : 'auto';
        scrollRightBtn.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }

    // Initial button state
    updateButtonVisibility();

    // Update on scroll
    scrollContainer.addEventListener('scroll', updateButtonVisibility);

    // Also update on window resize
    window.addEventListener('resize', updateButtonVisibility);
}

// Copy to clipboard functionality for hotline numbers
function copyToClipboard(text) {
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.focus();
    textarea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            // Show success feedback
            showCopyFeedback('Phone number copied to clipboard!');
        } else {
            // Fallback for older browsers
            navigator.clipboard.writeText(text).then(() => {
                showCopyFeedback('Phone number copied to clipboard!');
            }).catch(() => {
                showCopyFeedback('Failed to copy phone number');
            });
        }
    } catch (err) {
        // Fallback for modern browsers
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback('Phone number copied to clipboard!');
        }).catch(() => {
            showCopyFeedback('Failed to copy phone number');
        });
    }

    // Clean up
    document.body.removeChild(textarea);
}

// Show feedback message for copy action
function showCopyFeedback(message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.copy-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'copy-feedback fixed top-4 right-4 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    feedback.textContent = message;

    // Add to page
    document.body.appendChild(feedback);

    // Animate in
    setTimeout(() => {
        feedback.style.transform = 'translateY(0)';
        feedback.style.opacity = '1';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.transform = 'translateY(-10px)';
        feedback.style.opacity = '0';
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 3000);
}

// Toggle detail sections within campaign accordions
function toggleDetailSection(sectionId) {
    const content = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId.replace('-details', '-icon'));

    if (!content || !icon) return;

    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';

    if (isExpanded) {
        // Collapse
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';

        // Update parent height after collapse transition
        setTimeout(() => {
            updateParentAccordionHeight();
        }, 350); // Wait for collapse transition to complete
    } else {
        // Expand
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';

        // Update parent height after expand transition
        setTimeout(() => {
            updateParentAccordionHeight();
        }, 350); // Wait for expand transition to complete
    }
}

// Helper function to update the parent campaign accordion height
function updateParentAccordionHeight() {
    // Find all campaign accordions that are currently expanded
    for (let i = 1; i <= 6; i++) {
        const campaignContent = document.getElementById(`campaign${i}`);
        if (campaignContent && campaignContent.style.maxHeight !== '0px' && campaignContent.style.maxHeight !== '') {
            // Force a reflow to get accurate scrollHeight
            campaignContent.offsetHeight;
            // Recalculate and update the height
            campaignContent.style.maxHeight = campaignContent.scrollHeight + 'px';
        }
    }
}

/* ===== PAGE TRANSITION AND STORY ANIMATIONS ===== */

// Initialize story page animations
function initStoryPageAnimations() {
    // Add page enter animation to body
    document.body.classList.add('page-enter');

    // Initialize hero animations
    const heroSection = document.querySelector('.story-hero');
    if (heroSection) {
        heroSection.classList.add('story-hero-enter');
    }

    // Initialize content animations with stagger
    const contentElements = document.querySelectorAll('.story-content, .story-quote, .story-section');
    contentElements.forEach((element, index) => {
        element.classList.add('story-content-enter');
        element.style.animationDelay = `${0.4 + (index * 0.2)}s`;
    });

    // Initialize navigation animations
    const navElements = document.querySelectorAll('.story-nav, .story-navigation');
    navElements.forEach((element, index) => {
        element.classList.add('story-nav-enter');
        element.style.animationDelay = `${1.2 + (index * 0.1)}s`;
    });

    // Add text reveal animation to main title
    const mainTitle = document.querySelector('.story-title');
    if (mainTitle) {
        mainTitle.classList.add('text-reveal');
        const titleText = mainTitle.textContent;
        mainTitle.innerHTML = `<span>${titleText}</span>`;
    }

    // Add hover effects to story cards
    const storyCards = document.querySelectorAll('.story-card');
    storyCards.forEach(card => {
        card.classList.add('story-card-hover');
    });

    // Add pulse animation to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button, .story-cta');
    ctaButtons.forEach(button => {
        button.classList.add('cta-pulse');
    });
}

// Smooth page transition function
function navigateToStory(storyUrl) {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);

    // Show loading overlay
    setTimeout(() => {
        loadingOverlay.classList.add('active');
    }, 10);

    // Add page exit animation
    document.body.classList.add('page-exit');

    // Navigate after animation
    setTimeout(() => {
        window.location.href = storyUrl;
    }, 500);
}

// Enhanced scroll animations for story pages
function initEnhancedScrollAnimations() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // Handle different animation types
                if (target.classList.contains('story-section')) {
                    target.classList.add('story-content-enter');
                } else if (target.classList.contains('story-quote')) {
                    target.classList.add('story-quote-enter');
                } else if (target.classList.contains('reveal')) {
                    target.classList.add('revealed');
                }

                // Stagger children if it's a container
                if (target.classList.contains('stagger-children')) {
                    const children = Array.from(target.children);
                    children.forEach((child, i) => {
                        setTimeout(() => {
                            child.classList.add('story-content-enter');
                        }, i * 100);
                    });
                }

                observer.unobserve(target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    // Observe story-specific elements
    setTimeout(() => {
        const storyElements = document.querySelectorAll('.story-section, .story-quote, .reveal');
        storyElements.forEach(el => {
            observer.observe(el);
        });
    }, 100);
}

// Initialize all story page enhancements
function initStoryPageEnhancements() {
    // Check if we're on a story page
    if (window.location.pathname.includes('/stories/') || document.querySelector('.story-hero')) {
        initStoryPageAnimations();
        initEnhancedScrollAnimations();
    }

    // Add smooth navigation to story links
    const storyLinks = document.querySelectorAll('[onclick*="stories/"]');
    storyLinks.forEach(link => {
        const onclickAttr = link.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes('window.open')) {
            const urlMatch = onclickAttr.match(/'([^']*stories[^']*)'/);
            if (urlMatch) {
                const storyUrl = urlMatch[1];
                link.onclick = (e) => {
                    e.preventDefault();
                    navigateToStory(storyUrl);
                };
            }
        }
    });
}

// Add to DOMContentLoaded initialization
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initStoryPageEnhancements();
});
