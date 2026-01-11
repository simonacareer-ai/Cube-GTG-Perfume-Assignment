
(function () {
  const percentSection = document.getElementById("perc-holder");
  if (!percentSection) return;

  function animateCounters() {
    percentSection.classList.add("animate");
    const items = percentSection.querySelectorAll(".perc");

    items.forEach((item, i) => {
      const target = Number(item.dataset.value);
      const counter = item.querySelector(".count");
      let current = 0;

      setTimeout(() => {
        const timer = setInterval(() => {
          current += Math.max(1, Math.round((target - current) / 15));
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = current + "%";
        }, 30);
      }, i * 150);
    });
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    ).observe(percentSection);
  } else {
    animateCounters();
  }
})();


const GALLERY_DATA = {
  original: {
    hero: "./images/original-big.png",
    thumbnails: [
      "./images/original-perf1.png",
      "./images/original-perf2.jpg",
      "./images/original-perf3.jpg",
      "./images/original-perf4.jpg"
    ]
  },
  lily: {
    hero: "./images/lily-perf1.jpg",
    thumbnails: [
      "./images/lily-perf1.jpg",
      "./images/lily-perf2.jpg",
      "./images/lily-perf3.jpg",
      "./images/lily-perf-4.jpg"
    ]
  },
  rose: {
    hero: "./images/rose-perf1.jpg",
    thumbnails: [
      "./images/rose-perf1.jpg",
      "./images/rose-perf2.jpg",
      "./images/rose-perf-3.jpg",
      "./images/rose-perf4.jpg"
    ]
  }
};


let activeFragrance = "original";
let galleryImages = GALLERY_DATA[activeFragrance].thumbnails;
let activeIndex = 0;


const mainImage = document.getElementById("activeImage");
const dotsContainer = document.getElementById("dots");
const thumbsContainer = document.getElementById("thumbs");

function updateMainImage(src) {
  mainImage.classList.remove("fade-in");
  void mainImage.offsetWidth;
  mainImage.src = src;
  mainImage.classList.add("fade-in");
}

function renderGallery() {
  dotsContainer.innerHTML = "";
  thumbsContainer.innerHTML = "";

  galleryImages.forEach((src, i) => {
    /* dots */
    const dot = document.createElement("span");
    dot.classList.toggle("active", i === activeIndex);
    dot.onclick = () => selectImage(i);
    dotsContainer.appendChild(dot);

    /* thumbnails */
    const thumb = document.createElement("img");
    thumb.src = src;
    thumb.loading = "lazy";
    thumb.classList.toggle("active", i === activeIndex);
    thumb.onclick = () => selectImage(i);
    thumbsContainer.appendChild(thumb);
  });
}

function selectImage(i) {
  activeIndex = i;
  updateMainImage(galleryImages[activeIndex]);
  renderGallery();
}

document.querySelector(".prev").onclick = () => {
  activeIndex =
    (activeIndex - 1 + galleryImages.length) % galleryImages.length;
  selectImage(activeIndex);
};

document.querySelector(".next").onclick = () => {
  activeIndex = (activeIndex + 1) % galleryImages.length;
  selectImage(activeIndex);
};

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.onchange = () => {

    /* PLAN ACCORDION */
    if (radio.name === "plan") {
      document
        .querySelectorAll(".accordion")
        .forEach(acc => acc.classList.remove("active"));

      radio.closest(".accordion")?.classList.add("active");
      return;
    }

    /* FRAGRANCE SWITCH */
    if (!GALLERY_DATA[radio.value]) return;

    activeFragrance = radio.value;
    galleryImages = GALLERY_DATA[activeFragrance].thumbnails;
    activeIndex = 0;

    mainImage.src = GALLERY_DATA[activeFragrance].hero;
    renderGallery();
  };
});

const modal = document.getElementById("modal");
const summary = document.getElementById("summary");

document.getElementById("addToCart").onclick = () => {
  const activePlan = document.querySelector(".accordion.active");

  let html = `
    <div>
      <strong>Plan:</strong> ${activePlan.dataset.plan}
      — <strong class="price"> $${activePlan.dataset.price}</strong>
      <hr>
    </div>
  `;

  activePlan
    .querySelectorAll('input[type="radio"]:checked')
    .forEach(radio => {
      if (!radio.value || radio.value === "on") return;
      html += `<p class="mb-0"><strong>Fragrance:</strong> ${radio.value}</p>`;
    });

  summary.innerHTML = html;
  modal.classList.add("show");
};


mainImage.src = GALLERY_DATA[activeFragrance].hero;
renderGallery();
