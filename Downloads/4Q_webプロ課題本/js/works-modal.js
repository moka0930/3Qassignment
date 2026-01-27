// js/works-modal.js
(() => {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  const escapeHtml = (s) =>
    String(s ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  const getCardData = (card) => {
    const img = card.querySelector('.card__img');
    const title = card.querySelector('.card__title')?.textContent?.trim() || '';
    const desc = card.querySelector('.card__desc')?.textContent?.trim() || '';
    // 例: .card__meta の中に date を置いてる想定（なければ空）
    const date =
      card.querySelector('.card__meta .date')?.textContent?.trim() ||
      card.querySelector('.card__meta')?.textContent?.trim() ||
      '';

    return {
      imgSrc: img?.getAttribute('src') || '',
      imgAlt: img?.getAttribute('alt') || title || 'Artwork',
      title,
      desc,
      date,
    };
  };

  const closeModal = (modal) => {
    modal.classList.remove('is-open');
    document.body.classList.remove('noScroll');

    // ちょい待ってから消す（フェード用）
    setTimeout(() => modal.remove(), 160);

    document.removeEventListener('keydown', modal.__onKeydown);
  };

  const openModal = (data) => {
    const modal = document.createElement('div');
    modal.className = 'artModal is-open';

    modal.innerHTML = `
      <div class="artModal__backdrop" data-close="1"></div>

      <div class="artModal__panel" role="dialog" aria-modal="true" aria-label="作品の表示">
        <button class="artModal__close" type="button" aria-label="閉じる" data-close="1">×</button>

        <div class="artFrame">
          <div class="artFrame__frame">
            <div class="artFrame__mat">
              <img class="artFrame__img" src="${escapeHtml(data.imgSrc)}" alt="${escapeHtml(data.imgAlt)}">
            </div>
          </div>
        </div>

        <div class="artLabel">
          <div class="artLabel__title">${escapeHtml(data.title)}</div>
          ${data.date ? `<div class="artLabel__date">${escapeHtml(data.date)}</div>` : ''}
          <div class="artLabel__line"></div>
          <div class="artLabel__desc">${escapeHtml(data.desc)}</div>
        </div>
      </div>
    `;

    // backdrop / close click
    modal.addEventListener('click', (e) => {
      const t = e.target;
      if (t && t.dataset && t.dataset.close === '1') closeModal(modal);
    });

    // ESC close
    modal.__onKeydown = (e) => {
      if (e.key === 'Escape') closeModal(modal);
    };
    document.addEventListener('keydown', modal.__onKeydown);

    document.body.classList.add('noScroll');
    document.body.appendChild(modal);

    // 最初のフォーカス（アクセシビリティ）
    modal.querySelector('.artModal__close')?.focus();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const data = getCardData(card);
      if (!data.imgSrc) return;
      openModal(data);
    });
  });
})();
