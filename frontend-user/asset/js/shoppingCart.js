// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.init();
    }

    // Load cart from localStorage
    loadCart() {
        const cart = localStorage.getItem('shoppingCart');
        return cart ? JSON.parse(cart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
    }

    // Add product to cart
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                img: product.img,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartIcon();
        
        // If we're on the shopping cart page, re-render the cart items
        if (window.location.pathname.includes('shoppingcard.html')) {
            this.renderCartItems();
            this.updateTotalPrice();
        }
    }

    // Remove product from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        
        // Remove the row from DOM
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (row) {
            row.remove();
        }
        
        // If cart is empty, show empty message
        if (this.cart.length === 0) {
            const tbody = document.getElementById('cart-items');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center; padding: 20px;">
                            <p>Giỏ hàng trống</p>
                            <a href="./index.html">Tiếp tục mua hàng</a>
                        </td>
                    </tr>
                `;
            }
        }
        
        this.updateCartIcon();
        this.updateTotalPrice();
    }

    // Update product quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                
                // Update specific elements instead of re-rendering everything
                const row = document.querySelector(`tr[data-product-id="${productId}"]`);
                
                if (row) {
                    // Update input value
                    const input = row.querySelector('input[data-action="change"]');
                    
                    if (input) {
                        input.value = quantity;
                        input.setAttribute('value', quantity);
                        
                        // Force input to update visually
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    
                    // Update total price for this item (column 4)
                    const totalCell = row.querySelector('td:nth-child(4) p');
                    if (totalCell) {
                        const itemTotal = item.price * quantity;
                        totalCell.textContent = this.formatPrice(itemTotal);
                    }
                }
                
                // Update cart icon and total price immediately
                this.updateCartIcon();
                this.updateTotalPrice();
                
                // Show feedback to user
                this.showQuantityUpdateFeedback(productId, quantity);
            }
        }
    }

    // Calculate total price
    calculateTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Format price to VND
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    // Render cart items
    async renderCartItems() {
        const tbody = document.getElementById('cart-items');
        const tableContainer = document.querySelector('.card-section-left-table');
        if (!tbody || !tableContainer) return;

        if (this.cart.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        <p>Giỏ hàng trống</p>
                        <a href="./index.html">Tiếp tục mua hàng</a>
                    </td>
                </tr>
            `;
            
            // Clear mobile layout
            const mobileContainer = tableContainer.querySelector('.mobile-cart-items');
            if (mobileContainer) {
                mobileContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p>Giỏ hàng trống</p>
                        <a href="./index.html">Tiếp tục mua hàng</a>
                    </div>
                `;
            }
            return;
        }

        // Render table layout
        tbody.innerHTML = this.cart.map(item => `
            <tr data-product-id="${item.id}">
                <td><img style="width:70px" src="${item.img}" alt="${item.name}"></td>
                <td>
                    <div class="product-detail-right-info">
                        <h1>${item.name}</h1>
                        <div class="product-item-price">
                            <p>${this.formatPrice(item.price)}</p>          
                        </div>              
                    </div>
                </td>
                <td>
                    <div class="product-detail-right-quantity-input">
                        <i class="fa-solid fa-minus" data-product-id="${item.id}" data-action="decrease"></i>
                        <input onkeydown="return false" type="number" value="${item.quantity}" 
                               data-product-id="${item.id}" data-action="change">
                        <i class="fa-solid fa-plus" data-product-id="${item.id}" data-action="increase"></i>
                    </div>
                </td>
                <td><p>${this.formatPrice(item.price * item.quantity)}</p></td>
                <td><i class="fa-solid fa-trash" data-product-id="${item.id}" data-action="remove"></i></td>
            </tr>
        `).join('');

        // Render mobile layout
        let mobileContainer = tableContainer.querySelector('.mobile-cart-items');
        if (!mobileContainer) {
            mobileContainer = document.createElement('div');
            mobileContainer.className = 'mobile-cart-items';
            tableContainer.appendChild(mobileContainer);
        }

        mobileContainer.innerHTML = this.cart.map(item => `
            <div class="mobile-cart-item" data-product-id="${item.id}">
                <div class="mobile-cart-item-header">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="mobile-cart-item-info">
                        <h3>${item.name}</h3>
                        <div class="price">${this.formatPrice(item.price)}</div>
                    </div>
                </div>
                <div class="mobile-cart-item-controls">
                    <div class="mobile-cart-item-quantity">
                        <i class="fa-solid fa-minus" data-product-id="${item.id}" data-action="decrease"></i>
                        <input type="number" value="${item.quantity}" data-product-id="${item.id}" data-action="change">
                        <i class="fa-solid fa-plus" data-product-id="${item.id}" data-action="increase"></i>
                    </div>
                    <div class="mobile-cart-item-total">${this.formatPrice(item.price * item.quantity)}</div>
                    <i class="fa-solid fa-trash mobile-cart-item-remove" data-product-id="${item.id}" data-action="remove"></i>
                </div>
            </div>
        `).join('');

        // Add event listeners after rendering
        this.addEventListeners();
    }

    // Add event listeners for cart items using event delegation
    addEventListeners() {
        const cartContainer = document.getElementById('cart-items');
        if (cartContainer && !cartContainer.hasAttribute('data-events-bound')) {
            cartContainer.setAttribute('data-events-bound', 'true');
            
            cartContainer.addEventListener('click', (e) => {
                // Minus button
                if (e.target.matches('.fa-minus[data-action="decrease"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = e.target.getAttribute('data-product-id');
                    const item = this.cart.find(item => item.id === productId);
                    if (item && item.quantity > 1) {
                        this.updateQuantity(productId, item.quantity - 1);
                    } else if (item && item.quantity === 1) {
                        this.removeFromCart(productId);
                    }
                }
                
                // Plus button
                if (e.target.matches('.fa-plus[data-action="increase"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = e.target.getAttribute('data-product-id');
                    const item = this.cart.find(item => item.id === productId);
                    if (item) {
                        this.updateQuantity(productId, item.quantity + 1);
                    }
                }
                
                // Remove button
                if (e.target.matches('.fa-trash[data-action="remove"]')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = e.target.getAttribute('data-product-id');
                    this.removeFromCart(productId);
                }
            });
            
            // Input change - handle both change and input events for better responsiveness
            cartContainer.addEventListener('change', (e) => {
                if (e.target.matches('input[data-action="change"]')) {
                    const productId = e.target.getAttribute('data-product-id');
                    const quantity = parseInt(e.target.value);
                    if (quantity > 0) {
                        this.updateQuantity(productId, quantity);
                    } else {
                        e.target.value = 1;
                        this.updateQuantity(productId, 1);
                    }
                }
            });
            
            // Input event for real-time updates
            cartContainer.addEventListener('input', (e) => {
                if (e.target.matches('input[data-action="change"]')) {
                    const productId = e.target.getAttribute('data-product-id');
                    const quantity = parseInt(e.target.value);
                    if (quantity > 0) {
                        // Update item total immediately without saving to localStorage
                        const item = this.cart.find(item => item.id === productId);
                        if (item) {
                            const row = document.querySelector(`tr[data-product-id="${productId}"]`);
                            if (row) {
                                const totalCell = row.querySelector('td:nth-child(4) p');
                                if (totalCell) {
                                    const itemTotal = item.price * quantity;
                                    totalCell.textContent = this.formatPrice(itemTotal);
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    // Update cart display
    updateCartDisplay() {
        this.updateCartIcon();
        this.updateTotalPrice();
    }

    // Update cart icon with total quantity
    updateCartIcon() {
        const cartIcon = document.querySelector('.header-cart i');
        if (cartIcon) {
            const totalQuantity = this.cart.reduce((total, item) => total + item.quantity, 0);
            cartIcon.setAttribute('number', totalQuantity);
            
            // Add visual feedback for cart icon update
            cartIcon.style.transform = 'scale(1.2)';
            cartIcon.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Update total price display
    updateTotalPrice() {
        const totalElement = document.querySelector('.card-section-left-total .card-section-right-total-price p');
        if (totalElement) {
            const total = this.calculateTotal();
            totalElement.textContent = this.formatPrice(total);
            
            // Add visual feedback for total price update
            totalElement.style.transform = 'scale(1.1)';
            totalElement.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                totalElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // Show feedback when quantity is updated
    showQuantityUpdateFeedback(productId, quantity) {
        const row = document.querySelector(`tr[data-product-id="${productId}"]`);
        if (row) {
            const totalCell = row.querySelector('td:nth-child(4) p');
            if (totalCell) {
                // Add visual feedback
                totalCell.style.backgroundColor = '#e8f5e8';
                totalCell.style.transition = 'background-color 0.3s ease';
                setTimeout(() => {
                    totalCell.style.backgroundColor = '';
                }, 300);
            }
        }
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        
        // Clear the cart display
        const tbody = document.getElementById('cart-items');
        const tableContainer = document.querySelector('.card-section-left-table');
        
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 20px;">
                        <p>Giỏ hàng trống</p>
                        <a href="./index.html">Tiếp tục mua hàng</a>
                    </td>
                </tr>
            `;
        }
        
        // Clear mobile layout
        if (tableContainer) {
            const mobileContainer = tableContainer.querySelector('.mobile-cart-items');
            if (mobileContainer) {
                mobileContainer.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <p>Giỏ hàng trống</p>
                        <a href="./index.html">Tiếp tục mua hàng</a>
                    </div>
                `;
            }
        }
        
        this.updateCartIcon();
        this.updateTotalPrice();
    }

    // Initialize cart
    init() {
        this.renderCartItems();
        this.updateCartDisplay();
        // this.renderHotProducts(); // Commented out to avoid conflict with script.js
        
        // Add event listeners for cart buttons
        const updateCartBtn = document.querySelector('.card-section-left-button button');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', () => {
                // Cart is already updated in real-time, so just show a message
                alert('Giỏ hàng đã được cập nhật!');
            });
        }

        const continueShoppingBtn = document.querySelector('.card-section-left-button a');
        if (continueShoppingBtn) {
            continueShoppingBtn.href = './index.html';
        }

        // Add event listener for confirm order button - Commented out to avoid conflict with FormValidation
        /*
        const confirmOrderBtn = document.querySelector('.confirm-order');
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    alert('Giỏ hàng trống!');
                    return;
                }
                
                // Here you can add logic to submit order
                alert('Đơn hàng đã được gửi thành công!');
                this.clearCart();
                window.location.href = './orderconfirm.html';
            });
        }
        */
        
        // Prevent conflicts with other quantity inputs on the page
        this.preventQuantityInputConflicts();
    }
    
    // Prevent conflicts with other quantity inputs
    preventQuantityInputConflicts() {
        // Only apply to shopping cart page
        if (!window.location.pathname.includes('shoppingcard.html')) {
            return;
        }
        
        // Prevent default behavior for cart quantity inputs
        document.addEventListener('keydown', (e) => {
            if (e.target.matches('#cart-items input[data-action="change"]')) {
                // Allow only numbers and navigation keys
                const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
                const isNumber = /^[0-9]$/.test(e.key);
                
                if (!isNumber && !allowedKeys.includes(e.key)) {
                    e.preventDefault();
                }
            }
        });
    }

    // Render hot products section - Commented out to avoid conflict with script.js
    /*
    async renderHotProducts() {
        const container = document.querySelector('.row-grid-hot-products');
        if (!container) return;

        try {
            const response = await axios.get('https://684cf65e65ed08713914b281.mockapi.io/product');
            const products = response.data;
            
            container.innerHTML = products.map(product => `
                <div class="hot-product-item">
                    <a href="./product.html?id=${product.id}"><img src="${product.img}" alt="${product.name}"></a>
                    <p><a href="./product.html?id=${product.id}">${product.name}</a></p>
                    <span>${product.screen}</span>
                    <div class="hot-product-item-price">
                        <p>${this.formatPrice(product.price)}</p>          
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            container.innerHTML = '<p>Không thể tải danh sách sản phẩm</p>';
        }
    }
    */
}

// Initialize shopping cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
}); 