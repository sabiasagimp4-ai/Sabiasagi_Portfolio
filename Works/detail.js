document.addEventListener('DOMContentLoaded', () => {
    // 1. URLから 'id' パラメータを取得する
    const params = new URLSearchParams(window.location.search);
    // URLの ?id=X の X を取得 (例: "1", "2")
    const workId = params.get('id'); 

    // 2. data.json ファイルを読み込む (パスは ../data.json に注意)
    fetch('../data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(works => {
            // 3. 取得した全作品データから、URLのIDと一致する作品を探す
            // workId は文字列なので、数値に変換して比較 (または == で比較)
            const work = works.find(item => item.id == workId);

            if (work) {
                // 4. 作品が見つかったら、HTMLを生成して流し込む
                renderWorkDetail(work);
            } else {
                // 5. 作品が見つからなかった場合
                renderError();
            }
        })
        .catch(error => {
            console.error(error);
            renderError();
        });
});

/**
 * 作品データをHTMLに流し込む関数
 * @param {object} work - 見つかった作品のデータ
 */
function renderWorkDetail(work) {
    const contentArea = document.getElementById('work-detail-content');
    
    // ページのタイトルも作品名に変更する
    document.title = `${work.title} - Sabiasagi`;

    let imageHtml = '';
    // 画像URLの有無をチェック
    if (work.imageUrl && work.imageUrl.trim() !== "") {
        // パスを ../assets/images/... のように修正
        imageHtml = `<img src="../${work.imageUrl}" alt="${work.title}" class="detail-main-image">`;
    } else {
        // 画像がない場合は work-detail.css で定義したスタイルを適用
        imageHtml = `<div class="detail-main-image no-image-detail">NO IMAGE</div>`;
    }

    // HTMLを組み立てる
    contentArea.innerHTML = `
        <h2>${work.title}</h2>
        ${imageHtml}
        <p class="detail-description">${work.description}</p>
    `;
    
    // もしJSONに外部リンク用のキー (例: externalUrl) を追加するなら、ここに追加できる
    // if (work.externalUrl) {
    //     contentArea.innerHTML += `<a href="${work.externalUrl}" target="_blank" rel="noopener noreferrer">実際のサイトを見る &rarr;</a>`;
    // }
}

/**
 * エラーメッセージを表示する関数
 */
function renderError() {
    const contentArea = document.getElementById('work-detail-content');
    contentArea.innerHTML = '<h2>作品が見つかりません</h2><p>指定された作品データが見つかりませんでした。URLを確認してください。</p>';
}