if (sessionStorage.getItem('technocellAdminAuth') !== 'ok') location.replace('login.html');

const defaultServices = [
  {id:crypto.randomUUID(), equipment:'Celular', name:'Troca de tela', price:350},
  {id:crypto.randomUUID(), equipment:'Celular', name:'Troca de bateria', price:180},
  {id:crypto.randomUUID(), equipment:'Celular', name:'Conector de carga', price:220},
  {id:crypto.randomUUID(), equipment:'Celular', name:'Atualização de software', price:120},
  {id:crypto.randomUUID(), equipment:'Celular', name:'Outro reparo', price:150},
  {id:crypto.randomUUID(), equipment:'Notebook', name:'Formatação e Windows', price:180},
  {id:crypto.randomUUID(), equipment:'Notebook', name:'Limpeza interna', price:140},
  {id:crypto.randomUUID(), equipment:'Notebook', name:'Upgrade SSD', price:120},
  {id:crypto.randomUUID(), equipment:'Notebook', name:'Troca de tela', price:250},
  {id:crypto.randomUUID(), equipment:'Notebook', name:'Outro reparo', price:160},
  {id:crypto.randomUUID(), equipment:'Desktop', name:'Formatação e Windows', price:180},
  {id:crypto.randomUUID(), equipment:'Desktop', name:'Limpeza interna', price:130},
  {id:crypto.randomUUID(), equipment:'Desktop', name:'Montagem', price:250},
  {id:crypto.randomUUID(), equipment:'Desktop', name:'Upgrade de hardware', price:150},
  {id:crypto.randomUUID(), equipment:'Desktop', name:'Outro reparo', price:160}
];
const defaultStock = [
  {id:crypto.randomUUID(), name:'Tela universal', category:'Celular', quantity:2, cost:180},
  {id:crypto.randomUUID(), name:'Bateria smartphone', category:'Celular', quantity:4, cost:75},
  {id:crypto.randomUUID(), name:'SSD 480 GB', category:'Notebook', quantity:3, cost:190}
];

const read = (key, fallback) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return Array.isArray(value) ? value : fallback; }
  catch { return fallback; }
};
let services = read('technocellServices', defaultServices);
let stock = read('technocellStock', defaultStock);
if (!localStorage.getItem('technocellServices')) localStorage.setItem('technocellServices', JSON.stringify(services));
if (!localStorage.getItem('technocellStock')) localStorage.setItem('technocellStock', JSON.stringify(stock));
const money = value => Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const save = () => { localStorage.setItem('technocellServices', JSON.stringify(services)); localStorage.setItem('technocellStock', JSON.stringify(stock)); renderAll(); };

function renderServices(){
  document.getElementById('serviceTableBody').innerHTML = services.map(item => `<tr><td>${item.equipment}</td><td>${item.name}</td><td>${money(item.price)}</td><td><button class="table-action" data-edit-service="${item.id}">Editar</button><button class="table-action danger" data-delete-service="${item.id}">Excluir</button></td></tr>`).join('');
}
function renderStock(){
  document.getElementById('stockTableBody').innerHTML = stock.map(item => `<tr><td>${item.name}</td><td>${item.category}</td><td><span class="stock-pill ${item.quantity<=2?'low':''}">${item.quantity}</span></td><td>${money(item.cost)}</td><td><button class="table-action" data-edit-stock="${item.id}">Editar</button><button class="table-action danger" data-delete-stock="${item.id}">Excluir</button></td></tr>`).join('');
}
function renderOverview(){
  document.getElementById('serviceCount').textContent = services.length;
  document.getElementById('stockCount').textContent = stock.reduce((sum,item)=>sum+Number(item.quantity),0);
  document.getElementById('stockValue').textContent = money(stock.reduce((sum,item)=>sum+(Number(item.quantity)*Number(item.cost)),0));
  const low = stock.filter(item=>Number(item.quantity)<=2);
  document.getElementById('lowStockCount').textContent = low.length;
  document.getElementById('lowStockList').innerHTML = low.length ? low.map(item=>`<div><span>${item.name}</span><strong>${item.quantity} unidade(s)</strong></div>`).join('') : '<p>Nenhum item com estoque baixo.</p>';
}
function renderAll(){renderServices();renderStock();renderOverview();}

const serviceDialog = document.getElementById('serviceDialog');
const stockDialog = document.getElementById('stockDialog');
document.getElementById('newServiceBtn').onclick=()=>{document.getElementById('serviceForm').reset();document.getElementById('serviceId').value='';document.getElementById('serviceDialogTitle').textContent='Adicionar serviço';serviceDialog.showModal();};
document.getElementById('newStockBtn').onclick=()=>{document.getElementById('stockForm').reset();document.getElementById('stockId').value='';document.getElementById('stockDialogTitle').textContent='Adicionar item';stockDialog.showModal();};
document.querySelectorAll('[data-close]').forEach(btn=>btn.onclick=()=>document.getElementById(btn.dataset.close).close());

document.getElementById('serviceForm').addEventListener('submit',()=>{
  const id=document.getElementById('serviceId').value;
  const item={id:id||crypto.randomUUID(),equipment:document.getElementById('serviceEquipment').value,name:document.getElementById('serviceName').value.trim(),price:Number(document.getElementById('servicePrice').value)};
  services=id?services.map(service=>service.id===id?item:service):[...services,item];save();
});
document.getElementById('stockForm').addEventListener('submit',()=>{
  const id=document.getElementById('stockId').value;
  const item={id:id||crypto.randomUUID(),name:document.getElementById('stockName').value.trim(),category:document.getElementById('stockCategory').value,quantity:Number(document.getElementById('stockQuantity').value),cost:Number(document.getElementById('stockCost').value)};
  stock=id?stock.map(stockItem=>stockItem.id===id?item:stockItem):[...stock,item];save();
});

document.addEventListener('click',(event)=>{
  const editService=event.target.dataset.editService, deleteService=event.target.dataset.deleteService, editStock=event.target.dataset.editStock, deleteStock=event.target.dataset.deleteStock;
  if(editService){const item=services.find(service=>service.id===editService);document.getElementById('serviceId').value=item.id;document.getElementById('serviceEquipment').value=item.equipment;document.getElementById('serviceName').value=item.name;document.getElementById('servicePrice').value=item.price;document.getElementById('serviceDialogTitle').textContent='Editar serviço';serviceDialog.showModal();}
  if(deleteService&&confirm('Excluir este serviço?')){services=services.filter(item=>item.id!==deleteService);save();}
  if(editStock){const item=stock.find(stockItem=>stockItem.id===editStock);document.getElementById('stockId').value=item.id;document.getElementById('stockName').value=item.name;document.getElementById('stockCategory').value=item.category;document.getElementById('stockQuantity').value=item.quantity;document.getElementById('stockCost').value=item.cost;document.getElementById('stockDialogTitle').textContent='Editar item';stockDialog.showModal();}
  if(deleteStock&&confirm('Excluir este item?')){stock=stock.filter(item=>item.id!==deleteStock);save();}
});

document.querySelectorAll('.admin-nav').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.admin-nav').forEach(item=>item.classList.remove('active'));button.classList.add('active');document.querySelectorAll('.admin-section').forEach(section=>section.classList.remove('active'));document.getElementById(button.dataset.section).classList.add('active');document.getElementById('sectionTitle').textContent=button.textContent;}));
document.getElementById('logoutBtn').onclick=()=>{sessionStorage.removeItem('technocellAdminAuth');location.href='login.html';};
renderAll();
