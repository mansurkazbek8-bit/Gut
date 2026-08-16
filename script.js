(() => {
  'use strict';

  const state = {
    rating: 0,
    liked: [],
    learned: '',
    emotions: [],
    improve: '',
    oneword: ''
  };

  const totalSteps = 6;
  let currentStep = 1;

  const form = document.getElementById('reflection-form');
  const steps = Array.from(document.querySelectorAll('.step'));
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressFill = document.getElementById('progress-fill');
  const dotsWrap = document.getElementById('progress-dots');

  /* build progress dots */
  for (let i = 1; i <= totalSteps; i++) {
    const dot = document.createElement('span');
    dot.dataset.step = i;
    dotsWrap.appendChild(dot);
  }
  const dots = Array.from(dotsWrap.children);

  function renderProgress() {
    progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;
    dots.forEach((dot, i) => {
      const stepNum = i + 1;
      dot.classList.toggle('is-active', stepNum === currentStep);
      dot.classList.toggle('is-done', stepNum < currentStep);
    });
  }

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === n));
    prevBtn.classList.toggle('is-visible', n > 1);
    nextBtn.hidden = n === totalSteps;
    submitBtn.hidden = n !== totalSteps;
    renderProgress();
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; showStep(currentStep); }
  });
  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) { currentStep++; showStep(currentStep); }
  });

  /* ---- Step 1: stars ---- */
  const starButtons = Array.from(document.querySelectorAll('.star'));
  starButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      state.rating = Number(btn.dataset.value);
      paintStars();
    });
    btn.addEventListener('mouseenter', () => paintStars(Number(btn.dataset.value)));
    btn.addEventListener('mouseleave', () => paintStars());
  });
  function paintStars(hoverValue) {
    const value = hoverValue ?? state.rating;
    starButtons.forEach(b => b.classList.toggle('is-filled', Number(b.dataset.value) <= value));
  }

  /* ---- chip groups (liked / emotions) ---- */
  document.querySelectorAll('.chips').forEach(group => {
    const key = group.dataset.group;
    group.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('is-selected');
        const val = chip.dataset.value;
        const list = state[key];
        const idx = list.indexOf(val);
        if (chip.classList.contains('is-selected') && idx === -1) list.push(val);
        else if (!chip.classList.contains('is-selected') && idx > -1) list.splice(idx, 1);
      });
    });
  });

  /* ---- text fields ---- */
  document.getElementById('learned').addEventListener('input', e => state.learned = e.target.value);
  document.getElementById('improve').addEventListener('input', e => state.improve = e.target.value);
  document.getElementById('oneword').addEventListener('input', e => state.oneword = e.target.value);

  /* ---- start button: scroll to form ---- */
  document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---- submit ---- */
  form.addEventListener('submit', e => {
    e.preventDefault();
    finishReflection();
  });

  function finishReflection() {
    const finalSection = document.getElementById('final-section');
    finalSection.classList.add('is-active');
    finalSection.scrollIntoView({ behavior: 'smooth' });
    buildSummary();
    launchBurst();
  }

  function buildSummary() {
    const ratingWrap = document.getElementById('summary-rating');
    ratingWrap.textContent = '★★★★★'.slice(0, state.rating) + '☆☆☆☆☆'.slice(0, 5 - state.rating);

    const list = document.getElementById('summary-list');
    list.innerHTML = '';
    const entries = [
      ['Понравилось', state.liked.join(', ') || '—'],
      ['Новое узнал', state.learned || '—'],
      ['Эмоции', state.emotions.join(', ') || '—'],
      ['Улучшить', state.improve || '—'],
      ['Впечатление одним словом', state.oneword || '—']
    ];
    entries.forEach(([term, desc]) => {
      const dt = document.createElement('dt');
      dt.textContent = term;
      const dd = document.createElement('dd');
      dd.textContent = desc;
      list.appendChild(dt);
      list.appendChild(dd);
    });
  }

  /* ---- ornament burst animation on completion ---- */
  function launchBurst() {
    const burst = document.getElementById('burst');
    burst.innerHTML = '';
    const colors = ['#EAD08A', '#C79A3E', '#F6EFDD'];
    const count = 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const dist = 140 + Math.random() * 220;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist * 0.7 - 60;
      p.style.background = colors[i % colors.length];
      p.style.setProperty('--x', `${x}px`);
      p.style.setProperty('--y', `${y}px`);
      p.style.animation = `particle ${0.9 + Math.random() * 0.6}s ${(i % 5) * 0.03}s ease-out forwards`;
      burst.appendChild(p);
    }
  }

  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes particle {
      0% { opacity:1; transform: translate(-50%,-50%) translate(0,0) scale(0.6); }
      100% { opacity:0; transform: translate(-50%,-50%) translate(var(--x), var(--y)) scale(1); }
    }`;
  document.head.appendChild(styleTag);

  /* ---- restart ---- */
  document.getElementById('restart-btn').addEventListener('click', () => {
    state.rating = 0; state.liked = []; state.learned = '';
    state.emotions = []; state.improve = ''; state.oneword = '';
    paintStars();
    document.querySelectorAll('.chip.is-selected').forEach(c => c.classList.remove('is-selected'));
    document.getElementById('learned').value = '';
    document.getElementById('improve').value = '';
    document.getElementById('oneword').value = '';
    currentStep = 1;
    showStep(currentStep);
    document.getElementById('final-section').classList.remove('is-active');
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });

  /* init */
  showStep(currentStep);
})();
