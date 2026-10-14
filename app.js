// Creator Quickscan — app-logica (vanilla JS, geen build-stap nodig)
// De score wordt altijd via vaste regels berekend (zie content.js). Advies- en
// profielteksten zijn vooraf geschreven en worden automatisch geselecteerd op
// basis van de echte antwoorden — dit is de fase 1 vervanger voor de AI-koppeling
// die in een latere fase wordt toegevoegd (zie briefing).

const state = {
  step: 0,
  answers: {},
  intro: {},
  transparency: null,
  brand: {
    branche: null,
    leeftijd: null,
    interesses: [],
    platformen: [],
    merkwoorden: [],
    contentsoort: [],
  },
  carouselStep: 0,
  matchedProfiles: null,
  mailSent: false,
  meetingRequested: false,
};

const FLOW = [
  { id: "welcome" },
  { id: "intro", progress: true },
  ...SECTIONS.map((section, i) => ({ id: "section", progress: true, section, sectionIndex: i })),
  { id: "transparency", progress: true },
  { id: "results-summary" },
  { id: "brand", progress: true },
  { id: "carousel" },
];

const PROGRESS_STEPS = FLOW.filter((f) => f.progress);

// ---------- Scoring ----------

function sectionPoints(section) {
  return section.statements.reduce((sum, st) => sum + (state.answers[st.id] ?? 0), 0);
}
function sectionPercent(section) {
  return (sectionPoints(section) / 9) * 100;
}
function totalPoints() {
  return SECTIONS.reduce((sum, s) => sum + sectionPoints(s), 0);
}
function totalPercent() {
  return (totalPoints() / 63) * 100;
}
function levelFor(percent) {
  return LEVELS.find((l) => percent <= l.max) || LEVELS[LEVELS.length - 1];
}
function tierFor(percent) {
  if (percent < 34) return "low";
  if (percent < 67) return "mid";
  return "high";
}
function fmtPercent(n) {
  return n.toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "%";
}

function sectionsByScore() {
  return SECTIONS.map((s) => ({ section: s, percent: sectionPercent(s) }));
}
function strongestTwo() {
  return [...sectionsByScore()].sort((a, b) => b.percent - a.percent).slice(0, 2);
}
function weakestTwo() {
  return [...sectionsByScore()].sort((a, b) => a.percent - b.percent).slice(0, 2);
}

// ---------- Creatorprofiel-matching ----------

function budgetToSizeTier(budget) {
  if (budget === "lt5000" || budget === "5000_10000") return "nano";
  if (budget === "10000_25000" || budget === "25000_50000") return "micro";
  if (budget === "gt50000") return "macro";
  return "micro";
}

function matchProfiles() {
  const chosenTags = new Set([...state.brand.merkwoorden, ...state.brand.contentsoort]);
  const chosenPlatforms = new Set(state.brand.platformen);
  const sizeTier = budgetToSizeTier(state.intro.budget);

  const scored = CREATOR_PROFILES.map((profile) => {
    let score = 0;
    profile.tags.forEach((t) => {
      if (chosenTags.has(t)) score += 2;
    });
    if (chosenPlatforms.has(profile.platform)) score += 2;
    if (profile.sizePreference.includes(sizeTier)) score += 1;
    return { profile, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.profile);
}

function profileWhyText(profile) {
  const chosenTags = new Set([...state.brand.merkwoorden, ...state.brand.contentsoort]);
  const matched = profile.tags.filter((t) => chosenTags.has(t));
  let text = "";
  if (matched.length) {
    text += `Je koos voor ${matched.join(" en ").toLowerCase()}`;
    if (state.brand.leeftijd) text += `, met een doelgroep van ${state.brand.leeftijd} jaar`;
    text += ". ";
  }
  text += `Een ${profile.type.toLowerCase()} op ${profile.platform} past goed bij jouw gewenste aanpak en budget.`;
  return text;
}

// ---------- Rendering ----------

function render() {
  const app = document.getElementById("app");
  const entry = FLOW[state.step];
  app.innerHTML = `
    <div class="app-shell">
      ${renderHeader(entry)}
      <main class="page">${renderContent(entry)}</main>
      ${renderNav(entry)}
    </div>
  `;
  window.scrollTo(0, 0);
}

function renderHeader(entry) {
  const progressIdx = PROGRESS_STEPS.indexOf(entry);
  const showProgress = progressIdx > -1;
  const pct = showProgress ? ((progressIdx + 1) / PROGRESS_STEPS.length) * 100 : 0;
  return `
    <header class="topbar">
      <div class="logo">${BRAND.wordmark.map((w) => `<span>${w}</span>`).join("")}</div>
    </header>
    ${showProgress ? `<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>` : ""}
  `;
}

function renderContent(entry) {
  switch (entry.id) {
    case "welcome":
      return renderWelcome();
    case "intro":
      return renderIntro();
    case "section":
      return renderSection(entry.section, entry.sectionIndex);
    case "transparency":
      return renderTransparency();
    case "results-summary":
      return renderResultsSummary();
    case "brand":
      return renderBrand();
    case "carousel":
      return renderCarousel();
    default:
      return "";
  }
}

function renderWelcome() {
  return `
    <section class="hero card">
      <p class="eyebrow">${WELCOME.eyebrow}</p>
      <h1 class="title-xl">${WELCOME.title}</h1>
      <p class="body-lg">${WELCOME.intro}</p>
    </section>
    <section class="benefits">
      <h2 class="heading-sm">${WELCOME.benefitsTitle}</h2>
      <ul class="check-list">
        ${WELCOME.benefits.map((b) => `<li>${b}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderIntro() {
  return `
    <h1 class="heading-lg">${INTRO_PAGE.title}</h1>
    <p class="body-md muted">${INTRO_PAGE.description}</p>
    <div class="question-stack">
      ${INTRO_QUESTIONS.map((q) => renderIntroQuestion(q)).join("")}
    </div>
  `;
}

function renderIntroQuestion(q) {
  if (q.type === "single") {
    const selected = state.intro[q.id];
    return `
      <div class="question-card">
        <p class="question-text">${q.question}</p>
        <div class="option-list">
          ${q.options
            .map(
              (o) => `
            <button type="button" class="option-pill ${selected === o.value ? "is-selected" : ""}"
              data-action="select-intro" data-qid="${q.id}" data-value="${o.value}">${o.label}</button>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  const value = state.intro[q.id] || "";
  return `
    <div class="question-card">
      <p class="question-text">${q.question} <span class="optional-tag">Optioneel.</span></p>
      <input type="text" class="text-input" placeholder="${q.placeholder}" value="${escapeAttr(value)}"
        data-text-intro="${q.id}" />
    </div>
  `;
}

function renderSection(section, index) {
  return `
    <p class="step-label">Onderdeel ${index + 1} van de ${SECTIONS.length}</p>
    <h1 class="heading-lg">${section.title}</h1>
    <p class="body-md muted">${section.description}</p>
    <div class="question-stack">
      ${section.statements.map((st) => renderScaleQuestion(st.id, st.text)).join("")}
    </div>
  `;
}

function renderTransparency() {
  return `
    <h1 class="heading-lg">${TRANSPARENCY.title}</h1>
    <p class="body-md muted">${TRANSPARENCY.description}</p>
    <div class="question-stack">
      ${renderScaleQuestion(TRANSPARENCY.id, TRANSPARENCY.text, true)}
    </div>
  `;
}

function renderScaleQuestion(id, text, isTransparency) {
  const selected = isTransparency ? state.transparency : state.answers[id];
  return `
    <div class="question-card">
      <p class="question-text">${text}</p>
      <div class="scale-row">
        ${ANSWER_SCALE.map(
          (a) => `
          <button type="button" class="scale-btn ${selected === a.value ? "is-selected" : ""}"
            data-action="select-scale" data-stmt="${id}" data-transparency="${isTransparency ? "1" : "0"}"
            data-value="${a.value}">${a.label}</button>
        `
        ).join("")}
      </div>
    </div>
  `;
}

function renderResultsSummary() {
  const pct = totalPercent();
  const level = levelFor(pct);
  const strong = strongestTwo();
  const weak = weakestTwo();
  return `
    <div class="result-hero card">
      <p class="eyebrow">Jouw uitslag</p>
      <p class="score-big">${fmtPercent(pct)}</p>
      <span class="level-badge">${level.label}</span>
      <p class="body-md">${level.description}</p>
    </div>

    <div class="result-columns">
      <div>
        <h2 class="heading-sm good">Dit gaat al goed</h2>
        ${strong
          .map(
            (s) => `
          <div class="highlight-card good">
            <p class="highlight-title">${s.section.title}</p>
            <p class="body-sm">${s.section.tierDescriptions[tierFor(s.percent)]}</p>
          </div>
        `
          )
          .join("")}
      </div>
      <div>
        <h2 class="heading-sm opportunity">Hier ligt je grootste kans</h2>
        ${weak
          .map(
            (s) => `
          <div class="highlight-card opportunity">
            <p class="highlight-title">${s.section.title} (${fmtPercent(s.percent)})</p>
            <p class="body-sm">${s.section.tierDescriptions[tierFor(s.percent)]}</p>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div class="score-breakdown">
      <h2 class="heading-sm">Score per onderdeel</h2>
      ${SECTIONS.map((s) => {
        const p = sectionPercent(s);
        return `
          <div class="score-row">
            <div class="score-row-top">
              <span>${s.title}</span>
              <span class="score-row-pct">${fmtPercent(p)}</span>
            </div>
            <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="note-card">
      <p class="highlight-title">Aandachtspunt: transparantie</p>
      <p class="body-sm">Dit telt niet mee in je score, maar is wel belangrijk voor je geloofwaardigheid richting je doelgroep.</p>
    </div>
  `;
}

function renderBrand() {
  const q = BRAND_QUESTIONS;
  return `
    <h1 class="heading-lg">${BRAND_PAGE.title}</h1>
    <p class="body-md muted">${BRAND_PAGE.description}</p>
    <div class="question-stack">
      ${renderSingleChoiceCard(q.branche, state.brand.branche)}
      ${renderSingleChoiceCard(q.leeftijd, state.brand.leeftijd)}
      ${renderMultiChoiceCard(q.interesses, state.brand.interesses)}
      ${renderMultiChoiceCard(q.platformen, state.brand.platformen)}
      ${renderMultiChoiceCard(q.merkwoorden, state.brand.merkwoorden)}
      ${renderMultiChoiceCard(q.contentsoort, state.brand.contentsoort)}
    </div>
    <p class="body-sm muted">Je gegevens worden vertrouwelijk behandeld en alleen gebruikt voor jouw uitslag.</p>
  `;
}

function renderSingleChoiceCard(q, selected) {
  return `
    <div class="question-card">
      <p class="question-text">${q.question}</p>
      <div class="option-list">
        ${q.options
          .map(
            (o) => `
          <button type="button" class="option-pill ${selected === o ? "is-selected" : ""}"
            data-action="select-brand-single" data-qid="${q.id}" data-value="${escapeAttr(o)}">${o}</button>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderMultiChoiceCard(q, selectedList) {
  return `
    <div class="question-card">
      <p class="question-text">${q.question} <span class="optional-tag">Kies maximaal ${q.max}.</span></p>
      <div class="option-list">
        ${q.options
          .map((o) => {
            const isSelected = selectedList.includes(o);
            const atMax = selectedList.length >= q.max && !isSelected;
            return `
            <button type="button" class="option-pill ${isSelected ? "is-selected" : ""} ${atMax ? "is-disabled" : ""}"
              data-action="toggle-brand-multi" data-qid="${q.id}" data-max="${q.max}" data-value="${escapeAttr(o)}">${o}</button>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

// ---------- Resultaten-carrousel (na de merkvragen) ----------

const CAROUSEL_VIEWS = ["opportunities", "profile-0", "profile-1", "profile-2", "next-steps", "cta"];

function renderCarousel() {
  if (!state.matchedProfiles) state.matchedProfiles = matchProfiles();
  const view = CAROUSEL_VIEWS[state.carouselStep];
  let body = "";
  if (view === "opportunities") body = renderOpportunities();
  else if (view.startsWith("profile-")) body = renderProfile(parseInt(view.split("-")[1], 10));
  else if (view === "next-steps") body = renderNextSteps();
  else if (view === "cta") body = renderCtaPage();

  return `
    <div class="carousel-index">${state.carouselStep + 1} / ${CAROUSEL_VIEWS.length}</div>
    <div class="carousel-body">${body}</div>
  `;
}

function renderOpportunities() {
  const weak = weakestTwo();
  return `
    <h1 class="heading-lg">Jouw grootste kansen</h1>
    <p class="body-md muted">Op basis van je twee laagst scorende onderdelen.</p>
    <div class="opportunity-grid">
      ${weak
        .map(
          (w) => `
        <div class="opportunity-col">
          <h2 class="heading-sm">${w.section.title}</h2>
          <p class="body-sm muted">${w.section.tierDescriptions[tierFor(w.percent)]}</p>
          <div class="advice-card">
            <span class="advice-tag">Quick win</span>
            <p class="body-sm">${w.section.advice.quickwin}</p>
          </div>
          <div class="advice-card">
            <span class="advice-tag">Volgende stap</span>
            <p class="body-sm">${w.section.advice.volgendestap}</p>
          </div>
          <div class="advice-card">
            <span class="advice-tag">Langetermijndoel</span>
            <p class="body-sm">${w.section.advice.langetermijn}</p>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderProfile(i) {
  const profile = state.matchedProfiles[i];
  return `
    <p class="step-label">Profiel ${i + 1} van 3 · voorbeeldprofiel</p>
    <h1 class="heading-lg">${profile.name}</h1>
    <p class="body-md muted">${profile.type} — ${profile.platform}</p>
    <div class="profile-grid">
      <div class="profile-card">
        <p class="highlight-title">Waar post deze creator over?</p>
        <p class="body-sm">${profile.about}</p>
      </div>
      <div class="profile-card">
        <p class="highlight-title">Voorbeeld contentconcept</p>
        <p class="body-sm">${profile.concept}</p>
      </div>
      <div class="profile-card">
        <p class="highlight-title">Waarom dit past bij jou</p>
        <p class="body-sm">${profileWhyText(profile)}</p>
      </div>
      <div class="profile-card">
        <p class="highlight-title">KPI's voor dit voorstel</p>
        <p class="body-sm">${profile.kpis}</p>
      </div>
      <div class="profile-card">
        <p class="highlight-title">Jouw eerste stap</p>
        <p class="body-sm">${profile.firstStep}</p>
      </div>
    </div>
    <p class="body-sm muted">Dit is een fictief voorbeeldprofiel, geen bestaande creator.</p>
  `;
}

function renderNextSteps() {
  const startpunt = STARTPUNT_TEXT[state.intro.inzet];
  const doel = DOEL_TEXT[state.intro.doel];
  const budget = BUDGET_TEXT[state.intro.budget];
  const cols = [
    { label: "Je startpunt", data: startpunt },
    { label: "Je doel", data: doel },
    { label: "Je budget", data: budget },
  ];
  return `
    <h1 class="heading-lg">Jouw vervolgstappen</h1>
    <p class="body-md muted">Op basis van jouw antwoorden.</p>
    <div class="profile-grid">
      ${cols
        .map(
          (c) => `
        <div class="profile-card">
          <p class="highlight-title">${c.label}</p>
          <p class="body-sm">${c.data.text}</p>
          <ul class="check-list compact">
            ${c.data.bullets.map((b) => `<li>${b}</li>`).join("")}
          </ul>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderCtaPage() {
  return `
    <h1 class="heading-lg">${CTA_PAGE.title}</h1>
    <p class="body-md muted">${CTA_PAGE.description}</p>

    <div class="cta-grid">
      <div class="cta-card">
        <h2 class="heading-sm">${CTA_PAGE.planCta}</h2>
        ${
          state.meetingRequested
            ? `<p class="body-sm">Bedankt! We nemen contact met je op om dit moment te bevestigen.</p>`
            : `
          <div class="form-row">
            <input type="date" class="text-input" id="meeting-date" />
            <select class="text-input" id="meeting-time">
              ${["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
                .map((t) => `<option value="${t}">${t}</option>`)
                .join("")}
            </select>
          </div>
          <button type="button" class="btn-primary" data-action="request-meeting">Gesprek aanvragen</button>
        `
        }
      </div>

      <div class="cta-card">
        <h2 class="heading-sm">${CTA_PAGE.mailCta}</h2>
        ${
          state.mailSent
            ? `<p class="body-sm">Bedankt! Zodra deze functionaliteit live is ontvang je je uitslag automatisch per e-mail.</p>`
            : `
          <div class="form-row">
            <input type="email" class="text-input" id="result-email" placeholder="jouw@email.nl" />
          </div>
          <button type="button" class="btn-primary" data-action="send-mail">Mail mijn resultaten</button>
        `
        }
      </div>
    </div>
    <p class="body-sm muted">${CTA_PAGE.privacyNote}</p>
  `;
}

// ---------- Navigatie ----------

function renderNav(entry) {
  if (entry.id === "welcome") {
    return `<nav class="nav-bar single"><button type="button" class="btn-primary" data-action="start">${WELCOME.cta}</button></nav>`;
  }
  if (entry.id === "carousel") {
    const atStart = state.carouselStep === 0;
    const atEnd = state.carouselStep === CAROUSEL_VIEWS.length - 1;
    return `
      <nav class="nav-bar">
        <button type="button" class="btn-ghost" data-action="carousel-prev">&larr; Vorige</button>
        ${atEnd ? `<span class="body-sm muted">Einde van de Quickscan</span>` : `<button type="button" class="btn-primary" data-action="carousel-next">Volgende &rarr;</button>`}
      </nav>
    `;
  }
  const canGoBack = state.step > 0;
  const proceedOk = canProceed(entry);
  const nextLabel = entry.id === "results-summary" ? "Bekijk vervolgstappen" : "Volgende";
  return `
    <nav class="nav-bar">
      ${canGoBack ? `<button type="button" class="btn-ghost" data-action="nav-prev">Vorige</button>` : "<span></span>"}
      <button type="button" class="btn-primary" data-action="nav-next" ${proceedOk ? "" : "disabled"}>${nextLabel}</button>
    </nav>
  `;
}

function canProceed(entry) {
  switch (entry.id) {
    case "intro":
      return ["inzet", "ervaring", "doel", "budget"].every((id) => state.intro[id]);
    case "section":
      return entry.section.statements.every((st) => state.answers[st.id] !== undefined);
    case "transparency":
      return state.transparency !== null && state.transparency !== undefined;
    case "brand":
      return (
        !!state.brand.branche &&
        !!state.brand.leeftijd &&
        state.brand.interesses.length > 0 &&
        state.brand.platformen.length > 0 &&
        state.brand.merkwoorden.length > 0 &&
        state.brand.contentsoort.length > 0
      );
    default:
      return true;
  }
}

function goNext() {
  if (state.step < FLOW.length - 1) {
    state.step += 1;
    if (FLOW[state.step].id === "carousel") {
      state.carouselStep = 0;
      state.matchedProfiles = matchProfiles();
    }
    render();
  }
}

function goPrev() {
  if (state.step > 0) {
    state.step -= 1;
    render();
  }
}

function carouselNext() {
  if (state.carouselStep < CAROUSEL_VIEWS.length - 1) {
    state.carouselStep += 1;
    render();
  }
}

function carouselPrev() {
  if (state.carouselStep > 0) {
    state.carouselStep -= 1;
    render();
  } else {
    goPrev();
  }
}

// ---------- Helpers ----------

function escapeAttr(str) {
  return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// ---------- Event delegation ----------

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "start") return goNext();
  if (action === "nav-next") return goNext();
  if (action === "nav-prev") return goPrev();
  if (action === "carousel-next") return carouselNext();
  if (action === "carousel-prev") return carouselPrev();

  if (action === "select-intro") {
    state.intro[el.dataset.qid] = el.dataset.value;
    return render();
  }

  if (action === "select-scale") {
    const value = parseInt(el.dataset.value, 10);
    if (el.dataset.transparency === "1") {
      state.transparency = value;
    } else {
      state.answers[el.dataset.stmt] = value;
    }
    return render();
  }

  if (action === "select-brand-single") {
    state.brand[el.dataset.qid] = el.dataset.value;
    return render();
  }

  if (action === "toggle-brand-multi") {
    const qid = el.dataset.qid;
    const max = parseInt(el.dataset.max, 10);
    const value = el.dataset.value;
    const list = state.brand[qid];
    const idx = list.indexOf(value);
    if (idx > -1) {
      list.splice(idx, 1);
    } else if (list.length < max) {
      list.push(value);
    }
    return render();
  }

  if (action === "request-meeting") {
    state.meetingRequested = true;
    return render();
  }

  if (action === "send-mail") {
    state.mailSent = true;
    return render();
  }
});

document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset && el.dataset.textIntro) {
    state.intro[el.dataset.textIntro] = el.value;
  }
});

render();
