// ========== HIỂN THỊ DANH SÁCH SẢN PHẨM ADMIN ========== //

// Product class inline
class Product {
    constructor({ name, price, screen, backCamera, frontCamera, img, desc, type, id }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.img = img;
        this.desc = desc;
        this.type = type;
    }

    formatPrice() {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.price);
    }
}

const API_ENDPOINT = 'https://684cf65e65ed08713914b281.mockapi.io/product';

async function fetchProducts() {
    try {
        const response = await axios.get(API_ENDPOINT);
        return response.data.map(item => new Product(item));
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        return [];
    }
}

function renderAdminProducts(products) {
    const tbody = document.querySelector('#product-table tbody');
    if (!tbody) return;
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.img}</td>
            <td>${product.name}</td>
            <td>${product.formatPrice()}</td>
            <td>${product.screen}</td>
            <td>${product.backCamera}</td>
            <td>${product.frontCamera}</td>
            <td>${product.desc}</td>
            <td>${product.type}</td>
            <td>
                <button class="btn-update" data-id="${product.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-delete" data-id="${product.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

if (document.querySelector('#product-table')) {
    fetchProducts().then(renderAdminProducts);
}
