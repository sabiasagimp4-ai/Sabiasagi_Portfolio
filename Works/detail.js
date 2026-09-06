(() => {
  const container = document.getElementById('work-detail-content');
  const id = new URLSearchParams(location.search).get('id');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  function youtubeId(value) {
    try {
      const url = new URL(value);
      const host = url.hostname.replace(/^www\./, '');
      const candidate = host === 'youtu.be' ? url.pathname.slice(1) : host === 'youtube.com' ? url.searchParams.get('v') : null;
      return /^[\w-]{11}$/.test(candidate || '') ? candidate : null;
    } catch { return null; }
  }
  function showError(message) {
    container.replaceChildren(make('h1', 'detail-title', message), make('p', '', '作品一覧からもう一度お試しください。'));
    container.setAttribute('aria-busy', 'false');
  }
  fetch('../data.json')
    .then(response => { if (!response.ok) throw new Error('作品データを読み込めませんでした。'); return response.json(); })
    .then(works => {
      const work = works.find(item => String(item.id) === id);
      if (!work) { showError('作品が見つかりません。'); return; }
      document.title = `${work.title} — Sabiasagi`;
      document.getElementById('back-to-work').href = `../index.html#work-${work.id}`;
      const heading = make('div', 'detail-heading');
      heading.append(make('h1', 'detail-title', work.title));
      const date = make('time', 'detail-date', work.date.trim().replaceAll('-', '.'));
      date.dateTime = work.date.trim();
      heading.append(date);
      const media = make('div', 'detail-media');
      const image = make('img', 'detail-main-image');
      image.src = `../${work.imageUrl}`;
      image.alt = `${work.title} の一場面`;
      image.width = work.id === 9 ? 1919 : 1920;
      image.height = work.id === 9 ? 1008 : 1080;
      const videoId = youtubeId(work.youtubeUrl);
      if (videoId) {
        const button = make('button', 'video-poster');
        button.type = 'button';
        button.setAttribute('aria-label', `${work.title} を再生`);
        button.append(image, make('span', 'play-label', '▶ 映像を再生'));
        button.addEventListener('click', () => {
          const frame = make('iframe');
          frame.title = `${work.title} — YouTube動画`;
          frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
          frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
          frame.allowFullscreen = true;
          frame.referrerPolicy = 'strict-origin-when-cross-origin';
          const player = make('div', 'youtube-container');
          player.append(frame);
          media.replaceChildren(player);
          frame.focus();
        }, { once: true });
        media.append(button);
      } else { media.append(image); }
      const copy = make('div', 'detail-copy');
      copy.append(make('p', 'detail-description', work.description));
      if (videoId) {
        const external = make('a', 'text-link', 'YouTubeで見る ↗');
        external.href = `https://www.youtube.com/watch?v=${videoId}`;
        external.target = '_blank';
        external.rel = 'noopener noreferrer';
        copy.append(external);
      }
      container.replaceChildren(heading, media, copy);
      container.setAttribute('aria-busy', 'false');
    })
    .catch(() => showError('作品を読み込めませんでした。'));
})();
