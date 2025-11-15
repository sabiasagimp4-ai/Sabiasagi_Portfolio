document.addEventListener('DOMContentLoaded', () => {
    const workList = document.getElementById('work-list');

    // data.jsonファイルを非同期で読み込む
    fetch('data.json')
        .then(response => {
            // 応答が正常かチェック
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました');
            }
            return response.json(); // JSONとして解析
        })
        .then(works => {
            // 取得した作品データを使ってHTML要素を生成
            works.forEach(work => {
                const workItem = document.createElement('div');
                workItem.classList.add('work-item');

                // リンク全体をラップするa要素を作成
                const link = document.createElement('a');
                link.href = work.linkUrl;
                link.target = '_blank'; // 新しいタブで開く
                link.rel = 'noopener noreferrer';

                // 画像要素
                const image = document.createElement('img');
                image.src = work.imageUrl;
                image.alt = work.title;

                // テキスト情報コンテナ
                const textContainer = document.createElement('div');
                textContainer.classList.add('work-text');

                // タイトル
                const title = document.createElement('h3');
                title.textContent = work.title;

                // 説明
                const description = document.createElement('p');
                description.textContent = work.description;

                // 要素を組み立てる
                textContainer.appendChild(title);
                textContainer.appendChild(description);
                
                link.appendChild(image);
                link.appendChild(textContainer);
                
                workItem.appendChild(link);
                workList.appendChild(workItem);
            });
        })
        .catch(error => {
            console.error('データの処理中にエラーが発生しました:', error);
            workList.textContent = '作品データの表示に失敗しました。';
        });
});
