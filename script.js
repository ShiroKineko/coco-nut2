
(() => {
  const pages = [...document.querySelectorAll('.page')];
  const links = [...document.querySelectorAll('[data-page]')];

  const overlay = document.getElementById('ringMenu');
  const trigger = document.getElementById('menuTrigger');
  const close = document.getElementById('ringClose');
  const loader = document.getElementById('loader');
  const menuLabel = document.getElementById('menuLabel');

  let current = 'home';
  let navigating = false;

  // メニューの開閉
  function setMenu(open) {
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    trigger.setAttribute('aria-expanded', String(open));

    menuLabel.textContent = open ? 'CLOSE' : 'MENU';
  }

  // ページ遷移
  function navigate(id) {
    if (!pages.some(page => page.id === id) || navigating) {
      return;
    }

    setMenu(false);

    if (id === current) {
      return;
    }

    navigating = true;

    // ローディング開始
    loader.classList.add('show');
    loader.setAttribute('aria-hidden', 'false');

    window.setTimeout(() => {

      // ページ切り替え
      pages.forEach(page => {
        page.classList.toggle('active', page.id === id);
      });

      current = id;

      // メニューの選択状態
      links.forEach(link => {
        const selected = link.dataset.page === id;

        link.classList.toggle('current', selected);

        if (link.classList.contains('ring-link')) {
          if (selected) {
            link.setAttribute('aria-current', 'page');
          } else {
            link.removeAttribute('aria-current');
          }
        }
      });

      // URLのハッシュを更新
      history.pushState({ page: id }, '', `#${id}`);

      // スクロール位置を先頭に戻す
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });

      // ローディング終了
      loader.classList.remove('show');
      loader.setAttribute('aria-hidden', 'true');

      navigating = false;

    }, 850);
  }

  // メニューボタン
  trigger.addEventListener('click', () => {
    setMenu(!overlay.classList.contains('open'));
  });

  // 閉じるボタン
  close.addEventListener('click', () => {
    setMenu(false);
  });

  // メニュー外をクリックして閉じる
  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      setMenu(false);
    }
  });

  // ページリンク
  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.dataset.page;

      if (!id) return;

      event.preventDefault();
      navigate(id);
    });
  });

  // Escapeキーで閉じる
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  // ブラウザの戻る・進む
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1) || 'home';

    if (id === current) return;

    if (pages.some(page => page.id === id)) {
      pages.forEach(page => {
        page.classList.toggle('active', page.id === id);
      });

      current = id;
    }
  });

  // 初期ページの判定
  const initial = location.hash.slice(1);

  if (pages.some(page => page.id === initial)) {
    pages.forEach(page => {
      page.classList.toggle('active', page.id === initial);
    });

    current = initial;
  }
})();
