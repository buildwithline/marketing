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

// Blog post functionality
function openBlogPost(postId) {
    // Close all posts first
    document.querySelectorAll('.blog-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelectorAll('.blog-content').forEach(content => {
        content.classList.remove('active');
    });

    // Open the selected post
    const selectedCard = document.querySelector(`.blog-card[data-post="${postId}"]`);
    const selectedContent = document.querySelector(`.blog-content[data-post="${postId}"]`);
    
    if (selectedCard && selectedContent) {
        selectedCard.classList.add('active');
        selectedContent.classList.add('active');
        
        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('post', postId);
        window.history.pushState({}, '', url);
        
        // Scroll to content
        selectedContent.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeBlogPost() {
    // Close all posts
    document.querySelectorAll('.blog-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelectorAll('.blog-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove post from URL
    const url = new URL(window.location);
    url.searchParams.delete('post');
    window.history.pushState({}, '', url);
}

// Blog card click handler
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
        const postId = card.getAttribute('data-post');
        const blogContent = document.querySelector(`.blog-content[data-post="${postId}"]`);
        
        // If the card is already active, deactivate it and hide content
        if (card.classList.contains('active')) {
            card.classList.remove('active');
            blogContent.classList.remove('active');
            return;
        }
        
        // Remove active class from all cards and content
        document.querySelectorAll('.blog-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.blog-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card and its content
        card.classList.add('active');
        blogContent.classList.add('active');

        // Add offset for the fixed navigation (90px) plus some extra padding (40px)
        const navHeight = 90;
        const extraPadding = 40;
        const elementPosition = blogContent.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight - extraPadding;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Add click event listeners to share buttons
document.querySelectorAll('.share-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = button.getAttribute('data-post');
        const url = new URL(window.location);
        url.searchParams.set('post', postId);
        navigator.clipboard.writeText(url.toString()).then(() => {
            alert('Link copied to clipboard!');
        });
    });
});

// Handle URL state on page load
window.addEventListener('load', () => {
    const url = new URL(window.location);
    const postId = url.searchParams.get('post');
    if (postId) {
        openBlogPost(postId);
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    const url = new URL(window.location);
    const postId = url.searchParams.get('post');
    if (postId) {
        openBlogPost(postId);
    } else {
        closeBlogPost();
    }
});

// Handle next post links
document.querySelectorAll('.next-post-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const nextPostId = link.getAttribute('data-next');
        
        // Close all blog posts
        document.querySelectorAll('.blog-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelectorAll('.blog-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Open the next post
        const nextCard = document.querySelector(`.blog-card[data-post="${nextPostId}"]`);
        const nextContent = document.querySelector(`.blog-content[data-post="${nextPostId}"]`);
        
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