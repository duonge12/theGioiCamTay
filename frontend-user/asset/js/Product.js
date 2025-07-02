// Product class định nghĩa cho sản phẩm
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

    // Format price to VND
    formatPrice() {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.price);
    }
}

// Export cho môi trường browser
window.Product = Product; 