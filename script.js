// Handle nav shadow on scroll
const nav = document.querySelector('.main-nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 0) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
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
            
            navigator.clipboard.writeText(url.toString()).then(() => {
                // Create a temporary notification
                const notification = document.createElement('div');
                notification.textContent = 'Link copied to clipboard!';
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--primary-color);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    transition: opacity 0.3s ease;
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
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