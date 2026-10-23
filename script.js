const menu = document.querySelector('.menu-button');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
  menu.querySelector('span').textContent = open ? '−' : '＋';
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.querySelector('span').textContent = '＋';
}));
document.querySelector('#year').textContent = new Date().getFullYear();
const practices = {
 home: {title: '身体がほっとする場所を探す。', description: 'いつもの部屋で、5分だけ。心地よさを探す、小さな実験です。', steps: ['部屋のなかで、気になる場所に座ってみる。', '光の明るさ、空気の流れ、身体に触れるものを感じる。', '「もう少しこうしたい」をひとつ見つけて、できる範囲で変えてみる。']},
 dialogue: {title: '聴きあう時間を、少しだけ。', description: '身近な人と、あるいはノートのなかの自分と。結論を急がず、ことばを置いてみましょう。', steps: ['「今日、心が動いたのはどんなとき？」と問いかける。', '答えを評価せず、途中でさえぎらずに聴いてみる。', '聴いていて感じたことや、ありがとうをひとこと伝える。']}
};
const dialog = document.querySelector('#practice');
document.querySelectorAll('[data-practice]').forEach(link => link.addEventListener('click', event => {
 event.preventDefault(); const practice = practices[link.dataset.practice];
 document.querySelector('#practice-title').textContent = practice.title;
 document.querySelector('#practice-description').textContent = practice.description;
 document.querySelector('#practice-steps').replaceChildren(...practice.steps.map(text => {const li = document.createElement('li'); li.textContent = text; return li;}));
 dialog.setAttribute('aria-labelledby', 'practice-title'); dialog.showModal();
}));
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {if(event.target === dialog){const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();}});
