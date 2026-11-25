/* =====================================================================
   MAIN.JS — turns js/content.js into the page.
   You normally never need to edit this file; change content.js instead.
   ===================================================================== */
(function () {
  "use strict";

  var S = window.SITE;
  if (!S) return;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- text helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // escape, then allow `code` and **bold**
  function fmt(s) {
    return esc(s)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }
  function ph(label, extraClass) {
    return '<div class="ph ' + (extraClass || "") + '" role="note">' +
      '<span class="ph__tag">Placeholder</span><span class="ph__label">' + esc(label) + "</span></div>";
  }
  function tags(list) {
    return '<ul class="tags">' + list.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
  }
  var ARROW = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXT = '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function cvButton(cls) {
    if (S.cv) {
      return '<a class="btn ' + cls + '" href="' + esc(S.cv) + '" download>Download CV</a>';
    }
    return '<span class="btn btn--ph" role="note" title="Add your CV file and set `cv` in js/content.js">CV — PDF to be added</span>';
  }

  /* ---------- hero ---------- */
  function renderHero() {
    var h = S.hero;
    var photo = S.photo
      ? '<img class="hero__photo' + (S.photoCutout ? " hero__photo--cutout" : "") + '" src="' + esc(S.photo) + '" alt="Portrait of ' + esc(S.name) + '" width="420" height="520">'
      : ph("Your photo goes here", "ph--photo");
    $("#hero").innerHTML =
      '<div class="hero__glow" aria-hidden="true"></div>' +
      '<div class="container hero__grid">' +
        '<div class="hero__text">' +
          '<p class="eyebrow reveal">' + esc(h.eyebrow) + "</p>" +
          '<h1 class="hero__name reveal">' + esc(S.name) + "</h1>" +
          '<p class="hero__headline reveal">' + esc(h.headline) + "</p>" +
          '<p class="hero__sub reveal">' + fmt(h.sub) + "</p>" +
          '<div class="hero__cta reveal">' +
            '<a class="btn btn--primary" href="#projects">View projects ' + ARROW + "</a>" +
            cvButton("btn--ghost") +
          "</div>" +
        "</div>" +
        '<div class="hero__media' + (S.photo && S.photoCutout ? " hero__media--cutout" : "") + ' reveal">' + photo + "</div>" +
      "</div>" +
      '<div class="container"><dl class="facts reveal">' +
        h.facts.map(function (f) {
          return "<div><dt>" + esc(f.label) + "</dt><dd>" + esc(f.value) + "</dd></div>";
        }).join("") +
      "</dl></div>";
  }

  /* ---------- section header ---------- */
  function head(num, id, title, lead) {
    return '<header class="section__head reveal">' +
      '<p class="section__num" aria-hidden="true">' + num + "</p>" +
      '<h2 id="' + id + '">' + esc(title) + "</h2>" +
      (lead ? '<p class="section__lead">' + esc(lead) + "</p>" : "") +
      "</header>";
  }

  /* ---------- about ---------- */
  function renderAbout() {
    $("#about").innerHTML = '<div class="container about">' +
      head("01", "about-h", "About") +
      '<div class="about__text reveal">' +
        S.about.map(function (p, i) {
          return "<p" + (i === 0 ? ' class="about__first"' : "") + ">" + fmt(p) + "</p>";
        }).join("") +
      "</div></div>";
  }

  /* ---------- project card visuals ---------- */
  function cardVisual(v) {
    if (!v) return "";
    if (v.type === "image") {
      return '<div class="card__visual card__visual--img"><img src="' + esc(v.src) + '" alt="' + esc(v.alt) +
        '" loading="lazy" decoding="async"' + (v.position ? ' style="object-position:' + esc(v.position) + '"' : "") + "></div>";
    }
    if (v.type === "stats") {
      return '<div class="card__visual card__visual--stats"><dl class="stats">' + v.items.map(function (s) {
        return '<div class="stat"><dt>' + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>";
      }).join("") + "</dl></div>";
    }
    if (v.type === "flow") {
      return '<div class="card__visual card__visual--flow"><ol class="flow" aria-label="Pipeline steps">' + v.steps.map(function (s) {
        return "<li>" + esc(s) + "</li>";
      }).join("") + "</ol></div>";
    }
    if (v.type === "tokens") {
      return '<div class="card__visual card__visual--tokens"><ul class="tokens">' + v.items.map(function (s) {
        return "<li>" + esc(s) + "</li>";
      }).join("") + "</ul></div>";
    }
    if (v.type === "placeholder") {
      return '<div class="card__visual card__visual--ph">' + ph(v.label) + "</div>";
    }
    return "";
  }

  /* ---------- projects ---------- */
  function renderProjects() {
    var cards = S.projects.map(function (p, i) {
      return '<li class="card-wrap card-wrap--' + esc(p.size || "half") + ' reveal">' +
        '<a class="card" href="#/project/' + esc(p.id) + '" data-project="' + esc(p.id) + '">' +
          cardVisual(p.visual) +
          '<div class="card__body">' +
            '<p class="card__meta"><span>' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(p.year) + "</span></p>" +
            '<h3 class="card__title">' + esc(p.title) + "</h3>" +
            '<p class="card__summary">' + fmt(p.summary) + "</p>" +
            tags(p.tags) +
            '<span class="card__more">Read the details ' + ARROW + "</span>" +
          "</div>" +
        "</a></li>";
    }).join("");

    var small = S.smallerWork.map(function (w) {
      if (w.placeholder) return '<li class="reveal">' + ph(w.placeholder, "ph--small") + "</li>";
      var inner = '<p class="small__meta">' + esc(w.meta || "") + "</p>" +
        "<h4>" + esc(w.title) + (w.url ? " " + EXT : "") + "</h4><p>" + fmt(w.text) + "</p>";
      return '<li class="reveal">' + (w.url
        ? '<a class="small" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + inner + "</a>"
        : '<div class="small">' + inner + "</div>") + "</li>";
    }).join("");

    $("#projects").innerHTML = '<div class="container">' +
      head("02", "projects-h", "Projects", "Seven projects, each with the problem, the decisions and the reasoning behind them.") +
      '<ul class="cards">' + cards + "</ul>" +
      '<h3 class="sub-h reveal">Smaller work</h3>' +
      '<ul class="smalls">' + small + "</ul>" +
      "</div>";
  }

  /* ---------- experience & education ---------- */
  function timelineItem(e) {
    return '<li class="tl__item reveal">' +
      '<p class="tl__when">' + esc(e.when) + "</p>" +
      '<div class="tl__body">' +
        "<h4>" + esc(e.role) + "</h4>" +
        '<p class="tl__org">' + esc(e.org) + " · " + esc(e.where) + "</p>" +
        (e.note ? '<p class="tl__note">' + esc(e.note) + "</p>" : "") +
        (e.points ? "<ul class=\"tl__points\">" + e.points.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ul>" : "") +
        (e.coursework ? '<p class="tl__label">Relevant coursework</p>' + tags(e.coursework) : "") +
      "</div></li>";
  }
  function renderExperience() {
    $("#experience").innerHTML = '<div class="container">' +
      head("03", "experience-h", "Experience & education") +
      '<div class="tl-grid">' +
        '<div><h3 class="sub-h reveal">Education</h3><ol class="tl">' + S.education.map(timelineItem).join("") + "</ol></div>" +
        '<div><h3 class="sub-h reveal">Experience</h3><ol class="tl">' + S.experience.map(timelineItem).join("") + "</ol></div>" +
      "</div></div>";
  }

  /* ---------- skills ---------- */
  function renderSkills() {
    var groups = S.skills.concat([{ group: "Spoken languages", items: S.spokenLanguages }]);
    $("#skills").innerHTML = '<div class="container">' +
      head("04", "skills-h", "Skills") +
      '<dl class="skills">' + groups.map(function (g) {
        return '<div class="skills__row reveal"><dt>' + esc(g.group) + "</dt><dd>" + tags(g.items) + "</dd></div>";
      }).join("") + "</dl></div>";
  }

  /* ---------- contact ---------- */
  function renderContact() {
    var c = S.contact;
    var gh = S.github.replace(/^https?:\/\//, "");
    var li = S.linkedin ? S.linkedin.replace(/^https?:\/\/(www\.)?/, "") : "";
    $("#contact").innerHTML = '<div class="container contact reveal">' +
      '<p class="section__num" aria-hidden="true">05</p>' +
      '<h2 id="contact-h">' + esc(c.heading) + "</h2>" +
      '<p class="contact__text">' + esc(c.text) + "</p>" +
      '<a class="contact__email" href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a>" +
      '<ul class="contact__links">' +
        '<li><a class="btn btn--ghost" href="' + esc(S.github) + '" target="_blank" rel="noopener">GitHub <span class="btn__sub">' + esc(gh) + "</span> " + EXT + "</a></li>" +
        "<li>" + (S.linkedin
          ? '<a class="btn btn--ghost" href="' + esc(S.linkedin) + '" target="_blank" rel="noopener">LinkedIn <span class="btn__sub">' + esc(li) + "</span> " + EXT + "</a>"
          : '<span class="btn btn--ph" role="note">LinkedIn — URL to be added</span>') + "</li>" +
        "<li>" + cvButton("btn--ghost") + "</li>" +
      "</ul></div>";
  }

  /* ---------- project detail dialog ---------- */
  var dialog = $("#project-dialog");
  var lastFocus = null;

  function mediaBlock(m) {
    if (m.type === "placeholder") return ph(m.label, "ph--media");
    if (m.type === "image") {
      return '<figure class="pd__fig"><img src="' + esc(m.src) + '" alt="' + esc(m.alt) + '" loading="lazy" decoding="async">' +
        (m.caption ? "<figcaption>" + fmt(m.caption) + "</figcaption>" : "") + "</figure>";
    }
    if (m.type === "frames") {
      return '<figure class="pd__fig"><div class="frames">' + m.frames.map(function (f) {
        return '<div class="frame"><img src="' + esc(f.src) + '" alt="' + esc(f.alt) + '" loading="lazy" decoding="async"><span>' + esc(f.label) + "</span></div>";
      }).join("") + "</div>" + (m.caption ? "<figcaption>" + fmt(m.caption) + "</figcaption>" : "") + "</figure>";
    }
    if (m.type === "code") {
      return '<figure class="pd__fig pd__fig--code"><pre tabindex="0"><code>' + esc(m.code) + "</code></pre>" +
        (m.caption ? "<figcaption>" + fmt(m.caption) + "</figcaption>" : "") + "</figure>";
    }
    if (m.type === "youtube") {
      // Lightweight embed: thumbnail first, the player loads only on click.
      return '<figure class="pd__fig"><button class="yt" type="button" data-yt="' + esc(m.id) + '" data-title="' + esc(m.title || "Video") + '">' +
        '<img src="https://i.ytimg.com/vi/' + esc(m.id) + '/hqdefault.jpg" alt="" loading="lazy">' +
        '<span class="yt__play" aria-hidden="true"></span><span class="sr-only">Play video: ' + esc(m.title || "Video") + "</span></button></figure>";
    }
    return "";
  }
  function paras(list) { return (list || []).map(function (x) { return "<p>" + fmt(x) + "</p>"; }).join(""); }
  function bullets(list) { return "<ul>" + (list || []).map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ul>"; }

  function projectHTML(p, idx) {
    var prev = S.projects[(idx - 1 + S.projects.length) % S.projects.length];
    var next = S.projects[(idx + 1) % S.projects.length];
    var links = (p.links || []).map(function (l) {
      return l.placeholder
        ? ph(l.placeholder, "ph--inline")
        : '<a class="btn btn--ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " " + EXT + "</a>";
    }).join("");

    return '<header class="pd__head">' +
        '<p class="eyebrow">' + esc(p.year) + " · " + esc(p.context) + "</p>" +
        '<h2 id="pd-title" tabindex="-1">' + esc(p.title) + "</h2>" +
        '<p class="pd__summary">' + fmt(p.summary) + "</p>" +
      "</header>" +
      (p.media && p.media.length ? '<div class="pd__media">' + p.media.map(mediaBlock).join("") + "</div>" : "") +
      '<div class="pd__sections">' +
        '<section><h3>The problem</h3>' + paras(p.problem) + "</section>" +
        "<section><h3>What I built</h3>" + bullets(p.built) + "</section>" +
        (p.contributionPlaceholder ? "<section><h3>My contribution</h3>" + ph(p.contributionPlaceholder, "ph--inline") + "</section>" : "") +
        (p.contribution ? "<section><h3>My contribution</h3>" + paras([].concat(p.contribution)) + "</section>" : "") +
        '<section><h3>Decisions, and why</h3><dl class="decisions">' + (p.decisions || []).map(function (d) {
          return "<div><dt>" + fmt(d.what) + "</dt><dd>" + fmt(d.why) + "</dd></div>";
        }).join("") + "</dl></section>" +
        "<section><h3>Result</h3>" + bullets(p.result) + "</section>" +
        "<section><h3>Tech stack</h3>" + tags(p.stack || []) + "</section>" +
        (links ? '<section><h3>Links</h3><div class="pd__links">' + links + "</div></section>" : "") +
      "</div>" +
      '<nav class="pd__nav" aria-label="More projects">' +
        '<a href="#/project/' + esc(prev.id) + '"><span>Previous</span>' + esc(prev.title) + "</a>" +
        '<a href="#/project/' + esc(next.id) + '"><span>Next</span>' + esc(next.title) + "</a>" +
      "</nav>";
  }

  function openProject(id) {
    var idx = -1;
    S.projects.forEach(function (p, i) { if (p.id === id) idx = i; });
    if (idx < 0) return false;
    var p = S.projects[idx];
    $("#pd-crumb").textContent = "Project " + String(idx + 1).padStart(2, "0") + " / " + String(S.projects.length).padStart(2, "0");
    $("#pd-body").innerHTML = projectHTML(p, idx);
    if (!dialog.open) {
      lastFocus = document.activeElement;
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
      document.documentElement.classList.add("modal-open");
    }
    dialog.scrollTop = 0;
    var t = $("#pd-title");
    if (t) t.focus({ preventScroll: true });
    document.title = p.title + " — " + S.name;
    return true;
  }

  function closeProject(fromHash) {
    if (dialog.open) { if (dialog.close) dialog.close(); else dialog.removeAttribute("open"); }
    document.documentElement.classList.remove("modal-open");
    document.title = baseTitle;
    if (!fromHash && location.hash.indexOf("#/project/") === 0) {
      history.pushState(null, "", location.pathname + location.search + "#projects");
    }
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  function route() {
    var m = location.hash.match(/^#\/project\/([\w-]+)$/);
    if (m) { if (!openProject(m[1])) closeProject(true); }
    else if (dialog.open) closeProject(true);
  }

  /* ---------- behaviour ---------- */
  function initTheme() {
    var root = document.documentElement;
    var btn = $("#theme-toggle");
    function label() {
      var dark = root.getAttribute("data-theme") === "dark";
      btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      btn.setAttribute("aria-pressed", String(dark));
    }
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
    });
    // Follow the system setting until the visitor makes an explicit choice.
    if (window.matchMedia) {
      var mq = matchMedia("(prefers-color-scheme: dark)");
      var onChange = function (e) {
        var saved = null;
        try { saved = localStorage.getItem("theme"); } catch (err) {}
        if (!saved) { root.setAttribute("data-theme", e.matches ? "dark" : "light"); label(); }
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
    }
    label();
  }

  function initNav() {
    var nav = $("#nav"), btn = $("#menu-btn"), links = $("#nav-links");
    var onScroll = function () { nav.classList.toggle("nav--scrolled", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); btn.focus();
      }
    });

    // Highlight the section currently in view
    if ("IntersectionObserver" in window) {
      var map = {};
      $$("a", links).forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            $$("a", links).forEach(function (a) { a.removeAttribute("aria-current"); });
            var a = map[en.target.id];
            if (a) a.setAttribute("aria-current", "true");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
    }
  }

  function initReveal() {
    var els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    document.documentElement.classList.add("has-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden.
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add("is-in");
      });
    }, 1200);
  }

  function initCardGlow() {
    if (reduceMotion || !window.matchMedia || !matchMedia("(hover: hover)").matches) return;
    $$(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  function initDialog() {
    $("#pd-close").addEventListener("click", function () { closeProject(false); });
    dialog.addEventListener("cancel", function (e) { e.preventDefault(); closeProject(false); }); // Esc
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) { closeProject(false); return; } // click on backdrop
      var yt = e.target.closest(".yt");
      if (yt) {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(yt.getAttribute("data-yt")) + "?autoplay=1&rel=0";
        f.title = yt.getAttribute("data-title");
        f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
        f.allowFullscreen = true;
        f.className = "yt yt--frame";
        yt.replaceWith(f);
      }
    });
    window.addEventListener("hashchange", route);
  }

  /* ---------- go ---------- */
  var baseTitle = document.title;
  renderHero();
  renderAbout();
  renderProjects();
  renderExperience();
  renderSkills();
  renderContact();
  $("#year").textContent = new Date().getFullYear();

  initTheme();
  initNav();
  initReveal();
  initCardGlow();
  initDialog();
  route();
})();
