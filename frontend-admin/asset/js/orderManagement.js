// Order Management for Admin
class OrderManagement {
    constructor() {
        this.orders = [];
        this.init();
    }

    init() {
        this.loadOrders();
        this.renderOrderTable();
    }

    loadOrders() {
        // Load orders from localStorage
        this.orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Add sample orders if no orders exist
        if (this.orders.length === 0) {
            this.orders = this.getSampleOrders();
            localStorage.setItem('orders', JSON.stringify(this.orders));
        }
        
        console.log('Loaded orders:', this.orders);
    }

    getSampleOrders() {
        return [
            {
                id: 1,
                customerInfo: {
                    fullName: 'Nguyễn Văn A',
                    phone: '0901234567',
                    email: 'vana@gmail.com',
                    province: 'Hà Nội',
                    district: 'Hoàn Kiếm',
                    ward: 'Hàng Bạc',
                    address: '123 Đường ABC',
                    note: 'Giao giờ hành chính'
                },
                items: [
                    { id: 1, name: 'iPhone 15 Pro', price: 2500000, quantity: 1 },
                    { id: 2, name: 'Samsung Galaxy S24', price: 2000000, quantity: 2 }
                ],
                totalItems: 3,
                totalPrice: 6500000,
                orderDate: '2024-06-01',
                status: 'pending'
            },
            {
                id: 2,
                customerInfo: {
                    fullName: 'Trần Thị B',
                    phone: '0912345678',
                    email: 'thib@gmail.com',
                    province: 'TP. Hồ Chí Minh',
                    district: 'Quận 1',
                    ward: 'Bến Nghé',
                    address: '456 Đường XYZ',
                    note: 'Giao buổi tối'
                },
                items: [
                    { id: 3, name: 'MacBook Pro M3', price: 12000000, quantity: 1 }
                ],
                totalItems: 1,
                totalPrice: 12000000,
                orderDate: '2024-06-02',
                status: 'pending'
            }
        ];
    }

    renderOrderTable() {
        const tbody = document.querySelector('.list-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.orders.forEach(order => {
            const row = this.createOrderRow(order);
            tbody.appendChild(row);
        });
    }

    createOrderRow(order) {
        const row = document.createElement('tr');
        
        // Format address
        const fullAddress = `${order.customerInfo.address}, ${order.customerInfo.ward}, ${order.customerInfo.district}, ${order.customerInfo.province}`;
        
        // Format price
        const formattedPrice = this.formatPrice(order.totalPrice);
        
        row.innerHTML = `
            <td>${order.customerInfo.fullName}</td>
            <td>${order.customerInfo.phone}</td>
            <td>${order.customerInfo.email}</td>
            <td>${order.totalItems}</td>
            <td>${formattedPrice}</td>
            <td>${fullAddress}</td>
            <td>${order.customerInfo.note}</td>
            <td>${order.orderDate}</td>
            <td><a href="./orderdetail.html?id=${order.id}">Xem chi tiết</a></td>
        `;
        
        return row;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    }

    getOrderById(id) {
        return this.orders.find(order => order.id == id);
    }

    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = status;
            localStorage.setItem('orders', JSON.stringify(this.orders));
            this.renderOrderTable();
        }
    }

    deleteOrder(orderId) {
        this.orders = this.orders.filter(order => order.id != orderId);
        localStorage.setItem('orders', JSON.stringify(this.orders));
        this.renderOrderTable();
    }
}

// Initialize order management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orderManagement = new OrderManagement();
}); 