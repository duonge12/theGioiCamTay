const phoneBoxSection = document.getElementById("phonebox");
const animate = () => {
	const rect = phoneBoxSection.getBoundingClientRect();
	const isAtFullScreen = rect.y <= 0;
	const slideDown = phoneBoxSection.querySelector(
		".phonebox-grid:nth-child(1)"
	);
	const slideUp = phoneBoxSection.querySelector(
		".phonebox-grid:nth-child(2)"
	);
	const title = phoneBoxSection.querySelector(".title");
	const scrolled = Math.abs((rect.y / window.innerHeight) * 100);
	if (!isAtFullScreen) {
		slideDown.style.visibility = "hidden";
		slideUp.style.visibility = "hidden";
	}
	if (isAtFullScreen && scrolled <= 100) {
		slideDown.style.visibility = "visible";
		slideUp.style.visibility = "visible";

		const slideDownDistance = rect.y * -1.6;
		const slideUpDistance = rect.y * -0.5;
		const titleDistance = rect.y * -1;
		slideDown.style.transform = `translateY(${slideDownDistance}px)`;
		slideUp.style.transform = `translateY(${slideUpDistance}px)`;
		title.style.transform = `translateY(${titleDistance}px)`;

		title.style.opacity = scrolled / 100;
	}

	requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
