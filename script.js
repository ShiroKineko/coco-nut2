
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

  // -------------------------
  // DIGITAL CLOCK
  // -------------------------

  function updateClock() {
    const now = new Date();

    const time = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(now);

    const date = new Intl.DateTimeFormat('ja-JP', {
      timeZone: 'Asia/Tokyo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now).replaceAll('/', '.');

    document.getElementById('clock').textContent = time;
    document.getElementById('clockDate').textContent = date;
  }

  updateClock();
  setInterval(updateClock, 1000);


  // -------------------------
  // RING MENU
  // -------------------------

  function setMenu(open) {
    overlay.classList.toggle('open', open);

    overlay.setAttribute(
      'aria-hidden',
      String(!open)
    );

    trigger.setAttribute(
      'aria-expanded',
      String(open)
    );

    menuLabel.textContent = open ? 'CLOSE' : 'MENU';
  }

  trigger.addEventListener('click', () => {
    setMenu(!overlay.classList.contains('open'));
  });

  close.addEventListener('click', () => {
    setMenu(false);
  });

  // メニュー外をクリックして閉じる
  overlay.addEventListener('click', event => {
    if (event.target === overlay) {
      setMenu(false);
    }
  });


  // -------------------------
  // PAGE TRANSITION
  // -------------------------

  function navigate(id, updateURL = true) {
    if (!pages.some(page => page.id === id)) {
      return;
    }

    if (navigating) {
      return;
    }

    setMenu(false);

    if (id === current) {
      return;
    }

    navigating = true;

    // ローディング画面を表示
    loader.classList.remove('show');

    // アニメーションを確実に再実行
    void loader.offsetWidth;

    loader.classList.add('show');
    loader.setAttribute('aria-hidden', 'false');

    // ローディング演出中にページを切り替える
    window.setTimeout(() => {

      // ページ表示を切り替える
      pages.forEach(page => {
        page.classList.toggle(
          'active',
          page.id === id
        );
      });

      current = id;

      // メニューの選択状態を更新
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

      // URLを更新
      if (updateURL) {
        history.pushState(
          { page: id },
          '',
          `#${id}`
        );
      }

      // ローディング画面を閉じる
      window.setTimeout(() => {
        loader.classList.remove('show');

        loader.setAttribute(
          'aria-hidden',
          'true'
        );

        navigating = false;

      }, 500);

    }, 650);
  }


  // -------------------------
  // PAGE LINKS
  // -------------------------

  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.dataset.page;

      if (!id) return;

      event.preventDefault();

      navigate(id);
    });
  });


  // -------------------------
  // BROWSER HISTORY
  // -------------------------

  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1) || 'home';

    if (id !== current) {
      navigate(id, false);
    }
  });


  // -------------------------
  // KEYBOARD
  // -------------------------

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });


  // -------------------------
  // INITIAL PAGE
  // -------------------------

  const initial = location.hash.slice(1);

  if (pages.some(page => page.id === initial)) {
    pages.forEach(page => {
      page.classList.toggle(
        'active',
        page.id === initial
      );
    });

    current = initial;
  }

  // 初期ページのメニュー状態
  links.forEach(link => {
    if (link.classList.contains('ring-link')) {
      link.classList.toggle(
        'current',
        link.dataset.page === current
      );
    }
  });

})();
