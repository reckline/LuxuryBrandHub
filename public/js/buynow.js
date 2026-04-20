let selectedSize = "";
let quantity = 1;

document.addEventListener("DOMContentLoaded", () => {

const sizeRequired = ["shoes", "crocs", "sliders", "clothes"]
.includes(window.PRODUCT_CATEGORY);

const buyBtn = document.getElementById("buyNowBtn");

if(sizeRequired){
buyBtn.disabled = true;
}else{
buyBtn.disabled = false;
}

});


// SIZE SELECT
function selectSize(size, el){

selectedSize = size;

document.getElementById("selectedSize").value = size;

document.querySelectorAll(".size-btn").forEach(btn=>{
btn.classList.remove("active");
});

el.classList.add("active");

// enable buy button
const buyBtn = document.getElementById("buyNowBtn");
buyBtn.disabled = false;

const sizeError = document.getElementById("sizeError");
if(sizeError){
sizeError.classList.add("hidden");
}

}


// QUANTITY
function changeQty(val){

quantity += val;

if(quantity < 1) quantity = 1;

document.getElementById("qty-val").innerText = quantity;
document.getElementById("buyQty").value = quantity;

}


// OPEN CHECKOUT
function openCheckout(){

const sizeRequired = ["shoes", "crocs", "sliders", "clothes"]
.includes(window.PRODUCT_CATEGORY);

if(sizeRequired && !selectedSize){

const sizeError = document.getElementById("sizeError");

if(sizeError){
sizeError.classList.remove("hidden");
}

return;
}

document.getElementById("checkoutModal").classList.remove("hidden");

}


// CLOSE CHECKOUT
function closeCheckout(){

document.getElementById("checkoutModal").classList.add("hidden");

}