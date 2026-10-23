// Creator Quickscan — app-logica (vanilla JS, geen build-stap nodig)
// De score wordt altijd via vaste regels berekend (zie content.js). Advies- en
// profielteksten zijn vooraf geschreven en worden automatisch geselecteerd op
// basis van de echte antwoorden — dit is de fase 1 vervanger voor de AI-koppeling
// die in een latere fase wordt toegevoegd (zie briefing).
//
// Schermvolgorde en vormgeving volgen het Adobe XD-prototype van A Bigger Circle.

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
  finalMailSent: false,
};

// Volgorde zoals in het XD-prototype: welkom -> intro -> "over jouw merk" -> de
// zeven scorende onderdelen -> transparantie -> resultatenoverzicht -> cover ->
// carrousel (score+antwoorden, 3 profielen, vervolgstappen, grootste kansen, CTA).
const FLOW = [
  { id: "welcome" },
  { id: "intro", progress: true },
  { id: "brand", progress: true },
  ...SECTIONS.map((section, i) => ({ id: "section", progress: true, section, sectionIndex: i })),
  { id: "transparency", progress: true },
  { id: "results-summary" },
  { id: "cover" },
  { id: "carousel" },
];

const PROGRESS_STEPS = FLOW.filter((f) => f.progress);
const CAROUSEL_VIEWS = ["score-tags", "profile-0", "profile-1", "profile-2", "next-steps", "opportunities", "final-cta"];

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

function answerTags() {
  const tags = [];
  if (state.brand.branche) tags.push(state.brand.branche);
  if (state.brand.leeftijd) tags.push(state.brand.leeftijd + " jaar");
  const budgetLabel = INTRO_QUESTIONS.find((q) => q.id === "budget").options.find((o) => o.value === state.intro.budget);
  if (budgetLabel) tags.push(budgetLabel.label);
  const doelLabel = INTRO_QUESTIONS.find((q) => q.id === "doel").options.find((o) => o.value === state.intro.doel);
  if (doelLabel) tags.push("Doel: " + doelLabel.label);
  if (state.brand.platformen.length) tags.push(state.brand.platformen.join(" en "));
  return tags;
}

// ---------- Render: top-level dispatch ----------

function render() {
  const app = document.getElementById("app");
  const entry = FLOW[state.step];
  let html;
  if (entry.id === "welcome") html = renderWelcomePage();
  else if (entry.id === "results-summary") html = renderResultsSummaryPage();
  else if (entry.id === "cover") html = renderCoverPage();
  else if (entry.id === "carousel") html = renderCarouselPage();
  else html = renderStandardShell(entry);
  app.innerHTML = html;
}

function scrollTop() {
  window.scrollTo(0, 0);
}

function logoHtml(variant) {
  // variant: "ultramarine" (on oat bg) or "oat" (on ultramarine bg)
  return `<div class="logo logo-${variant}">${BRAND.wordmark.map((w) => `<span>${w}</span>`).join("")}</div>`;
}

// ---------- Welcome ----------

function renderWelcomePage() {
  return `
    <div class="app-shell">
      <section class="hero-card">
        ${logoHtml("oat")}
        <h1 class="title-xl">${WELCOME.title.split(" ").join("<br>")}</h1>
        <p class="body-lg">${WELCOME.intro}</p>
      </section>
      <section class="benefits">
        <p class="body-md">${WELCOME.description}</p>
        <h2 class="heading-sm">${WELCOME.benefitsTitle}</h2>
        <ul class="dash-list">
          ${WELCOME.benefits.map((b) => `<li>${b}</li>`).join("")}
        </ul>
        <button type="button" class="btn-primary" data-action="start">${WELCOME.cta}</button>
      </section>
    </div>
  `;
}

// ---------- Gedeelde shell: intro / brand / section / transparency ----------

function renderStandardShell(entry) {
  const progressIdx = PROGRESS_STEPS.indexOf(entry);
  const showProgress = progressIdx > -1;
  const pct = showProgress ? ((progressIdx + 1) / PROGRESS_STEPS.length) * 100 : 0;
  return `
    <div class="page-logo">${logoHtml("ultramarine")}</div>
    <div class="app-shell">
      ${renderStandardNav(entry) /* TIJDELIJK: nav ook bovenaan, voor sneller doorklikken tijdens testen. Verwijderen om terug te gaan naar alleen onderaan. */}
      ${showProgress ? `<div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>` : ""}
      <main class="page">${renderContent(entry)}</main>
      ${renderStandardNav(entry)}
    </div>
  `;
}

function renderContent(entry) {
  switch (entry.id) {
    case "intro":
      return renderIntro();
    case "brand":
      return renderBrand();
    case "section":
      return renderSection(entry.section, entry.sectionIndex);
    case "transparency":
      return renderTransparency();
    default:
      return "";
  }
}

function renderIntro() {
  return `
    <h2 class="heading-lg">${INTRO_PAGE.title}</h2>
    <p class="body-md muted page-description">${INTRO_PAGE.description}</p>
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
        <h3 class="question-text">${q.question}</h3>
        <div class="option-list stacked">
          ${q.options
            .map(
              (o) => `
            <button type="button" class="choice-btn ${selected === o.value ? "is-selected" : ""}"
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
      <h3 class="question-text">${q.question}</h3>
      <p class="optional-tag">Optioneel.</p>
      <input type="text" class="text-input" placeholder="${q.placeholder}" value="${escapeAttr(value)}"
        data-text-intro="${q.id}" />
    </div>
  `;
}

function renderSection(section, index) {
  return `
    <p class="step-label">Onderdeel ${index + 1} van de ${SECTIONS.length}</p>
    <h2 class="heading-lg">${section.title}</h2>
    <p class="body-md muted page-description">${section.description}</p>
    <div class="question-stack">
      ${section.statements.map((st) => renderScaleQuestion(st.id, st.text)).join("")}
    </div>
  `;
}

function renderTransparency() {
  return `
    <h2 class="heading-lg">${TRANSPARENCY.title}</h2>
    <p class="body-md muted page-description">${TRANSPARENCY.description}</p>
    <div class="question-stack">
      ${renderScaleQuestion(TRANSPARENCY.id, TRANSPARENCY.text, true)}
    </div>
  `;
}

function renderScaleQuestion(id, text, isTransparency) {
  const selected = isTransparency ? state.transparency : state.answers[id];
  return `
    <div class="question-card">
      <h3 class="question-text">${text}</h3>
      <div class="scale-row">
        ${ANSWER_SCALE.map(
          (a) => `
          <button type="button" class="choice-btn scale-btn ${selected === a.value ? "is-selected" : ""}"
            data-action="select-scale" data-stmt="${id}" data-transparency="${isTransparency ? "1" : "0"}"
            data-value="${a.value}">${a.label}</button>
        `
        ).join("")}
      </div>
    </div>
  `;
}

function renderBrand() {
  const q = BRAND_QUESTIONS;
  return `
    <h2 class="heading-lg">${BRAND_PAGE.title}</h2>
    <p class="body-md muted page-description">${BRAND_PAGE.description}</p>
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
      <h3 class="question-text">${q.question}</h3>
      <p class="optional-tag">Kies 1 antwoord.</p>
      <div class="option-list stacked">
        ${q.options
          .map(
            (o) => `
          <button type="button" class="choice-btn ${selected === o ? "is-selected" : ""}"
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
      <h3 class="question-text">${q.question}</h3>
      <p class="optional-tag">Kies maximaal ${q.max}.</p>
      <div class="option-list wrap">
        ${q.options
          .map((o) => {
            const isSelected = selectedList.includes(o);
            const atMax = selectedList.length >= q.max && !isSelected;
            return `
            <button type="button" class="choice-btn ${isSelected ? "is-selected" : ""} ${atMax ? "is-disabled" : ""}"
              data-action="toggle-brand-multi" data-qid="${q.id}" data-max="${q.max}" data-value="${escapeAttr(o)}">${o}</button>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderStandardNav(entry) {
  const canGoBack = state.step > 0;
  const proceedOk = canProceed(entry);
  return `
    <nav class="nav-bar">
      ${canGoBack ? `<button type="button" class="btn-primary" data-action="nav-prev">Vorige</button>` : "<span></span>"}
      <button type="button" class="btn-primary" data-action="nav-next" ${proceedOk ? "" : "disabled"}>Volgende</button>
    </nav>
  `;
}

// ---------- Resultatenoverzicht (met ingebedde CTA) ----------

function renderResultsSummaryPage() {
  const pct = totalPercent();
  const level = levelFor(pct);
  const strong = strongestTwo();
  const weak = weakestTwo();
  return `
    <div class="app-shell">
      <div class="hero-card result-hero">
        ${logoHtml("oat")}
        <p class="eyebrow no-letter-spacing">Jouw resultaat</p>
        <p class="score-big">${fmtPercent(pct)}</p>
        <span class="level-badge">${level.label}</span>
        <p class="body-md level-description level-${level.id}">${level.description}</p>
      </div>

      <h2 class="heading-sm">Dit gaat al goed</h2>
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

      <h2 class="heading-sm">Hier ligt je grootste kans</h2>
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

      <div class="hero-card cta-embed-card">
        ${logoHtml("oat")}
        <h2 class="heading-lg cta-heading">${EMBEDDED_CTA.title}</h2>
        <p class="body-md">${EMBEDDED_CTA.description}</p>
        <button type="button" class="btn-white" data-action="request-meeting">${EMBEDDED_CTA.planCta}</button>
        ${
          state.mailSent
            ? `<p class="body-sm">Bedankt! Zodra deze functionaliteit live is ontvang je je uitslag automatisch per e-mail.</p>`
            : `
          <p class="body-md">${EMBEDDED_CTA.mailLabel}</p>
          <input type="email" class="text-input" id="result-email" placeholder="jouw@email.nl" />
          <button type="button" class="btn-white" data-action="send-mail">${EMBEDDED_CTA.mailCta}</button>
        `
        }
        ${state.meetingRequested ? `<p class="body-sm">Bedankt! We nemen contact met je op om dit moment te bevestigen.</p>` : ""}
      </div>
      <p class="body-sm muted">${EMBEDDED_CTA.privacyNote}</p>

      <nav class="nav-bar">
        <button type="button" class="btn-primary" data-action="nav-prev">Vorige</button>
        <button type="button" class="btn-primary" data-action="nav-next">Bekijk vervolgstappen</button>
      </nav>
    </div>
  `;
}

// ---------- Cover (tussenscherm) ----------

function renderCoverPage() {
  return `
    <div class="cover-page" data-action="cover-next">
      ${logoHtml("oat")}
      <div class="cover-content">
        <h1 class="title-xl cover-title">${COVER_PAGE.title.replace(" en ", "<br>en ")}</h1>
        <p class="body-lg cover-subtitle">${COVER_PAGE.subtitle}</p>
      </div>
      <p class="footer-label oat">${FOOTER_LABEL}</p>
    </div>
  `;
}

// ---------- Resultaten-carrousel ----------

function renderCarouselPage() {
  if (!state.matchedProfiles) state.matchedProfiles = matchProfiles();
  const view = CAROUSEL_VIEWS[state.carouselStep];

  if (view === "final-cta") return renderFinalCtaPage();

  let body = "";
  if (view === "score-tags") body = renderScoreTagsPage();
  else if (view.startsWith("profile-")) body = renderProfile(parseInt(view.split("-")[1], 10));
  else if (view === "next-steps") body = renderNextSteps();
  else if (view === "opportunities") body = renderOpportunities();

  const atStart = state.carouselStep === 0;
  const atEnd = state.carouselStep === CAROUSEL_VIEWS.length - 1;
  return `
    <div class="carousel-shell">
      <div class="carousel-body">${body}</div>
      <p class="footer-label">${FOOTER_LABEL}</p>
      <button type="button" class="arrow-nav arrow-left" data-action="carousel-prev" aria-label="Vorige">&#8592;</button>
      ${atEnd ? "" : `<button type="button" class="arrow-nav arrow-right" data-action="carousel-next" aria-label="Volgende">&#8594;</button>`}
    </div>
  `;
}

function renderScoreTagsPage() {
  const pct = totalPercent();
  const level = levelFor(pct);
  return `
    <div class="score-tags-grid">
      <div>
        <h1 class="heading-lg">${SCORE_PAGE.title}</h1>
        <div class="hero-card score-hero">
          <p class="eyebrow">${SCORE_PAGE.exampleLabel}</p>
          <p class="score-big">${fmtPercent(pct)}</p>
          <span class="level-badge">${level.label}</span>
          <p class="body-md level-description level-${level.id}">${level.description}</p>
        </div>
        <h3 class="heading-xs answers-label">${SCORE_PAGE.answersLabel}</h3>
        <div class="tag-list">
          ${answerTags()
            .map((t) => `<span class="answer-tag">${t}</span>`)
            .join("")}
        </div>
      </div>
      <div class="score-breakdown-col">
        <h3 class="heading-xs breakdown-title">${SCORE_PAGE.breakdownTitle}</h3>
        ${SECTIONS.map((s) => {
          const p = sectionPercent(s);
          return `
            <div class="score-row">
              <div class="score-row-top">
                <span class="highlight-title">${s.title}</span>
                <span class="score-row-pct">${fmtPercent(p)}</span>
              </div>
              <div class="bar-track"><div class="bar-fill" style="width:${p}%"></div></div>
              <p class="body-sm">${s.tierDescriptions[tierFor(p)]}</p>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderOpportunities() {
  const weak = weakestTwo();
  return `
    <h1 class="heading-lg opportunities-title">${OPPORTUNITIES_PAGE.title}</h1>
    <div class="opportunity-grid">
      ${weak
        .map(
          (w) => `
        <div class="opportunity-col">
          <h2 class="heading-sm opportunity-heading">${w.section.title}</h2>
          <p class="body-sm muted opportunity-tier-text">${w.section.tierDescriptions[tierFor(w.percent)]}</p>
          <div class="advice-card">
            <span class="pill-label">Quick win</span>
            <p class="body-sm">${w.section.advice.quickwin}</p>
          </div>
          <div class="advice-card">
            <span class="pill-label">Volgende stap</span>
            <p class="body-sm">${w.section.advice.volgendestap}</p>
          </div>
          <div class="advice-card">
            <span class="pill-label">Langetermijndoel</span>
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
    <div class="profile-header">
      <div>
        <h1 class="heading-lg">${profile.name}</h1>
        <p class="body-md muted profile-subtitle">${profile.type} - ${profile.platform}</p>
      </div>
      <span class="pill-outline profile-count-badge">Profiel ${i + 1} van 3</span>
    </div>
    <div class="tag-list outline">
      <span class="pill-outline profile-tag">${profile.tags[0]}</span>
      <span class="pill-outline profile-tag">${profile.tags[1]}</span>
      <span class="pill-outline profile-tag">${profile.platform}</span>
    </div>
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
        <p class="highlight-title">KPI's om te gebruiken binnen dit voorstel</p>
        <p class="body-sm">${profile.kpis}</p>
      </div>
      <div class="profile-card">
        <p class="highlight-title">Jouw eerste stap</p>
        <p class="body-sm">${profile.firstStep}</p>
      </div>
    </div>
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
    <h1 class="heading-lg">${NEXT_STEPS_PAGE.title}</h1>
    <p class="body-md muted">${NEXT_STEPS_PAGE.description}</p>
    <div class="profile-grid three-col">
      ${cols
        .map(
          (c) => `
        <div>
          <span class="pill-label block">${c.label}</span>
          <div class="profile-card">
            <p class="body-sm">${c.data.text}</p>
            <ul class="dash-list compact">
              ${c.data.bullets.map((b) => `<li>${b}</li>`).join("")}
            </ul>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

function renderFinalCtaPage() {
  return `
    <div class="final-cta-page">
      ${logoHtml("oat")}
      <div class="final-cta-body">
        <h1 class="heading-lg">${FINAL_CTA.title}</h1>
        <p class="body-md">${FINAL_CTA.description}</p>
        <div class="final-cta-buttons">
          <button type="button" class="btn-white" data-action="request-meeting">${FINAL_CTA.planCta}</button>
          <button type="button" class="btn-white" data-action="send-mail-final">${FINAL_CTA.mailCta}</button>
        </div>
        ${state.finalMailSent ? `<p class="body-sm">Bedankt! Zodra deze functionaliteit live is ontvang je je uitslag automatisch per e-mail.</p>` : ""}
        ${state.meetingRequested ? `<p class="body-sm">Bedankt! We nemen contact met je op om dit moment te bevestigen.</p>` : ""}
      </div>
      <p class="footer-label oat">${FOOTER_LABEL}</p>
      <button type="button" class="arrow-nav arrow-left oat" data-action="carousel-prev" aria-label="Vorige">&#8592;</button>
    </div>
  `;
}

// ---------- Navigatie ----------

function canProceed(entry) {
  // TIJDELIJK: validatie uitgeschakeld zodat je kan doorklikken zonder
  // vragen in te vullen (voor testen). Originele logica hieronder bewaard
  // in comments — haal de comment-tekens weg en verwijder de "return true"
  // erboven om de echte validatie weer aan te zetten.
  return true;
  /*
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
  */
}

function goNext() {
  if (state.step < FLOW.length - 1) {
    state.step += 1;
    if (FLOW[state.step].id === "carousel") {
      state.carouselStep = 0;
      state.matchedProfiles = matchProfiles();
    }
    render();
    scrollTop();
  }
}

function goPrev() {
  if (state.step > 0) {
    state.step -= 1;
    render();
    scrollTop();
  }
}

function carouselNext() {
  if (state.carouselStep < CAROUSEL_VIEWS.length - 1) {
    state.carouselStep += 1;
    render();
    scrollTop();
  }
}

function carouselPrev() {
  if (state.carouselStep > 0) {
    state.carouselStep -= 1;
    render();
    scrollTop();
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
  if (action === "cover-next") return goNext();

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

  if (action === "send-mail-final") {
    state.finalMailSent = true;
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
scrollTop();