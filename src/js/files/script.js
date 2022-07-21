// Импорт функционала ==============================================================================================================================================================================================================================================================================================================================
// import { isMobile } from "./functions.js";
// import { formsModules } from "./forms/forms.js";

// Календарь
import datepicker from 'js-datepicker';

window.addEventListener("load", function (e) {
	const bg = document.querySelectorAll('[data-bg]');
	if (bg.length) {
		bg.forEach(bgItem => {
			bgItem.insertAdjacentHTML('beforeend', `<div class="bg-item"></div>`);
		});
	}
	const bg2 = document.querySelectorAll('[data-bg2]');
	if (bg2.length) {
		bg2.forEach(bgItem => {
			bgItem.insertAdjacentHTML('beforeend', `<div class="bg-item2"></div>`);
		});
	}

	const picker = datepicker('[data-calendar]', {

	});
	if (document.querySelectorAll('.video-module')) {
		document.addEventListener("watcherCallback", function (e) {
			const entry = e.detail.entry;
			const targetElement = entry.target;
			if (targetElement.dataset.watch === 'video' && !targetElement.classList.contains('_init')) {
				if (entry.isIntersecting) {
					// Видим объект
					targetElement.querySelector('video').play();
				} else {
					// Не видим объект
					targetElement.querySelector('video').pause();
				}
			}
		});
		const videoModule = document.querySelector('.video-module');
		videoModule.addEventListener("click", function (e) {
			if (!document.querySelector('.video-module').classList.contains('_init')) {
				videoModule.querySelector('video').src = videoModule.querySelector('video').dataset.full;
				videoModule.classList.add('_active');
				videoModule.classList.add('_init');
				videoModule.querySelector('video').play();
				videoModule.querySelector('video').muted = false;
			} else {
				if (videoModule.querySelector('video').paused) {
					videoModule.querySelector('video').play();
				} else {
					videoModule.querySelector('video').pause();
				}
				videoModule.classList.toggle('_active');
			}
		});
	}
});
//* Scroll-Top ========================================================================================================================================================


/*
const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}
			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				animItem.classList.remove('_active');
			}
		}
	}

	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return {
			top: rect.top + scrollTop,
			left: rect.left + scrollLeft
		}
	}
	animOnScroll()
}
*/

function scrollTo(to, duration = 700) {
	const
		element = document.scrollingElement || document.documentElement,
		start = element.scrollTop,
		change = to - start,
		startDate = +new Date(),
		// t = current time
		// b = start value
		// c = change in value
		// d = duration
		easeInOutQuad = function (t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t + b;
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		},
		animateScroll = function () {
			const currentDate = +new Date();
			const currentTime = currentDate - startDate;
			element.scrollTop = parseInt(easeInOutQuad(currentTime, start, change, duration));
			if (currentTime < duration) {
				requestAnimationFrame(animateScroll);
			} else {
				element.scrollTop = to;
			}
		};
	animateScroll();
}

document.addEventListener('DOMContentLoaded', function () {
	let btn = document.querySelector('._anim-items');
	window.addEventListener('scroll', function () {
		// Если прокрутили дальше 599px, показываем кнопку
		if (pageYOffset > 700) {
			btn.classList.add('_active');
			// Иначе прячем
		} else {
			btn.classList.remove('_active');
		}
	});

	// // При клике прокручиываем на самый верх
	// btn.onclick = function (click) {
	// 	click.preventDefault();
	// 	scrollTo(0, 400);
	// }
});

//* scroll header ========================================================================================================================================================

window.onload = function () {
	const parallax = document.querySelector('.welcome, .barpage-slider');

	if (parallax) {
		const content = document.querySelector('.welcome__container, .barpage__images');
		const images = document.querySelector(
			'.images-welcome__background, .images-barpage__background, .images-contact__background, .images-blogs__background'
		)

		// Коэффициенты
		const forImages = 40;

		// Скорость анимации
		const speed = 0.07;

		// Объявление переменных
		let positionX = 0,
			positionY = 0;
		let coordXprocent = 0,
			coordYprocent = 0;

		function setMouseParallaxStyle() {
			const distX = coordXprocent - positionX;
			const distY = coordYprocent - positionY;
			positionX = positionX + (distX * speed);
			positionY = positionY + (distY * speed);

			// Передаем стили
			images.style.cssText = `transform: translate(${positionX / forImages}%,${positionY / forImages}%);`;
			requestAnimationFrame(setMouseParallaxStyle);
		}
		setMouseParallaxStyle();

		parallax.addEventListener("mousemove", function (e) {
			// Получение ширины и высоты блока
			const parallaxWidth = parallax.offsetWidth;
			const parallaxHeight = parallax.offsetHeight;

			// Ноль по середине
			const coordX = e.pageX - parallaxWidth / 2;
			const coordY = e.pageY - parallaxHeight / 2;

			// Получаем проценты
			coordXprocent = coordX / parallaxWidth * 100;
			coordYprocent = coordY / parallaxHeight * 100;
		});

		// Parallax при скролле

		let thresholdSets = [];
		for (let i = 0; i <= 1.0; i += 0.0009) {
			thresholdSets.push(i);
		}
		const callback = function (entries, observer) {
			const scrollTopProcent = window.pageYOffset / parallax.offsetHeight * 100;
			setParallaxItemsStyle(scrollTopProcent);
		};
		const observer = new IntersectionObserver(callback, {
			threshold: thresholdSets
		});

		observer.observe(
			document.querySelector('.history, .mainpage__body, .contact-maps')
		)

		function setParallaxItemsStyle(scrollTopProcent) {
			content.style.cssText = `transform: translate(0%,${scrollTopProcent / 0}%);`;
			images.parentElement.style.cssText = `transform: translate(0%,${scrollTopProcent / 5}%);`;
		}
	}
}

// form========================================================================================================================================================

document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		// вытягиваем данные из полей формы 
		let formData = new FormData(form);
		// formData.append(files[0]);

		if (error === 0) {
			form.classList.add('_sending');
			let response = await fetch('../../sendmail.php', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				let result = await response.json();
				alert(result.message);
				formPreview.innerHTML = '';
				form.reset();
				form.classList.remove('_sending');
			} else {
				alert("Ошибка");
				form.classList.remove('_sending');
			}
		} else {
			alert('Заполните обязательные поля');
		}


	}

	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
				formAddError(input);
				error++;
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}

	function emailTest(input) {
		return !/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(input.value);
	}
});


//* Maps========================================================================================================================================================
		// Initialize and add the map
		function initMap() {
			// The location of Uluru
			const uluru = { lat: 51.499259, lng: -0.1265852 };
			// The map, centered at Uluru
			const map = new google.maps.Map(document.getElementById("contact__map"), {
				zoom: 11,
				center: uluru,
				styles: [
					{
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#212121"
							}
						]
					},
					{
						"elementType": "labels.icon",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#757575"
							}
						]
					},
					{
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#212121"
							}
						]
					},
					{
						"featureType": "administrative",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#757575"
							}
						]
					},
					{
						"featureType": "administrative.country",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#9e9e9e"
							}
						]
					},
					{
						"featureType": "administrative.land_parcel",
						"stylers": [
							{
								"visibility": "off"
							}
						]
					},
					{
						"featureType": "administrative.locality",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#bdbdbd"
							}
						]
					},
					{
						"featureType": "poi",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#757575"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#181818"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#616161"
							}
						]
					},
					{
						"featureType": "poi.park",
						"elementType": "labels.text.stroke",
						"stylers": [
							{
								"color": "#1b1b1b"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#2c2c2c"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#8a8a8a"
							}
						]
					},
					{
						"featureType": "road.arterial",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#373737"
							}
						]
					},
					{
						"featureType": "road.highway",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#3c3c3c"
							}
						]
					},
					{
						"featureType": "road.highway.controlled_access",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#4e4e4e"
							}
						]
					},
					{
						"featureType": "road.local",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#616161"
							}
						]
					},
					{
						"featureType": "transit",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#757575"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#000000"
							}
						]
					},
					{
						"featureType": "water",
						"elementType": "labels.text.fill",
						"stylers": [
							{
								"color": "#3d3d3d"
							}
						]
					}
				],
			});
			// The marker, positioned at Uluru
			marker = new google.maps.Marker({
				map,
				draggable: true,
				title: "Drag me!",
				animation: google.maps.Animation.DROP,
				position: { lat: 51.499259, lng: -0.1265852 },
			});
			marker.addListener("click", toggleBounce);
			function toggleBounce() {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
		}
		window.initMap = initMap;