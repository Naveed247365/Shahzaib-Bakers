document.addEventListener('DOMContentLoaded', function() {
    // Elements with null checks
    const webstoreView = document.getElementById('webstore-view');
    const adminView = document.getElementById('admin-view');
    const loginContainer = document.getElementById('login-container');
    const cartSection = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout');
    const categoryFilter = document.getElementById('category-filter');
    const productsContainer = document.getElementById('products-container');
    const productCategorySelect = document.getElementById('productCategory');
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    const mobileCartButton = document.getElementById('mobile-cart-button');
    const webLogo = webstoreView ? webstoreView.querySelector('.logo') : null;
    const adminLogo = adminView ? adminView.querySelector('.logo') : null;

    // Create backdrop for mobile menu
    const backdrop = document.createElement('div');
    backdrop.className = 'menu-backdrop';
    document.body.appendChild(backdrop);

    // Data storage
    let categories = JSON.parse(localStorage.getItem('shahzaibCategories')) || [
        { id: 1, name: "bread" },
        { id: 2, name: "cakes" },
        { id: 3, name: "pastries" },
        { id: 4, name: "cookies" },
        { id: 5, name: "other" }
    ];

    let products = JSON.parse(localStorage.getItem('shahzaibProducts')) || [
        {
            id: 1,
            name: "Whole Wheat Bread",
            category: "bread",
            price: 200,
            stock: 42,
            image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 2,
            name: "Chocolate Cake",
            category: "cakes",
            price: 850,
            stock: 15,
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 3,
            name: "Butter Croissants",
            category: "pastries",
            price: 120,
            stock: 36,
            image: "https://images.unsplash.com/photo-1555507036-ab794f24d6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 4,
            name: "Assorted Donuts",
            category: "pastries",
            price: 100,
            stock: 0,
            image: "https://images.unsplash.com/photo-1587248720328-4daa08f11b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "out-of-stock"
        }
    ];

    let orders = JSON.parse(localStorage.getItem('shahzaibOrders')) || [
        {
            id: 701,
            customer: "Ali Ahmed",
            products: [
                { id: 1, name: "Whole Wheat Bread", quantity: 2, price: 200 },
                { id: 3, name: "Butter Croissants", quantity: 3, price: 120 }
            ],
            total: 760,
            date: "2023-11-12",
            status: "delivered"
        },
        {
            id: 702,
            customer: "Fatima Khan",
            products: [
                { id: 2, name: "Chocolate Cake", quantity: 1, price: 850 }
            ],
            total: 850,
            date: "2023-11-12",
            status: "processing"
        },
        {
            id: 703,
            customer: "Omar Siddiqui",
            products: [
                { id: 1, name: "Whole Wheat Bread", quantity: 1, price: 200 },
                { id: 2, name: "Chocolate Cake", quantity: 2, price: 850 },
                { id: 3, name: "Butter Croissants", quantity: 4, price: 120 }
            ],
            total: 2150,
            date: "2023-11-11",
            status: "delivered"
        }
    ];

    let customers = JSON.parse(localStorage.getItem('shahzaibCustomers')) || [
        {
            id: 1,
            name: "Ali Ahmed",
            email: "ali.ahmed@example.com",
            phone: "+92 300 1111111",
            orders: 3,
            totalSpent: 2500
        },
        {
            id: 2,
            name: "Fatima Khan",
            email: "fatima.khan@example.com",
            phone: "+92 300 2222222",
            orders: 1,
            totalSpent: 850
        },
        {
            id: 3,
            name: "Omar Siddiqui",
            email: "omar.siddiqui@example.com",
            phone: "+92 300 3333333",
            orders: 5,
            totalSpent: 4200
        }
    ];

    let cart = JSON.parse(localStorage.getItem('shahzaibCart')) || [];

    // Save data to localStorage
    function saveData() {
        localStorage.setItem('shahzaibCategories', JSON.stringify(categories));
        localStorage.setItem('shahzaibProducts', JSON.stringify(products));
        localStorage.setItem('shahzaibOrders', JSON.stringify(orders));
        localStorage.setItem('shahzaibCustomers', JSON.stringify(customers));
        localStorage.setItem('shahzaibCart', JSON.stringify(cart));
    }

    // Update cart count and total
    function updateCartCountAndTotal() {
        if (!cartCount || !mobileCartCount || !cartTotal) return;
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        mobileCartCount.textContent = totalItems;
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `Total: Rs. ${total.toFixed(2)}`;
    }

    // Populate category dropdowns
    function populateCategoryDropdowns() {
        if (!categoryFilter || !productCategorySelect) return;
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        productCategorySelect.innerHTML = '<option value="">Select Category</option>';
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
            categoryFilter.appendChild(option);
            
            const productOption = document.createElement('option');
            productOption.value = category.name;
            productOption.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
            productCategorySelect.appendChild(productOption);
        });
    }

    // Render products in webstore
    function renderProducts() {
        if (!productsContainer) return;
        productsContainer.innerHTML = '';
        const filteredProducts = categoryFilter && categoryFilter.value === 'all' 
            ? products 
            : products.filter(p => p.category === categoryFilter.value);
        
        filteredProducts.forEach(product => {
            if (product.status === 'active') {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">Rs. ${product.price}</p>
                        <button class="cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                        <button class="order-btn" onclick="buyNow(${product.id})">Buy Now</button>
                    </div>
                `;
                productsContainer.appendChild(productCard);
            }
        });
    }

    // Render cart
    function renderCart() {
        if (!cartItems) return;
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <span>${product.name}</span>
                    <span>Price: Rs. ${product.price}</span>
                    <input type="number" value="${item.quantity}" min="1" max="${product.stock}" onchange="updateQuantity(${item.id}, this.value)">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">Remove</button>
                `;
                cartItems.appendChild(cartItem);
            }
        });
        updateCartCountAndTotal();
    }

    // Render categories in admin
    function renderCategories() {
        const categoriesTable = document.getElementById('categories-table');
        if (!categoriesTable) return;
        const tbody = categoriesTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Add to cart
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        if (product && product.stock > 0) {
            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                if (cartItem.quantity < product.stock) {
                    cartItem.quantity++;
                } else {
                    alert('Cannot add more than available stock');
                    return;
                }
            } else {
                cart.push({ id, name: product.name, quantity: 1, price: product.price });
            }
            saveData();
            updateCartCountAndTotal();
            alert(`${product.name} added to cart`);
        } else {
            alert('Product out of stock');
        }
    };

    // Update quantity
    window.updateQuantity = (id, quantity) => {
        const product = products.find(p => p.id === id);
        quantity = parseInt(quantity);
        if (quantity <= 0) {
            removeFromCart(id);
        } else if (quantity > product.stock) {
            alert('Cannot exceed available stock');
            return;
        } else {
            const cartItem = cart.find(item => item.id === id);
            if (cartItem) {
                cartItem.quantity = quantity;
                saveData();
                renderCart();
            }
        }
    };

    // Remove from cart
    window.removeFromCart = (id) => {
        cart = cart.filter(item => item.id !== id);
        saveData();
        renderCart();
    };

    // Buy Now
    window.buyNow = (id) => {
        const product = products.find(p => p.id === id);
        if (product && product.stock > 0) {
            const message = `Order: ${product.name}, Quantity: 1, Price: Rs. ${product.price}`;
            window.open(`https://wa.me/+923452307908?text=${encodeURIComponent(message)}`, '_blank');
            
            // Add to orders
            const order = {
                id: Date.now(),
                customer: "Guest",
                products: [{ id: product.id, name: product.name, quantity: 1, price: product.price }],
                total: product.price,
                date: new Date().toISOString().split('T')[0],
                status: "pending"
            };
            orders.push(order);
            product.stock--;
            saveData();
            renderProducts();
        } else {
            alert('Product out of stock');
        }
    };

    // Checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Cart is empty');
                return;
            }
            let message = 'Order:\n';
            let total = 0;
            const orderProducts = [];
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product && product.stock >= item.quantity) {
                    message += `${item.name}, Quantity: ${item.quantity}, Price: Rs. ${item.price * item.quantity}\n`;
                    total += item.price * item.quantity;
                    orderProducts.push({ id: item.id, name: item.name, quantity: item.quantity, price: item.price });
                    product.stock -= item.quantity;
                }
            });
            message += `Total: Rs. ${total.toFixed(2)}`;
            window.open(`https://wa.me/+923452307908?text=${encodeURIComponent(message)}`, '_blank');
            
            // Add to orders
            const order = {
                id: Date.now(),
                customer: "Guest",
                products: orderProducts,
                total,
                date: new Date().toISOString().split('T')[0],
                status: "pending"
            };
            orders.push(order);
            cart = [];
            saveData();
            renderCart();
            renderProducts();
            if (cartSection) cartSection.style.display = 'none';
            if (productsContainer) productsContainer.style.display = 'grid';
            if (webstoreView) webstoreView.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Modal functionality for products
    window.openModal = () => {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'flex';
            const form = document.getElementById('add-product-form');
            if (form) form.reset();
            const imagePreview = document.getElementById('imagePreview');
            if (imagePreview) imagePreview.innerHTML = '<div class="image-preview-text">Image preview will appear here</div>';
            populateCategoryDropdowns();
        }
    };

    window.closeModal = () => {
        const modal = document.getElementById('productModal');
        if (modal) modal.style.display = 'none';
    };

    // Modal functionality for categories
    window.openCategoryModal = () => {
        const modal = document.getElementById('categoryModal');
        if (modal) {
            modal.style.display = 'flex';
            const form = document.getElementById('add-category-form');
            if (form) form.reset();
        }
    };

    window.closeCategoryModal = () => {
        const modal = document.getElementById('categoryModal');
        if (modal) modal.style.display = 'none';
    };

    // Image preview functionality
    function setupImagePreview() {
        const fileInput = document.getElementById('productImage');
        const previewContainer = document.getElementById('imagePreview');
        if (!fileInput || !previewContainer) return;
        
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                previewContainer.innerHTML = '';
                const previewImage = document.createElement('img');
                previewImage.id = 'previewImage';
                previewContainer.appendChild(previewImage);
                reader.addEventListener('load', function() {
                    previewImage.src = this.result;
                });
                reader.readAsDataURL(file);
            } else {
                previewContainer.innerHTML = '<div class="image-preview-text">Image preview will appear here</div>';
            }
        });
    }

    // Render products in admin
    function renderAdminProducts() {
        const productsTable = document.getElementById('products-table');
        if (!productsTable) return;
        const tbody = productsTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                <td>${product.name}</td>
                <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
                <td>Rs. ${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">${product.status === 'active' ? 'Active' : 'Out of Stock'}</span></td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        const totalProducts = document.getElementById('total-products');
        if (totalProducts) totalProducts.textContent = products.length;
    }

    // Render orders in admin
    function renderOrders() {
        const ordersTable = document.getElementById('orders-table');
        const recentOrdersTable = document.getElementById('recent-orders-table');
        if (!ordersTable || !recentOrdersTable) return;
        
        const ordersTbody = ordersTable.querySelector('tbody');
        const recentOrdersTbody = recentOrdersTable.querySelector('tbody');
        ordersTbody.innerHTML = '';
        recentOrdersTbody.innerHTML = '';
        
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += order.total;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#ORD-${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.products.map(p => p.name).join(', ')}</td>
                <td>Rs. ${order.total}</td>
                <td>${order.date}</td>
                <td><span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'processing' ? 'badge-warning' : 'badge-danger'}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary">View</button>
                </td>
            `;
            ordersTbody.appendChild(row);
        });
        
        const recentOrders = orders.slice(-3).reverse();
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>#ORD-${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>Rs. ${order.total}</td>
                <td><span class="badge ${order.status === 'delivered' ? 'badge-success' : order.status === 'processing' ? 'badge-warning' : 'badge-danger'}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary">View</button>
                </td>
            `;
            recentOrdersTbody.appendChild(row);
        });
        
        const totalOrders = document.getElementById('total-orders');
        const totalRevenueEl = document.getElementById('total-revenue');
        if (totalOrders) totalOrders.textContent = orders.length;
        if (totalRevenueEl) totalRevenueEl.textContent = `Rs. ${totalRevenue}`;
    }

    // Render customers in admin
    function renderCustomers() {
        const customersTable = document.getElementById('customers-table');
        if (!customersTable) return;
        const tbody = customersTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.orders}</td>
                <td>Rs. ${customer.totalSpent}</td>
                <td>
                    <button class="btn btn-sm btn-primary">View</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        const totalCustomers = document.getElementById('total-customers');
        if (totalCustomers) totalCustomers.textContent = customers.length;
    }

    // Add new category
    function addCategory(e) {
        e.preventDefault();
        const categoryNameInput = document.getElementById('categoryName');
        if (!categoryNameInput) return;
        const name = categoryNameInput.value.trim().toLowerCase();
        if (!name) {
            alert('Category name cannot be empty');
            return;
        }
        if (categories.find(c => c.name === name)) {
            alert('Category already exists');
            return;
        }
        const id = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        categories.push({ id, name });
        saveData();
        renderCategories();
        populateCategoryDropdowns();
        closeCategoryModal();
        alert('Category added successfully!');
    }

    // Delete category
    window.deleteCategory = (id) => {
        if (confirm('Are you sure you want to delete this category? Products in this category will be moved to "other".')) {
            const category = categories.find(c => c.id === id);
            if (category) {
                if (category.name === 'other') {
                    alert('Cannot delete the "other" category');
                    return;
                }
                products = products.map(product => 
                    product.category === category.name ? { ...product, category: 'other' } : product
                );
                categories = categories.filter(c => c.id !== id);
                saveData();
                renderCategories();
                renderProducts();
                renderAdminProducts();
                populateCategoryDropdowns();
                alert('Category deleted successfully!');
            }
        }
    };

    // Convert file to base64
    function toBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // Add new product
    async function addProduct(e) {
        e.preventDefault();
        const nameInput = document.getElementById('productName');
        const categoryInput = document.getElementById('productCategory');
        const priceInput = document.getElementById('productPrice');
        const stockInput = document.getElementById('productStock');
        const fileInput = document.getElementById('productImage');

        // Check if all required inputs exist
        if (!nameInput || !categoryInput || !priceInput || !stockInput || !fileInput) {
            alert('Form elements are missing. Please check the form structure.');
            return;
        }

        const name = nameInput.value.trim();
        const category = categoryInput.value;
        const price = parseFloat(priceInput.value);
        const stock = parseInt(stockInput.value);

        // Validate inputs
        if (!name || !category || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
            alert('Please fill in all fields with valid values.');
            return;
        }

        let image = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        if (fileInput.files[0]) {
            try {
                image = await toBase64(fileInput.files[0]);
            } catch (error) {
                alert('Error uploading image');
                return;
            }
        }

        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name,
            category,
            price,
            stock,
            image,
            status: stock > 0 ? 'active' : 'out-of-stock'
        };

        products.push(newProduct);
        saveData();
        renderProducts();
        renderAdminProducts();
        closeModal();
        alert('Product added successfully!');
    }

    // Edit product
    window.editProduct = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            const nameInput = document.getElementById('productName');
            const categoryInput = document.getElementById('productCategory');
            const priceInput = document.getElementById('productPrice');
            const stockInput = document.getElementById('productStock');
            const fileInput = document.getElementById('productImage');
            const imagePreview = document.getElementById('imagePreview');

            // Check if all required inputs exist
            if (!nameInput || !categoryInput || !priceInput || !stockInput || !fileInput || !imagePreview) {
                alert('Form elements are missing. Please check the form structure.');
                return;
            }

            nameInput.value = product.name;
            categoryInput.value = product.category;
            priceInput.value = product.price;
            stockInput.value = product.stock;
            imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
            
            const form = document.getElementById('add-product-form');
            if (form) {
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const name = nameInput.value.trim();
                    const category = categoryInput.value;
                    const price = parseFloat(priceInput.value);
                    const stock = parseInt(stockInput.value);

                    // Validate inputs
                    if (!name || !category || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
                        alert('Please fill in all fields with valid values.');
                        return;
                    }

                    let image = product.image;
                    if (fileInput.files[0]) {
                        try {
                            image = await toBase64(fileInput.files[0]);
                        } catch (error) {
                            alert('Error uploading image');
                            return;
                        }
                    }

                    product.name = name;
                    product.category = category;
                    product.price = price;
                    product.stock = stock;
                    product.image = image;
                    product.status = stock > 0 ? 'active' : 'out-of-stock';

                    saveData();
                    renderProducts();
                    renderAdminProducts();
                    closeModal();
                    alert('Product updated successfully!');
                    form.onsubmit = addProduct; // Reset form submission
                };
            }
            openModal();
        }
    };

    // Delete product
    window.deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            cart = cart.filter(item => item.id !== id);
            saveData();
            renderProducts();
            renderAdminProducts();
            renderCart();
            alert('Product deleted successfully!');
        }
    };

    // Navigation handling
    function handleNavigation(sectionId) {
        const sections = ['home', 'products', 'about', 'contact', 'cart'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.style.display = section === sectionId ? 'block' : 'none';
            }
        });
        if (sectionId === 'products' && productsContainer) {
            productsContainer.style.display = 'grid';
            renderProducts();
        }
        if (sectionId === 'cart' && cartSection) {
            renderCart();
        }
        if (webstoreView) webstoreView.scrollIntoView({ behavior: 'smooth' });
    }

    // Admin navigation
    function handleAdminNavigation(sectionId) {
        const sections = ['dashboard', 'products', 'orders', 'customers', 'categories', 'settings'];
        sections.forEach(section => {
            const element = document.getElementById(`${section}-section`);
            if (element) {
                element.classList.toggle('active', section === sectionId);
            }
        });
        const menuItems = document.querySelectorAll('.sidebar-menu li');
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                item.classList.toggle('menu-active', link.dataset.section === sectionId);
            }
        });
    }

    // Toggle mobile menu
    function toggleMenu() {
        if (!navUl || !menuToggle) return;
        navUl.classList.toggle('active');
        backdrop.classList.toggle('active');
        const isActive = navUl.classList.contains('active');
        menuToggle.innerHTML = `<i class="fas fa-${isActive ? 'times' : 'bars'}"></i>`;
    }

    // Close menu when clicking a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            handleNavigation(sectionId);
            if (navUl && navUl.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Menu toggle event
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    // Backdrop click to close menu
    backdrop.addEventListener('click', () => {
        if (navUl && navUl.classList.contains('active')) {
            toggleMenu();
        }
    });

    // Admin login
    const showLogin = document.getElementById('show-login');
    const showLoginMobile = document.getElementById('show-login-mobile');
    if (showLogin) {
        showLogin.addEventListener('click', () => {
            if (loginContainer && webstoreView) {
                loginContainer.style.display = 'flex';
                webstoreView.style.display = 'none';
            }
        });
    }
    if (showLoginMobile) {
        showLoginMobile.addEventListener('click', () => {
            if (loginContainer && webstoreView && navUl) {
                loginContainer.style.display = 'flex';
                webstoreView.style.display = 'none';
                if (navUl.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username');
            const password = document.getElementById('password');
            if (!username || !password) return;
            if (username.value === 'admin' && password.value === 'admin123') {
                if (loginContainer && adminView && webstoreView) {
                    loginContainer.style.display = 'none';
                    adminView.style.display = 'flex';
                    webstoreView.style.display = 'none';
                    handleAdminNavigation('dashboard');
                    renderAdminProducts();
                    renderOrders();
                    renderCustomers();
                    renderCategories();
                }
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Back to store
    const backToStore = document.getElementById('back-to-store');
    const backToStoreFromLogin = document.getElementById('back-to-store-from-login');
    if (backToStore) {
        backToStore.addEventListener('click', () => {
            if (adminView && webstoreView) {
                adminView.style.display = 'none';
                webstoreView.style.display = 'block';
                handleNavigation('home');
                renderProducts();
            }
        });
    }
    if (backToStoreFromLogin) {
        backToStoreFromLogin.addEventListener('click', () => {
            if (loginContainer && webstoreView) {
                loginContainer.style.display = 'none';
                webstoreView.style.display = 'block';
                handleNavigation('home');
                renderProducts();
            }
        });
    }

    // Admin logout
    const adminLogout = document.getElementById('admin-logout');
    if (adminLogout) {
        adminLogout.addEventListener('click', () => {
            if (adminView && webstoreView) {
                adminView.style.display = 'none';
                webstoreView.style.display = 'block';
                handleNavigation('home');
                renderProducts();
            }
        });
    }

    // Admin navigation
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            if (section) handleAdminNavigation(section);
        });
    });

    // Admin dashboard link
    const adminDashboardLink = document.getElementById('admin-dashboard-link');
    if (adminDashboardLink) {
        adminDashboardLink.addEventListener('click', () => {
            handleAdminNavigation('dashboard');
        });
    }

    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', renderProducts);
    }

    // Form submissions
    const addProductForm = document.getElementById('add-product-form');
    const addCategoryForm = document.getElementById('add-category-form');
    if (addProductForm) addProductForm.addEventListener('submit', addProduct);
    if (addCategoryForm) addCategoryForm.addEventListener('submit', addCategory);

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    }

    // Logo click to home
    if (webLogo) {
        webLogo.addEventListener('click', () => {
            handleNavigation('home');
            renderProducts();
        });
    }
    if (adminLogo) {
        adminLogo.addEventListener('click', () => {
            handleAdminNavigation('dashboard');
        });
    }

    // Initialize
    setupImagePreview();
    populateCategoryDropdowns();
    renderProducts();
    renderCart();
    renderAdminProducts();
    renderOrders();
    renderCustomers();
    renderCategories();
    updateCartCountAndTotal();
});