// Product Management for Admin
class ProductManagement {
    constructor() {
        this.apiUrl = 'https://684cf65e65ed08713914b281.mockapi.io/product';
        this.allProducts = []; // Store all products for search
        this.currentSort = ''; // Current sort option
        this.currentSearch = ''; // Current search term
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkEditMode();
        this.loadProducts();
    }

    setupEventListeners() {
        // Product form (add/edit)
        const productForm = document.querySelector('#product-form');
        if (productForm) {
            productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
        }

        // Search functionality
        const searchInput = document.getElementById('search-product');
        const searchButton = document.getElementById('search-button');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const searchValue = searchInput ? searchInput.value : '';
                this.handleSearch(searchValue);
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-products');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                this.handleDeleteProduct(e.target.dataset.id);
            }
            if (e.target.classList.contains('edit-btn')) {
                this.handleEditClick(e.target.dataset.id);
            }
        });
    }

    // Validation functions
    validateProduct(product) {
        const errors = [];

        if (!product.name || product.name.trim().length < 2) {
            errors.push('Tên sản phẩm phải có ít nhất 2 ký tự');
        }

        if (!product.price || product.price <= 0) {
            errors.push('Giá sản phẩm phải lớn hơn 0');
        }

        if (!product.type) {
            errors.push('Vui lòng chọn hãng sản phẩm');
        }

        // Chỉ validate URL nếu có nhập
        if (product.img && product.img.trim() !== '' && !this.isValidUrl(product.img)) {
            errors.push('URL ảnh không hợp lệ');
        }

        return errors;
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    showMessage(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
        `;
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Check if we're in edit mode
    checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const editId = urlParams.get('edit');
        
        if (editId) {
            this.loadProductForEdit(editId);
            this.updatePageForEdit();
        }
    }

    updatePageForEdit() {
        const pageTitle = document.getElementById('page-title');
        const submitBtn = document.getElementById('submit-btn');
        
        if (pageTitle) pageTitle.textContent = 'Sửa sản phẩm';
        if (submitBtn) submitBtn.textContent = 'Cập nhật sản phẩm';
    }

    async loadProductForEdit(productId) {
        try {
            const response = await axios.get(`${this.apiUrl}/${productId}`);
            const product = response.data;
            this.populateForm(product);
        } catch (error) {
            this.showMessage('Không thể tải thông tin sản phẩm: ' + error.message, 'error');
            console.error('Load product for edit error:', error);
        }
    }

    populateForm(product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name || '';
        document.getElementById('price').value = product.price || '';
        document.getElementById('screen').value = product.screen || '';
        document.getElementById('backCamera').value = product.backCamera || '';
        document.getElementById('frontCamera').value = product.frontCamera || '';
        document.getElementById('image').value = product.img || '';
        document.getElementById('description').value = product.desc || '';
        document.getElementById('brand').value = product.type || '';
    }

    // CRUD Operations
    async handleProductSubmit(e) {
        e.preventDefault();
        
        const productId = document.getElementById('productId').value;
        const isEditMode = productId && productId.trim() !== '';
        
        const product = {
            name: document.getElementById('productName').value.trim(),
            price: Number(document.getElementById('price').value),
            screen: document.getElementById('screen').value.trim(),
            backCamera: document.getElementById('backCamera').value.trim(),
            frontCamera: document.getElementById('frontCamera').value.trim(),
            img: document.getElementById('image').value.trim(),
            desc: document.getElementById('description').value.trim(),
            type: document.getElementById('brand').value
        };

        // Validate
        const errors = this.validateProduct(product);
        if (errors.length > 0) {
            this.showMessage(errors.join('\n'), 'error');
            return;
        }

        try {
            console.log('Sending product data:', product);
            
            if (isEditMode) {
                // Update existing product
                const response = await axios.put(`${this.apiUrl}/${productId}`, product);
                this.showMessage('Cập nhật sản phẩm thành công!');
            } else {
                // Add new product
                const response = await axios.post(this.apiUrl, product);
                this.showMessage('Thêm sản phẩm thành công!');
            }
            
            document.querySelector('#product-form').reset();
            document.getElementById('productId').value = '';
            
            // Redirect to product list
            setTimeout(() => {
                window.location.href = './productlist.html';
            }, 1500);
            
        } catch (error) {
            console.error('Product submit error:', error);
            console.error('Error response:', error.response?.data);
            const action = isEditMode ? 'Cập nhật' : 'Thêm';
            this.showMessage(`${action} sản phẩm thất bại: ` + (error.response?.data || error.message), 'error');
        }
    }



    async handleDeleteProduct(productId) {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            await axios.delete(`${this.apiUrl}/${productId}`);
            this.showMessage('Xóa sản phẩm thành công!');
            this.loadProducts(); // Refresh product list
        } catch (error) {
            this.showMessage('Xóa sản phẩm thất bại: ' + error.message, 'error');
            console.error('Delete product error:', error);
        }
    }

    async handleEditClick(productId) {
        // Redirect to edit page
        window.location.href = `./productadd.html?edit=${productId}`;
    }



    // Search functionality
    handleSearch(searchTerm) {
        this.currentSearch = searchTerm;
        this.applyFiltersAndSort();
    }

    // Sort functionality
    handleSort(sortOption) {
        this.currentSort = sortOption;
        this.applyFiltersAndSort();
    }

    // Apply both search and sort filters
    applyFiltersAndSort() {
        let filteredProducts = [...this.allProducts];

        // Apply search filter
        if (this.currentSearch && this.currentSearch.trim() !== '') {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(this.currentSearch.toLowerCase())
            );
        }

        // Apply sort
        if (this.currentSort) {
            switch (this.currentSort) {
                case 'price-asc':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-desc':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                default:
                    // No sorting
                    break;
            }
        }

        this.renderProductTable(filteredProducts);
        
        // Show result message
        if (this.currentSearch && this.currentSearch.trim() !== '') {
            if (filteredProducts.length === 0) {
                this.showMessage(`Không tìm thấy sản phẩm nào có tên "${this.currentSearch}"`, 'error');
            } else {
                this.showMessage(`Tìm thấy ${filteredProducts.length} sản phẩm`, 'success');
            }
        }
    }

    // Load and display products
    async loadProducts() {
        const productTable = document.getElementById('product-table');
        if (!productTable) return;

        try {
            const response = await axios.get(this.apiUrl);
            this.allProducts = response.data; // Store all products
            this.renderProductTable(this.allProducts);
        } catch (error) {
            this.showMessage('Không thể tải danh sách sản phẩm: ' + error.message, 'error');
            console.error('Load products error:', error);
        }
    }

    renderProductTable(products) {
        const tbody = document.querySelector('#product-table tbody');
        if (!tbody) return;

        tbody.innerHTML = products.map(product => `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                <td>${product.screen || '-'}</td>
                <td>${product.backCamera || '-'}</td>
                <td>${product.frontCamera || '-'}</td>
                <td>${product.desc || '-'}</td>
                <td>${product.type}</td>
                <td>
                    <button class="edit-btn" data-id="${product.id}" style="background: #007bff; color: white; border: none; padding: 5px 8px; border-radius: 3px; margin-right: 5px; cursor: pointer;">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-id="${product.id}" style="background: #dc3545; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductManagement();
}); 