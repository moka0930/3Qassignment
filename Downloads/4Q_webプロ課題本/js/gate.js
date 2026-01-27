// js/gate.js
(() => {
  const ADMIN_PASSWORD = "MIYONOSAITO"; 
  const REDIRECT_TO = "index.html";

  // 管理ページは毎回入力（保存しない）
  const input = prompt("Archiveに入るにはパスワードが必要です");

  if (input === null) {
    location.href = REDIRECT_TO;
    return;
  }
  if (input !== ADMIN_PASSWORD) {
    alert("パスワードが違います");
    location.href = REDIRECT_TO;
    return;
  }
})();
