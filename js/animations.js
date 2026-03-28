const Animations = {
  confetti(container, count = 5) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#9B1B21', '#D4852E', '#E7D4CC', '#C43333'];
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'confetti-particle';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 60}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.animationDelay = `${Math.random() * 200}ms`;
      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
    }
  },
  shimmer(progressFill) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    progressFill.classList.add('shimmer');
    setTimeout(() => progressFill.classList.remove('shimmer'), 3000);
  },
};
