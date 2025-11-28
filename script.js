// Parallax background
const bgCinema = document.querySelector(".bg-cinema");
window.addEventListener("scroll", () => {
  const y = window.scrollY * 0.12;
  bgCinema.style.transform = `translateY(${y}px)`;
});

// Smooth scroll nav
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(btn.dataset.scroll);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Active nav on scroll
const sections = document.querySelectorAll("main section[id]");
function updateActiveNav() {
  let activeId = null;
  const offset = 160;
  const scrollY = window.scrollY;
  sections.forEach((sec) => {
    const top = sec.offsetTop - offset;
    if (scrollY >= top) {
      activeId = `#${sec.id}`;
    }
  });
  navLinks.forEach((btn) => {
    if (btn.dataset.scroll === activeId) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });
}
window.addEventListener("scroll", updateActiveNav);
updateActiveNav();

// Animations on scroll
const animatedSections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);
animatedSections.forEach((s) => observer.observe(s));

// Experience detail
const xpCards = document.querySelectorAll(".xp-card");
const xpDetail = document.getElementById("xp-detail");

const xpDetails = {
  "market-lab": {
    title: "Market Lab — lire un board comme un pro",
    text:
      "On affiche le CAC, le S&P, le Nasdaq, les taux et Bitcoin sur un écran. Chaque membre doit expliquer un mouvement : 'qu’est-ce qui a pu provoquer ce +1,2 % ?'. On cherche des hypothèses cohérentes, pas des excuses.",
  },
  "macro-room": {
    title: "Macro Room — la macro traduite en décisions",
    text:
      "On prend un article de presse (Financial Times, The Economist…) et on le découpe : faits, hypothèses, conséquences possibles. Ensuite, on discute : qu’est-ce qu’un gérant ferait concrètement sur son portefeuille ?",
  },
  "career-lab": {
    title: "Career Lab — transformer FEIS en ligne de CV",
    text:
      "On construit des mini-dossiers FEIS (pays, secteur, ETF) que tu peux ensuite présenter en entretien. Objectif : montrer que tu sais suivre les marchés, structurer un raisonnement et assumer une position.",
  },
};

xpCards.forEach((card) => {
  const key = card.dataset.xp;
  const info = xpDetails[key];

  function showDetail() {
    if (!info) return;
    xpDetail.innerHTML = `
      <h3 class="xp-detail-title">${info.title}</h3>
      <p>${info.text}</p>
    `;
  }

  card.addEventListener("mouseenter", showDetail);
  card.addEventListener("click", showDetail);
});

// QA DATA
const qaData = [
  {
    q: "J’ai tout sur un livret, comment commencer sans faire n’importe quoi ?",
    meta: "Profil débutant",
    body:
      "FEIS commence par séparer ton argent en deux : cash de sécurité (6 mois de dépenses) et capital à investir. Le cash reste sur livret. Le capital va petit à petit sur un ETF Monde via des versements réguliers.",
    tags: ["Cash de secours", "ETF Monde", "Investissement progressif"],
  },
  {
    q: "Comment utiliser la crypto sans exploser mon patrimoine ?",
    meta: "Poche spéculative",
    body:
      "La crypto est traitée comme un laboratoire de volatilité. On parle d’une poche max de 5 % du patrimoine financier, uniquement si tu acceptes mentalement la possibilité de -70 % sans mettre en danger ton quotidien.",
    tags: ["Poche limitée", "BTC / ETH d’abord", "Pas d’effet de levier"],
  },
  {
    q: "Faut-il attendre que le marché baisse pour investir ?",
    meta: "Biais psychologique",
    body:
      "Les données montrent que rater quelques rares journées de forte hausse détruit une grande part de la performance long terme. FEIS préfère un plan automatique (DCA) : même montant, même jour, sur un ETF diversifié.",
    tags: ["DCA", "Données historiques", "Moins de stress"],
  },
  {
    q: "Comment parler des marchés en entretien grâce à FEIS ?",
    meta: "Angle carrière",
    body:
      "À chaque séance, tu peux garder une trace : capture du board marchés, mini-note macro, décisions simulées. Au bout de quelques mois, tu as un dossier FEIS que tu peux utiliser en entretien pour prouver ta curiosité et ta rigueur.",
    tags: ["Notes de marché", "Dossiers FEIS", "Prépa entretiens"],
  },
];

const qaList = document.getElementById("qa-list");

qaData.forEach((item, index) => {
  const wrapper = document.createElement("article");
  wrapper.className = "qa-item";

  const btn = document.createElement("button");
  btn.className = "qa-btn";

  btn.innerHTML = `
    <span class="qa-question">${item.q}</span>
    <span class="qa-meta">
      <span>${item.meta}</span>
      <span class="qa-icon">›</span>
    </span>
  `;

  const panel = document.createElement("div");
  panel.className = "qa-panel";

  const inner = document.createElement("div");
  inner.className = "qa-panel-inner";
  inner.innerHTML = `
    <p>${item.body}</p>
    <div class="qa-tags">
      ${item.tags.map((t) => `<span class="qa-tag">${t}</span>`).join("")}
    </div>
  `;

  panel.appendChild(inner);
  wrapper.appendChild(btn);
  wrapper.appendChild(panel);
  qaList.appendChild(wrapper);

  btn.addEventListener("click", () => {
    const isOpen = wrapper.classList.contains("is-open");
    document.querySelectorAll(".qa-item").forEach((other) => {
      other.classList.remove("is-open");
      const p = other.querySelector(".qa-panel");
      if (p) p.style.maxHeight = null;
    });
    if (!isOpen) {
      wrapper.classList.add("is-open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });

  // ouvrir la première par défaut
  if (index === 0) {
    wrapper.classList.add("is-open");
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
});

// MARCHÉS — tentative de vrai live via Yahoo Finance, fallback simulation
const marketsList = document.getElementById("markets-list");
const marketsNote = document.getElementById("markets-note");
const marketsComment = document.getElementById("markets-comment");
const refreshBtn = document.getElementById("btn-refresh");

const marketConfig = [
  { label: "CAC 40", symbol: "^FCHI", role: "Proxy France, luxe & industrie." },
  { label: "S&P 500", symbol: "^GSPC", role: "États-Unis large cap, colonne vertébrale de nombreux portefeuilles." },
  { label: "NASDAQ 100", symbol: "^NDX", role: "Tech US & croissance, très sensible aux taux." },
  { label: "MSCI World (URTH)", symbol: "URTH", role: "ETF Monde diversifié, base long terme." },
  { label: "Bitcoin", symbol: "BTC-USD", role: "Actif spéculatif / 'or numérique' selon certains, volatilité extrême." },
  { label: "Ethereum", symbol: "ETH-USD", role: "Infrastructure crypto, paris sur l’écosystème plutôt qu’une seule appli." },
];

function renderMarkets(quotes, fromLive) {
  marketsList.innerHTML = "";
  quotes.forEach((q) => {
    const row = document.createElement("div");
    row.className = "market-row";
    row.dataset.symbol = q.symbol;

    const left = document.createElement("span");
    left.className = "market-name";
    left.textContent = q.name;

    const right = document.createElement("div");
    right.className = "market-right";

    const val = document.createElement("span");
    val.className = "market-value";
    val.textContent = q.price;

    const chg = document.createElement("span");
    chg.className =
      "market-change " + (q.change >= 0 ? "chg-pos" : "chg-neg");
    const sign = q.change >= 0 ? "+" : "";
    chg.textContent = `${sign}${q.change.toFixed(2)} %`;

    right.appendChild(val);
    right.appendChild(chg);
    row.appendChild(left);
    row.appendChild(right);
    marketsList.appendChild(row);

    row.addEventListener("click", () => {
      const config = marketConfig.find((m) => m.symbol === q.symbol);
      if (!config) return;
      marketsComment.innerHTML = `
        <h3>${config.label}</h3>
        <p>
          ${config.role}
        </p>
        <p>
          Lecture FEIS : prix ~ <strong>${q.price}</strong>, variation
          <strong>${sign}${q.change.toFixed(2)} %</strong>. On ne réagit pas
          à chaque mouvement, on se demande : quel rôle cet actif joue-t-il
          dans un portefeuille long terme ?
        </p>
      `;
    });
  });

  marketsNote.textContent = fromLive
    ? "Données basées sur Yahoo Finance (sans garantie). Usage 100 % pédagogique."
    : "Mode pédagogique : niveaux indicatifs avec variations simulées.";
}

function simulateQuotes() {
  const base = {
    "^FCHI": 7400,
    "^GSPC": 5100,
    "^NDX": 18000,
    "URTH": 120,
    "BTC-USD": 65000,
    "ETH-USD": 3600,
  };
  const quotes = marketConfig.map((m) => {
    const b = base[m.symbol] || 100;
    const shift = Math.random() * 1.4 - 0.7; // -0.7% à +0.7%
    const price = (b * (1 + shift / 100)).toFixed(2);
    return {
      symbol: m.symbol,
      name: m.label,
      price,
      change: shift,
    };
  });
  renderMarkets(quotes, false);
}

async function fetchLiveQuotes() {
  try {
    const symbols = marketConfig.map((m) => m.symbol).join(",");
    const url =
      "https://query1.finance.yahoo.com/v7/finance/quote?symbols=" +
      encodeURIComponent(symbols);

    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const result = data.quoteResponse && data.quoteResponse.result
      ? data.quoteResponse.result
      : [];

    if (!result.length) throw new Error("No data");

    const quotes = marketConfig.map((m) => {
      const r = result.find((x) => x.symbol === m.symbol) || {};
      const price = r.regularMarketPrice ?? r.previousClose ?? 0;
      const changePct =
        r.regularMarketChangePercent ??
        (r.regularMarketChange && r.regularMarketPreviousClose
          ? (r.regularMarketChange / r.regularMarketPreviousClose) * 100
          : 0);
      return {
        symbol: m.symbol,
        name: m.label,
        price: price ? price.toFixed(2) : "--",
        change: changePct || 0,
      };
    });

    renderMarkets(quotes, true);
  } catch (err) {
    console.warn("Live fetch failed, simulate instead:", err);
    simulateQuotes();
  }
}

refreshBtn.addEventListener("click", () => {
  fetchLiveQuotes();
});

// first load
fetchLiveQuotes();
