document.addEventListener('DOMContentLoaded', () => {
    const workGrid = document.getElementById('work-grid');

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(works => {
            
            // ソート処理: 投稿日を基に新しい順（降順）に並べ替える
            works.sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB - dateA; // 降順ソート
            });

            works.forEach(work => {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');

                // link.target を削除することで、同じタブで詳細ページに遷移するように修正
                const link = document.createElement('a');
                link.href = work.linkUrl;
                // link.target = '_blank'; // 外部サイトではないため削除
                link.rel = 'noopener noreferrer';
                link.classList.add('work-link');

                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('work-image-wrapper');

                if (work.imageUrl && work.imageUrl.trim() !== "") {
                    const image = document.createElement('img');
                    image.src = work.imageUrl;
                    image.alt = work.title;
                    imageWrapper.appendChild(image);
                } else {
                    imageWrapper.classList.add('no-image');
                    const placeholderText = document.createElement('p');
                    placeholderText.textContent = "NO IMAGE";
                    placeholderText.classList.add('no-image-text');
                    imageWrapper.appendChild(placeholderText);
                }

                // ★★★ ホバーオーバーレイの生成 ★★★
                const hoverOverlay = document.createElement('div');
                hoverOverlay.classList.add('hover-overlay');

                const overlayTitle = document.createElement('h3');
                overlayTitle.classList.add('overlay-title');
                overlayTitle.textContent = work.title;

                const overlayDate = document.createElement('p');
                overlayDate.classList.add('overlay-date');
                // YYYY.MM.DD 形式に整形
                const formattedDate = new Date(work.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
                overlayDate.textContent = formattedDate;

                hoverOverlay.appendChild(overlayTitle);
                hoverOverlay.appendChild(overlayDate);
                imageWrapper.appendChild(hoverOverlay); // 画像ラッパーに追加
                // ★★★ ホバーオーバーレイの生成 終わり ★★★

                // ★画像下のテキストを生成していた古いロジックは全て削除されています★

                link.appendChild(imageWrapper); // 画像ラッパーをリンクに追加
                workItem.appendChild(link);
                workGrid.appendChild(workItem);
            });
        })
        .catch(error => {
            console.error('データの処理中にエラーが発生しました:', error);
            workGrid.textContent = '作品データの表示に失敗しました。';
        });
});