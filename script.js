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

            // works count in section bar
            const countEl = document.getElementById('works-count');
            if (countEl) countEl.textContent = works.length + ' works';

            works.forEach((work, index) => {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');

                const link = document.createElement('a');
                link.href = work.linkUrl;
                link.rel = 'noopener noreferrer';
                link.classList.add('work-link');

                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('work-image-wrapper');

                // 番号ラベル
                const workNumber = document.createElement('span');
                workNumber.classList.add('work-number');
                workNumber.textContent = String(index + 1).padStart(3, '0');
                imageWrapper.appendChild(workNumber);

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

                const hoverOverlay = document.createElement('div');
                hoverOverlay.classList.add('hover-overlay');

                const overlayTitle = document.createElement('h3');
                overlayTitle.classList.add('overlay-title');
                overlayTitle.textContent = work.title;

                const overlayDate = document.createElement('p');
                overlayDate.classList.add('overlay-date');
                const formattedDate = new Date(work.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
                overlayDate.textContent = formattedDate;

                hoverOverlay.appendChild(overlayTitle);
                hoverOverlay.appendChild(overlayDate);
                imageWrapper.appendChild(hoverOverlay);

                link.appendChild(imageWrapper);
                workItem.appendChild(link);
                workGrid.appendChild(workItem);
            });
        })
        .catch(error => {
            console.error('データの処理中にエラーが発生しました:', error);
            workGrid.textContent = '作品データの表示に失敗しました。';
        });
});