// js/archive.js
(() => {
  "use strict";

  const KEY = "miyoWorks";
  const KEY_DELETED = "miyoWorksDeleted";

  const $ = (sel) => document.querySelector(sel);

  // form
  const form = $("#workForm");
  const workIdEl = $("#workId"); // hidden想定
  const titleEl = $("#title");
  const tagEl = $("#tag");
  const descEl = $("#desc");
  const detailEl = $("#detail");
  const dateEl = $("#date");
  const imageEl = $("#image");

  // add (work/project + link)
  const itemTypeEl = $("#itemType");
  const linkEl = $("#link");

  // list
  const listEl = $("#adminList");
  // ↑もしHTMLが違うなら、ここをあなたのidに変更して

  // ===== seed（home.jsと同じものを置く：管理画面でも同期する） =====
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
      desc: "神山町のちょっとユニークなバイト。地域に根差した活動を行っている。1年生の後期、お祭りを観に神社へ向かった帰り道",
      date: "2023/11",
      image: "images/さあくる.webp",
      link: ""
    },
    {
      id: "seed-qoopocket",
      itemType: "project",
      title: "Qoo-Pocket",
      tag: "#UX #企画 #プロトタイプ",
      desc: "マイナビキャリア甲子園で活動中。企業や社会が抱えるテーマについて自分たちなりの解決策を提案する。",
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
      date: "2025/10",
      image: "images/編み物.jpg",
      link: ""
    },
  ];

  // ===== utils =====
  function safeParse(json, fallback) {
    try { return JSON.parse(json) ?? fallback; } catch { return fallback; }
  }

  function getAll() {
    const arr = safeParse(localStorage.getItem(KEY), []);
    return arr.map(x => ({
      ...x,
      itemType: x.itemType || "work",
      link: x.link || ""
    }));
  }

  function setAll(arr) {
    localStorage.setItem(KEY, JSON.stringify(arr));
  }

  function getDeleted() {
    return safeParse(localStorage.getItem(KEY_DELETED), []);
  }

  function setDeleted(ids) {
    localStorage.setItem(KEY_DELETED, JSON.stringify(ids));
  }

  // 削除済みseedは復活させない + seedは上書き同期
  function syncSeed() {
    const existing = getAll();
    const deleted = getDeleted();

    const map = new Map(existing.map(w => [String(w.id), w]));

    seed.forEach(s => {
      if (deleted.includes(s.id)) return;
      const prev = map.get(String(s.id)) || {};
      map.set(String(s.id), { ...s, ...prev });
    });

    setAll([...map.values()]);
  }

  function uid() {
    return "id-" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // ===== render =====
  function renderList() {
    if (!listEl) return;

    const items = getAll();

    if (items.length === 0) {
      listEl.innerHTML = `<p class="muted">まだデータがありません。</p>`;
      return;
    }

    // work / project を混ぜて出す（見やすく）
    listEl.innerHTML = items.map(w => `
      <div class="adminItem" data-id="${escapeHtml(w.id)}">
        <img class="adminItem__thumb" src="${escapeHtml(w.image || "")}" alt="">
        <div>
          <div class="adminItem__title">${escapeHtml(w.title || "(no title)")}</div>
          <div class="adminItem__sub">
            <span class="muted">${escapeHtml(w.itemType === "project" ? "Project" : "Works")}</span>
            <span class="muted">${escapeHtml(w.date || "")}</span>
            <span class="muted">${escapeHtml(w.tag || "")}</span>
          </div>
          ${w.link ? `<div class="muted" style="margin-top:6px;">link: ${escapeHtml(w.link)}</div>` : ""}

          <div class="adminItem__actions">
            <button class="btn" type="button" data-act="edit">編集</button>
            <button class="btn btn--danger" type="button" data-act="del">削除</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  // ===== form fill =====
  function fillForm(w) {
    if (!w) return;
    workIdEl.value = w.id || "";
    titleEl.value = w.title || "";
    tagEl.value = w.tag || "";
    descEl.value = w.desc || "";
    detailEl.value = w.detail || "";
    dateEl.value = w.date || "";
    imageEl.value = w.image || "";
    if (itemTypeEl) itemTypeEl.value = w.itemType || "work";
    if (linkEl) linkEl.value = w.link || "";
  }

  function clearForm() {
    workIdEl.value = "";
    titleEl.value = "";
    tagEl.value = "";
    descEl.value = "";
    detailEl.value = "";
    dateEl.value = "";
    imageEl.value = "";
    if (itemTypeEl) itemTypeEl.value = "work";
    if (linkEl) linkEl.value = "";
  }

  // ===== save =====
  function upsertFromForm() {
    const id = (workIdEl.value || "").trim() || uid();

    const next = {
      id,
      itemType: (itemTypeEl?.value || "work").trim(),
      title: (titleEl.value || "").trim(),
      tag: (tagEl.value || "").trim(),
      desc: (descEl.value || "").trim(),
      detail: (detailEl?.value || "").trim(),
      date: (dateEl.value || "").trim(),
      image: (imageEl.value || "").trim(),
      link: (linkEl?.value || "").trim(),
    };

    const all = getAll();
    const idx = all.findIndex(x => String(x.id) === String(id));
    if (idx >= 0) all[idx] = { ...all[idx], ...next };
    else all.push(next);

    setAll(all);
    clearForm();
    renderList();
  }

  // ===== delete =====
  function removeById(id) {
    const all = getAll().filter(x => String(x.id) !== String(id));
    setAll(all);

    // seedの削除なら「復活禁止」にも入れる
    if (String(id).startsWith("seed-")) {
      const deleted = getDeleted();
      if (!deleted.includes(id)) {
        deleted.push(id);
        setDeleted(deleted);
      }
    }

    // 編集中だったらリセット
    if (workIdEl.value === id) clearForm();

    renderList();
  }

  // ===== events =====
  function bindListActions() {
    if (!listEl) return;

    listEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-act]");
      if (!btn) return;

      const card = e.target.closest("[data-id]");
      if (!card) return;

      const id = card.dataset.id;
      const act = btn.dataset.act;

      if (act === "edit") {
        const w = getAll().find(x => String(x.id) === String(id));
        fillForm(w);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (act === "del") {
        // confirm（安全）
        if (confirm("この項目を削除しますか？")) removeById(id);
      }
    });
  }

  // ===== boot =====
  document.addEventListener("DOMContentLoaded", () => {
    // まずseed同期（管理画面でも必ず入る）
    syncSeed();

    // 一覧描画
    renderList();

    // 編集/削除
    bindListActions();

    // 保存
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      upsertFromForm();
    });

    // 「新規」ボタンがあるなら（任意）
    const newBtn = $("#newBtn");
    newBtn?.addEventListener("click", () => clearForm());
  });
})();
