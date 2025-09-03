document.addEventListener('DOMContentLoaded', function() {
    // Elements
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
            description: "Freshly baked whole wheat bread, perfect for health-conscious families.",
            image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 2,
            name: "Chocolate Cake",
            category: "cakes",
            price: 850,
            stock: 15,
            description: "Rich, moist chocolate cake with layers of chocolate frosting.",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 3,
            name: "Butter Croissants",
            category: "pastries",
            price: 120,
            stock: 36,
            description: "Flaky, buttery croissants made with pure butter and traditional techniques.",
            image: "https://images.unsplash.com/photo-1555507036-ab794f24d6c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "active"
        },
        {
            id: 4,
            name: "Assorted Donuts",
            category: "pastries",
            price: 100,
            stock: 0,
            description: "Soft, fluffy donuts with various toppings and fillings.",
            image: "https://images.unsplash.com/photo-1587248720328-4daa08f11b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            status: "out-of-stock"
        }
    ];

    let orders = JSON.parse(localStorage.getItem('shahzaibOrders')) || [
        {
            id: 701,
            customer: "Asad Ansari",
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
            customer: "Faisal Khan",
            products: [
                { id: 2, name: "Chocolate Cake", quantity: 1, price: 850 }
            ],
            total: 850,
            date: "2023-11-12",
            status: "processing"
        },
        {
            id: 703,
            customer: "Naveed qureshi",
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
            name: "Asad Ansari",
            email: "asad.ansari@example.com",
            phone: "+92 345 6010698 ",
            orders: 3,
            totalSpent: 2500
        },
        {
            id: 2,
            name: "Faisal Khan",
            email: "faisal.khan@example.com",
            phone: "+92 345 5536699",
            orders: 1,
            totalSpent: 850
        },
        {
            id: 3,
            name: "Naveed Qureshi",
            email: "qureshinaveed21@gmail.com",
            phone: "+92 300 3627458",
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
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.textContent = `Total: Rs. ${total.toFixed(2)}`;
    }

    // Populate category dropdowns
    function populateCategoryDropdowns() {
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
        productsContainer.innerHTML = '';
        const filteredProducts = categoryFilter.value === 'all' 
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
                        <p class="product-description">${product.description}</p>
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
        const categoriesTable = document.getElementById('categories-table').querySelector('tbody');
        categoriesTable.innerHTML = '';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name.charAt(0).toUpperCase() + category.name.slice(1)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
                </td>
            `;
            categoriesTable.appendChild(row);
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
        cartSection.style.display = 'none';
        productsContainer.style.display = 'grid';
        webstoreView.scrollIntoView({ behavior: 'smooth' });
    });

    // Modal functionality for products
    window.openModal = () => {
        document.getElementById('productModal').style.display = 'flex';
        document.getElementById('add-product-form').reset();
        document.getElementById('imagePreview').innerHTML = '<div class="image-preview-text">Image preview will appear here</div>';
        populateCategoryDropdowns();
    };

    window.closeModal = () => {
        document.getElementById('productModal').style.display = 'none';
    };

    // Modal functionality for categories
    window.openCategoryModal = () => {
        document.getElementById('categoryModal').style.display = 'flex';
        document.getElementById('add-category-form').reset();
    };

    window.closeCategoryModal = () => {
        document.getElementById('categoryModal').style.display = 'none';
    };

    // Image preview functionality
    function setupImagePreview() {
        const fileInput = document.getElementById('productImage');
        const previewContainer = document.getElementById('imagePreview');
        
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
        const productsTable = document.getElementById('products-table').querySelector('tbody');
        productsTable.innerHTML = '';
        
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
            productsTable.appendChild(row);
        });
        
        document.getElementById('total-products').textContent = products.length;
    }

    // Render orders in admin
    function renderOrders() {
        const ordersTable = document.getElementById('orders-table').querySelector('tbody');
        const recentOrdersTable = document.getElementById('recent-orders-table').querySelector('tbody');
        
        ordersTable.innerHTML = '';
        recentOrdersTable.innerHTML = '';
        
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
            ordersTable.appendChild(row);
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
            recentOrdersTable.appendChild(row);
        });
        
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('total-revenue').textContent = `Rs. ${totalRevenue}`;
    }

    // Render customers in admin
    function renderCustomers() {
        const customersTable = document.getElementById('customers-table').querySelector('tbody');
        customersTable.innerHTML = '';
        
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
            customersTable.appendChild(row);
        });
        
        document.getElementById('total-customers').textContent = customers.length;
    }

    // Add new category
    function addCategory(e) {
        e.preventDefault();
        const name = document.getElementById('categoryName').value.trim().toLowerCase();
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
                // Move products to "other" category
                products = products.map(product => 
                    product.category === category.name ? { ...product, category: 'other' } : product
                );
                // Prevent deletion of "other" category
                if (category.name === 'other') {
                    alert('Cannot delete the "other" category');
                    return;
                }
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

    // Add new product
    async function addProduct(e) {
        e.preventDefault();
        const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const name = document.getElementById('productName').value;
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const description = document.getElementById('productDescription').value;
        const imageFile = document.getElementById('productImage').files[0];

        if (!categories.find(c => c.name === category)) {
            alert('Invalid category selected');
            return;
        }

        let imagePath = '';
        if (imageFile) {
            try {
                const response = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: await toBase64(imageFile),
                        fileName: `product-${id}.jpg`
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                if (result.status === 'success') {
                    imagePath = result.path;
                } else {
                    alert('Image upload failed');
                    return;
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Image upload failed');
                return;
            }
        } else {
            imagePath = 'https://images.unsplash.com/photo-1551966775-a4ddc8df052b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        }

        const newProduct = { id, name, category, price, stock, description, image: imagePath, status: 'active' };
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
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productStock').value = product.stock;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('imagePreview').innerHTML = `<img src="${product.image}" alt="${product.name}">`;
            populateCategoryDropdowns();
            document.getElementById('add-product-form').onsubmit = async (e) => {
                e.preventDefault();
                const updatedCategory = document.getElementById('productCategory').value;
                if (!categories.find(c => c.name === updatedCategory)) {
                    alert('Invalid category selected');
                    return;
                }
                const updatedProduct = {
                    id,
                    name: document.getElementById('productName').value,
                    category: updatedCategory,
                    price: parseFloat(document.getElementById('productPrice').value),
                    stock: parseInt(document.getElementById('productStock').value),
                    description: document.getElementById('productDescription').value,
                    image: product.image,
                    status: product.status
                };
                const imageFile = document.getElementById('productImage').files[0];
                if (imageFile) {
                    try {
                        const response = await fetch('/api/upload-image', {
                            method: 'POST',
                            body: JSON.stringify({
                                image: await toBase64(imageFile),
                                fileName: `product-${id}.jpg`
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const result = await response.json();
                        if (result.status === 'success') {
                            updatedProduct.image = result.path;
                        } else {
                            alert('Image upload failed');
                            return;
                        }
                    } catch (error) {
                        console.error('Error uploading image:', error);
                        alert('Image upload failed');
                        return;
                    }
                }
                products = products.map(p => p.id === id ? updatedProduct : p);
                saveData();
                renderProducts();
                renderAdminProducts();
                closeModal();
                alert('Product updated successfully!');
            };
            openModal();
        }
    };

    // Delete product
    window.deleteProduct = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(product => product.id !== id);
            saveData();
            renderProducts();
            renderAdminProducts();
            alert('Product deleted successfully!');
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

    // Navigation handling
    function handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetId === 'cart') {
            cartSection.style.display = 'block';
            productsContainer.style.display = 'none';
            renderCart();
        } else {
            cartSection.style.display = 'none';
            productsContainer.style.display = 'grid';
            renderProducts();
        }

        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Add event listeners to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Login and View Management
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'flex';
        webstoreView.style.display = 'block';
        adminView.style.display = 'none';
        cartSection.style.display = 'none';
        productsContainer.style.display = 'grid';
    });

    document.getElementById('back-to-store-from-login').addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        webstoreView.style.display = 'block';
        adminView.style.display = 'none';
        cartSection.style.display = 'none';
        productsContainer.style.display = 'grid';
    });

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === 'admin' && password === 'admin786') {
            loginContainer.style.display = 'none';
            webstoreView.style.display = 'none';
            adminView.style.display = 'flex';
            cartSection.style.display = 'none';
            productsContainer.style.display = 'grid';
            renderAdminProducts();
            renderOrders();
            renderCustomers();
            renderCategories();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    document.getElementById('admin-logout').addEventListener('click', (e) => {
        e.preventDefault();
        adminView.style.display = 'none';
        webstoreView.style.display = 'block';
        cartSection.style.display = 'none';
        productsContainer.style.display = 'grid';
        renderProducts();
    });

    document.getElementById('back-to-store').addEventListener('click', (e) => {
        e.preventDefault();
        adminView.style.display = 'none';
        webstoreView.style.display = 'block';
        cartSection.style.display = 'none';
        productsContainer.style.display = 'grid';
        renderProducts();
    });

    // Admin navigation
    const navLinks = document.querySelectorAll('.sidebar-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section') + '-section';
            navLinks.forEach(l => l.parentElement.classList.remove('menu-active'));
            link.parentElement.classList.add('menu-active');
            document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
        });
    });

    // Category filter change
    categoryFilter.addEventListener('change', renderProducts);

    // Form submissions
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
    document.getElementById('add-category-form').addEventListener('submit', addCategory);

    // Settings form
    document.getElementById('settings-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Settings saved successfully!');
    });

    // Initialize
    renderProducts();
    renderCart();
    renderAdminProducts();
    renderOrders();
    renderCustomers();
    renderCategories();
    populateCategoryDropdowns();
    setupImagePreview();
});