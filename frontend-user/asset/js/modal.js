const modal = document.getElementById("modal-detail");
const closeModalButton = modal.querySelector("#cancle-modal-detail-button");
closeModalButton.addEventListener("click", () => {
	modal.classList.remove("active");
});
