// Form Validation for Shipping Information
class FormValidation {
    constructor() {
        this.form = document.getElementById('shipping-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Form submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Check if cart is empty
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        if (cart.length === 0) {
            alert('Giỏ hàng trống! Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.');
            return;
        }
        
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const isValid = this.validateAllFields(data);
        
        if (isValid) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            // Create order object
            const order = {
                id: Date.now(), // Simple ID generation
                customerInfo: {
                    fullName: data.fullName,
                    phone: data.phone,
                    email: data.email,
                    province: data.province,
                    district: data.district,
                    ward: data.ward,
                    address: data.address,
                    note: data.note || 'Không có ghi chú'
                },
                items: cart,
                totalItems: totalItems,
                totalPrice: totalPrice,
                orderDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
                status: 'pending'
            };
            
            // Save order to localStorage
            this.saveOrder(order);
            
            // Clear cart
            localStorage.removeItem('shoppingCart');
            
            // Show success message
            this.showSuccessMessage('Đặt hàng thành công! Đơn hàng đã được gửi.');
            
            // Redirect to order confirmation page
            setTimeout(() => {
                window.location.href = './orderconfirm.html';
            }, 2000);
        }
    }

    validateAllFields(data) {
        let isValid = true;

        // Validate full name
        if (!this.validateFullName(data.fullName)) {
            this.showError('fullName', 'Vui lòng nhập họ và tên');
            isValid = false;
        }

        // Validate phone
        if (!this.validatePhone(data.phone)) {
            this.showError('phone', 'Số điện thoại không hợp lệ');
            isValid = false;
        }

        // Validate email
        if (!this.validateEmail(data.email)) {
            this.showError('email', 'Email không hợp lệ');
            isValid = false;
        }

        // Validate province
        if (!data.province) {
            this.showError('province', 'Vui lòng chọn tỉnh/thành phố');
            isValid = false;
        }

        // Validate district
        if (!data.district) {
            this.showError('district', 'Vui lòng chọn quận/huyện');
            isValid = false;
        }

        // Validate ward
        if (!data.ward) {
            this.showError('ward', 'Vui lòng chọn phường/xã');
            isValid = false;
        }

        // Validate address
        if (!data.address || data.address.trim().length < 5) {
            this.showError('address', 'Địa chỉ phải có ít nhất 5 ký tự');
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;

        switch (fieldName) {
            case 'fullName':
                if (!this.validateFullName(value)) {
                    this.showError(fieldName, 'Vui lòng nhập họ và tên');
                    return false;
                }
                break;
            case 'phone':
                if (!this.validatePhone(value)) {
                    this.showError(fieldName, 'Số điện thoại không hợp lệ');
                    return false;
                }
                break;
            case 'email':
                if (!this.validateEmail(value)) {
                    this.showError(fieldName, 'Email không hợp lệ');
                    return false;
                }
                break;
            case 'province':
            case 'district':
            case 'ward':
                if (!value) {
                    this.showError(fieldName, `Vui lòng chọn ${this.getFieldLabel(fieldName)}`);
                    return false;
                }
                break;
            case 'address':
                if (!value || value.length < 5) {
                    this.showError(fieldName, 'Địa chỉ phải có ít nhất 5 ký tự');
                    return false;
                }
                break;
        }

        this.showSuccess(fieldName);
        return true;
    }

    validateFullName(name) {
        return name && name.trim().length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
    }

    validatePhone(phone) {
        return phone && /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone);
    }

    validateEmail(email) {
        return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    getFieldLabel(fieldName) {
        const labels = {
            'province': 'tỉnh/thành phố',
            'district': 'quận/huyện',
            'ward': 'phường/xã'
        };
        return labels[fieldName] || fieldName;
    }

    showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.classList.remove('success');
            field.classList.add('error');
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    showSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (field && errorElement) {
            field.classList.remove('error');
            field.classList.add('success');
            errorElement.classList.remove('show');
        }
    }

    clearError(field) {
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        
        field.classList.remove('error', 'success');
    }

    saveOrder(order) {
        // Get existing orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Add new order
        orders.push(order);
        
        // Save back to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        console.log('Order saved:', order);
    }

    showSuccessMessage(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.textContent = message;
        alertDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            background-color: #28a745;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
} 