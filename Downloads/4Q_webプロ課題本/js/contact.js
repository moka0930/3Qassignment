const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // ★ここを自分の受信アドレスに変更
  const TO = "yourmail@example.com";

  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const msg = document.getElementById("cMsg").value.trim();

  const subject = encodeURIComponent(`【ポートフォリオ問い合わせ】${name}さんより`);
  const body = encodeURIComponent(
`お名前：${name}
メール：${email}

--- 内容 ---
${msg}
`);

  // mailtoで通知トリガー（メールアプリが開く）
  location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
});
