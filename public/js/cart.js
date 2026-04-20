function toggleAdvance(element) {
  const advanceBox = document.getElementById("advanceBox");
  const balanceRow = document.getElementById("balanceRow");

  if (!advanceBox || !balanceRow) return;

  if (element.value === "cod") {
    advanceBox.classList.remove("hidden");
    balanceRow.classList.remove("hidden");
  } else {
    advanceBox.classList.add("hidden");
    balanceRow.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lol = document.querySelector(".lol");
  const kok = document.querySelector(".kok");
  const summaryPanel = document.querySelector("aside .glass-panel");
  const advanceBox = document.getElementById("advanceBox");
  const balanceRow = document.getElementById("balanceRow");

  // ❗ Agar cart / checkout page nahi hai to script quietly stop
  if (!lol || !kok) return;

  const updateDisplay = (method) => {
    if (summaryPanel) summaryPanel.style.display = "block";

    if (advanceBox && balanceRow) {
      if (method === "cod") {
        advanceBox.classList.remove("hidden");
        balanceRow.classList.remove("hidden");
      } else {
        advanceBox.classList.add("hidden");
        balanceRow.classList.add("hidden");
      }
    }
  };

  // ONLINE
  lol.addEventListener("click", () => {
    const radio = lol.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
    updateDisplay("online");
  });

  // COD
  kok.addEventListener("click", () => {
    const radio = kok.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
    updateDisplay("cod");
  });
});


// ================= CART FUNCTIONS =================

async function updateCartQty(productId, action) {
  await fetch("/cart/update-qty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, action }),
  });

  location.reload();
}

async function removeItem(productId) {
  await fetch("/cart/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  location.reload();
}


// ================= MODAL =================

// function openCheckout() {
//   const modal = document.getElementById("checkoutModal");
//   if (modal) modal.classList.remove("hidden");
// }

// function closeCheckout() {
//   const modal = document.getElementById("checkoutModal");
//   if (modal) modal.classList.add("hidden");
// }


function showToast(message, type = "success") {

  const toast = document.createElement("div");

  toast.className =
    "px-5 py-3 rounded-xl shadow-lg text-white font-bold animate-slideIn";

  if (type === "success") {
    toast.classList.add("bg-green-500");
  } else if (type === "error") {
    toast.classList.add("bg-red-500");
  } else {
    toast.classList.add("bg-gray-800");
  }

  toast.innerText = message;

  const container = document.getElementById("toast-container");
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}


async function toggleCart(btn, productId) {

  const res = await fetch("/add-to-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId })
  });

  const data = await res.json();

  if (data.success) {

    showToast("Product added to cart 🛒");

  } else {

    showToast("Failed to add cart", "error");

  }

}


// // ================= PAYMENT TOGGLE =================

// function toggleAdvance(element) {
//   const advanceBox = document.getElementById("advanceBox");
//   const balanceRow = document.getElementById("balanceRow");

//   if (!advanceBox || !balanceRow) return;

//   if (element.value === "cod") {
//     advanceBox.classList.remove("hidden");
//     balanceRow.classList.remove("hidden");
//   } else {
//     advanceBox.classList.add("hidden");
//     balanceRow.classList.add("hidden");
//   }
// }


// // ================= PAGE LOAD =================

// document.addEventListener("DOMContentLoaded", () => {

//   const lol = document.querySelector(".lol");
//   const kok = document.querySelector(".kok");
//   const summaryPanel = document.querySelector("aside .glass-panel");
//   const advanceBox = document.getElementById("advanceBox");
//   const balanceRow = document.getElementById("balanceRow");

//   if (!lol || !kok) return;

//   const updateDisplay = (method) => {

//     if (summaryPanel) summaryPanel.style.display = "block";

//     if (advanceBox && balanceRow) {

//       if (method === "cod") {

//         advanceBox.classList.remove("hidden");
//         balanceRow.classList.remove("hidden");

//       } else {

//         advanceBox.classList.add("hidden");
//         balanceRow.classList.add("hidden");

//       }

//     }

//   };

//   // ONLINE
//   lol.addEventListener("click", () => {

//     const radio = lol.querySelector('input[type="radio"]');
//     if (radio) radio.checked = true;

//     updateDisplay("online");

//   });

//   // COD
//   kok.addEventListener("click", () => {

//     const radio = kok.querySelector('input[type="radio"]');
//     if (radio) radio.checked = true;

//     updateDisplay("cod");

//   });

// });


// // ================= TOAST FUNCTION =================

// function showToast(message, type = "success") {

//   const container = document.getElementById("toast-container");

//   if (!container) return; // safety check

//   const toast = document.createElement("div");

//   toast.className =
//     "px-5 py-3 rounded-xl shadow-lg text-white font-bold animate-slideIn";

//   if (type === "success") {
//     toast.classList.add("bg-green-500");
//   } else if (type === "error") {
//     toast.classList.add("bg-red-500");
//   } else {
//     toast.classList.add("bg-gray-800");
//   }

//   toast.innerText = message;

//   container.appendChild(toast);

//   setTimeout(() => {
//     toast.remove();
//   }, 3000);

// }


// // ================= CART FUNCTIONS =================

// async function toggleCart(btn, productId) {

//   try {

//     const res = await fetch("/add-to-cart", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ productId })
//     });

//     const data = await res.json();

//     if (data.success) {

//       showToast("Product added to cart 🛒");

//     } else {

//       showToast("Failed to add cart", "error");

//     }

//   } catch (err) {

//     console.error(err);
//     showToast("Server error", "error");

//   }

// }


// // ================= CART UPDATE =================

// async function updateCartQty(productId, action) {

//   try {

//     await fetch("/cart/update-qty", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ productId, action }),
//     });

//     showToast("Cart updated");

//     setTimeout(() => {
//       location.reload();
//     }, 700);

//   } catch {

//     showToast("Error updating cart", "error");

//   }

// }


// // ================= REMOVE ITEM =================

// async function removeItem(productId) {

//   try {

//     await fetch("/cart/remove", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ productId }),
//     });

//     showToast("Item removed from cart");

//     setTimeout(() => {
//       location.reload();
//     }, 700);

//   } catch {

//     showToast("Error removing item", "error");

//   }

// }