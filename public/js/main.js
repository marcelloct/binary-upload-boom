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
