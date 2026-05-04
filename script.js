const API = "https://anjan-plus-1.onrender.com";

let cart = [];
let productsData = [];

// 🔹 LOAD PRODUCTS
function loadProducts() {
  fetch(API + "/products")
    .then(res => res.json())
    .then(d => {
      productsData = d;

      let list = document.getElementById("productList");
      if (!list) return;

      list.innerHTML = "";

      d.forEach(p => {
        list.innerHTML += `
          <div style="margin:10px; padding:10px; background:#1e2a47; border-radius:8px;">
            <b>${p.name}</b> - ₹${p.price} (Stock: ${p.stock})
            <button onclick="addToCart(${p.id})">Add</button>
          </div>
        `;
      });
    });
}

// 🔹 ADD PRODUCT (FIXED)
function addProduct() {
  const name = document.getElementById("name").value;
  const stock = document.getElementById("stock").value;
  const price = document.getElementById("price").value;

  if (!name || !stock || !price) {
    alert("Fill all fields");
    return;
  }

  fetch(API + "/add-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      stock: stock,
      price: price
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("✅ Product Added");
      loadProducts();
    })
    .catch(err => {
      console.error(err);
      alert("❌ Error adding product");
    });
}

// 🔹 ADD TO CART
function addToCart(id) {
  let item = cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id, qty: 1 });
  }

  renderCart();
}

// 🔹 RENDER CART
function renderCart() {
  let cartDiv = document.getElementById("cart");

  if (!cartDiv) return;

  cartDiv.innerHTML = "";

  cart.forEach(c => {
    let p = productsData.find(x => x.id === c.id);

    if (!p) return;

    cartDiv.innerHTML += `
      <div>
        ${p.name} x ${c.qty} = ₹${p.price * c.qty}
      </div>
    `;
  });
}

// 🔹 PAGE LOAD
window.onload = loadProducts;