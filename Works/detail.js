function extractYoutubeId(url) {
    if (!url) return null;
    const watchMatch = url.match(/(?:\?v=|\/embed\/|youtu\.be\/|\/v\/|watch\?v=)([a-zA-Z0-9_-]{11})(?:[&\?].*)?$/);
    if (watchMatch) {
        return watchMatch[1];
    }
    return null;
}


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const workId = params.get('id'); 

    fetch('../data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSONデータの読み込みに失敗しました');
            }
            return response.json();
        })
        .then(works => {
            const work = works.find(item => item.id == workId);

            if (work) {
                renderWorkDetail(work);
            } else {
                renderError();
            }
        })
        .catch(error => {
            console.error(error);
            renderError();
        });
});

function renderWorkDetail(work) {
    const contentArea = document.getElementById('work-detail-content');
    
    document.title = `${work.title} - Sabiasagi`;

    let mediaHtml = '';

    const videoId = extractYoutubeId(work.youtubeUrl);

    if (videoId) {
        mediaHtml = `
            <div class="youtube-container">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    referrerpolicy="strict-origin-when-cross-origin" 
                >
                </iframe>
            </div>
        `;
    } 
    else if (work.imageUrl && work.imageUrl.trim() !== "") {
        mediaHtml = `<img src="../${work.imageUrl}" alt="${work.title}" class="detail-main-image">`;
    } 
    else {
        mediaHtml = `<div class="detail-main-image no-image-detail">NO MEDIA</div>`;
    }

    const formattedDate = new Date(work.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });

    contentArea.innerHTML = `
        <h2 class="detail-title">${work.title}</h2>
        <p class="detail-date">${formattedDate} 投稿</p>
        ${mediaHtml}
        <p class="detail-description">${work.description}</p>
    `;
}

function renderError() {
    const contentArea = document.getElementById('work-detail-content');
    contentArea.innerHTML = '<h2>作品が見つかりません</h2><p>指定された作品データが見つかりませんでした。URLを確認してください。</p>';
}