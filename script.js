const header = document.querySelector("#home");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

function toggleMenu() {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation menu" : "Close navigation menu"
  );
  header.classList.toggle("menu-open", !isOpen);
}

if (header && menuToggle && navigation) {
  header.classList.add("menu-ready");
  menuToggle.addEventListener("click", toggleMenu);

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      header.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
    }
  });
}

const filterButtons = document.querySelectorAll(".project-filters [data-filter]");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.querySelector("#filter-status");

function filterProjects(category) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const shouldShow = category === "all" || card.dataset.category === category;
    card.hidden = !shouldShow;
    if (shouldShow) visibleCount++;
  });

  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === category));
  });

  if (filterStatus) {
    filterStatus.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "s"} shown.`;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProjects(button.dataset.filter));
});

const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");

document.querySelectorAll(".project-image-button").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!lightbox || !image || typeof lightbox.showModal !== "function") return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent =
      button.closest("figure")?.querySelector("figcaption")?.textContent ||
      image.alt;

    lightbox.showModal();
    lightboxClose.focus();
  });
});

lightboxClose?.addEventListener("click", () => lightbox.close());

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const fields = [
    contactForm.elements.namedItem("name"),
    contactForm.elements.namedItem("email"),
    contactForm.elements.namedItem("message"),
  ];
  const status = document.querySelector("#contact-status");

  function validateField(field) {
    const error = document.querySelector(`#${field.id}-error`);
    const value = field.value.trim();
    let message = "";

    if (!value) {
      message = "This field is required.";
    } else if (field.type === "email" && field.validity.typeMismatch) {
      message = "Enter a valid email address.";
    }

    error.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.dataset.touched) validateField(field);
    });

    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      validateField(field);
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !validateField(field));

    if (invalidFields.length) {
      status.textContent = "Please correct the highlighted fields.";
      invalidFields[0].focus();
      return;
    }

    status.textContent =
      "Your message passed validation. This demo does not send messages yet.";
  });
}