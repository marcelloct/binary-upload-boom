// FOLLOW USER
const followBtn = document.getElementById("followBtn");

window.addEventListener("load", () => {
  followBtn.classList.contains("followed")
    ? (followBtn.textContent = "Following")
    : (followBtn.textContent = "Follow");
});

followBtn.addEventListener("click", async () => {
  const user = followBtn.dataset.follow;
  const res = await fetch(`${user}/follow`, { method: "POST" });
  const data = await res.json();
  console.log(data);

  // Update UI
  //   if (data.follow == true) {
  //     followBtn.textContent = "Following";
  //     followBtn.classList.add("follow-hover");
  //   }

  followBtn.textContent = data.follow ? "Following" : "Follow";

  followBtn.classList.toggle("followed", data.follow);
});
