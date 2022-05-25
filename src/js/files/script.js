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

// ========================================================================================================================================================

window.onload = function () {
	const parallax = document.querySelector('.welcome');

	if (parallax) {
		const content = document.querySelector('.welcome__container');
		const images = document.querySelector('.images-welcome__background');

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
		for (let i = 0; i <= 1.0; i += 0.005) {
			thresholdSets.push(i);
		}
		const callback = function (entries, observer) {
			const scrollTopProcent = window.pageYOffset / parallax.offsetHeight * 100;
			setParallaxItemsStyle(scrollTopProcent);
		};
		const observer = new IntersectionObserver(callback, {
			threshold: thresholdSets
		});

		observer.observe(document.querySelector('.history'));

		function setParallaxItemsStyle(scrollTopProcent) {
			content.style.cssText = `transform: translate(0%,-${scrollTopProcent / 5}%);`;
			images.parentElement.style.cssText = `transform: translate(0%,-${scrollTopProcent / 13}%);`;
		}
	}
}
