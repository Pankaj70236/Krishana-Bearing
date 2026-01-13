// =======================
// CONFIG (CHANGE ONLY HERE)
// =======================
const WHATSAPP_NUMBER = "919928857705"; // 91 + 9928857705
const DISPLAY_PHONE = "9928857705";
const ADDRESS_TEXT = "Singhana, Rajasthan";

// Default WhatsApp message
const DEFAULT_MESSAGE =
  `Hello Krishna Bearing Agency! I want to order parts.\n` +
  `Phone: ${DISPLAY_PHONE}\n` +
  `Please share price & availability.`;

// Build WhatsApp link
function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Set WhatsApp links
const whatsappBtn = document.getElementById("whatsappBtn");
const floatingWa = document.getElementById("floatingWa");
const waLinkEl = document.getElementById("waLink");

if (whatsappBtn) whatsappBtn.href = waLink(DEFAULT_MESSAGE);
if (floatingWa) floatingWa.href = waLink(DEFAULT_MESSAGE);
if (waLinkEl) waLinkEl.href = waLink(DEFAULT_MESSAGE);

// Quick order -> WhatsApp
const sendOrderBtn = document.getElementById("sendOrder");
if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", () => {
    const partno = (document.getElementById("partno")?.value || "").trim();
    const qty = (document.getElementById("qty")?.value || "").trim();

    let msg = `Hello Krishna Bearing Agency!\n`;
    msg += `Location: ${ADDRESS_TEXT}\n\n`;
    msg += `I want to order:\n`;

    if (partno) msg += `Part No: ${partno}\n`;
    if (qty) msg += `Qty: ${qty}\n`;

    msg += `\nPlease share price & availability.`;
    window.open(waLink(msg), "_blank");
  });
}

// Enquiry -> WhatsApp
const sendEnquiryBtn = document.getElementById("sendEnquiry");
if (sendEnquiryBtn) {
  sendEnquiryBtn.addEventListener("click", () => {
    const name = (document.getElementById("name")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    let msg = `Enquiry from website\n`;
    msg += `Location: ${ADDRESS_TEXT}\n`;
    msg += `Phone: ${DISPLAY_PHONE}\n\n`;

    if (name) msg += `Name: ${name}\n`;
    if (message) msg += `Message: ${message}\n`;

    msg += `\nPlease reply with details.`;
    window.open(waLink(msg), "_blank");
  });
}

// =======================
// PREMIUM EFFECTS (FIGMA-LIKE)
// =======================

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

// 3D Tilt effect on hover (gesture)
document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const rx = ((y / r.height) - 0.5) * -8; // rotateX
    const ry = ((x / r.width) - 0.5) * 10;  // rotateY

    card.style.transform =
      `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
});
