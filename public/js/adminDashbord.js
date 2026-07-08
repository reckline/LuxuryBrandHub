function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("active");
}

function toggleModal() {
  const modal = document.getElementById("productModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}


