(function () {
	'use strict';

	function VSwiper() {
		let defaultParams = {
			containerModifierClass:  'swiper-container-',
			slideClass:  'swiper-slide',
			slideActiveClass:  'swiper-slide-active',
			slideDuplicateActiveClass:  'swiper-slide-duplicate-active',
			slideVisibleClass:  'swiper-slide-visible',
			slideDuplicateClass:  'swiper-slide-duplicate',
			slideNextClass:  'swiper-slide-next',
			slideDuplicateNextClass:  'swiper-slide-duplicate-next',
			slidePrevClass:  'swiper-slide-prev',
			slideDuplicatePrevClass:  'swiper-slide-duplicate-prev',
			slideBlankClass:  'swiper-slide-invisible-blank',
			wrapperClass:  'swiper-wrapper',
			navigation: {
				disabledClass:  'swiper-button-disabled',
				hiddenClass:  'swiper-button-hidden',
				lockClass:  'swiper-button-lock'
			},
			pagination: {
				bulletClass:  'swiper-pagination-bullet',
				bulletActiveClass:  'swiper-pagination-bullet-active',
				modifierClass:  'swiper-pagination-',
				currentClass:  'swiper-pagination-current',
				totalClass:  'swiper-pagination-total',
				hiddenClass:  'swiper-pagination-hidden',
				progressbarFillClass:  'swiper-pagination-progressbar-fill',
				clickableClass:  'swiper-pagination-clickable',
				lockClass:  'swiper-pagination-lock',
				progressbarOppositeClass:  'swiper-pagination-progressbar-opposite',
			},
			scrollbar: {
				lockClass:  'swiper-scrollbar-lock',
				dragClass:  'swiper-scrollbar-drag',
			}
		};

		this.init = function (el, slierParams) {
			if (!slierParams) slierParams = {};

			let defaultParamsKeys = Object.keys(defaultParams);

			for(let i = 0; i < defaultParamsKeys.length; i++){
				let index = defaultParamsKeys[i],
					param = defaultParams[index];

				if(!slierParams[index]){
					slierParams[index] = param;
				}else if(param instanceof Object){
					let paramKeys = Object.keys(param);

					for(let i2 = 0; i2 < paramKeys.length; i2++){
						let index2 = paramKeys[i2],
							param2 = param[index2];

						if(!slierParams[index][index2]){
							slierParams[index][index2] = param2;
						}
					}
				}
			}

			return new Swiper(el, slierParams);
		};
	}

	/*
	--------------------------------------------
	--------------------------------------------
			  		COUNTUP
	--------------------------------------------
	--------------------------------------------
	*/
	function Countup(block) {
		let classes = {
			base: 'countup',
			withoutSeparate: 'countup--without-separate',
			initialized: 'countup--initialized'
		};

		let duration = 2000,
			frameCount = 1000 / 60;

		let easeOutCubic = function (val) {
			return 1 - Math.pow(1 - val, 3);
		};
		let animate = function (el) {
			if(el.classList.contains(classes.initialized)){
				return false;
			}
			el.classList.add(classes.initialized);

			let frame = 0,
				totalFrames = Math.round(duration / frameCount),
				dataVal = el.getAttribute('data-value').replace(/,/, "."),
				decimalCount = parseInt(el.dataset.decimalCount || 0),
				decimalSymbol = el.dataset.decimalSymbol || "",
				thousandSymbol = el.dataset.thousandSymbol || " ",
				isFloat = dataVal.indexOf(',') !== -1 || dataVal.indexOf('.') !== -1,
				countTo = parseFloat(dataVal);

			let counter = setInterval(function(){
				frame++;

				const progress = easeOutCubic(frame / totalFrames);
				let currentCount = countTo * progress;

				if(isFloat){
					currentCount = currentCount.toFixed(2).toString(1);
				}else{
					currentCount = Math.round(currentCount);
				}

				if (parseFloat(el.innerHTML) !== currentCount) {
					if(currentCount > 999 && !el.classList.contains(classes.withoutSeparate)){
						currentCount = currentCount.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSymbol);
					}
					el.innerHTML = currentCount;
				}

				if (frame === totalFrames) {
					clearInterval(counter);
				}
			}, frameCount);
		};
		let init = function () {
			if (typeof block === "string")
				block = document.querySelector(block);
			let blockElement = block;
			let items = blockElement.getElementsByClassName(classes.base);

			for (let i = 0; i < items.length; i++){
				animate(items[i]);
			}
		};

		init();
	}

	function Video() {
		let classes = {
			item: 'video',
			itemPlaying: 'video--playing',
		};

		let getVideoFrame = function (videoId, source) {
			let iframe = document.createElement('iframe');
				iframe.frameBorder = "0";
				iframe.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
				iframe.allowFullscreen = "";

			switch (source) {
				case "vimeo":
					iframe.src = 'https://player.vimeo.com/video/' + videoId + '?autoplay=1';
					break;
				default:
					iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&controls=1&showinfo=0';
			}

			return iframe;
		};
		let play = function (item) {
			if (item.classList.contains(classes.itemPlaying)) {
				return false;
			}

			let videoId = item.getAttribute('data-video-id'),
				source = item.getAttribute('data-video-source'),
				iframe = getVideoFrame(videoId, source);

			item.classList.add(classes.itemPlaying);
			item.appendChild(iframe);
		};
		let listenPlayClick = function () {
			let items = document.getElementsByClassName(classes.item);

			for (let i = 0; i < items.length; i++) {
				let item = items[i];

				item.addEventListener('click', function () {
					play(item);
				});
			}
		};
		let init = function () {
			listenPlayClick();
		};

		this.destroy = function (item) {
			item.classList.remove(classes.itemPlaying);
			item.removeChild(item.querySelector('iframe'));
		};

		init();
	}

	function Content(callback) {
		let classes = {
			tab: 'content-tab',
			swiperContainer: 'swiper-container',
			tabActive: 'content-tab--active',
			content: 'content',
			contentActive: 'content--active',
			contentOpacity1: 'content--opacity-1',
		};

		let contents,
			tabs,
			classPrefix = 'content__';

		let updateActiveSwipers = function () {
			let contents = document.getElementsByClassName(classes.contentActive);

			for (let i = 0; i < contents.length; i++) {
				let swipers = contents[i].getElementsByClassName(classes.swiperContainer);
				for (let i2 = 0; i2 < swipers.length; i2++) {
					if(swipers[i2].swiper){
						swipers[i2].swiper.update();
					}
				}
			}
		};
		let change = function (contentTag) {
			let contents = document.getElementsByClassName(classPrefix + contentTag);

			hideAll(contentTag);
			deactivateAllTabs();

			if(callback){
				callback(contentTag);
			}

			setTimeout(function () {
				show(contents);
				setTimeout(updateActiveSwipers, 50);
			}, 400);

			let activeTabSelector = '.' + classes.tab + '[href="#' + contentTag + '"]',
				activeTabs = document.querySelectorAll(activeTabSelector);

			for (let i = 0; i < activeTabs.length; i++) {
				activeTabs[i]
					.classList
					.add(classes.tabActive);
			}

			if (window.location.hash.substr(1) !== contentTag) {
				window.location.hash = '#' + contentTag;
			}
		};
		let hideAll = function (exceptTag) {
			let exceptClass = classPrefix + exceptTag;
			for (let i = 0; i < contents.length; i++) {
				let content = contents[i];

				if (!content.classList.contains(exceptClass)) {
					content.classList.remove(classes.contentOpacity1);
					setTimeout(function () {
						content.classList.remove(classes.contentActive);
					}, 400);
				}
			}
		};
		let show = function (contents) {
			if (typeof contents !== "object") {
				contents = [contents];
			}

			for (let i = 0; i < contents.length; i++) {
				let content = contents[i];

				content.classList.add(classes.contentActive);
				setTimeout(function () {
					content.classList.add(classes.contentOpacity1);
				}, 50);
			}
		};
		let deactivateAllTabs = function () {
			for (let i = 0; i < tabs.length; i++) {
				tabs[i].classList.remove(classes.tabActive);
			}
		};
		let listenTabClick = function () {
			for (let i = 0; i < tabs.length; i++) {
				tabs[i].addEventListener('click', function () {
					let content = this.getAttribute('href').replace('#', '');
					change(content);
					scrollTo({ top: 0, behavior: 'smooth' });
				});
			}
		};
		let getCurrentTab = function () {
			return tabs[0] && tabs[0].getAttribute('href')
				? tabs[0].getAttribute('href')
				: "";
		};
		let init = function () {
			contents = document.getElementsByClassName(classes.content);
			tabs = document.getElementsByClassName(classes.tab);

			let hash = window.location.hash;
			if (hash !== '' && hash !== getCurrentTab()) {
				setTimeout(change, 200, hash.substr(1));
			}

			listenTabClick();
		};

		init();
	}

	function closest(element, selector) {
		if (element.closest) {
			return element.closest(selector);
		}
		function closest(parentElement, selector) {
			if (!parentElement) return null;
			if (parentElement.matches(selector)) return parentElement;
			if (!parentElement.parentElement) return null;
			return closest(element.parentElement, selector);
		}

		return closest(element.parentElement, selector);
	}

	function Nav() {
		let nav, btn, opened = false;
		let classes = {
			nav: {
				base: 'nav',
				opened: 'nav--opened'
			},
			btn: {
				base: 'nav-btn',
				active: 'nav-btn--active',
				closed: 'nav-btn--closed'
			}
		};

		let close = function () {
			opened = false;
			nav.classList.remove(classes.nav.opened);
			btn.classList.remove(classes.btn.active);
			btn.classList.add(classes.btn.closed);
		};
		let open = function () {
			opened = true;
			nav.classList.add(classes.nav.opened);
			btn.classList.remove(classes.btn.closed);
			btn.classList.add(classes.btn.active);
		};

		let headerNav = document.querySelector('.header__nav');
		let tabs = document.querySelectorAll('.content-tab');
		// let navs = document.querySelectorAll('.nav__item--parent')
		headerNav.addEventListener('click', function () {
			opened = true;
			nav.classList.add(classes.nav.opened);
			btn.classList.remove(classes.btn.closed);
			btn.classList.add(classes.btn.active);
		});
		for (let tab of tabs){
			tab.addEventListener('click', function (event) {
				event.stopPropagation();
				opened = false;
				nav.classList.remove(classes.nav.opened);
				btn.classList.remove(classes.btn.active);
				btn.classList.add(classes.btn.closed);
			});
		}
		// let currentNav = null
		// for (let nav of navs){
		// 	nav.addEventListener('click', () => {
		// 		if (currentNav === nav){
		// 			nav.firstElementChild.classList.remove('nav__item-menu--active')
		// 			currentNav = null
		// 		}else{
		// 			navs.forEach(nav => nav.firstElementChild.classList.remove('nav__item-menu--active'))
		// 			nav.firstElementChild.classList.add('nav__item-menu--active')
		// 			currentNav = nav
		// 		}
		// 	})
		// }

		let toggle = function () {
			if(opened){
				close();
			}else{
				open();
			}
		};
		let listenBtnClick = function () {
			btn.addEventListener('click', toggle);
		};
		let listenOutClick = function (){
			document.addEventListener('mousedown', function (event) {
				if (!event.target) return;
				if(!opened) return;
				if(event.target !== btn && !closest(event.target, '.' + classes.btn.base)){
					close();
				}
			});
		};
		let init = function () {
			nav = document.querySelector('.' + classes.nav.base);
			btn = document.querySelector('.' + classes.btn.base);

			listenOutClick();
			listenBtnClick();
		};

		init();
	}

	/*
	available options:
	onInit: Function
	onBeforeShow: Function
	onAfterShow: Function
	onBeforeHide: Function
	onAfterHide: Function
	*/
	function Modal(modalSelector, options) {
		let classes = {
			pageWrapper: 'wrapper',
			modal: 'modal',
			modalShow: 'modal--show',
			window: 'modal__window',
			closeBtn: 'modal__close-btn',
		};
		let modal;
		let onInit = function (){},
			onBeforeShow = function (){},
			onAfterShow = function (){},
			onBeforeHide = function (){},
			onAfterHide = function (){};

		let hide = function(){
			onBeforeHide();
			modal.classList.remove(classes.modalShow);
			onAfterHide();
		};
		let show = function(){
			onBeforeShow();
			modal.classList.add(classes.modalShow);
			onAfterShow();
		};
		let center = function (){
			let wrapperPos = document.querySelector('.' + classes.pageWrapper).offsetTop,
				modalWindow = modal.querySelector('.' + classes.window),
				modalWindowHeight = parseInt(getComputedStyle(modalWindow)['height']);

			modalWindow.style.top = (window.pageYOffset - wrapperPos + (window.innerHeight / 2 - modalWindowHeight / 2)) + "px";
		};
		let listenModalOutClick = function (){
			document.addEventListener('mousedown', function (event) {
				if (!event.target) return;
				if (!event.target.classList.contains(classes.window) && !closest(event.target, '.' + classes.window)) {
					hide();
				}
			});
		};
		let listenCloseBtnClick = function (){
			const closeBtn = modal.querySelector('.' + classes.closeBtn);
			if (!closeBtn) return;
			closeBtn.addEventListener('click', hide);
		};
		let init = function(){
			modal = document.querySelector(modalSelector);
			if (!modal) {
				console.error('Modal with selector ' + modalSelector + ' not found');
				return;
			}
			if (options !== undefined && options instanceof Object) {
				if (options.onInit !== undefined && options.onInit instanceof Function) {
					onInit = options.onInit;
				}
				if (options.onBeforeShow !== undefined && options.onBeforeShow instanceof Function) {
					onBeforeShow = options.onBeforeShow;
				}
				if (options.onAfterShow !== undefined && options.onAfterShow instanceof Function) {
					onAfterShow = options.onAfterShow;
				}
				if (options.onBeforeHide !== undefined && options.onBeforeHide instanceof Function) {
					onBeforeHide = options.onBeforeHide;
				}
				if (options.onAfterHide !== undefined && options.onAfterHide instanceof Function) {
					onAfterHide = options.onAfterHide;
				}
			}
			listenModalOutClick();
			listenCloseBtnClick();
			onInit();
		};

		this.hide = hide;
		this.show = function(){
			center();
			show();
		};

		init();
	}
	/*
		--------------------------------------------
		--------------------------------------------
						SLIDERS
		--------------------------------------------
		--------------------------------------------
	 */
		function initCompanySlider() {
			swiper.init(".company-slider", {
				loop: true,
				slidesPerView: '6',
				autoHeight: true,
				speed: 3000,
				autoplay: {
					enabled: true,
    				delay: 500,
					disableOnInteraction: false,
				  },
				bulletActiveClass: '.company-slider-pagination-active',
				pagination: {
					el: '.company-slider__pagination',
					clickable: true,
				},
			});
		}

		function initCompanySecondSlider() {
			swiper.init(".company-slider__second", {
				loop: true,
				slidesPerView: '6',
				autoHeight: true,
				speed: 3000,
				autoplay: {
					enabled: true,
    				delay: 1,
					disableOnInteraction: false,
				  },
				bulletActiveClass: '.company-slider__second-pagination-active',
				pagination: {
					el: '.company-slider__second__pagination',
					clickable: true,
				},
			});
		}

		function initCompanyThirdSlider() {
			swiper.init(".company-slider__third", {
				loop: true,
				slidesPerView: '6',
				autoHeight: true,
				speed: 3000,
				autoPlay: true,
				autoplay: {
					enabled: true,
    				delay: 1,
					disableOnInteraction: false,
				  },
				bulletActiveClass: '.company-slider__third-pagination-active',
				pagination: {
					el: '.company-slider__third__pagination',
					clickable: true,
				},
			});
		}

		function initGallerySlider() {
			swiper.init(".gallery-slider", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				bulletActiveClass: '.gallery-slider-pagination-active',
				navigation: {
					prevEl: ".gallery-slider-arrow-prev",
					nextEl: ".gallery-slider-arrow-next",
				},
				pagination: {
					el: '.gallery-slider__pagination',
					clickable: true,
				},
			});
		}

		function initTeacherSlider1() {
			swiper.init(".teacher-slider1", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				bulletActiveClass: '.teacher-slider1-pagination-active',
				navigation: {
					prevEl: ".teacher-slider1-arrow-prev",
					nextEl: ".teacher-slider1-arrow-next",
				},
				pagination: {
					el: '.teacher-slider1__pagination',
					clickable: true,
				},
			});
		}

		function initTeacherSlider2() {
			swiper.init(".teacher-slider2", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				bulletActiveClass: '.teacher-slider2-pagination-active',
				navigation: {
					prevEl: ".teacher-slider2-arrow-prev",
					nextEl: ".teacher-slider2-arrow-next",
				},
				pagination: {
					el: '.teacher-slider2__pagination',
					clickable: true,
				},
			});
		}

		function initTeacherSlider3() {
			swiper.init(".teacher-slider3", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				bulletActiveClass: '.teacher-slider3-pagination-active',
				navigation: {
					prevEl: ".teacher-slider3-arrow-prev",
					nextEl: ".teacher-slider3-arrow-next",
				},
				pagination: {
					el: '.teacher-slider3__pagination',
					clickable: true,
				},
			});
		}

		function initTeacherSlider4() {
			swiper.init(".teacher-slider4", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				bulletActiveClass: '.teacher-slider4-pagination-active',
				navigation: {
					prevEl: ".teacher-slider4-arrow-prev",
					nextEl: ".teacher-slider4-arrow-next",
				},
				pagination: {
					el: '.teacher-slider4__pagination',
					clickable: true,
				},
			});
		}

		function initCourseProgram() {
			swiper.init(".course-program-s", {
				loop: true,
				slidesPerView: 1,
				autoHeight: true,
				spaceBetween: 30,
				bulletActiveClass: '.course-program-pagination-active',
				navigation: {
					prevEl: ".course-program-arrow-prev",
					nextEl: ".course-program-arrow-next",
				},
				pagination: {
					el: '.course-program__pagination',
					clickable: true,
				},
			});
		}

		function initVideoSlider() {
			swiper.init(".video-slider", {
				loop: false,
				slidesPerView: 3,
				autoHeight: true,
				bulletActiveClass: '.video-slider-pagination-active',
				spaceBetween: 32,
				navigation: {
					prevEl: ".video-slider-arrow-prev",
					nextEl: ".video-slider-arrow-next",
				},
				pagination: {
					el: '.video-slider__pagination',
					clickable: true,
				},
				breakpoints: {
					699: {
						slidesPerView: 1,
						spaceBetween: 0,
					}
				} 
			});
		}
	/*
		--------------------------------------------
		--------------------------------------------
							STATS
		--------------------------------------------
		--------------------------------------------
	 */
		const scrollElements = document.querySelectorAll(".s-stats");
		const elementInView = (el, dividend = 1) => {  
			const elementTop = el.getBoundingClientRect().top;  
			return (    
				elementTop <=    
				(window.innerHeight || document.documentElement.clientHeight) / dividend  );};
				const handleScrollAnimation = () => {  
					scrollElements.forEach((el) => {    
						if (elementInView(el, 1.25)) {      
							new Countup(".s-stats");
						}  
					});
				};
				window.addEventListener("scroll", () => {   handleScrollAnimation();});

		const scrollElementsSecond = document.querySelectorAll(".s-stats-second");
		const elementInViewSecond = (el, dividend = 1) => {  
			const elementTop = el.getBoundingClientRect().top;  
			return (    
				elementTop <=    
				(window.innerHeight || document.documentElement.clientHeight) / dividend  );};
				const handleScrollAnimationSecond = () => {  
					scrollElementsSecond.forEach((el) => {    
						if (elementInViewSecond(el, 1.25)) {      
							new Countup(".s-stats-second");
						}  
					});
				};
				window.addEventListener("scroll", () => {   handleScrollAnimationSecond();});
		/*
		--------------------------------------------
		--------------------------------------------
							TABS
		--------------------------------------------
		--------------------------------------------
	 */
				
		const tabsBtn = document.querySelectorAll(".tabs__nav-btn");
		const tabsItem = document.querySelectorAll(".tabs__item");
		tabsBtn.forEach(onTabClick);

		function onTabClick(item) {
			item.addEventListener("click", function() {
				let currentBtn = item;
				let tabId = currentBtn.getAttribute("data-tab");
				let currentTab = document.querySelector(tabId);
				if( !currentBtn.classList.contains("tabs__nav-btn--active") ) {
					tabsBtn.forEach(function(item) {
						item.classList.remove("tabs__nav-btn--active");
					});
					tabsItem.forEach(function(item) {
						item.classList.remove("tabs__item--active");
					});
					currentBtn.classList.add("tabs__nav-btn--active");
					currentTab.classList.add("tabs__item--active");
				}else{
					currentBtn.classList.remove('tabs__nav-btn--active');
					currentTab.classList.remove('tabs__item--active');
				}
			});
		}

		document.querySelector(".tabs__nav-btn").click();

	/*
		--------------------------------------------
		--------------------------------------------
							INPUT MASK and FORM
		--------------------------------------------
		--------------------------------------------
	 */

		const form1 = document.querySelector(".form1");
		const telSelector1 = form1.querySelector('input[type="tel"]');
		const inputMask1 = new Inputmask('+7 (999) 999-99-99');
		inputMask1.mask(telSelector1);

		const form2 = document.querySelector(".form2");
		const telSelector2 = form2.querySelector('input[type="tel"]');
		const inputMask2 = new Inputmask('+7 (999) 999-99-99');
		inputMask2.mask(telSelector2);

		const form3 = document.querySelector(".form3");
		const telSelector3 = form3.querySelector('input[type="tel"]');
		const inputMask3 = new Inputmask('+7 (999) 999-99-99');
		inputMask3.mask(telSelector3);

		const form4 = document.querySelector(".form4");
		const telSelector4 = form4.querySelector('input[type="tel"]');
		const inputMask4 = new Inputmask('+7 (999) 999-99-99');
		inputMask4.mask(telSelector4);

		// const form5 = document.querySelector(".form5");
		// const telSelector5 = form5.querySelector('input[type="tel"]');
		// const inputMask5 = new Inputmask('+7 (999) 999-99-99');
		// inputMask5.mask(telSelector5);

		new window.JustValidate('.form1', {
			rules: {
				tel: {
					required: true,
					function: () => {
						const phone = telSelector1.inputmask.unmaskedvalue();
						return Number(phone) && phone.length === 10;
					}
				}
			}, 
			messages: {
				name: {
					required: 'Введите имя'
				},
				email: {
					email: 'Введите корректный email',
					required: 'Введите email'
				},
				tel: {
					required: 'Введите телефон'
				}
			},
			submitHandler: function(thisForm) {
				let formData = new FormData(thisForm);

				let xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							alert("Отправлено");
							console.log('Отправлено');
						}
					}
				};
		
				xhr.open('POST', 'https://formsubmit.co/shakarim-m@mail.ru', true);
				xhr.send(formData);
		
				thisForm.reset();
			}
		});

		new window.JustValidate('.form2', {
			rules: {
				tel: {
					required: true,
					function: () => {
						const phone = telSelector2.inputmask.unmaskedvalue();
						return Number(phone) && phone.length === 10;
					}
				}
			}, 
			messages: {
				name: {
					required: 'Введите имя'
				},
				email: {
					email: 'Введите корректный email',
					required: 'Введите email'
				},
				tel: {
					required: 'Введите телефон'
				}
			},
			submitHandler: function(thisForm) {
				let formData = new FormData(thisForm);

				let xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							alert("Отправлено");
							console.log('Отправлено');
						}
					}
				};
		
				xhr.open('POST', 'mail.php', true);
				xhr.send(formData);
		
				thisForm.reset();
			}
		});

		new window.JustValidate('.form3', {
			rules: {
				tel: {
					required: true,
					function: () => {
						const phone = telSelector3.inputmask.unmaskedvalue();
						return Number(phone) && phone.length === 10;
					}
				}
			}, 
			messages: {
				name: {
					required: 'Введите имя'
				},
				email: {
					email: 'Введите корректный email',
					required: 'Введите email'
				},
				tel: {
					required: 'Введите телефон'
				}
			},
			submitHandler: function(thisForm) {
				let formData = new FormData(thisForm);

				let xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							alert("Отправлено");
							console.log('Отправлено');
						}
					}
				};
		
				xhr.open('POST', 'mail.php', true);
				xhr.send(formData);
		
				thisForm.reset();
			}
		});

		new window.JustValidate('.form4', {
			rules: {
				tel: {
					required: true,
					function: () => {
						const phone = telSelector4.inputmask.unmaskedvalue();
						return Number(phone) && phone.length === 10;
					}
				}
			}, 
			messages: {
				name: {
					required: 'Введите имя'
				},
				email: {
					email: 'Введите корректный email',
					required: 'Введите email'
				},
				tel: {
					required: 'Введите телефон'
				}
			},
			submitHandler: function(thisForm) {
				let formData = new FormData(thisForm);

				let xhr = new XMLHttpRequest();

				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						if (xhr.status === 200) {
							alert("Отправлено");
							console.log('Отправлено');
						}
					}
				};
		
				xhr.open('POST', 'mail.php', true);
				xhr.send(formData);
		
				thisForm.reset();
			}
		});

		// new window.JustValidate('.form5', {
		// 	rules: {
		// 		tel: {
		// 			required: true,
		// 			function: () => {
		// 				const phone = telSelector5.inputmask.unmaskedvalue();
		// 				return Number(phone) && phone.length === 10;
		// 			}
		// 		}
		// 	}, 
		// 	messages: {
		// 		name: {
		// 			required: 'Введите имя'
		// 		},
		// 		email: {
		// 			email: 'Введите корректный email',
		// 			required: 'Введите email'
		// 		},
		// 		tel: {
		// 			required: 'Введите телефон'
		// 		}
		// 	},
		// 	submitHandler: function(thisForm) {
		// 		let formData = new FormData(thisForm);

		// 		let xhr = new XMLHttpRequest();

		// 		xhr.onreadystatechange = function () {
		// 			if (xhr.readyState === 4) {
		// 				if (xhr.status === 200) {
		// 					alert("Отправлено");
		// 					console.log('Отправлено');
		// 				}
		// 			}
		// 		};
		
		// 		xhr.open('POST', 'mail.php', true);
		// 		xhr.send(formData);
		
		// 		thisForm.reset();
		// 	}
		// });

		window.addEventListener('load', function(){
			let loc = document.getElementById("74518063311cbf90d5a");
			loc.value = window.location.href;
			let ref = document.getElementById("74518063311cbf90d5aref");
			ref.value = document.referrer;
			
			let statUrl = "https://ableacademy.getcourse.ru/stat/counter?ref=" + encodeURIComponent(document.referrer)
			 + "&loc=" + encodeURIComponent(document.location.href);
			document.getElementById('gccounterImgContainer').innerHTML
			 = "<img width=1 height=1 style='display:none' id='gccounterImg' src='" + statUrl + "'/>";
		 });

		//  let formWrapper = document.getElementById("formWrapper");
		//  let fsBtn = document.getElementById("fsBtn");
		//  let wrapper = document.getElementById("wrapper")

		//  fsBtn.addEventListener("click", ()=> {
		// 	formWrapper.classList.add("s-fs__form-wrapper--active")
		// 	wrapper.classList.add("wrapper--active")
		//  })
	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		function listenTestModalBtnClick() {
			document.getElementById('fsBtn').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickOne() {
			document.getElementById('fsBtnOne').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickTwo() {
			document.getElementById('fsBtnTwo').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickThree() {
			document.getElementById('fsBtnThree').addEventListener('click', function () {
				testModal.show();
			});
		}
	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		function listenTestModalBtnClickss() {
			document.getElementById('ssBtn').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickssOne() {
			document.getElementById('ssBtnOne').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickssTwo() {
			document.getElementById('ssBtnTwo').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickssThree() {
			document.getElementById('ssBtnThree').addEventListener('click', function () {
				testModal.show();
			});
		}
	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		function listenTestModalBtnClickts() {
			document.getElementById('tsBtn').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClicktsOne() {
			document.getElementById('tsBtnOne').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClicktsTwo() {
			document.getElementById('tsBtnTwo').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClicktsThree() {
			document.getElementById('tsBtnThree').addEventListener('click', function () {
				testModal.show();
			});
		}
		/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		function listenTestModalBtnClickbs() {
			document.getElementById('bsBtn').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickbsOne() {
			document.getElementById('bsBtnOne').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickbsTwo() {
			document.getElementById('bsBtnTwo').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickbsThree() {
			document.getElementById('bsBtnThree').addEventListener('click', function () {
				testModal.show();
			});
		}

		/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		function listenTestModalBtnClicktt() {
			document.getElementById('ttBtn').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickttOne() {
			document.getElementById('ttBtnOne').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickttTwo() {
			document.getElementById('ttBtnTwo').addEventListener('click', function () {
				testModal.show();
			});
		}

		function listenTestModalBtnClickttThree() {
			document.getElementById('ttBtnThree').addEventListener('click', function () {
				testModal.show();
			});
		}

	/*
		--------------------------------------------
		--------------------------------------------
							COMMON
		--------------------------------------------
		--------------------------------------------
	 */

		const swiper = new VSwiper();
		new Video();
		new Content();
		new Nav();

		const testModal = new Modal('#test-modal');

		listenTestModalBtnClick();
		listenTestModalBtnClickOne();
		listenTestModalBtnClickTwo();
		listenTestModalBtnClickThree();

	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		listenTestModalBtnClickss();
		listenTestModalBtnClickssOne();
		listenTestModalBtnClickssTwo();
		listenTestModalBtnClickssThree();

	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		listenTestModalBtnClickts();
		listenTestModalBtnClicktsOne();
		listenTestModalBtnClicktsTwo();
		listenTestModalBtnClicktsThree();

	/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		listenTestModalBtnClickbs();
		listenTestModalBtnClickbsOne();
		listenTestModalBtnClickbsTwo();
		listenTestModalBtnClickbsThree();
/*
		--------------------------------------------
		--------------------------------------------
							MODAL
		--------------------------------------------
		--------------------------------------------
	 */
		listenTestModalBtnClicktt();
		listenTestModalBtnClickttOne();
		listenTestModalBtnClickttTwo();
		listenTestModalBtnClickttThree();



		initCompanySlider();
		initCompanySecondSlider();
		initCompanyThirdSlider();
		initGallerySlider();
		initVideoSlider();
		initTeacherSlider1();
		initTeacherSlider2();
		initTeacherSlider3();
		initTeacherSlider4();
		initCourseProgram();

}());


jQuery(document).ready(function () {

    $(".tech-toggle_head").on("click", function(){
        $(this).toggleClass("active");
        $(this).parent().find(".tech-toggle_content").slideToggle();
    })

})
