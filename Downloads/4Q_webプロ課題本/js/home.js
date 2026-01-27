const KEY = "miyoWorks";

/* ===== seed（ここを編集すればカード内容が変わる） ===== */
const seed = [
  {
    id: "seed-bakuhatsu",
    title: "爆発",
    tag: "#木炭 #デッサン",
    desc: "「運動した後の感情を表現してください」というテーマで描いた作品。感情の微細な動きを詰め込んだ。",
    date: "2022/08",
    meta: "",
    image: "images/木炭.jpg"
  },
];

/* ===== 起動 ===== */
syncSeed();

const grid = document.getElementById("worksGrid");
renderWorks(grid);

initModal();
bindWorksModal(grid);

/* ===== storage ===== */
function syncSeed() {
  const works = getWorks();

  // 削除済みseedは復活させない
  let deleted = [];
  try { deleted = JSON.parse(localStorage.getItem("miyoWorksDeleted") || "[]"); } catch {}

  const map = new Map(works.map(w => [w.id, w]));

  seed.forEach(s => {
    if (deleted.includes(s.id)) return;           // ←追加
    map.set(s.id, { ...map.get(s.id), ...s });
  });

  localStorage.setItem(KEY, JSON.stringify([...map.values()]));
}


function getWorks() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

/* ===== render ===== */
function renderWorks(container) {
  const works = getWorks();

  container.innerHTML = works.map(w => `
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
          <span>${escapeHtml(w.meta || "")}</span>
        </div>
      </div>
    </article>
  `).join("");
}

/* ===== modal ===== */
let modalEl, modalImg, labelTitle, labelDate, labelDesc;

function initModal() {
  if (document.querySelector(".artModal")) return;

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
        <div class="artLabel__date"></div>
        <div class="artLabel__line"></div>
        <div class="artLabel__desc"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modalEl);

  modalImg = modalEl.querySelector(".artFrame__img");
  labelTitle = modalEl.querySelector(".artLabel__title");
  labelDate  = modalEl.querySelector(".artLabel__date");
  labelDesc  = modalEl.querySelector(".artLabel__desc");

  modalEl.addEventListener("click", (e) => {
    if (e.target.dataset.close) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function bindWorksModal(container) {
  const openByCard = (card) => {
    const id = card.dataset.id;
    const w = getWorks().find(x => String(x.id) === String(id));
    if (!w) return;

    modalImg.src = w.image;
    modalImg.alt = w.title;

    labelTitle.textContent = w.title;
    labelDate.textContent  = prettyDate(w.date);
    labelDesc.textContent  = w.desc;

    modalEl.classList.add("is-open");
    document.body.classList.add("noScroll");
  };

  container.addEventListener("click", (e) => {
    const card = e.target.closest(".js-work");
    if (!card) return;
    openByCard(card);
  });

  container.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const card = e.target.closest(".js-work");
    if (!card) return;
    openByCard(card);
  });
}

function closeModal() {
  if (!modalEl) return;
  modalEl.classList.remove("is-open");
  document.body.classList.remove("noScroll");
}

function prettyDate(v){
  if (!v) return "";
  const s = String(v).trim();
  if (s.includes("-")) return s.replaceAll("-", ".");
  if (s.includes("/")) {
    const [y,m,d] = s.split("/");
    if (d) return `${y}.${pad2(m)}.${pad2(d)}`;
    return `${y}.${pad2(m)}`;
  }
  return s;
}
function pad2(x){ return String(x).padStart(2,"0"); }

/* ===== escape ===== */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
