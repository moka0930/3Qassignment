// js/archive.js
(() => {
  const STORAGE_KEY = "miyoWorks"; // ★index側も同じキーを読む必要あり

  const $ = (sel) => document.querySelector(sel);

  const form = $("#workForm");
  const workIdEl = $("#workId");
  const titleEl = $("#title");
  const tagEl = $("#tag");
  const descEl = $("#desc");
  const dateEl = $("#date");
  const imageEl = $("#image");

  const saveBtn = $("#saveBtn");
  const resetBtn = $("#resetBtn");
  const adminList = $("#adminList");

  function safeParse(json, fallback) {
    try { return JSON.parse(json) ?? fallback; } catch { return fallback; }
  }

  function loadWorks() {
    return safeParse(localStorage.getItem(STORAGE_KEY), []);
  }

  function saveWorks(works) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
  }

  function uid() {
    // crypto.randomUUID が使える環境ならそれ優先
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
  }

  function normalizeTag(tag) {
    return String(tag || "").trim();
  }

  function fillForm(work) {
    workIdEl.value = work.id;
    titleEl.value = work.title ?? "";
    tagEl.value = work.tag ?? "";
    descEl.value = work.desc ?? "";
    dateEl.value = work.date ?? "";
    imageEl.value = work.image ?? "";
    saveBtn.textContent = "保存";
  }

  function resetForm() {
    workIdEl.value = "";
    form.reset();
    saveBtn.textContent = "追加";
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function render() {
    const works = loadWorks();

    // 新しい順っぽく見せる（idがuuidの場合は並び保証できないので date優先）
    const sorted = [...works].sort((a, b) => {
      const ad = (a.date || "").toString();
      const bd = (b.date || "").toString();
      if (ad !== bd) return bd.localeCompare(ad);
      return String(b.id).localeCompare(String(a.id));
    });

    adminList.innerHTML = "";

    if (sorted.length === 0) {
      adminList.innerHTML = `<p class="muted">まだ作品がありません。上のフォームから追加してください。</p>`;
      return;
    }

    sorted.forEach((w) => {
      const item = document.createElement("div");
      item.className = "adminItem";

      item.innerHTML = `
        <img class="adminItem__thumb" src="${escapeHtml(w.image)}" alt="">
        <div>
          <div class="adminItem__title">${escapeHtml(w.title)}</div>
          <div class="adminItem__sub">
            <span class="chip">${escapeHtml(w.tag)}</span>
            <span class="muted">${escapeHtml(w.date)}</span>
          </div>
          <div class="adminItem__actions">
            <button class="btn btn--ghost" type="button" data-action="edit" data-id="${escapeHtml(w.id)}">編集</button>
            <button class="btn btn--danger" type="button" data-action="delete" data-id="${escapeHtml(w.id)}">削除</button>
          </div>
        </div>
      `;
      adminList.appendChild(item);
    });
  }

  function upsertWork(next) {
    const works = loadWorks();
    const idx = works.findIndex((w) => w.id === next.id);
    if (idx >= 0) works[idx] = next;
    else works.push(next);
    saveWorks(works);
  }

  function deleteWork(id) {
    const works = loadWorks().filter((w) => w.id !== id);
    saveWorks(works);
  }

  // ===== events =====
  document.addEventListener("DOMContentLoaded", () => {
    render();

    form.addEventListener("submit", (e) => {
      e.preventDefault(); // ★これが無いとページ遷移して「追加されない」ように見える

      const title = titleEl.value.trim();
      const tag = normalizeTag(tagEl.value);
      const desc = descEl.value.trim();
      const date = dateEl.value.trim();
      const image = imageEl.value.trim();

      // required はHTMLで効いてるけど、念のため
      if (!title || !tag || !desc || !date || !image) return;

      const editingId = workIdEl.value.trim();
      const work = {
        id: editingId || uid(),
        title,
        tag,
        desc,
        date,
        image
      };

      upsertWork(work);
      resetForm();
      render();
    });

    resetBtn.addEventListener("click", () => {
      resetForm();
    });

    adminList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === "edit") {
        const work = loadWorks().find((w) => w.id === id);
        if (work) {
          fillForm(work);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (action === "delete") {
        const ok = confirm("この作品を削除しますか？");
        if (!ok) return;

        deleteWork(id);

        // いまフォームで編集中のものを消したならフォームも戻す
        if (workIdEl.value === id) resetForm();

        render();
      }
    });
  });
})();
