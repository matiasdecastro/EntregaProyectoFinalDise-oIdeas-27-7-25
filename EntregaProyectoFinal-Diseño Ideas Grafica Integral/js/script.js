// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartDisplay();
        this.initializeEventListeners();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${product.title} agregado al carrito`, 'success');
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Producto eliminado del carrito', 'info');
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    // Get cart total
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const cartTotal = document.getElementById('cart-total');
        
        // Update cart count badge
        const itemCount = this.getItemCount();
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'inline' : 'none';
        }
        
        // Update cart modal content
        if (this.items.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h6 class="cart-item-title">${item.title}</h6>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="cart.updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="btn-remove" onclick="cart.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Update total
        cartTotal.textContent = this.getTotal().toFixed(2);
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Cart toggle button
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
                cartModal.show();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    // Checkout process
    checkout() {
        if (this.items.length === 0) {
            this.showNotification('Tu carrito está vacío', 'warning');
            return;
        }
        
        // Simulate checkout process
        this.showNotification('Procesando compra...', 'info');
        
        setTimeout(() => {
            this.items = [];
            this.saveCart();
            this.updateCartDisplay();
            
            // Close modal
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            cartModal.hide();
            
            this.showNotification('¡Compra realizada exitosamente!', 'success');
        }, 2000);
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} notification`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'} me-2"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Products Management
class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    // Load static products (no API needed)
    async loadProducts() {
        this.products = this.getSampleProducts();
        this.renderProducts();
    }

    // Render products to DOM
    renderProducts() {
        const gridElement = document.getElementById('products-grid');
        
        if (!gridElement) return;
        
        gridElement.innerHTML = this.products.map(product => `
            <div class="col-lg-4 col-md-6">
                <div class="product-card">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.title}" loading="lazy">
                        <span class="product-category">${product.category}</span>
                    </div>
                    <div class="product-content">
                        <h4 class="product-title">${product.title}</h4>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-actions">
                            <button class="btn-add-to-cart" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                                <i class="fas fa-shopping-cart me-2"></i>Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get sample products for static version
    getSampleProducts() {
        return [
            {
                "id": 1,
                "title": "Banner Roll UP",
                "price": 150.00,
                "description": "Impresion de Banner Roll UP 85x205cm",
                "image": "images/bannerrollup.jpeg",
                "category": "Branding"
            },
            {
                "id": 2,
                "title": "Tarjetas de Presentación",
                "price": 45.00,
                "description": "Diseño e impresión de tarjetas de presentación elegantes",
                "image": "images/tarjetaspersonalesconlacasect.webp",
                "category": "Print"
            },
            {
                "id": 3,
                "title": "Flyer Promocional",
                "price": 35.00,
                "description": "Diseño de flyer promocional para eventos y marketing",
                "image": "images/folletosoffset.webp",
                "category": "Folletos Offset"
            },
            {
                "id": 4,
                "title": "Carteleria Corporea",
                "price": 800.00,
                "description": "Impresion y armado Carteleria Corporeas",
                "image": "images/cartelcorporeoacrilico.jpg",
                "category": "Corporeos"
            },
            {
                "id": 5,
                "title": "Impresion de Lona",
                "price": 500.00,
                "description": "Impresion de Lona calidad Resina/latex",
                "image": "images/impresiondelona.jpg",
                "category": "Lonas"
            },
            {
                "id": 6,
                "title": "Impresion UV Plana",
                "price": 60.00,
                "description": "Impresiones en materiales semirigidos",
                "image": "images/impresionplanouv.jpg",
                "category": "impresion Plano"
            }
        ];
    }
}

// Contact Form Management
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.initializeForm();
    }

    initializeForm() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Add real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Reset previous validation state
        field.classList.remove('is-invalid', 'is-valid');

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        }

        // Update field appearance
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        // Update error message
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const successElement = document.getElementById('form-success');
        const errorElement = document.getElementById('form-error');

        // Hide previous messages
        successElement.style.display = 'none';
        errorElement.style.display = 'none';

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';

        try {
            const formData = new FormData(this.form);
            
            // Replace with your actual Formspree endpoint
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                successElement.style.display = 'block';
                this.form.reset();
                
                // Reset validation classes
                const inputs = this.form.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
                
                // Scroll to success message
                successElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            errorElement.style.display = 'block';
            errorElement.scrollIntoView({ behavior: 'smooth' });
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    }
}

// Navigation Management
class Navigation {
    constructor() {
        this.initializeNavigation();
    }

    initializeNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
        });

        // Active navigation highlighting
        this.updateActiveNavigation();
        window.addEventListener('scroll', () => {
            this.updateActiveNavigation();
        });
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// Utility Functions
function loadProducts() {
    if (window.productManager) {
        window.productManager.loadProducts();
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
    
    .navbar-nav .nav-link.active {
        color: var(--primary-color) !important;
        background-color: rgba(0, 123, 255, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    window.cart = new ShoppingCart();
    window.productManager = new ProductManager();
    window.contactForm = new ContactForm();
    window.navigation = new Navigation();
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .product-card, .review-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    console.log('Diseño Ideas Gráfica Integral - Website initialized successfully!');
});

// Error handling for uncaught errors
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('Back online');
});

window.addEventListener('offline', () => {
    console.log('Gone offline');
});
