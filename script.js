const catalog=[
 {id:"tee-white",type:"tshirt",name:"ALFA ESSENTIAL T-SHIRT",color:"OFF WHITE",hex:"#f4f2eb",price:850,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",desc:"A clean everyday silhouette made from premium heavyweight cotton. Finished with a subtle ALFA chest mark."},
 {id:"tee-black",type:"tshirt",name:"ALFA ESSENTIAL T-SHIRT",color:"BLACK",hex:"#111111",price:850,image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=85",desc:"A clean everyday silhouette made from premium heavyweight cotton. Finished with a subtle ALFA chest mark."},
 {id:"pants-white",type:"pants",name:"ALFA EVERYDAY PANTS",color:"SNOW WHITE",hex:"#f8f8f6",price:1250,image:"https://images.unsplash.com/photo-1506629905607-d9a3b3b9c6a1?auto=format&fit=crop&w=1000&q=85",desc:"Relaxed straight-leg pants with an elasticated waist and a minimal embroidered logo."},
 {id:"pants-black",type:"pants",name:"ALFA EVERYDAY PANTS",color:"BLACK",hex:"#111111",price:1250,image:"https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1000&q=85",desc:"Relaxed straight-leg pants with an elasticated waist and a minimal embroidered logo."}
];
const sizes=["S","M","L","XL"];let activeProduct=null,chosenSize="",bag=[];
const $=id=>document.getElementById(id);
const money=n=>"LE "+n.toLocaleString("en-EG");
function renderProducts(filter="all"){
 const list=catalog.filter(p=>filter==="all"||p.type===filter);
 $("productGrid").innerHTML=list.map(p=>`<article class="product-card" data-product="${p.id}"><div class="product-photo"><img src="${p.image}" alt="${p.name} ${p.color}" loading="lazy"><span class="product-label">ESSENTIALS 001</span></div><div class="product-meta"><div class="product-title-line"><b>${p.name}</b><span class="product-price">${money(p.price)}</span></div><div class="product-color">${p.color} · PREMIUM QUALITY</div><button class="view-product" data-open="${p.id}">VIEW PRODUCT +</button></div></article>`).join("");
}
function openProduct(id){
 activeProduct=catalog.find(p=>p.id===id);chosenSize="";
 $("modalImage").src=activeProduct.image;$("modalImage").alt=activeProduct.name+" "+activeProduct.color;
 $("modalName").textContent=activeProduct.name;$("modalPrice").textContent=money(activeProduct.price);
 $("addPrice").textContent=money(activeProduct.price);$("modalDescription").textContent=activeProduct.desc;
 $("selectedColorName").textContent=activeProduct.color;$("selectionError").textContent="";
 $("swatches").innerHTML=catalog.filter(p=>p.type===activeProduct.type).map(p=>`<button class="swatch ${p.id===activeProduct.id?"selected":""}" data-color="${p.id}" aria-label="${p.color}"><span style="background:${p.hex}"></span></button>`).join("");
 $("sizes").innerHTML=sizes.map(s=>`<button data-size="${s}">${s}</button>`).join("");
 $("productBackdrop").classList.add("show");document.body.style.overflow="hidden";
}
function closeProduct(){$("productBackdrop").classList.remove("show");if(!$("sizeBackdrop").classList.contains("show"))document.body.style.overflow=""}
$("productGrid").addEventListener("click",e=>{const button=e.target.closest("[data-open]");const card=e.target.closest("[data-product]");if(button)openProduct(button.dataset.open);else if(card)openProduct(card.dataset.product)});
$("swatches").addEventListener("click",e=>{const b=e.target.closest("[data-color]");if(b)openProduct(b.dataset.color)});
$("sizes").addEventListener("click",e=>{const b=e.target.closest("[data-size]");if(!b)return;chosenSize=b.dataset.size;document.querySelectorAll("#sizes button").forEach(x=>x.classList.toggle("selected",x===b));$("selectionError").textContent=""});
$("addToBag").addEventListener("click",()=>{if(!chosenSize){$("selectionError").textContent="Please select your size first.";return}const key=activeProduct.id+"-"+chosenSize;const existing=bag.find(x=>x.key===key);if(existing)existing.qty++;else bag.push({...activeProduct,size:chosenSize,qty:1,key});renderBag();closeProduct();openBag()});
function renderBag(){const count=bag.reduce((a,x)=>a+x.qty,0),total=bag.reduce((a,x)=>a+x.price*x.qty,0);$("bagCount").textContent=count;$("drawerCount").textContent="("+count+")";$("subtotal").textContent=money(total);$("bagLines").innerHTML=bag.length?bag.map(x=>`<div class="bag-item"><img src="${x.image}" alt=""><div><b>${x.name}</b><small>${x.color} / SIZE ${x.size} / QTY ${x.qty}</small><button class="remove" data-remove="${x.key}">REMOVE</button></div><small>${money(x.price*x.qty)}</small></div>`).join(""):`<p class="empty-bag">Your bag is waiting for something good.</p>`}
$("bagLines").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(!b)return;bag=bag.filter(x=>x.key!==b.dataset.remove);renderBag()});
function openBag(){$("bagDrawer").classList.add("open");$("drawerShade").classList.add("show")}
function closeBag(){$("bagDrawer").classList.remove("open");$("drawerShade").classList.remove("show")}
$("bagButton").addEventListener("click",openBag);$("closeBag").addEventListener("click",closeBag);$("drawerShade").addEventListener("click",closeBag);
$("closeProduct").addEventListener("click",closeProduct);$("productBackdrop").addEventListener("click",e=>{if(e.target===$("productBackdrop"))closeProduct()});
$("sizeGuide").addEventListener("click",()=>$("sizeBackdrop").classList.add("show"));$("closeSize").addEventListener("click",()=>$("sizeBackdrop").classList.remove("show"));$("sizeBackdrop").addEventListener("click",e=>{if(e.target===$("sizeBackdrop"))$("sizeBackdrop").classList.remove("show")});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts(b.dataset.filter)}));
$("menuButton").addEventListener("click",()=>$("nav").classList.toggle("open"));document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));
$("checkout").addEventListener("click",()=>{if(!bag.length){alert("Your bag is empty.");return}const lines=bag.map(x=>`${x.name} - ${x.color} - Size ${x.size} x${x.qty}: ${money(x.price*x.qty)}`).join("\n");const total=bag.reduce((a,x)=>a+x.price*x.qty,0);const message=encodeURIComponent(`Hello ALFA, I would like to place an order:\n${lines}\nTotal: ${money(total)}\nPlease contact me to confirm delivery.`);window.open(`https://wa.me/?text=${message}`,"_blank")});
renderProducts();renderBag();