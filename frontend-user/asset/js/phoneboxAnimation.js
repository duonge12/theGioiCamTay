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
		const slideDownDistance = Math.ceil(scrolled * 3) * 1.1;
		const slideUpDistance = Math.ceil(scrolled * 1) * 1.1;
		slideDown.style.transform = `translateY(${slideDownDistance}%)`;
		slideUp.style.transform = `translateY(${slideUpDistance}%)`;
		title.style.transform = `translateY(${scrolled}%)`;
		console.log("a", Math.ceil(scrolled * 3));
		title.style.opacity = scrolled / 100;
	}

	requestAnimationFrame(animate);
};
requestAnimationFrame(animate);
