// Variáveis globais
let cart = JSON.parse(localStorage.getItem('cart')) || [];
// A variável 'allProducts' é inicializada no ficheiro index.ejs (injetada pelo servidor).

// --- FUNÇÕES DE MÁSCARAS ---
function maskCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length > 14) cnpj = cnpj.slice(0, 14);
    
    if (cnpj.length <= 2) return cnpj;
    if (cnpj.length <= 5) return cnpj.replace(/(\d{2})(\d+)/, '$1.$2');
    if (cnpj.length <= 8) return cnpj.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2.$3');
    if (cnpj.length <= 12) return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/, '$1.$2.$3/$4-$5');
}

function setupCNPJMask(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', function() {
        this.value = maskCNPJ(this.value);
    });
    
    input.addEventListener('blur', function() {
        const clean = this.value.replace(/\D/g, '');
        if (clean.length !== 14 && clean.length > 0) {
            this.classList.add('invalid');
        } else {
            this.classList.remove('invalid');
        }
    });
}

// --- FUNÇÕES DE AUTENTICAÇÃO E MODAIS ---
function openAuthModal() { 
    document.getElementById('authModal').style.display = 'flex';
    // Setup CNPJ masks when modal opens
    setupCNPJMask('loginCnpj');
    setupCNPJMask('adminRegisterCnpj');
}
function closeAuthModal() { document.getElementById('authModal').style.display = 'none'; }

function switchTab(tabName){
    document.querySelectorAll('.auth-tab').forEach(t=>t.classList.remove('active'));
    // Encontra o botão pelo atributo e adiciona a classe 'active'
    const buttonToActivate = document.querySelector(`.auth-tab[onclick="switchTab('${tabName}')"]`);
    if(buttonToActivate) buttonToActivate.classList.add('active');

    document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
    document.getElementById(tabName === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
}

function togglePassword(inputId){
    const i = document.getElementById(inputId);
    i.type = i.type === 'password' ? 'text' : 'password';
}

// --- LÓGICA DE PRODUTOS E FILTROS ---
function filterProducts(category, btn) {
    // Remove active from all filter buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // If a button was passed (clicked), mark it active. Otherwise try to find by data-slug
    if (btn && btn.classList) {
        btn.classList.add('active');
    } else {
        const found = document.querySelector(`.filter-btn[data-slug="${category}"]`);
        if (found) found.classList.add('active');
    }

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'todos' || card.dataset.category === category) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// --- LÓGICA DO CARRINHO ---
function addToCart(event, productId, btn) {
    // CORREÇÃO: Impede que o clique se propague para o elemento pai (o card).
    if (event) {
        event.stopPropagation();
    }

    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Notifica outras partes da página (ex: About) que o carrinho foi atualizado
    try {
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: cart.reduce((t,i)=>t+i.quantity,0) } }));
    } catch (e) {
        // fall back silently
    }

    if(btn) {
        btn.disabled = true;
        btn.textContent = 'Adicionado!';
        btn.style.background = '#2e7d32';
        setTimeout(() => {
            btn.disabled = false;
            // CORREÇÃO: O texto original do botão no modal é "Adicionar ao Carrinho"
            btn.textContent = btn.classList.contains('modal-add-to-cart') ? 'Adicionar ao Carrinho' : 'Adicionar';
            btn.style.background = '';
        }, 1200);
    }
}


function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (count > 0) {
        cartCountEl.textContent = count;
        cartCountEl.style.display = 'flex';
    } else {
        cartCountEl.style.display = 'none';
    }
}

function openCart() {
    const modal = document.getElementById('cartModal');
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    let total = 0;

    itemsEl.innerHTML = ''; 
    if (cart.length === 0) {
        itemsEl.innerHTML = '<p style="text-align:center; padding: 20px; color: #666;">O seu carrinho está vazio</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = Number(item.preco) * item.quantity;
            total += itemTotal;
            itemsEl.innerHTML += `
                <div class="cart-item">
                    <div><strong>${item.nome}</strong><br><small>Qtd: ${item.quantity}</small></div>
                    <strong>R$ ${itemTotal.toFixed(2).replace('.', ',')}</strong>
                </div>`;
        });
    }

    totalEl.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
    modal.style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('O seu carrinho está vazio!');
        return;
    }
    window.location.href = '/checkout';
}

// --- LÓGICA DE LOGIN E UI ---
function updateUserUI(user) {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');

    if (user && user.nome) {
        if(loginBtn) loginBtn.style.display = 'none';
        if(userMenu) {
            userMenu.style.display = 'block';
            userMenu.querySelector('#userAvatar').textContent = user.nome.charAt(0).toUpperCase();
        }
    } else {
        if(loginBtn) loginBtn.style.display = 'block';
        if(userMenu) userMenu.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('user');
    updateUserUI(null);
    window.location.reload();
}

function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function showProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
        window.location.href = `/usuario/${user.id}`;
    } else {
        alert('Faça login para ver seu perfil.');
        openAuthModal();
    }
}

function showOrders() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
        window.location.href = `/pedido/meus-pedidos/${user.id}`;
    } else {
        alert('Faça login para ver os seus pedidos.');
        openAuthModal();
    }
}

// --- LÓGICA DO MODAL DE DETALHES DO PRODUTO ---
function showProductDetails(product) {
    const modal = document.getElementById('productDetailModal');
    const content = document.getElementById('modalProductContent');
    const formattedPrice = `R$ ${Number(product.preco).toFixed(2).replace('.', ',')}`;

    content.innerHTML = `
        <img src="/images/uploads/${product.imagem || '../default-plate.jpg'}" 
             alt="${product.nome}" 
             class="modal-product-image"
             onerror="this.onerror=null; this.src='/images/default-plate.jpg';">
        <div class="modal-product-info">
            <h2 class="modal-product-name">${product.emoji || '🍲'} ${product.nome}</h2>
            <p class="modal-product-description">${product.descricao}</p>
            <div class="modal-product-footer">
                <span class="modal-product-price">${formattedPrice}</span>
                <button class="modal-add-to-cart" onclick="addToCart(event, ${product.id}, this)">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

function closeProductModal() {
    document.getElementById('productDetailModal').style.display = 'none';
}

// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    const loggedUser = JSON.parse(localStorage.getItem('user'));
    updateUserUI(loggedUser);

    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginPassword').value;

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.usuario));
                updateUserUI(data.usuario);
                closeAuthModal();
            } else {
                alert(data.message);
            }
        });
    }

    const registerForm = document.getElementById('registerForm');
    if(registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const telefone = document.getElementById('registerPhone').value;
            const cnpj = document.getElementById('registerCnpj') ? document.getElementById('registerCnpj').value : '';
            const senha = document.getElementById('registerPassword').value;
            const confirmSenha = document.getElementById('confirmPassword').value;

            if (senha !== confirmSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, telefone, senha, cnpj })
            });

            const data = await response.json();
            if (data.success) {
                alert('Cadastro realizado com sucesso! Faça o login.');
                switchTab('login');
            } else {
                alert(data.message);
            }
        });
    }

    // If server injected an initialCategoria variable, apply the filter on load
    try {
        if (typeof initialCategoria !== 'undefined' && initialCategoria) {
            // small timeout to allow DOM to render product cards
            setTimeout(() => {
                filterProducts(initialCategoria);
                // If category was specified (not 'todos'), scroll to products
                if (initialCategoria && initialCategoria !== 'todos') {
                    const productsSection = document.getElementById('produtos');
                    if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 120);
        }
    } catch (e) {
        // no-op
    }
});

// Fecha modais ao clicar no fundo
window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
        closeCart();
        closeAuthModal();
        closeProductModal();
    }
});