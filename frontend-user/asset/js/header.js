const button = document.getElementById("header-toggle");
const menuMobile = document.getElementsByClassName("menu-mobile")[0];
button.addEventListener("click", () => {
	menuMobile.classList.toggle("active");
});
