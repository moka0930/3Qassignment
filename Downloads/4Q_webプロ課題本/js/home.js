// js/home.js（全文・差し替え）
(() => {
  "use strict";

  const KEY = "miyoWorks";
  const KEY_SORT = "miyoSortModeBtns"; // { work:"created|date", project:"created|date" }

  // ===== seed（ここを増やす） =====
  const seed = [
    {
      id: "seed-bakuhatsu",
      itemType: "work",
      title: "爆発",
      tag: "#木炭 #デッサン",
      desc: "「運動した後の感情を表現してください」というテーマで描いた作品。感情の微細な動きを詰め込んだ。",
      date: "2022/08",
      image: "images/木炭.jpg"
    },
    {
      id: "seed-seimei",
      itemType: "work",
      title: "生命",
      tag: "#油絵 #アクリル",
      desc: "「日常と架空を組み合わせた風景を描きなさい」というテーマで描いた作品。波に打たれても折れないけやきはまさに不屈の精神を感じさせる。",
      date: "2023/11",
      image: "images/油絵.jpg"
    },
    {
      id: "seed-kirin",
      itemType: "work",
      title: "キリン",
      tag: "#落書き #イラスト",
      desc: "ちょっと不恰好なキリンのイラスト。当時はひたすらに書くことが楽しかった。ものづくりの原点とも言える一枚。",
      date: "2014/01",
      image: "images/キリン.jpg"
    },

    // project
    {
      id: "seed-saakuru",
      itemType: "project",
      title: "さあくる",
      tag: "#町内バイト #デジタル万屋",
      desc: "神山町のちょっとユニークなバイト。地域に根差した活動を行っている。",
      detail: "一年生の後期、お祭りを観に神社へ向かった帰り道、突然雨が降ってきた。「傘いるか？」と声をかけてくれた隣人。そのままお宅にお邪魔させてもらった。そこで、「バイト先に困っている」と相談したところ、「さあくる」を紹介してもらった。人との縁はどこでつながるのかわからない。さあくるでは、高齢者に向けた町内ポスターを制作している。ポスターは、阿波踊り空港に掲示されたことがある。また、「かみやまch」としてyoutubeで活躍している。",
      date: "2023/11",
      image: "images/さあくる.webp",
      link: "" // ←リンク入れたい時はここにURL
    },
    {
      id: "seed-qoopocket",
      itemType: "project",
      title: "Qoo-Pocket",
      tag: "#UX #企画 #プロトタイプ",
      desc: "マイナビキャリア甲子園で活動中。企業や社会が抱えるテーマについて自分たちなりの解決策を提案する。",
      detail:"マイナビキャリア甲子園は、高校生・高専生を対象とした全国規模のビジネスコンテストである。参加者はチームを組み、企業が提示する課題に対して、社会や企業の課題を分析し、新しいアイデアや企画を提案する。企業としてセコムが携わっており、毎年甲子園の様子を見てきた。高校三年生の代がラストチャンスであることもあり、以前から興味を持っていた本大会に参加することを決意した。私たちは「Qoo10」の課題を解決するため「Qoo-Pocket」という新サービスを考えている。",
      date: "2025/11",
      image: "images/マイナビ.png",
      link: ""
    },
    {
      id: "seed-kousensai",
      itemType: "project",
      title: "高専祭物販",
      tag: "#編み物 #スイーツ",
      desc: "高専祭で「アフタヌーンティ」をコンセプトに編んだスイーツを販売。ものづくりを見せるだけではなく、売るという体験をした。",
      detail:"2年生後期、編み物に没頭していた。無心で、手を動かし続けた。気持ちが折れかけ、次のモチベーションを探していたときに見つけたのが高専祭だった。「高専祭で販売する」という目標を立て、作品を編み続けた。完成度だけでなく、使う人のことや見せ方も意識しながら制作を進めた。当日は多くの人に作品を手に取ってもらい、購入してもらうことができた。後日、「買ったよ」と声をかけてもらうこともあり、自分のものづくりが誰かの日常に届いたことを実感した。普段は、見えない場所で黙々とものづくりをしている私にとって、不思議な感覚だった。見せること、手渡すことを前提にものづくりをした経験は初めてだったが、一歩外へ踏み出せたと感じている。",
      date: "2025/10",
      image: "images/編み物.jpg",
      link: ""
    },
  ];

  // ===== utils =====
  function safeParse(json, fallback) {
    try {
      const v = JSON.parse(json);
      return (v === null || v === undefined) ? fallback : v;
    } catch {
      return fallback;
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function pad2(x) { return String(x).padStart(2, "0"); }

  function prettyDate(v) {
    if (!v) return "";
    const s = String(v).trim();
    if (s.includes("-")) return s.replaceAll("-", ".");
    if (s.includes("/")) {
      const [y, m, d] = s.split("/");
      if (d) return `${y}.${pad2(m)}.${pad2(d)}`;
      return `${y}.${pad2(m)}`;
    }
    return s;
  }

  function parseDateKey(v) {
    // "YYYY/MM" / "YYYY/MM/DD" / "YYYY-MM" / "YYYY.MM" ぜんぶ対応
    const s = String(v || "").trim();
    if (!s) return 0;
    const normalized = s.replaceAll(".", "/").replaceAll("-", "/");
    const parts = normalized.split("/").map(x => x.trim()).filter(Boolean);

    const y = Number(parts[0] || 0);
    const m = Number(parts[1] || 0);
    const d = Number(parts[2] || 0);

    return y * 10000 + m * 100 + d; // YYYYMMDD
  }

  // ===== storage =====
  function getWorks() {
    const arr = safeParse(localStorage.getItem(KEY), []);
    // 古いデータ救済：itemTypeが無いものはwork
    return arr.map(x => ({ ...x, itemType: x.itemType || "work" }));
  }

  function setWorks(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function syncSeed() {
    const existing = getWorks();

    // 削除済みseedは復活させない
    const deleted = safeParse(localStorage.getItem("miyoWorksDeleted"), []);

    // 既存 + seed をマージ（seedで上書き）
    const map = new Map(existing.map(w => [String(w.id), w]));

    seed.forEach(s => {
      if (deleted.includes(s.id)) return;
      const prev = map.get(String(s.id)) || {};
      map.set(String(s.id), { ...prev, ...s });
    });

    setWorks([...map.values()]);
  }

  // ===== sort state =====
  function loadSortMode() {
    const def = { work: "created", project: "created" };
    const obj = safeParse(localStorage.getItem(KEY_SORT), null);
    if (!obj) return def;

    const w = (obj.work === "date" ? "date" : "created");
    const p = (obj.project === "date" ? "date" : "created");
    return { work: w, project: p };
  }

  function saveSortMode(next) {
    localStorage.setItem(KEY_SORT, JSON.stringify(next));
  }

  function sortItems(items, mode) {
    const arr = [...items];

    if (mode === "date") {
      // 日付順（新しい順）
      return arr.sort((a, b) => {
        const ad = parseDateKey(a.date);
        const bd = parseDateKey(b.date);
        if (ad !== bd) return bd - ad;
        // 日付同じなら id で軽く安定化
        return String(b.id).localeCompare(String(a.id));
      });
    }

    // 追加順（localStorage順を尊重）
    return arr;
  }

  // ===== render =====
  function renderItems(container, type, mode) {
    if (!container) return;

    const all = getWorks();
    const items = all.filter(i => i.itemType === type);
    const sorted = sortItems(items, mode);

    if (sorted.length === 0) {
      container.innerHTML = `<p class="muted">まだありません。</p>`;
      return;
    }

    container.innerHTML = sorted.map(w => `
      <article class="card js-work" data-id="${escapeAttr(w.id)}" tabindex="0" role="button">
        <div class="card__imgWrap">
          <img class="card__img" src="${escapeAttr(w.image)}" alt="${escapeHtml(w.title)}">
        </div>
        <div class="card__body">
          <div class="card__top">
            <h3 class="card__title">${escapeHtml(w.title)}</h3>
            <span class="chip">${escapeHtml(w.tag)}</span>
          </div>
          <p class="card__desc">${escapeHtml(w.desc)}</p>
          <div class="card__meta">
            <span>${escapeHtml(w.date)}</span>
          </div>
        </div>
      </article>
    `).join("");
  }

  // ===== modal（額縁 + link） =====
  let modalEl, modalImg, labelTitle, labelDetail, labelDate, labelDesc, labelLink, labelLinkWrap;

  function initModal() {
    // 既に存在するなら再利用
    const found = document.querySelector(".artModal");
    if (found) {
      modalEl = found;
      modalImg = modalEl.querySelector(".artFrame__img");
      labelTitle = modalEl.querySelector(".artLabel__title");
      labelDetail = modalEl.querySelector(".artLabel__detail");
      labelDate = modalEl.querySelector(".artLabel__date");
      labelDesc = modalEl.querySelector(".artLabel__desc");
      labelLink = modalEl.querySelector(".artLabel__link");
      labelLinkWrap = modalEl.querySelector(".artLabel__linkWrap");
      bindModalClose();
      return;
    }

    modalEl = document.createElement("div");
    modalEl.className = "artModal";
    modalEl.innerHTML = `
      <div class="artModal__backdrop" data-close="1" aria-hidden="true"></div>

      <div class="artModal__panel" role="dialog" aria-modal="true" aria-label="作品表示">
        <button class="artModal__close" type="button" data-close="1" aria-label="閉じる">×</button>

        <div class="artFrame">
          <div class="artFrame__frame">
            <div class="artFrame__mat">
              <img class="artFrame__img" src="" alt="">
            </div>
          </div>
        </div>

        <div class="artLabel">
          <div class="artLabel__title"></div>
          <div class="artLabel__detail" style="display:none;"></div>
          <div class="artLabel__date"></div>
          <div class="artLabel__line"></div>
          <div class="artLabel__desc"></div>
          <div class="artLabel__linkWrap" style="margin-top:10px; display:none;">
            <a class="artLabel__link btn btn--pill" href="" target="_blank" rel="noopener">リンクを開く</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);

    modalImg = modalEl.querySelector(".artFrame__img");
    labelTitle = modalEl.querySelector(".artLabel__title");
    labelDetail = modalEl.querySelector(".artLabel__detail"); 
    labelDate = modalEl.querySelector(".artLabel__date");
    labelDesc = modalEl.querySelector(".artLabel__desc");
    labelLink = modalEl.querySelector(".artLabel__link");
    labelLinkWrap = modalEl.querySelector(".artLabel__linkWrap");

    bindModalClose();
  }

  function bindModalClose() {
    if (!modalEl) return;

    // 多重登録防止
    if (modalEl.dataset.boundClose === "1") return;
    modalEl.dataset.boundClose = "1";

    modalEl.addEventListener("click", (e) => {
      if (e.target && e.target.dataset && e.target.dataset.close) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  function openModalById(id) {
    const w = getWorks().find(x => String(x.id) === String(id));
    if (!w) return;

    modalImg.src = w.image || "";
    modalImg.alt = w.title || "";

    labelTitle.textContent = w.title || "";
    const hasDetail = !!(w.detail && String(w.detail).trim());
    if (labelDetail) {
      labelDetail.style.display = hasDetail ? "block" : "none";
      labelDetail.textContent = hasDetail ? String(w.detail).trim() : "";
    }
    labelDate.textContent = prettyDate(w.date || "");
    labelDesc.textContent = w.desc || "";

    const hasLink = !!(w.link && String(w.link).trim());
    if (labelLinkWrap) labelLinkWrap.style.display = hasLink ? "block" : "none";
    if (hasLink && labelLink) labelLink.href = String(w.link).trim();

    modalEl.classList.add("is-open");
    document.body.classList.add("noScroll");
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove("is-open");
    document.body.classList.remove("noScroll");
  }

  function bindModal(container) {
    if (!container) return;

    container.addEventListener("click", (e) => {
      const card = e.target.closest(".js-work");
      if (!card) return;
      openModalById(card.dataset.id);
    });

    container.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const card = e.target.closest(".js-work");
      if (!card) return;
      openModalById(card.dataset.id);
    });
  }

  // ===== sort buttons（真ん中の2ボタンを動かす） =====
  function setupSortButtons(sectionId, type, gridEl, initialMode) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const btns = Array.from(section.querySelectorAll(".sectionTools .sortBtn[data-sort]"));
    if (btns.length === 0) return;

    // 初期 active を state に合わせる（HTMLが違っても揃える）
    btns.forEach(b => b.classList.toggle("is-active", b.dataset.sort === initialMode));

    // 初回描画
    renderItems(gridEl, type, initialMode);

    // クリックで切替
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = (btn.dataset.sort === "date") ? "date" : "created";

        // UI
        btns.forEach(b => b.classList.toggle("is-active", b === btn));

        // 保存
        const next = loadSortMode();
        next[type] = mode; // typeは "work" or "project"
        saveSortMode(next);

        // 再描画
        renderItems(gridEl, type, mode);
      });
    });
  }

  // ===== 起動 =====
  document.addEventListener("DOMContentLoaded", () => {
    try {
      syncSeed();

      const worksGrid = document.getElementById("worksGrid");
      const projectsGrid = document.getElementById("projectsGrid");

      // グリッドが見つからない時は画面に出す
      if (!worksGrid && !projectsGrid) {
        const p = document.createElement("p");
        p.className = "muted";
        p.style.textAlign = "center";
        p.style.padding = "24px 16px";
        p.textContent = "worksGrid / projectsGrid が見つかりません（id名が違う可能性）";
        document.body.appendChild(p);
        return;
      }

      // モード読み込み
      const mode = loadSortMode();

      // 描画 + ボタン
      setupSortButtons("works", "work", worksGrid, mode.work);
      setupSortButtons("projects", "project", projectsGrid, mode.project);

      // モーダル
      initModal();
      bindModal(worksGrid);
      bindModal(projectsGrid);

    } catch (err) {
      console.error(err);
      const box = document.createElement("div");
      box.className = "muted";
      box.style.maxWidth = "920px";
      box.style.margin = "24px auto";
      box.style.padding = "14px 16px";
      box.style.border = "1px solid var(--line)";
      box.style.background = "rgba(255,255,255,.7)";
      box.style.borderRadius = "14px";
      box.textContent = "home.js が途中で止まりました。Consoleの赤いエラーを確認してください。";
      document.body.appendChild(box);
    }
  });
})();
