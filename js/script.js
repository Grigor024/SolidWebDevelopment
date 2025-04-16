// header

const section = document.getElementById('section');
const header = document.getElementById('header');

// Отслеживаем прокрутку страницы
window.onscroll = function () {
  if (window.pageYOffset > section.offsetHeight) {
    // Когда страница прокручена, фиксируем header и поднимаем section
    header.classList.add('fixed', 'top-0', 'w-full', 'z-10');
    section.classList.add('transform', '-translate-y-[4em]', 'opacity-0');  // Поднимаем section и скрываем его
  } else {
    // Если прокрутка меньше, возвращаем элементы в исходное состояние
    header.classList.remove('fixed', 'top-0', 'w-full', 'z-10');
    section.classList.remove('transform', '-translate-y-[4em]', 'opacity-0');  // Возвращаем section
  }
};

// SlideShow

let slideIndex = 0;
const slides = document.querySelectorAll(".slide");
const texts = document.querySelectorAll(".text-slide");
const dots = document.querySelectorAll(".dot")
const slideInterval = 4000;


function showSlides() {
  slides.forEach((slide, index) => {
    slide.style.opacity = "0";
    texts[index].style.opacity = "0";
    texts[index].style.transform = "translate(100%)";
    dots[index].classList.remove("active")
  });

  slides[slideIndex].style.opacity = "1";
  texts[slideIndex].style.opacity = "1";
  texts[slideIndex].style.transform = "translate(0)";
  dots[slideIndex].classList.add("active");

  slideIndex = (slideIndex + 1) % slides.length;
}

dots.forEach(dot => {
  dot.addEventListener("click", () => {
    slideIndex = parseInt(dot.getAttribute("data-index"));
    showSlides();
  });

});

setInterval(showSlides, slideInterval);
showSlides();



// BurgerMenu

const menuToggle = document.getElementById('menu-toggle');
const mobileMenuLang = document.getElementById('mobile-menu-lang'); 
const menuLinks = document.querySelectorAll('#mobile-menu-lang .menu-link');

menuToggle.addEventListener('click', () => {
    mobileMenuLang.classList.toggle('hidden');
});

// ✅ Закрываем меню при клике на любую область внутри `mobileMenuLang`
mobileMenuLang.addEventListener('click', () => {
    mobileMenuLang.classList.add('hidden');
});

// ✅ Закрываем меню при клике на ссылки внутри
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuLang.classList.add('hidden');
    });
});

// Accardion

function toggleAccardion(index) {
  const sections = document.querySelectorAll('.space-y-2 > div');
  sections.forEach((section, i) => {
      const content = section.querySelector('div.hidden, div.block');
      const arrow = section.querySelector('.arrow');
      if (i === index){
          content.classList.toggle('hidden')
          content.classList.toggle('block');
          arrow.textContent = content.classList.contains('hidden') ? '▼' : '▲'
      }else{
          content.classList.add('hidden');
          content.classList.remove('block');
          arrow.textContent = '▼'
      }
  })

}

// Animation

function toggleAccordion() {
  const content = document.querySelector('.accordion-content');
  content.classList.toggle('open');
}


document.addEventListener("DOMContentLoaded", () => {
  const blocks = document.querySelectorAll(".blockanim");

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add("show");
          }
      });
  }, { threshold: 0.2 }); // Покажет блок, когда он на 20% в зоне видимости

  blocks.forEach(blockanim => observer.observe(blockanim));
});



// language

async function fetchData() {
  try {
      const response = await fetch('./locales/content.json');
      return await response.json();
      console.log("✅ Данные успешно загружены:", data);
  } catch (error) {
      console.error('Ошибка загрузки данных:', error);
  }
}

// Функция обновления контента
function renderContent(data, language) {
  const sectionText1 = document.getElementById('section-text1');
  const sectionText2 = document.getElementById('section-text2');
  const websitesTitle = document.querySelector(".text-4xl");

  if (sectionText1 && sectionText2 && data.section[language]) {
      sectionText1.innerText = data.section[language].text1;
      sectionText2.innerText = data.section[language].text2;
  } else {
      console.warn(`⚠️ Отсутствуют данные для секции (${language})`);
  }

  // Обновление навигации
  const nav = document.getElementById('nav');
  if (nav) {
      nav.innerHTML = '';
      Object.keys(data.header.nav || {}).forEach(key => {
          if (data.header.nav[key] && data.header.nav[key][language] && data.header.nav[key].link) {
              const navItem = document.createElement('li');
              navItem.innerHTML = `<a href="${data.header.nav[key].link}" class="hover:underline">${data.header.nav[key][language]}</a>`;
              nav.appendChild(navItem);
          } else {
              console.warn(`⚠️ Нет данных для '${key}' (${language})`);
          }
      });
  } else {
      console.error("Элемент #nav не найден в DOM!");
  }

  // Обновление мобильного меню
  if (mobileMenuLang) {
      mobileMenuLang.innerHTML = '';
      Object.keys(data.header.mobile_menu || {}).forEach(key => {
        if (data.header.mobile_menu[key] && data.header.mobile_menu[key][language] && data.header.mobile_menu[key].link) {
          const mobileItem = document.createElement('li');
          mobileItem.innerHTML = `<a href="${data.header.mobile_menu[key].link}" class="menu-link">${data.header.mobile_menu[key][language]}</a>`;
          mobileMenuLang.appendChild(mobileItem);
      } else {
          console.warn(`⚠️ Нет данных для '${key}' (${language})`);
      }
      });
  } else {
      console.error("Элемент #mobile-menu-lang не найден в DOM!");
  }
}


// ServiceSection

function renderServicesSection(data, language) {
  const servicesContainer = document.getElementById('services');
  const servicesTitle = document.getElementById('service-title');

  // ✅ Обновляем заголовок секции
  if (servicesTitle) {
      servicesTitle.innerText = data.servicesSection.title[language] || "Services";
  }

  // ✅ Очищаем только контейнер с карточками, НЕ всю секцию
  const cardContainer = servicesContainer.querySelector('.blockanim:nth-child(2)');
  cardContainer.innerHTML = '';

  // ✅ Генерируем карточки заново
  data.servicesSection.services.forEach((service, index) => {
      const serviceElement = document.createElement('div');
      serviceElement.classList.add(
          'service-card', 'w-full', 'h-[650px]', 'md:w-[80%]', 'lg:w-[100%]', 'bg-white',
          'flex', 'flex-col', 'justify-center', 'rounded-3xl', 'shadow-xl', 'text-white'
      );
      serviceElement.style = "background-image: url('img/background_1.jpg'); background-size: 55em; background-position: center; opacity: 0.8;";

      serviceElement.innerHTML = `
          <p class="text-2xl font-bold px-5">${service.subtitle[language]}</p>
          <h1 class="py-4 px-5 text-[20px]">${service.text[language]}</h1><br>
          <a href="#faq" class="px-5">${service.link[language]}</a>
      `;

      // ✅ Добавляем новую карточку внутрь контейнера
      cardContainer.appendChild(serviceElement);
  });
}

// Faq section

function renderFaqSection(data, language) {
  const faqTitle = document.getElementById('animated-title');

  

  // ✅ Обновляем заголовок FAQ
  if (faqTitle) {
      faqTitle.innerText = data.faqSection.faqSectionTitle[language] || "FAQ";
  }

  // ✅ Обновляем вопросы и ответы
  data.faqSection.accordionItems.forEach((item, index) => {
    const buttonElement = document.querySelector(`button[onClick="toggleAccardion(${index})"] span.font-bold`);
    const contentElement = document.getElementById(`content-${index}`);

    // Проверяем, найдена ли кнопка
    // console.log(`Кнопка (${index}):`, buttonElement);

    if (buttonElement) {
        buttonElement.innerText = item.question[language]; // ✅ Обновляем текст кнопки
    }
    if (contentElement) {
      let formattedText = item.answer[language];

    // ✅ Добавляем переносы строк только для армянского
    if (language === "am") {
        formattedText = formattedText.split("Քայլ").join("<br><br>Քայլ");
    } else {
        formattedText = formattedText.replace(/(Step \d+|Шаг \d+)/g, "<br><br>$1");
    }

      // ✅ Применяем стили
      contentElement.innerHTML = `<p>${formattedText}</p>`;
      contentElement.classList.add(
          "p-4", "rounded-2xl", "w-full", "md:w-[90%]", "lg:w-[80%]", "mx-auto", 
          "text-white", "shadow-xl", "leading-7"
      );
      
    //   contentElement.classList.add(
    //       "p-4", "rounded-2xl", "w-full", "md:w-[90%]", "lg:w-[80%]", "mx-auto", 
    //       "text-white", "shadow-xl", "leading-7", "bg-gray-600"
    //   ); // ✅ Добавляем стили// ✅ Обновляем ответ
    }
});
}



// Types of websites

function renderWebsitesSection(data, language) {
  const sectionTitle = document.querySelector("p.text-4xl");
  const pricingText = document.getElementById("pricing-text");
  const container = document.querySelector("#types section.w-full");

  console.log("✅ Загруженные данные:", data);
  console.log("🎯 Найден элемент title:", sectionTitle);
  console.log("🎯 Найден элемент pricing-text:", pricingText);
  console.log("🔍 Проверка title:", data.typesSection.title[language]);
  console.log("🔍 Проверка pricing:", data.typesSection.pricing[language]);

  if (sectionTitle && data.typesSection.title[language]) {
      sectionTitle.innerText = data.typesSection.title[language];
  } else {
      console.warn(`⚠️ Нет данных для title (${language})`);
  }

  if (pricingText && data.typesSection.pricing[language]) {
      pricingText.innerText = data.typesSection.pricing[language];
  } else {
      console.warn(`⚠️ Нет данных для pricing (${language})`);
  }

  // ✅ Очищаем контейнер перед созданием карточек
  container.innerHTML = "";

  // ✅ Генерируем карточки услуг
  data.typesSection.services.forEach(service => {
      const serviceElement = document.createElement("div");
      serviceElement.classList.add(
          "w-full", "sm:w-[45%]", "lg:w-[20%]", "min-h-[500px]", "rounded-2xl",
          "shadow-xl", "border-2", "border-blue-300", "bg-white", "flex", "flex-col", "px-5", "py-5"
      );

      serviceElement.innerHTML = `
          <div class="w-full flex gap-3 items-center">
              <img src="./icon/${service.icon}" alt="${service.title[language]} Icon" class="w-[30px]">
              <p class="text-lg sm:text-base font-bold">${service.title[language]}</p>
          </div>
          <section class="w-full flex flex-col py-5 flex-grow">
              <h2 class="font-bold text-sm">${service.details[language]}</h2>
              <ul class="list-disc pl-5 text-sm space-y-3 mt-3">
                  ${service.description[language].map(item => `<li>${item}</li>`).join("")}
              </ul>
          </section>
      `;

      container.appendChild(serviceElement);
  });
}


// About Us

function renderAboutSection(data, language) {
    // const aboutTitle = document.querySelector("#about h1.text-4xl");
    const aboutContent = document.getElementById("about-content");
    const aboutTitle = document.getElementById("about-title");

    console.log("🔄 Проверка данных aboutSection:", data.aboutSection);

    // ✅ Перевод заголовка "ABOUT US"
    if (aboutTitle && data.aboutSection.title[language]) {
        aboutTitle.innerText = data.aboutSection.title[language];
    } else {
        console.warn(`⚠️ Нет данных для about-title (${language})`);
    }

    // ✅ Перевод заголовка внутри секции
    const headlineElement = document.querySelector("#about-content h2");
    if (headlineElement && data.aboutSection.content.headline[language]) {
        headlineElement.innerText = data.aboutSection.content.headline[language];
    } else {
        console.warn(`⚠️ Нет данных для headline (${language})`);
    }

    // ✅ Перевод параграфов
    const paragraphs = document.querySelectorAll("#about-content p");
    const contentArray = data.aboutSection.content.paragraphs[language];

    if (paragraphs.length > 0 && contentArray) {
        paragraphs.forEach((p, index) => {
            if (contentArray[index]) {
                p.innerText = contentArray[index];
            }
        });
    } else {
        console.warn(`⚠️ Нет данных для about-content paragraphs (${language})`);
    }
}


// Contact

function renderContact(data, language) {
    // const contactTitle = document.querySelector(".logo-shadow.text-white.text-center");
    const navLinks = document.querySelectorAll("#contact-nav a");
    const contactTitle = document.getElementById("contact-title");

    console.log("Check data:", data.contact);

    if (contactTitle && data.contact.title && data.contact.title[language]) {
        contactTitle.innerText = data.contact.title[language];
    } else {
        console.warn(`No data for contact-title: (${language})`);
    }

    if (navLinks.length > 0 && data.contact.links && data.contact.links[language]) {
        navLinks.forEach((link, index) => {
            const newText = data.contact.links[language][index];
            if (newText) link.innerText = newText;
        });
    } else {
        console.log(`No data for contact-links: (${language})`)
    }
}

// ----------------------
// Переключение языка (перевод всех секций)
// ----------------------
document.getElementById('language-select').addEventListener('change', async (event) => {
    const selectedLanguage = event.target.value;
    localStorage.setItem('language', selectedLanguage);
    const data = await fetchData();
    
    renderContent(data, selectedLanguage);
    renderServicesSection(data, selectedLanguage);
    renderFaqSection(data, selectedLanguage);
    renderWebsitesSection(data, selectedLanguage);
    renderAboutSection(data, selectedLanguage);
    renderContact(data, selectedLanguage);
});

// ----------------------
// Загрузка данных при старте страницы
// ----------------------
const savedLanguage = localStorage.getItem('language') || 'en';
fetchData().then(data => {
    renderContent(data, savedLanguage);
    renderServicesSection(data, savedLanguage);
    renderFaqSection(data, savedLanguage);
    renderWebsitesSection(data, savedLanguage);
    renderAboutSection(data, selectedLanguage);
    renderContact(data, selectedLanguage);
});
  
