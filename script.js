const menu = {
    hamburgers: [
        { name: "Classic Burger", description: "Hambúrguer clássico com alface, tomate e queijo.", price: 11.99,image:'./image/img_01.jpg' },
        { name: "Cheese Burger", description: "Hambúrguer com queijo, alface e tomate.", price: 15.99,image:'./image/img_02.jpg' },
        { name: "Baita Burgão da Casa", description: "Hambúrguer com bacon, queijo, alface e tomate.", price: 19.99,image:'./image/img_03.jpg' }
    ],
    savories: [
        { name: "Coxinha", description: "Coxinha de frango com catupiry.", price: 5.00,image:'./image/img_04.jpg' },
        { name: "Pastel", description: "Pastel de carne, queijo ou frango.", price: 8.00,image:'./image/img_06.jpg' },
        { name: "Kibe", description: "Kibe recheado com carne.", price: 4.00,image:'./image/img_05.jpg' }
    ],
    drinks: [
        { name: "Coca-Cola 1L", description: "Refrigerante Coca-Cola.", price: 6.00,image:'./image/img_07.jpg' },
        { name: "Sprite 1L", description: "Refrigerante Sprite.", price: 5.00,image:'./image/img_08.jpg' },
        { name: "Água Mineral 500ML", description: "Água mineral.", price: 2.50,image:'./image/img_09.jpg' }
    ]
};

const cart = [];
function choosedCategory(){
    document.querySelectorAll('.btn').forEach(e=>{
       
        e.addEventListener('click',item=>{
            document.querySelectorAll('.btn').forEach(e=>{e.classList.remove('active');  e.style.backgroundColor = 'yellow'; e.style.color = "black"});
            e.style.backgroundColor = '#b38900';
            e.style.color = '#fff';
            e.classList.add('active')
            console.log(item.target.innerText)
        
        })
        
    })
}
choosedCategory()
function showCategory(category) {
    const menuItemsDiv = document.getElementById('menu-items');
    menuItemsDiv.innerHTML = '';

    if (menu[category]) {
        menu[category].forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <div>
                    <img src=${item.image} alt="Hamburguer"/>

                    <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.description}</small><br>
                    <span>R$${item.price.toFixed(2)}</span>
                    </div>
                    
                </div>
                <div>
                    <input type="checkbox" id="item-${category}-${index}" onchange="toggleItem('${category}', ${index}, this)">
                    <label for="item-${category}-${index}">Selec.</label>
                    <input type="number" id="quantity-${category}-${index}" min="1" style="width: 30px;">
                </div>
            `;
            menuItemsDiv.appendChild(menuItem);
        });
    }
}

function toggleItem(category, index, checkbox) {
    
    const quantityInput = document.getElementById(`quantity-${category}-${index}`);


    if(!quantityInput.value||quantityInput.value == 0 ){
        alert(" Informe um valor válido\nAntes de selecior o item !");
        checkbox.checked = false
        return
    }
    if (checkbox.checked) {
        quantityInput.disabled = false;
        const item = menu[category][index];
        cart.push({ ...item, category, index, quantity: Number(quantityInput.value) });
        quantityInput.disabled = true;
    } else {
        quantityInput.disabled = false;
        quantityInput.value = 0;
        const cartIndex = cart.findIndex(cartItem => cartItem.category === category && cartItem.index === index);
        cart.splice(cartIndex, 1);
    }
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong> - R$${item.price.toFixed(2)} x ${item.quantity}
            </div>
            <div>
                <button onclick="changeQuantity('${item.category}', ${item.index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${item.category}', ${item.index}, 1)">+</button>
            </div>
        `;
        cartItemsDiv.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    cartTotalDiv.innerText = `Total: R$${total.toFixed(2)}`;
}

function changeQuantity(category, index, change) {
    const cartIndex = cart.findIndex(item => item.category === category && item.index === index);
    cart[cartIndex].quantity += change;

    if (cart[cartIndex].quantity === 0) {
        cart.splice(cartIndex, 1);
        document.getElementById(`item-${category}-${index}`).checked = false;
        document.getElementById(`quantity-${category}-${index}`).disabled = true;
        document.getElementById(`quantity-${category}-${index}`).value = 1;
    }

    updateCart();
}

function finalizeOrder() {
    if(!cart.length){
        alert("Realize um pedido !");
        return
    }
    document.querySelector('.cart-container').style.display = "none"
    document.getElementById('order-form').classList.remove('hidden');
    const orderSummaryDiv = document.getElementById('order-summary');
    orderSummaryDiv.innerHTML = '';

    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <strong>${item.name}</strong> - R$${item.price.toFixed(2)} x ${item.quantity}
        `;
        orderSummaryDiv.appendChild(orderItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderTotal = document.createElement('div');
    
    orderTotal.className = 'order-total';
    orderTotal.innerHTML = `Total do Pedido: R$${total.toFixed(2)}`;
    orderSummaryDiv.appendChild(orderTotal);
}

function confirmOrder() {
    const paymentMethod = document.getElementById('payment-method').value;
    const customerName = document.getElementById('customer-name').value;
    const address = document.getElementById('address').value;

    if (paymentMethod && customerName && address) {
        alert(`Pedido confirmado!\n\nNome: ${customerName}\nEndereço: ${address}\nMétodo de Pagamento: ${paymentMethod}`);
        
        document.querySelector('.cart-container').style.display = "block"
        resetOrder();
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function cancelOrder() {
    if (confirm('Deseja realmente cancelar o pedido?')) {
        resetOrder();
        document.querySelector('.cart-container').style.display = "block"
    }
}

function resetOrder() {
    cart.length = 0;
    updateCart();
  
    document.getElementById('order-form').classList.add('hidden')
    document.getElementById('order-form').classList.add('hidden');
    document.getElementById('orderDetails').reset();
    document.getElementById('menu-items').innerHTML = '';
}
