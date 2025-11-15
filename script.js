document.addEventListener('DOMContentLoaded', () => {
    const workList = document.getElementById('work-list');

    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(works => {
            works.forEach(work => {
                const link = document.createElement('a');
                link.href = work.linkUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.classList.add('work-card');

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('work-image-container');

                // ★★★ 修正箇所: 画像URLのチェック ★★★
                if (work.imageUrl && work.imageUrl.trim() !== "") {
                    // 画像URLがある場合、img要素を作成
                    const image = document.createElement('img');
                    image.src = work.imageUrl;
                    image.alt = work.title;
                    imageContainer.appendChild(image);
                } else {
                    // 画像URLがない場合、青色背景のクラスを追加
                    imageContainer.classList.add('no-image');
                }
                // ★★★ 修正箇所 終わり ★★★

                const textOverlay = document.createElement('div');
                textOverlay.classList.add('work-text-overlay');

                const title = document.createElement('h3');
                title.textContent = work.title;

                const description = document.createElement('p');
                description.textContent = work.description;

                textOverlay.appendChild(title);
                textOverlay.appendChild(description);
                
                imageContainer.appendChild(textOverlay); // テキストは常にオーバーレイとして追加
                
                link.appendChild(imageContainer);
                workList.appendChild(link);
            });
        })
        .catch(error => {
            console.error('データの処理中にエラーが発生しました:', error);
            workList.textContent = '作品データの表示に失敗しました。';
        });
});
