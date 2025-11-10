export function attachTooltips(container) {
  const tooltipElements = container.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      document.querySelectorAll(".tooltip").forEach((t) => t.remove());

      const tip = document.createElement("div");
      tip.className = "tooltip";
      tip.textContent = el.dataset.tooltip || "";
      document.body.appendChild(tip);

      const moveTooltip = (ev) => {
        tip.style.left = ev.pageX + 12 + "px";
        tip.style.top = ev.pageY + 12 + "px";
      };

      requestAnimationFrame(() => {
        moveTooltip(e);
        tip.classList.add("show");
      });

      el.addEventListener("mousemove", moveTooltip);

      const removeTip = () => {
        tip.remove();
        el.removeEventListener("mousemove", moveTooltip);
      };

      el.addEventListener("mouseleave", removeTip, { once: true });
      el.addEventListener("click", removeTip, { once: true });
      tip.addEventListener("mouseleave", removeTip, { once: true });
    });
  });
}
