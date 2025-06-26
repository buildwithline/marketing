// Handle nav shadow on scroll
let nav, headerContainer, howWeHelpSection, blogSection;
let lastScroll = 0;

// Initialize elements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    nav = document.querySelector('.main-nav');
    headerContainer = document.querySelector('.header-bg-container');
    howWeHelpSection = document.getElementById('how-we-help');
    blogSection = document.getElementById('blog');
    
    console.log('Elements found:', {
        nav: !!nav,
        headerContainer: !!headerContainer,
        howWeHelpSection: !!howWeHelpSection,
        blogSection: !!blogSection
    });

    // Handle responsive CTA button changes
    const ctaButton = document.querySelector('.cta-button[data-mobile-href]');
    
    function updateCTAButton() {
        if (!ctaButton) return;
        
        if (window.innerWidth <= 768) {
            // Mobile/tablet: Change to "Schedule demo" and update href
            ctaButton.textContent = ctaButton.getAttribute('data-mobile-text');
            ctaButton.href = ctaButton.getAttribute('data-mobile-href');
            ctaButton.target = '_blank';
        } else {
            // Desktop: Keep original "Get early access" and href
            ctaButton.textContent = 'Get early access';
            ctaButton.href = '#contact';
            ctaButton.removeAttribute('target');
        }
    }
    
    // Update on load and resize
    updateCTAButton();
    window.addEventListener('resize', updateCTAButton);
});

window.addEventListener('scroll', () => {
    // Make sure elements are available
    if (!nav || !headerContainer) return;
    
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class when we've scrolled past the header to either "How we help" or "blog" sections
    if (howWeHelpSection || blogSection) {
        const headerHeight = headerContainer.offsetHeight;
        const navHeight = 90; // Height of the nav
        
        // Check if we're over the "How we help" section
        const howWeHelpOffset = howWeHelpSection ? howWeHelpSection.offsetTop - navHeight : Infinity;
        const howWeHelpBottom = howWeHelpSection ? howWeHelpSection.offsetTop + howWeHelpSection.offsetHeight : 0;
        
        // Check if we're over the blog section
        const blogOffset = blogSection ? blogSection.offsetTop - navHeight : Infinity;
        const blogBottom = blogSection ? blogSection.offsetTop + blogSection.offsetHeight : 0;
        
        // Check if we're currently over either section
        const isOverHowWeHelp = currentScroll >= howWeHelpOffset && currentScroll < howWeHelpBottom;
        const isOverBlog = currentScroll >= blogOffset && currentScroll < blogBottom;
        
        // Debug logging
        console.log('Scroll Debug:', {
            currentScroll,
            howWeHelpOffset,
            howWeHelpBottom,
            blogOffset,
            blogBottom,
            isOverHowWeHelp,
            isOverBlog,
            blogSectionExists: !!blogSection
        });
        
        // Remove all scroll classes first
        nav.classList.remove('scrolled', 'blog-scrolled');
        
        // Add appropriate class based on which section we're over
        if (isOverHowWeHelp) {
            nav.classList.add('scrolled');
        } else if (isOverBlog) {
            nav.classList.add('blog-scrolled');
        }
    }
    
    // Keep the header container scrolled class for potential future use
    if (currentScroll > 0) {
        headerContainer.classList.add('scrolled');
    } else {
        headerContainer.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Handle navigation active states
function updateActiveNavLink() {
    const sections = ['how-we-help', 'blog', 'contact'];
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get scroll position
    const scrollPosition = window.scrollY;
    
    // Find the current section
    let currentSection = '';
    let foundSection = false;
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const offsetTop = element.offsetTop - 100; // Offset for nav height
            const nextSection = sections[sections.indexOf(section) + 1];
            const nextElement = nextSection ? document.getElementById(nextSection) : null;
            const nextOffsetTop = nextElement ? nextElement.offsetTop - 100 : Infinity;
            
            if (scrollPosition >= offsetTop && scrollPosition < nextOffsetTop) {
                currentSection = section;
                foundSection = true;
            }
        }
    });
    
    // If we're in the contact section, remove active state from all links
    if (currentSection === 'contact') {
        navLinks.forEach(link => link.classList.remove('active'));
        return;
    }
    
    // Update active state
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
    
    // If no section is active and we're not in contact, default to "How we help"
    if (!foundSection && currentSection !== 'contact') {
        const howWeHelpLink = document.querySelector('a[href="#how-we-help"]');
        if (howWeHelpLink) {
            howWeHelpLink.classList.add('active');
        }
    }
}

// Update active state on scroll
window.addEventListener('scroll', updateActiveNavLink);

// Update active state on page load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Handle hash changes
window.addEventListener('hashchange', updateActiveNavLink);

// Blog card expand/collapse functionality
document.addEventListener('DOMContentLoaded', () => {
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on share button
            if (e.target.closest('.share-button')) {
                return;
            }
            
            const postId = card.getAttribute('data-post');
            const expandedContent = document.querySelector(`.blog-content-expanded[data-post="${postId}"]`);
            const isActive = card.classList.contains('active');
            
            // Close all other cards and content first
            blogCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('active');
                }
            });
            document.querySelectorAll('.blog-content-expanded').forEach(content => {
                if (content !== expandedContent) {
                    content.classList.remove('active');
                }
            });
            
            // Toggle current card and content
            if (isActive) {
                card.classList.remove('active');
                if (expandedContent) {
                    expandedContent.classList.remove('active');
                }
            } else {
                card.classList.add('active');
                if (expandedContent) {
                    expandedContent.classList.add('active');
                    
                    // Smooth scroll to the expanded content
                    setTimeout(() => {
                        const navHeight = 90;
                        const extraPadding = 40;
                        const elementPosition = expandedContent.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navHeight - extraPadding;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
        });
    });
    
    // Share button functionality
    const shareButtons = document.querySelectorAll('.share-button');
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const postId = button.getAttribute('data-post');
            const url = new URL(window.location);
            url.searchParams.set('post', postId);
            
            // Store original button content
            const originalContent = button.innerHTML;
            
            navigator.clipboard.writeText(url.toString()).then(() => {
                // Change button text to show success
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" fill="currentColor"/>
                    </svg>
                    Copied!
                `;
                button.classList.add('copied');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                alert('Link copied to clipboard!');
            });
        });
    });
    
    // Handle URL state on page load
    const url = new URL(window.location);
    const postId = url.searchParams.get('post');
    if (postId) {
        const targetCard = document.querySelector(`.blog-card[data-post="${postId}"]`);
        const targetContent = document.querySelector(`.blog-content-expanded[data-post="${postId}"]`);
        
        if (targetCard && targetContent) {
            targetCard.classList.add('active');
            targetContent.classList.add('active');
            
            // Scroll to the content
            setTimeout(() => {
                const navHeight = 90;
                const extraPadding = 40;
                const elementPosition = targetContent.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - extraPadding;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const url = new URL(window.location);
        const postId = url.searchParams.get('post');
        
        // Close all cards and content
        blogCards.forEach(card => card.classList.remove('active'));
        document.querySelectorAll('.blog-content-expanded').forEach(content => {
            content.classList.remove('active');
        });
        
        if (postId) {
            const targetCard = document.querySelector(`.blog-card[data-post="${postId}"]`);
            const targetContent = document.querySelector(`.blog-content-expanded[data-post="${postId}"]`);
            
            if (targetCard && targetContent) {
                targetCard.classList.add('active');
                targetContent.classList.add('active');
            }
        }
    });

    // Handle next post links
    document.querySelectorAll('.next-post-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const nextPostId = link.getAttribute('data-next');
            
            // Close all blog posts
            blogCards.forEach(card => {
                card.classList.remove('active');
            });
            document.querySelectorAll('.blog-content-expanded').forEach(content => {
                content.classList.remove('active');
            });
            
            // Open the next post
            const nextCard = document.querySelector(`.blog-card[data-post="${nextPostId}"]`);
            const nextContent = document.querySelector(`.blog-content-expanded[data-post="${nextPostId}"]`);
            
            if (nextCard && nextContent) {
                nextCard.classList.add('active');
                nextContent.classList.add('active');
                
                // Add offset for the fixed navigation (90px) plus some extra padding (40px)
                const navHeight = 90;
                const extraPadding = 40;
                const elementPosition = nextContent.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - extraPadding;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 