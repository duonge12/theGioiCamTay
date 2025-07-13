// Cache for API responses
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Menu Bar Responsive
const menuBar = document.querySelector(".header-bar-icon");
const headerNav = document.querySelector(".header-nav");
if (menuBar && headerNav) {
	menuBar.addEventListener("click", () => {
		headerNav.classList.toggle("active");
	});
}

// Cart icon click handler
// const cartIcon = document.querySelector(".header-cart i");
// if (cartIcon) {
//     cartIcon.addEventListener("click", () => {
//         window.location.href = "./shoppingcard.html";
//     });
// }

// click product-detail-img
const productDetailImg = document.querySelectorAll(".product-detail-img img");
productDetailImg.forEach((img) => {
	img.addEventListener("click", () => {
		const src = img.getAttribute("src");
		const productDetailLeft = document.querySelector(
			".product-detail-left img"
		);
		if (productDetailLeft) {
			productDetailLeft.src = src;
		}

		// Xóa class active từ tất cả hình ảnh
		productDetailImg.forEach((item) => {
			item.classList.remove("active");
		});

		// Thêm class active cho hình ảnh được click
		img.classList.add("active");
	});
});

// input quanlity product
const inputQuantity = document.querySelector(
	".product-detail-right-quantity-input input"
);
const plusBtn = document.querySelector(
	".product-detail-right-quantity-input .fa-plus"
);
const minusBtn = document.querySelector(
	".product-detail-right-quantity-input .fa-minus"
);

// Xử lý sự kiện thay đổi giá trị input
if (inputQuantity) {
	inputQuantity.addEventListener("change", (e) => {
		const value = parseInt(e.target.value);
		if (value < 1 || isNaN(value)) {
			e.target.value = 1;
		}
	});
}

// Xử lý sự kiện click nút plus (chỉ cho trang product detail)
if (plusBtn && window.location.pathname.includes("product.html")) {
	plusBtn.addEventListener("click", () => {
		if (inputQuantity) {
			const currentValue = parseInt(inputQuantity.value) || 1;
			inputQuantity.value = currentValue + 1;
		}
	});
}

// Xử lý sự kiện click nút minus (chỉ cho trang product detail)
if (minusBtn && window.location.pathname.includes("product.html")) {
	minusBtn.addEventListener("click", () => {
		if (inputQuantity) {
			const currentValue = parseInt(inputQuantity.value) || 1;
			if (currentValue > 1) {
				inputQuantity.value = currentValue - 1;
			}
		}
	});
}

// Hàm thêm sản phẩm vào giỏ hàng
async function addToCart() {
	if (inputQuantity) {
		const quantity = parseInt(inputQuantity.value) || 1;

		// Lấy thông tin sản phẩm từ trang hiện tại
		const productId = getProductIdFromUrl();
		if (!productId) {
			alert("Không tìm thấy thông tin sản phẩm!");
			return false;
		}

		try {
			const product = await fetchProductDetail(productId);
			if (product && window.shoppingCart) {
				// Sử dụng ShoppingCart class
				window.shoppingCart.addToCart(product, quantity);
				return true;
			} else {
				alert(
					"Không thể lấy thông tin sản phẩm hoặc giỏ hàng chưa được khởi tạo!"
				);
				return false;
			}
		} catch (error) {
			console.error("Lỗi khi thêm vào giỏ hàng:", error);
			alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
			return false;
		}
	}
	return false;
}

// thêm vào giỏ hàng
const addToCartBtn = document.querySelector(".add-to-cart-btn");

if (addToCartBtn) {
	addToCartBtn.addEventListener("click", async () => {
		// Đợi ShoppingCart được khởi tạo
		if (!window.shoppingCart) {
			alert("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
			return;
		}
		const success = await addToCart();
		if (success) {
			alert(
				`Đã thêm ${
					parseInt(inputQuantity.value) || 1
				} sản phẩm vào giỏ hàng!`
			);
		}
	});
}

// Xử lý nút "Mua ngay"
const buyNowBtn = document.querySelectorAll(".add-to-cart-btn")[1]; // Lấy nút thứ 2
if (buyNowBtn) {
	buyNowBtn.addEventListener("click", async () => {
		// Đợi ShoppingCart được khởi tạo
		if (!window.shoppingCart) {
			alert("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
			return;
		}
		const success = await addToCart();
		if (success) {
			// Chuyển thẳng đến trang giỏ hàng
			window.location.href = "./shoppingcard.html";
		}
	});
}

// ========== HIỂN THỊ DANH SÁCH SẢN PHẨM HOT-PRODUCT ========== //
// Product class đã được load từ Product.js

const API_ENDPOINT = "https://684cf65e65ed08713914b281.mockapi.io/product";

// Hàm kiểm tra cache
function getCachedProducts() {
	const cached = productCache.get("products");
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}
	return null;
}

// Hàm lưu cache
function setCachedProducts(products) {
	productCache.set("products", {
		data: products,
		timestamp: Date.now(),
	});
}

async function fetchProducts() {
	try {
		// Kiểm tra cache trước
		const cachedProducts = getCachedProducts();
		if (cachedProducts) {
			console.log("Lấy dữ liệu từ cache");
			return cachedProducts;
		}

		console.log("Đang gọi API:", API_ENDPOINT);
		const response = await axios.get(API_ENDPOINT, {
			timeout: 10000, // 10 second timeout
		});
		console.log("Response từ API:", response.data);

		const products = response.data.map((item) => new window.Product(item));

		// Lưu vào cache
		setCachedProducts(products);

		return products;
	} catch (error) {
		console.error("Lỗi khi lấy danh sách sản phẩm:", error);
		console.error("Error details:", error.response?.data);

		// Thử lấy từ cache nếu có lỗi
		const cachedProducts = getCachedProducts();
		if (cachedProducts) {
			console.log("Sử dụng dữ liệu cache do lỗi API");
			return cachedProducts;
		}

		return [];
	}
}
function createElement({ tag, props, child }) {
	const element = document.createElement(tag);
	if (props) {
		for (const [key, value] of Object.entries(props)) {
			element.setAttribute(key, value);
		}
	}
	if (child) {
		element.append(...child);
	}
	return element;
}
function createProductCard(product) {
	const { id, img, name, screen, price } = product;
	const card = createElement({
		tag: "div",
		props: {
			["class"]: "product-card",
			["data-id"]: id,
			["data-url"]: img,
			["data-name"]: name,
			["data-screen"]: screen,
			["data-price"]: price,
		},
		child: [
			createElement({
				tag: "div",
				props: undefined,
				child: [
					createElement({
						tag: "img",
						props: { ["src"]: img, ["alt"]: "Not found" },
						child: undefined,
					}),
				],
			}),
			createElement({
				tag: "div",
				props: undefined,
				child: [
					createElement({
						tag: "h2",
						props: undefined,
						child: [name],
					}),
					createElement({
						tag: "div",
						props: undefined,
						child: [price],
					}),
				],
			}),
		],
	});
	card.addEventListener("click", () => {
		const product = {
			["url"]: card.dataset.url,
			["name"]: card.dataset.name,
			["screen"]: card.dataset.screen,
			["price"]: card.dataset.price,
		};
		if (product) {
			const modalCard = modal.querySelector(".modal-card");
			modalCard.querySelector(".product-img").src = product.url;
			modalCard.querySelector(".product-name").innerHTML = product.name;
			modalCard.querySelector(".product-screen").innerHTML =
				product.screen;
			modalCard.querySelector(".product-name").innerHTML = product.name;
			modalCard.querySelector(".product-price").innerHTML = product.price;
			modal.classList.add("active");
		}
	});
	return card;
}
function renderHotProducts(products) {
	const container = document.querySelector("#products .products-list");
	if (!container) return;

	if (products.length === 0) {
		container.innerHTML =
			'<p style="text-align: center; grid-column: 1/-1; color: #666;">Không có sản phẩm nào</p>';
		return;
	}
	const cards = products.map((product) => createProductCard(product));
	container.append(...cards);
}

// Hàm thêm event listener cho các button trong danh sách sản phẩm hot
// function addHotProductEventListeners(products) {
// 	// Event listener cho button "Thêm vào giỏ hàng"
// 	const addToCartBtns = document.querySelectorAll(
// 		".hot-product-item .add-to-cart-btn"
// 	);
// 	addToCartBtns.forEach((btn) => {
// 		btn.addEventListener("click", async (e) => {
// 			e.preventDefault();
// 			e.stopPropagation();

// 			const productId = btn.getAttribute("data-product-id");
// 			const product = products.find((p) => p.id === productId);

// 			if (!product) {
// 				alert("Không tìm thấy thông tin sản phẩm!");
// 				return;
// 			}

// 			// Đợi ShoppingCart được khởi tạo
// 			if (!window.shoppingCart) {
// 				alert("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
// 				return;
// 			}

// 			// Thêm vào giỏ hàng với số lượng 1
// 			window.shoppingCart.addToCart(product, 1);
// 			alert("Đã thêm sản phẩm vào giỏ hàng!");
// 		});
// 	});

// 	// Event listener cho button "Mua ngay"
// 	const buyNowBtns = document.querySelectorAll(
// 		".hot-product-item .buy-now-btn"
// 	);
// 	buyNowBtns.forEach((btn) => {
// 		btn.addEventListener("click", async (e) => {
// 			e.preventDefault();
// 			e.stopPropagation();

// 			const productId = btn.getAttribute("data-product-id");
// 			const product = products.find((p) => p.id === productId);

// 			if (!product) {
// 				alert("Không tìm thấy thông tin sản phẩm!");
// 				return;
// 			}

// 			// Đợi ShoppingCart được khởi tạo
// 			if (!window.shoppingCart) {
// 				alert("Đang khởi tạo giỏ hàng, vui lòng thử lại!");
// 				return;
// 			}

// 			// Thêm vào giỏ hàng với số lượng 1
// 			window.shoppingCart.addToCart(product, 1);

// 			// Chuyển thẳng đến trang giỏ hàng
// 			window.location.href = "./shoppingcard.html";
// 		});
// 	});
// }

// Khởi tạo hiển thị sản phẩm khi load trang với Intersection Observer
if (document.querySelector("#products .products-list")) {
	// Sử dụng Intersection Observer để lazy load
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					fetchProducts().then(renderHotProducts);
					observer.unobserve(entry.target);
				}
			});
		},
		{
			threshold: 0.1,
		}
	);

	const hotProductSection = document.querySelector(
		"#products .products-list"
	);
	if (hotProductSection) {
		observer.observe(hotProductSection);
	}
}

// Lấy id từ URL
function getProductIdFromUrl() {
	const params = new URLSearchParams(window.location.search);
	return params.get("id");
}

async function fetchProductDetail(id) {
	try {
		// Kiểm tra cache
		const cacheKey = `product_${id}`;
		const cached = productCache.get(cacheKey);
		if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
			return cached.data;
		}

		const response = await axios.get(
			`https://684cf65e65ed08713914b281.mockapi.io/product/${id}`,
			{
				timeout: 10000,
			}
		);

		// Lưu vào cache
		productCache.set(cacheKey, {
			data: response.data,
			timestamp: Date.now(),
		});

		return response.data;
	} catch (error) {
		console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
		return null;
	}
}
function renderProductDetail(product) {
	if (!product) return;

	document.getElementById("product-title").textContent = product.name;
	document.getElementById("product-name").textContent = product.name;
	document.getElementById("product-screen").textContent = product.screen;
	document.getElementById("product-price").innerHTML = `${Number(
		product.price
	).toLocaleString()} <sup>đ</sup>`;
	document.getElementById("main-product-image").src = product.img;

	// Render mô tả chi tiết
	const details = [
		`Back Camera: ${product.backCamera}`,
		`Front Camera: ${product.frontCamera}`,
		`Mô tả: ${product.desc}`,
		`Loại: ${product.type}`,
	];
	document.getElementById("product-details").innerHTML = details
		.map((d) => `<li>${d}</li>`)
		.join("");
}

// Chạy logic chi tiết sản phẩm chỉ khi ở trang product.html
if (window.location.pathname.includes("product.html")) {
	document.addEventListener("DOMContentLoaded", async () => {
		const id = getProductIdFromUrl();
		if (!id) {
			console.log("Không tìm thấy ID sản phẩm trong URL");
			return;
		}
		const product = await fetchProductDetail(id);
		if (product) {
			renderProductDetail(product);
		} else {
			console.log("Không tìm thấy sản phẩm với ID:", id);
		}
	});
}
