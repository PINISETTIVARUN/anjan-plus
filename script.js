if(!localStorage.getItem("loggedIn")){
if(!location.href.includes("login.html")) location.href="login.html";
}

const API="https://anjan-plus-1.onrender.com";
let cart=[],productsData=[];

function logout(){
localStorage.removeItem("loggedIn");
location.href="login.html";
}

function loadProducts(){
fetch(API+"/products").then(r=>r.json()).then(d=>{
productsData=d;
let list=document.getElementById("productList");
if(!list)return;
list.innerHTML="";
d.forEach(p=>{
list.innerHTML+=`${p.name} ₹${p.price} (${p.stock})
<button onclick="addToCart(${p.id})">Add</button><br>`;
});
});
}

function addProduct(){
fetch(API+"/add_product",{method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name:name.value,stock:stock.value,price:price.value})
}).then(loadProducts);
}

function addToCart(id){
let i=cart.find(x=>x.id===id);
if(i)i.qty++; else cart.push({id,qty:1});
renderCart();
}

function renderCart(){
let t=0,h="";
cart.forEach(c=>{
let p=productsData.find(x=>x.id===c.id);
let v=p.price*c.qty;t+=v;
h+=`${p.name} x${c.qty}=₹${v}<br>`;
});
if(billing)billing.innerHTML=h;
if(totalAmount)totalAmount.innerText="₹"+t;
}

function sell(){
fetch(API+"/sell",{method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(cart)}).then(()=>{
cart=[];loadProducts();loadSales();
});
}

function printBill(){
let w=window.open();
w.document.write(billing.innerHTML+"<h3>"+totalAmount.innerText+"</h3>");
w.print();
}

function downloadPDF(){
let e=document.createElement("div");
e.innerHTML=billing.innerHTML+"<h3>"+totalAmount.innerText+"</h3>";
html2pdf().from(e).save();
}

function loadSales(){
fetch(API+"/sales").then(r=>r.json()).then(d=>{
let total=0,qty=0,labels=[],values=[];
d.forEach(s=>{
total+=s.total;qty+=s.qty;
labels.push(s.name);values.push(s.total);
});
if(totalSales)totalSales.innerText="₹"+total;
if(totalQty)totalQty.innerText=qty;
if(salesChart)new Chart(salesChart,{type:"bar",
data:{labels:labels,datasets:[{data:values}]}
});
});
}

if(document.getElementById("productList"))loadProducts();
if(document.getElementById("salesChart"))loadSales();