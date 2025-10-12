const apiKey = "b175b124b25d4743a72dc45ce02ba263";
const url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&pageSize=12&apiKey=${apiKey}`;
const newsContainer = document.getElementById("news-container");
const searchInput = document.getElementById("searchInput");
let allArticles = [];

// Ambil data berita
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.status === "error") {
      throw new Error(data.message);
    }
    allArticles = data.articles || [];
    displayNews(allArticles);
  })
  .catch(error => {
    console.error("Gagal mengambil data:", error);
    newsContainer.innerHTML = `
      <div class="alert alert-danger text-center" role="alert">
        Gagal memuat berita 😢<br>
        ${error.message}<br>
        <small>Coba lagi nanti atau buat API key baru di <a href="https://newsapi.org/" target="_blank">NewsAPI.org</a>.</small>
      </div>
    `;
  });

// Fungsi menampilkan berita
function displayNews(articles) {
  newsContainer.innerHTML = "";
  if (!articles.length) {
    newsContainer.innerHTML = `
      <div class="col-12 text-center text-muted mt-3">
        Tidak ada berita ditemukan 😅
      </div>`;
    return;
  }

  articles.slice(0, 12).forEach(article => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" class="card-img-top" alt="Gambar berita">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${article.title}</h5>
          <small class="text-muted mb-2">${new Date(article.publishedAt).toLocaleDateString()}</small>
          <p class="card-text flex-grow-1">${article.description || "Tidak ada deskripsi."}</p>
          <a href="${article.url}" target="_blank" class="btn btn-primary mt-auto">Read More</a>
        </div>
      </div>
    `;
    newsContainer.appendChild(col);
  });
}

// Searching real-time
searchInput.addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allArticles.filter(article =>
    article.title && article.title.toLowerCase().includes(keyword)
  );
  displayNews(filtered);
});
