// Nezzo App - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navActions.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.app-card, .feature-card, .leader-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Dynamic greeting based on time
    const updateGreeting = () => {
        const hour = new Date().getHours();
        const heroTitle = document.querySelector('.hero-title');
        
        if (heroTitle && !heroTitle.dataset.greeted) {
            let greeting;
            if (hour < 6) greeting = 'Gute Nacht';
            else if (hour < 12) greeting = 'Guten Morgen';
            else if (hour < 18) greeting = 'Guten Tag';
            else greeting = 'Guten Abend';

            heroTitle.dataset.greeted = 'true';
        }
    };

    updateGreeting();

    // Stats counter animation
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = stat.textContent;
            const numericValue = parseInt(target.replace(/\D/g, ''));
            
            if (!isNaN(numericValue)) {
                let current = 0;
                const increment = numericValue / 50;
                const suffix = target.replace(/[0-9]/g, '');
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        current = numericValue;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current) + suffix;
                }, 30);
            }
        });
    };

    // Trigger stats animation when visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    console.log('🚀 Nezzo App loaded successfully!');
    console.log('👤 CEO: LobiGmbh | COO: JoviGmbh');
});

// API Helper functions
const API = {
    baseURL: '/api',

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // AI endpoints
    ai: {
        generate: (prompt) => API.request('/ai/generate', {
            method: 'POST',
            body: JSON.stringify({ prompt })
        }),
        chat: (messages) => API.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({ messages })
        }),
        code: (description, language) => API.request('/ai/code', {
            method: 'POST',
            body: JSON.stringify({ description, language })
        }),
        analyze: (text, type) => API.request('/ai/analyze', {
            method: 'POST',
            body: JSON.stringify({ text, type })
        })
    },

    // Chat endpoints
    chat: {
        createSession: () => API.request('/chat/session', { method: 'POST' }),
        getSession: (sessionId) => API.request(`/chat/session/${sessionId}`),
        sendMessage: (sessionId, message) => API.request('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ sessionId, message })
        }),
        getMessages: (sessionId) => API.request(`/chat/session/${sessionId}/messages`),
        deleteSession: (sessionId) => API.request(`/chat/session/${sessionId}`, {
            method: 'DELETE'
        })
    },

    // Cloud endpoints
    cloud: {
        upload: (filename, content, type) => API.request('/cloud/upload', {
            method: 'POST',
            body: JSON.stringify({ filename, content, type })
        }),
        getFile: (fileId) => API.request(`/cloud/file/${fileId}`),
        getFiles: () => API.request('/cloud/files'),
        deleteFile: (fileId) => API.request(`/cloud/file/${fileId}`, {
            method: 'DELETE'
        }),
        getStats: () => API.request('/cloud/stats')
    },

    // Host endpoints
    host: {
        deploy: (name, content, domain) => API.request('/host/deploy', {
            method: 'POST',
            body: JSON.stringify({ name, content, domain })
        }),
        getSite: (siteId) => API.request(`/host/site/${siteId}`),
        getSites: () => API.request('/host/sites'),
        updateSite: (siteId, data) => API.request(`/host/site/${siteId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        deleteSite: (siteId) => API.request(`/host/site/${siteId}`, {
            method: 'DELETE'
        })
    },

    // Vocab endpoints
    vocab: {
        createSet: (name, description, words) => API.request('/vocab/set', {
            method: 'POST',
            body: JSON.stringify({ name, description, words })
        }),
        getSet: (setId) => API.request(`/vocab/set/${setId}`),
        getSets: () => API.request('/vocab/sets'),
        addWord: (setId, term, definition, example) => API.request(`/vocab/set/${setId}/word`, {
            method: 'POST',
            body: JSON.stringify({ term, definition, example })
        }),
        search: (query) => API.request(`/vocab/search?query=${encodeURIComponent(query)}`)
    },

    // Code endpoints
    code: {
        createSnippet: (title, code, language, description) => API.request('/code/snippet', {
            method: 'POST',
            body: JSON.stringify({ title, code, language, description })
        }),
        getSnippet: (snippetId) => API.request(`/code/snippet/${snippetId}`),
        getSnippets: (language) => API.request(`/code/snippets${language ? `?language=${language}` : ''}`),
        likeSnippet: (snippetId) => API.request(`/code/snippet/${snippetId}/like`, {
            method: 'POST'
        }),
        getLanguages: () => API.request('/code/languages')
    },

    // Text endpoints
    text: {
        createDocument: (title, content, format) => API.request('/text/document', {
            method: 'POST',
            body: JSON.stringify({ title, content, format })
        }),
        getDocument: (docId) => API.request(`/text/document/${docId}`),
        getDocuments: () => API.request('/text/documents'),
        getStats: (text) => API.request('/text/stats', {
            method: 'POST',
            body: JSON.stringify({ text })
        }),
        transform: (text, transformation) => API.request('/text/transform', {
            method: 'POST',
            body: JSON.stringify({ text, transformation })
        })
    }
};

// Make API available globally
window.NezzoAPI = API;
