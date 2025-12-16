// LIKE POST
const likeBtn = document.getElementById("likeBtn");

likeBtn.addEventListener("click", async () => {
  const postId = likeBtn.dataset.post;
  const res = await fetch(`${postId}/likePost`, { method: "POST" });
  const data = await res.json();
  console.log(data);

  // Update UI
  const countEl = document.getElementById("likeCount");
  countEl.textContent = parseInt(countEl.textContent) + (data.liked ? 1 : -1);

  likeBtn.classList.toggle("liked", data.liked);
});

// LIKE COMMENTS
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".likeCommentBtn");
  if (!btn) return;

  const commentId = btn.dataset.comment;

  console.log("commentId:", commentId); // DEBUG

  const res = await fetch(`/comment/${commentId}/likeComment`, {
    method: "POST",
  });

  const data = await res.json();

  btn.classList.toggle("liked", data.liked);

  const countEl = document.getElementById(`commentCount-${commentId}`);

  const currentCount = parseInt(countEl.textContent, 10);
  countEl.textContent = data.liked ? currentCount + 1 : currentCount - 1;
});

// FAVORITES
const favoriteBtn = document.getElementById("favoriteBtn");

favoriteBtn.addEventListener("click", async () => {
  const postId = favoriteBtn.dataset.post;
  const res = await fetch(`${postId}/favorite`, { method: "POST" });
  const data = await res.json();
  console.log(data);

  // Update UI

  favoriteBtn.classList.toggle("favorite", data.favorite);
});
