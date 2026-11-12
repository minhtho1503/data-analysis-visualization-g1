(function () {
  "use strict";

  const D = window.G1;
  D.projects.sort((a, b) => D.projectOrder.indexOf(a.id) - D.projectOrder.indexOf(b.id));
  const body = document.body;
  const ROOT = body.dataset.root || "";
  const PAGE = body.dataset.page || "home";
  const PROJECT_ID = body.dataset.project;
  const HOME = PAGE === "home" ? "" : ROOT + "index.html";
  const pageUrl = (id) => `${ROOT}projects/${id}/`;

  const T = {
    navAbout: "About",
    navProjects: "Projects",
    repo: "Source code",

    eyebrow: "Course project",
    ctaProjects: "View projects",
    ctaRepo: "Source code on GitHub",
    dataTypes: "Three data types",
    statMembers: "members",
    statProjects: "projects",
    statMaterials: "materials ready",

    aboutEyebrow: "Course and team",
    aboutTitle: (g, n) => `Group ${g}: ${n} members, three projects.`,
    course: "Course",
    courseName: "Course name",
    courseCode: "Course code",
    lecturer: "Lecturer",
    semester: "Semester",
    school: "University",
    faculty: "Faculty",
    member: "Member",
    studentId: "Student ID",
    repoLine: "Team repository",

    projectsEyebrow: "Projects",
    projectsTitle: "One project per data type.",
    projectsLead: "Each project has its own page with the problem, dataset, workflow and results, plus links to the notebook, PDF report, slideshow and video.",
    dataset: "Dataset",
    owners: "Owner",
    details: "View details",
    soon: "Coming soon",
    updating: "Coming soon",

    planned: "Not started",
    "in-progress": "In progress",
    done: "Done",

    matNotebook: "Notebook (GitHub)",
    matColab: "Open in Colab",
    matReport: "PDF report",
    matSlides: "Slideshow (HTML)",
    matVideo: "YouTube video",

    home: "Home",
    dataType: "Data type",
    secProblem: "Problem",
    secDataset: "Dataset",
    secWorkflow: "Workflow",
    secResults: "Results",
    secResultsNote: "Test-set scores, matching the notebook and the PDF report. Rows tagged **best** are the best model for each task, selected by macro-F1 on the validation set.",
    secQuestions: "Analysis questions",
    secVideo: "Video presentation",
    secMaterials: "Materials",
    secOthers: "Other projects",
    dsName: "Name",
    dsSource: "Source",
    dsSamples: "Size",
    dsFeatures: "Columns",
    colModel: "Model",
    colMetric: "Metric",
    colValue: "Value",
    colFeatures: "Features",
    colAcc: "Accuracy",
    colF1: "Macro-F1",
    finalTag: "best",
    back: "Back to home",
    notFound: "Project not found.",
  };

  const fmt = (v) => esc(v).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`(.+?)`/g, "<code>$1</code>");

  const esc = (v) =>
    String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const PATHS = {
    tabular: '<rect x="3.5" y="4.5" width="17" height="15"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10"/>',
    text: '<path d="M4 6h16M4 10.5h16M4 15h11M4 19.5h7"/>',
    image: '<rect x="3.5" y="4.5" width="17" height="15"/><circle cx="15.5" cy="9.5" r="1.75"/><path d="m3.5 17 5-5 4.5 4.5 2.5-2.5 5 5"/>',
    code: '<path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    slides: '<rect x="3.5" y="4.5" width="17" height="11"/><path d="M12 15.5v4M8 19.5h8M8 12l3-3 2 2 3-3"/>',
    doc: '<path d="M6 3.5h8l4.5 4.5v12.5H6z"/><path d="M14 3.5V8h4.5M9 12.5h6M9 16h4"/>',
    video: '<rect x="3" y="6" width="13" height="12"/><path d="m16 10.5 5-3v9l-5-3"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
    out: '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    arrow: '<path d="M4.5 12h15M13.5 6l6 6-6 6"/>',
    down: '<path d="M12 4.5v15M6 13.5l6 6 6-6"/>',
    back: '<path d="M19.5 12h-15M10.5 6l-6 6 6 6"/>',
  };
  const icon = (name, cls) =>
    `<svg class="i${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ` +
    `stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${PATHS[name]}</svg>`;

  const btn = (href, label, opts) => {
    const o = opts || {};
    return `<a class="btn ${o.cls || "btn-light"}" href="${esc(href)}"${o.ext ? ' target="_blank" rel="noopener"' : ""}>` +
      `<span>${esc(label)}</span><span class="btn-ic">${icon(o.icon || "out")}</span></a>`;
  };

  const ART = {
    tabular: (() => {
      let s = '<svg class="art" viewBox="0 0 320 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">';
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          const x = 48 + c * 46, y = 30 + r * 30;
          const fill = r === 0 ? ' class="art-fill"' : (r + c * 2) % 5 === 0 ? ' class="art-accent"' : "";
          s += `<rect x="${x}" y="${y}" width="40" height="22"${fill}/>`;
        }
      }
      s += '<path d="M40 24v158M280 24v158" stroke-dasharray="3 4"/></g></svg>';
      return s;
    })(),
    text:
      '<svg class="art" viewBox="0 0 320 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<rect x="44" y="30" width="232" height="140"/>' +
      '<path d="M60 56h120M60 80h176M60 104h92M60 128h150M60 152h70"/>' +
      '<rect x="186" y="49" width="56" height="14" class="art-accent"/>' +
      '<rect x="156" y="97" width="60" height="14" class="art-fill"/>' +
      '<path d="M242 56h22v58h-22" stroke-dasharray="3 4"/>' +
      "</g></svg>",
    image:
      '<svg class="art" viewBox="0 0 320 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.2">' +
      '<rect x="44" y="26" width="232" height="148"/>' +
      '<circle cx="222" cy="64" r="16" class="art-accent"/>' +
      '<path d="M44 160 116 82l50 54 30-30 80 68" />' +
      '<rect x="92" y="64" width="96" height="88" stroke-dasharray="4 4"/>' +
      '<rect x="92" y="52" width="46" height="12" class="art-fill"/>' +
      "</g></svg>",
  };

  const HERO_ROUTE = (() => {
    const pts = [[0, 300], [120, 292], [220, 296], [330, 250], [440, 262], [560, 180], [700, 196], [820, 112], [960, 128], [1100, 40], [1240, 4]];
    const labels = { 2: "Raw data", 4: "Cleaning", 6: "EDA", 8: "Features", 9: "Model" };
    const d = "M" + pts.map((p) => p.join(" ")).join("L");
    const nodes = pts.slice(1, -1).map((p, i) => {
      const k = i + 1;
      const lab = labels[k]
        ? `<text x="${p[0]}" y="${p[1] + (k === 9 ? -22 : 30)}" text-anchor="middle">${esc(labels[k])}</text>`
        : "";
      return `<circle cx="${p[0]}" cy="${p[1]}" r="${labels[k] ? 7 : 4}"${k === 9 ? ' class="node-hot"' : ""}/>${lab}`;
    }).join("");
    return `<svg class="route" viewBox="0 0 1240 340" preserveAspectRatio="xMidYMax meet" aria-hidden="true">` +
      `<path d="${d}" class="route-line"/>${nodes}</svg>`;
  })();

  const repoUrl = `https://github.com/${D.repo.owner}/${D.repo.name}`;
  const repoShort = `github.com/${D.repo.owner}/${D.repo.name}`;
  const isAbs = (u) => /^https?:\/\//i.test(u);

  function materials(p) {
    const l = p.links || {};
    const nb = l.notebook;
    return [
      { label: T.matNotebook, icon: "code", url: nb ? (isAbs(nb) ? nb : `${repoUrl}/blob/${D.repo.branch}/${nb}`) : null },
      { label: T.matColab, icon: "play", url: nb && !isAbs(nb) ? `https://colab.research.google.com/github/${D.repo.owner}/${D.repo.name}/blob/${D.repo.branch}/${nb}` : null },
      { label: T.matReport, icon: "doc", url: l.report ? (isAbs(l.report) ? l.report : ROOT + l.report) : null },
      { label: T.matSlides, icon: "slides", url: l.slides ? (isAbs(l.slides) ? l.slides : ROOT + l.slides) : null },
      { label: T.matVideo, icon: "video", url: l.video || null },
    ];
  }

  const matRow = (m) => m.url
    ? `<a class="mat" href="${esc(m.url)}" target="_blank" rel="noopener">${icon(m.icon)}<span>${esc(m.label)}</span>${icon("out", "i-end")}</a>`
    : `<span class="mat is-off" aria-disabled="true">${icon(m.icon)}<span>${esc(m.label)}</span><em>${esc(T.soon)}</em></span>`;

  const statusTag = (s) => `<span class="status status-${esc(s)}">${esc(T[s] || s)}</span>`;
  const label = (text, cls) => `<p class="label${cls ? " " + cls : ""}"><span class="sq" aria-hidden="true"></span>${esc(text)}</p>`;
  const soon = () => `<p class="placeholder">${esc(T.updating)}</p>`;

  function renderHeader() {
    return (
      `<div class="wrap header-in">` +
        `<a class="brand" href="${HOME || "#top"}"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>` +
        `<span class="brand-text">Group ${esc(D.group.name)}<small>${esc(D.course.code)}</small></span></a>` +
        `<nav class="nav" aria-label="Main navigation">` +
          `<a href="${HOME}#about">${esc(T.navAbout)}</a>` +
          `<a href="${HOME}#projects">${esc(T.navProjects)}</a>` +
        `</nav>` +
        btn(repoUrl, T.repo, { cls: "btn-light btn-sm", icon: "github", ext: true }) +
      `</div>`
    );
  }

  function renderFooter() {
    return (
      `<div class="wrap footer-in">` +
        `<div class="footer-col"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>` +
          `<p class="footer-name">Group ${esc(D.group.name)}</p></div>` +
        `<div class="footer-col"><p>${esc(D.course.name)} (${esc(D.course.code)})</p><p>${esc(D.course.school)} | ${esc(D.course.semester)}</p></div>` +
        `<div class="footer-col"><a class="footer-link" href="${repoUrl}" target="_blank" rel="noopener">${icon("github")}${esc(repoShort)}</a></div>` +
      `</div>`
    );
  }

  function renderHome() {
    const c = D.course;

    let ready = 0, total = 0;
    D.projects.forEach((p) => ["notebook", "report", "video"].forEach((k) => { total++; if (p.links && p.links[k]) ready++; }));

    const typeLinks = D.projects.map((p) =>
      `<a class="type-link" href="${pageUrl(p.id)}">${icon(p.id)}<span>${esc(p.type)}</span></a>`
    ).join("");

    const hero =
      `<section class="hero" id="top">` +
        `<div class="wrap hero-grid" aria-hidden="true"><span></span><span></span><span></span></div>` +
        `<svg class="arcs" viewBox="0 0 1000 1000" aria-hidden="true"><circle cx="500" cy="500" r="499"/><circle cx="500" cy="560" r="420"/></svg>` +
        `<div class="wrap hero-in">` +
          `<div class="hero-main">` +
            label(`${T.eyebrow} | ${c.code} | ${c.semester}`, "label-dark") +
            `<h1>${esc(D.group.headline)}</h1>` +
            `<div class="hero-actions">` +
              btn("#projects", T.ctaProjects, { icon: "down" }) +
              `<span class="dot" aria-hidden="true"></span>` +
              `<a class="btn btn-ghost" href="${repoUrl}" target="_blank" rel="noopener"><span>${esc(T.ctaRepo)}</span></a>` +
            `</div>` +
          `</div>` +
          `<p class="hero-side">${esc(D.group.lead)}</p>` +
        `</div>` +
        HERO_ROUTE +
        `<div class="wrap hero-foot">` +
          `<p>${esc(T.dataTypes)}:</p><div class="type-links">${typeLinks}</div>` +
          `<dl class="hero-stats">` +
            `<div><dt>${esc(T.statMembers)}</dt><dd>${D.members.length}</dd></div>` +
            `<div><dt>${esc(T.statProjects)}</dt><dd>${D.projects.length}</dd></div>` +
            `<div><dt>${esc(T.statMaterials)}</dt><dd>${ready}/${total}</dd></div>` +
          `</dl>` +
        `</div>` +
      `</section>`;

    const courseRows = [
      [T.courseName, c.name], [T.courseCode, c.code], [T.lecturer, c.lecturer],
      [T.semester, c.semester], [T.school, c.school], [T.faculty, c.faculty],
    ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

    const members = D.members.map((m, i) => {
      const topics = (m.topics || []).map((t) => {
        const p = D.projects.find((x) => x.id === t);
        return `<li>${icon(t)}${esc(p ? p.type : t)}</li>`;
      }).join("");
      return (
        `<article class="col">` +
          label(`${T.member} 0${i + 1}`, "col-head") +
          `<h3 class="member-name">${esc(m.name)}</h3>` +
          `<p class="member-id">${esc(T.studentId)} ${esc(m.id)}</p>` +
          `<p class="member-role">${esc(m.role)}</p>` +
          `<ul class="member-topics">${topics}</ul>` +
          (m.github ? `<a class="member-gh" href="${esc(m.github)}" target="_blank" rel="noopener">${icon("github")}${esc(m.github.replace(/^https?:\/\/github\.com\//, ""))}${icon("out", "i-sm")}</a>` : "") +
        `</article>`
      );
    }).join("");

    const about =
      `<section class="sec" id="about"><div class="wrap">` +
        `<header class="sec-head">` +
          `<div>${label(T.aboutEyebrow)}<h2>${esc(T.aboutTitle(D.group.name, D.members.length))}</h2></div>` +
          `<p>${esc(c.name)} (${esc(c.code)}), ${esc(c.semester.toLowerCase())}. ${esc(T.lecturer)}: ${esc(c.lecturer)}.</p>` +
        `</header>` +
        `<div class="cols">` +
          `<article class="col col-course">${label(T.course, "col-head")}<dl class="facts">${courseRows}</dl></article>` +
          members +
        `</div>` +
        `<a class="repo-row" href="${repoUrl}" target="_blank" rel="noopener">` +
          `<span class="repo-l">${icon("github")}${esc(T.repoLine)}</span><span class="repo-u">${esc(repoShort)}</span>${icon("out")}</a>` +
      `</div></section>`;

    const cards = D.projects.map((p, i) => {
      const ds = p.dataset ? p.dataset.name : T.updating;
      return (
        `<article class="card" data-type="${esc(p.id)}">` +
          `<a class="card-art" href="${pageUrl(p.id)}" tabindex="-1" aria-hidden="true">${ART[p.id]}</a>` +
          `<div class="card-body">` +
            `<div class="card-top"><p class="card-num"><span class="sq"></span>0${i + 1} | ${esc(p.type)}</p>${statusTag(p.status)}</div>` +
            `<h3><a href="${pageUrl(p.id)}">${esc(p.title)}</a></h3>` +
            `<p class="card-sum">${p.summary ? esc(p.summary) : esc(T.updating)}</p>` +
            `<dl class="card-meta"><div><dt>${esc(T.dataset)}</dt><dd>${esc(ds)}</dd></div>` +
            `<div><dt>${esc(T.owners)}</dt><dd>${esc(p.owners.join(", "))}</dd></div></dl>` +
            `<div class="mats">${materials(p).map(matRow).join("")}</div>` +
            btn(pageUrl(p.id), T.details, { cls: "btn-dark btn-block", icon: "arrow" }) +
          `</div>` +
        `</article>`
      );
    }).join("");

    const projects =
      `<section class="sec sec-tint" id="projects"><div class="wrap">` +
        `<header class="sec-head">` +
          `<div>${label(T.projectsEyebrow)}<h2>${esc(T.projectsTitle)}</h2></div>` +
          `<p>${esc(T.projectsLead)}</p>` +
        `</header>` +
        `<div class="cards">${cards}</div>` +
      `</div></section>`;

    return hero + about + projects;
  }

  function renderProject() {
    const idx = D.projects.findIndex((p) => p.id === PROJECT_ID);
    if (idx === -1) return `<div class="wrap sec"><p>${esc(T.notFound)}</p></div>`;
    const p = D.projects[idx];
    document.title = `${p.type} | ${p.title} | Group ${D.group.name}`;

    let dataset = soon();
    if (p.dataset) {
      const d = p.dataset;
      dataset =
        (d.description ? `<p>${esc(d.description)}</p>` : "") +
        `<dl class="facts facts-2">` +
          `<div><dt>${esc(T.dsName)}</dt><dd>${esc(d.name)}</dd></div>` +
          `<div><dt>${esc(T.dsSource)}</dt><dd>${d.url ? `<a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.url.replace(/^https?:\/\//, ""))}</a>` : "-"}</dd></div>` +
          `<div><dt>${esc(T.dsSamples)}</dt><dd>${esc(d.samples || "-")}</dd></div>` +
          `<div><dt>${esc(T.dsFeatures)}</dt><dd>${esc(d.features || "-")}</dd></div>` +
        `</dl>`;
    }

    const workflow = p.workflow && p.workflow.length
      ? `<ol class="flow">${p.workflow.map((w, i) =>
          `<li><span class="flow-n">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(w.title)}</h3><p>${esc(w.detail)}</p></div></li>`
        ).join("")}</ol>`
      : soon();

    const bestTag = `<span class="final-tag">${esc(T.finalTag)}</span>`;
    const groupTable = (g) =>
      `<h3 class="results-title">${fmt(g.title)}</h3>` +
      `<div class="table-wrap"><table class="results"><thead><tr><th>${esc(T.colModel)}</th><th>${esc(T.colFeatures)}</th>` +
      `<th class="num">${esc(T.colAcc)}</th><th>${esc(T.colF1)}</th></tr></thead><tbody>` +
      g.rows.map((r) =>
        `<tr${r.best ? ' class="is-final"' : ""}><td>${esc(r.model)}${r.best ? " " + bestTag : ""}</td><td>${esc(r.features)}</td>` +
        `<td class="num">${esc(r.acc)}</td><td class="num">${esc(r.f1)}</td></tr>`
      ).join("") + `</tbody></table></div>`;
    const results = !(p.results && p.results.length) ? soon()
      : p.results[0].rows
        ? p.results.map(groupTable).join("") + `<p class="note">${fmt(T.secResultsNote)}</p>`
        : `<div class="table-wrap"><table class="results"><thead><tr><th>${esc(T.colModel)}</th><th>${esc(T.colMetric)}</th><th>${esc(T.colValue)}</th></tr></thead><tbody>` +
          p.results.map((r) =>
            `<tr${r.final ? ' class="is-final"' : ""}><td>${esc(r.model)}${r.final ? " " + bestTag : ""}</td><td>${esc(r.metric)}</td><td class="num">${esc(r.value)}</td></tr>`
          ).join("") + `</tbody></table></div><p class="note">${fmt(T.secResultsNote)}</p>`;

    const questions = p.questions && p.questions.length
      ? `<div class="qa">${p.questions.map((q, i) =>
          `<article><p class="qa-n"><span class="sq"></span>Q${i + 1}</p><h3>${esc(q.q)}</h3><p>${esc(q.a)}</p></article>`
        ).join("")}</div>`
      : soon();

    const vid = ((p.links && p.links.video) || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
    const video = vid
      ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${esc(vid[1])}" title="${esc(`${D.group.name} - ${p.type}`)}" loading="lazy" allowfullscreen allow="encrypted-media; picture-in-picture"></iframe></div>`
      : `<div class="video video-off">${icon("video")}<span>${esc(T.soon)}</span></div>`;

    const owners = D.members.filter((m) => p.owners.includes(m.name)).map((m) =>
      `<li><strong>${esc(m.name)}</strong><small>${esc(T.studentId)} ${esc(m.id)}</small></li>`
    ).join("");

    const others = D.projects.filter((x) => x.id !== p.id).map((x) =>
      `<a class="other" href="${pageUrl(x.id)}">${icon(x.id)}<span><small>${esc(x.type)}</small>${esc(x.title)}</span>${icon("arrow", "i-end")}</a>`
    ).join("");

    const block = (title, html) => `<section class="block">${label(title, "block-head")}${html}</section>`;

    return (
      `<section class="band">` +
        `<div class="wrap hero-grid" aria-hidden="true"><span></span><span></span><span></span></div>` +
        `<div class="wrap band-in">` +
          `<nav class="crumbs" aria-label="Breadcrumb"><a href="${ROOT}index.html">${esc(T.home)}</a><span>/</span><a href="${ROOT}index.html#projects">${esc(T.navProjects)}</a><span>/</span><span>${esc(p.type)}</span></nav>` +
          label(`0${idx + 1} | ${T.dataType}: ${p.type}`, "label-dark") +
          `<h1>${esc(p.title)}</h1>` +
          (p.summary ? `<p class="band-lead">${esc(p.summary)}</p>` : "") +
          `<div class="band-tags">${statusTag(p.status)}${p.dataset ? `<span class="tag">${esc(p.dataset.name)}</span>` : ""}</div>` +
        `</div>` +
        `<div class="band-art" data-type="${esc(p.id)}">${ART[p.id]}</div>` +
      `</section>` +

      `<div class="wrap page">` +
        `<div class="page-main">` +
          block(T.secProblem, !p.problem ? soon() : Array.isArray(p.problem)
            ? `<ul class="points">${p.problem.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>`
            : `<p class="lead">${fmt(p.problem)}</p>`) +
          block(T.secDataset, dataset) +
          block(T.secWorkflow, workflow) +
          block(T.secResults, results) +
          block(T.secQuestions, questions) +
          block(T.secVideo, video) +
        `</div>` +
        `<aside class="page-side">` +
          `<section class="side">${label(T.secMaterials, "col-head")}<div class="mats">${materials(p).map(matRow).join("")}</div></section>` +
          `<section class="side">${label(T.owners, "col-head")}<ul class="owners">${owners}</ul></section>` +
          `<section class="side">${label(T.secOthers, "col-head")}${others}</section>` +
        `</aside>` +
      `</div>` +
      `<div class="wrap back">${btn(`${ROOT}index.html`, T.back, { cls: "btn-dark", icon: "back" })}</div>`
    );
  }

  if (PAGE === "home") document.title = `Group ${D.group.name} | ${D.course.name}`;
  document.getElementById("site-header").innerHTML = renderHeader();
  document.getElementById("app").innerHTML = PAGE === "project" ? renderProject() : renderHome();
  document.getElementById("site-footer").innerHTML = renderFooter();
})();
