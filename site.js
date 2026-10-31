document.documentElement.classList.remove("no-js");

// Entrances: once per element, as it enters.
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}, { threshold: 0.15 });
document.querySelectorAll(".rise").forEach((el) => io.observe(el));

// Teleprompter demo: words light up as if spoken, like Follow voice.
const prompter = document.getElementById("prompter");
const rec = document.getElementById("rec");
if (prompter && rec) {
  const label = document.getElementById("rec-label");
  prompter.innerHTML = prompter.textContent.trim().split(/\s+/)
    .map((w) => `<span class="w">${w}</span> `).join("");
  const words = [...prompter.querySelectorAll(".w")];
  let i = 0, timer = null;

  const stop = (done) => {
    clearInterval(timer); timer = null;
    rec.setAttribute("aria-pressed", "false");
    rec.setAttribute("aria-label", "Start the teleprompter demo");
    label.textContent = done ? "Take saved" : "Tap to try";
  };
  rec.addEventListener("click", () => {
    if (timer) return stop(false);
    if (i >= words.length) { i = 0; words.forEach((w) => w.className = "w"); prompter.scrollTop = 0; }
    rec.setAttribute("aria-pressed", "true");
    rec.setAttribute("aria-label", "Stop the teleprompter demo");
    label.textContent = "Recording";
    timer = setInterval(() => {
      if (i > 0) words[i - 1].className = "w said";
      if (i >= words.length) return stop(true);
      words[i].className = "w now";
      const top = words[i].offsetTop - prompter.offsetTop;
      if (top > prompter.scrollTop + prompter.clientHeight * 0.45) prompter.scrollTo({ top: top - 30, behavior: "smooth" });
      i++;
    }, 260);
  });
}
