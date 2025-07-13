const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;
const API_ENDPOINT = "https://684cf65e65ed08713914b281.mockapi.io/product";
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
function handleClickProductCard(card) {
	const { url, name, screen, price } = card.dataset;
	const product = {
		["url"]: url,
		["name"]: name,
		["screen"]: screen,
		["price"]: price,
	};
	if (product) {
		const modalCard = modal.querySelector(".modal-card");
		modalCard.querySelector(".product-img").src = product.url;
		modalCard.querySelector(".product-name").innerHTML = product.name;
		modalCard.querySelector(".product-screen").innerHTML = product.screen;
		modalCard.querySelector(".product-name").innerHTML = product.name;
		modalCard.querySelector(".product-price").innerHTML = product.price;
		modal.classList.add("active");
	}
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
	card.addEventListener("click", (e) => handleClickProductCard(card));
	return card;
}
function renderProductsCards(products) {
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
function getCachedProducts() {
	const cached = productCache.get("products");
	if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
		return cached.data;
	}
	return null;
}
function setCachedProducts(products) {
	productCache.set("products", {
		data: products,
		timestamp: Date.now(),
	});
}

function theGioiCamTayApi(protocol = "https://", domain, resource) {
	const baseURL = `${protocol}${domain}/${resource}`;

	const api = {
		get: async function (id = "") {
			const url = id ? `${baseURL}/${id}` : baseURL;
			const response = await axios.get(url);
			return response.data;
		},

		// POST: create new
		post: async function (data) {
			const response = await axios.post(baseURL, data, {
				headers: { "Content-Type": "application/json" },
			});
			return response.data;
		},

		// PUT: update by ID
		put: async function (id, data) {
			const response = await axios.put(`${baseURL}/${id}`, data, {
				headers: { "Content-Type": "application/json" },
			});
			return response.data;
		},

		// DELETE: remove by ID
		delete: async function (id) {
			const response = await axios.delete(`${baseURL}/${id}`);
			return response.data;
		},
	};

	return api;
}

async function fetchProducts() {
	try {
		// Kiểm tra cache trước, cached có dữ liệu và thời gian lưu cho tới bây giờ không quá 5 phút
		const cachedProducts = getCachedProducts();
		if (cachedProducts) {
			return cachedProducts;
		}
		const productsApi = theGioiCamTayApi(
			"https://",
			"684cf65e65ed08713914b281.mockapi.io",
			"product"
		);
		const response = await productsApi.get();
		const products = response;
		setCachedProducts(products);

		return products;
	} catch (error) {
		return error;
	}
}

//Thực thi

const productCardsContainer = document.querySelector(
	"#products .products-list"
);
const modal = document.getElementById("modal-detail");
const closeModalButton = modal.querySelector("#cancle-modal-detail-button");
closeModalButton.addEventListener("click", () => {
	modal.classList.remove("active");
});
//code:@@@@@@@@@
if (productCardsContainer) {
	fetchProducts()
		.then(renderProductsCards)
		.catch((err) => {
			console.log("search :@@@@@@@@@ in productsPage.js");
			console.log(err);
		});
}
