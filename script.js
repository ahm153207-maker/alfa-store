const catalog=[
 {id:"tee-white",type:"tshirt",name:"ALFA ESSENTIAL T-SHIRT",color:"OFF WHITE",hex:"#f4f2eb",price:850,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85",desc:"A clean everyday silhouette made from premium heavyweight cotton. Finished with a subtle ALFA chest mark."},
 {id:"tee-black",type:"tshirt",name:"ALFA ESSENTIAL T-SHIRT",color:"BLACK",hex:"#111111",price:850,image:"https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1000&q=85",desc:"A clean everyday silhouette made from premium heavyweight cotton. Finished with a subtle ALFA chest mark."},
 {id:"pants-white",type:"pants",name:"ALFA EVERYDAY PANTS",color:"SNOW WHITE",hex:"#f8f8f6",price:1250,image:"https://images.unsplash.com/photo-1506629905607-d9a3b3b9c6a1?auto=format&fit=crop&w=1000&q=85",desc:"Relaxed straight-leg pants with an elasticated waist and a minimal embroidered logo."},
 {id:"pants-black",type:"pants",name:"ALFA EVERYDAY PANTS",color:"BLACK",hex:"#111111",price:1250,image:"https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=1000&q=85",desc:"Relaxed straight-leg pants with an elasticated waist and a minimal embroidered logo."}
];
const sizes=["S","M","L","XL"];
let activeProduct=null,chosenSize="",bag=[];
const $=id=>document.getElementById(id);
const money=n=>"LE "+Number(n).toLocaleString("en-EG");

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

function renderBag(){
 const count=bag.reduce((a,x)=>a+x.qty,0),total=bag.reduce((a,x)=>a+x.price*x.qty,0);
 $("bagCount").textContent=count;$("drawerCount").textContent="("+count+")";$("subtotal").textContent=money(total);
 $("bagLines").innerHTML=bag.length?bag.map(x=>`<div class="bag-item"><img src="${x.image}" alt=""><div><b>${x.name}</b><small>${x.color} / SIZE ${x.size} / QTY ${x.qty}</small><button class="remove" data-remove="${x.key}">REMOVE</button></div><small>${money(x.price*x.qty)}</small></div>`).join(""):`<p class="empty-bag">Your bag is waiting for something good.</p>`;
}
$("bagLines").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(!b)return;bag=bag.filter(x=>x.key!==b.dataset.remove);renderBag()});
function openBag(){$("bagDrawer").classList.add("open");$("drawerShade").classList.add("show")}
function closeBag(){$("bagDrawer").classList.remove("open");$("drawerShade").classList.remove("show")}
$("bagButton").addEventListener("click",openBag);$("closeBag").addEventListener("click",closeBag);$("drawerShade").addEventListener("click",closeBag);
$("closeProduct").addEventListener("click",closeProduct);$("productBackdrop").addEventListener("click",e=>{if(e.target===$("productBackdrop"))closeProduct()});
$("sizeGuide").addEventListener("click",()=>$("sizeBackdrop").classList.add("show"));$("closeSize").addEventListener("click",()=>$("sizeBackdrop").classList.remove("show"));$("sizeBackdrop").addEventListener("click",e=>{if(e.target===$("sizeBackdrop"))$("sizeBackdrop").classList.remove("show")});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts(b.dataset.filter)}));
$("menuButton").addEventListener("click",()=>$("nav").classList.toggle("open"));document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>$("nav").classList.remove("open")));

const SUPABASE_URL="https://yuyxlpaeswqfjjjdfasm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_NJvPmYj20O360q9W-bmVTg_-4gD5jyN";

function loadSupabase(){
 return new Promise((resolve,reject)=>{
  if(window.supabase?.createClient){resolve(window.supabase);return}
  const script=document.createElement("script");
  script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  script.onload=()=>window.supabase?.createClient?resolve(window.supabase):reject(new Error("Supabase library did not load."));
  script.onerror=()=>reject(new Error("Could not load Supabase. Check your internet connection."));
  document.head.appendChild(script);
 });
}
function createCheckoutModal(){
 if($("alfaCheckoutModal"))return;
 const style=document.createElement("style");
 style.textContent=`
 #alfaCheckoutModal{position:fixed;inset:0;z-index:99999;background:#0009;display:none;align-items:center;justify-content:center;padding:18px}
 #alfaCheckoutModal.show{display:flex}
 #alfaCheckoutBox{background:#fff;color:#111;width:min(100%,460px);max-height:90vh;overflow:auto;padding:26px;border-radius:4px;font-family:Arial,sans-serif}
 #alfaCheckoutBox h2{font-size:22px;margin:0 0 8px;letter-spacing:1px}
 #alfaCheckoutBox p{font-size:13px;color:#555;margin:0 0 18px}
 #alfaCheckoutBox label{display:block;font-size:12px;margin:13px 0 6px}
 #alfaCheckoutBox input,#alfaCheckoutBox textarea{box-sizing:border-box;width:100%;padding:12px;border:1px solid #ccc;border-radius:2px;font:14px Arial}
 #alfaCheckoutBox textarea{min-height:75px;resize:vertical}
 #alfaCheckoutBox button{padding:13px 16px;border:0;cursor:pointer;font-weight:bold}
 #alfaSubmitOrder{background:#111;color:white;width:100%;margin-top:16px}
 #alfaCancelOrder{background:#eee;color:#111;width:100%;margin-top:8px}
 #alfaOrderMessage{font-size:13px;margin-top:12px;line-height:1.5}
 `;
 document.head.appendChild(style);
 const modal=document.createElement("div");modal.id="alfaCheckoutModal";
 modal.innerHTML=`<div id="alfaCheckoutBox"><h2>COMPLETE YOUR ORDER</h2><p>Enter your delivery details. Your order will be sent to ALFA.</p>
 <form id="alfaCheckoutForm">
 <label for="alfaCustomerName">FULL NAME *</label><input id="alfaCustomerName" required autocomplete="name">
 <label for="alfaCustomerPhone">PHONE NUMBER *</label><input id="alfaCustomerPhone" required type="tel" autocomplete="tel">
 <label for="alfaCustomerAddress">DELIVERY ADDRESS *</label><textarea id="alfaCustomerAddress" required autocomplete="street-address"></textarea>
 <label for="alfaCustomerNotes">NOTES (OPTIONAL)</label><textarea id="alfaCustomerNotes"></textarea>
 <div id="alfaOrderMessage" aria-live="polite"></div>
 <button id="alfaSubmitOrder" type="submit">PLACE ORDER</button><button id="alfaCancelOrder" type="button">BACK TO BAG</button>
 </form></div>`;
 document.body.appendChild(modal);
 $("alfaCancelOrder").addEventListener("click",()=>modal.classList.remove("show"));
 modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show")});
 $("alfaCheckoutForm").addEventListener("submit",submitAlfaOrder);
}
async function submitAlfaOrder(e){
 e.preventDefault();
 if(!bag.length){alert("Your bag is empty.");return}
 const key=SUPABASE_PUBLISHABLE_KEY.trim();
 const message=$("alfaOrderMessage"),submit=$("alfaSubmitOrder");
 if(!key){message.textContent="Supabase key is missing.";return}
 const customerName=$("alfaCustomerName").value.trim();
 const phone=$("alfaCustomerPhone").value.trim();
 const address=$("alfaCustomerAddress").value.trim();
 const notes=$("alfaCustomerNotes").value.trim();
 if(!customerName||!phone||!address){message.textContent="Please fill in your name, phone number and address.";return}
 const total=bag.reduce((a,x)=>a+x.price*x.qty,0);
 const orderDetails=bag.map(x=>`${x.name} - ${x.color} - Size ${x.size} x${x.qty}`).join(" | ");
 submit.disabled=true;submit.textContent="SENDING...";
 message.textContent="Sending your order...";
 try{
  const supabaseLib=await loadSupabase();
  const client=supabaseLib.createClient(SUPABASE_URL,key);
  const {error}=await client.from("orders").insert([{
   customer_name:customerName,
   phone:phone,
   address:address,
   total:money(total),
   status:"new",
   notes:[notes,orderDetails].filter(Boolean).join(" | ")
  }]);
  if(error)throw error;
  message.textContent="Your order was received successfully. Thank you for choosing ALFA!";
  bag=[];renderBag();
  $("alfaCheckoutForm").reset();
  setTimeout(()=>{$("alfaCheckoutModal").classList.remove("show");closeBag();message.textContent="";},2200);
 }catch(error){
  console.error("ALFA order error:",error);
  message.textContent="We couldn't save your order. Please check your connection or try again. ("+(error.message||"Unknown error")+")";
 }finally{
  submit.disabled=false;submit.textContent="PLACE ORDER";
 }
}
$("checkout").addEventListener("click",()=>{
 if(!bag.length){alert("Your bag is empty.");return}
 createCheckoutModal();
 $("alfaCheckoutModal").classList.add("show");
});

renderProducts();renderBag();
