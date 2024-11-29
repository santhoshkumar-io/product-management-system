document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Screwdriver', price: 10.5, discountedPrice: null },
    { id: 2, name: 'Hammer', price: 12.75, discountedPrice: null },
    { id: 3, name: 'Wrench', price: 15.0, discountedPrice: null },
    { id: 44, name: 'Screwdriver', price: 10.5, discountedPrice: null },
    { id: 33, name: 'Hammer', price: 12.75, discountedPrice: null },
    { id: 55, name: 'Wrench', price: 15.0, discountedPrice: null },
  ];

  const addProductBtn = document.querySelector('#add-product');
  const updateProductBtn = document.querySelector('#update-product');
  const viewProductsBtn = document.querySelector('#view-products');
  const applyDiscountBtn = document.querySelector('#apply-discount');

  const idInput = document.querySelector('#id');
  const nameInput = document.querySelector('#name');
  const priceInput = document.querySelector('#price');
  const discountInput = document.querySelector('#discount');

  const productsTableBody = document.querySelector('#products-table tbody');
  const productsSection = document.querySelector('#products-section');
  const discountedProductsSection = document.querySelector(
    '#discounted-products-section'
  );
  const discountedProductsTableBody = document.querySelector(
    '#discounted-products-table tbody'
  );
  const warningMessage = document.querySelector('#warning-message');

  let isUpdating = false;
  let updatingProductId = null;

  // Helper function to display error messages
  function showError(message) {
    warningMessage.textContent = message;
    warningMessage.className = 'warning-message error'; // Apply error styling
    warningMessage.style.display = 'block';
    setTimeout(() => {
      warningMessage.style.display = 'none';
    }, 3000);
  }

  // Helper function to display success messages
  function showSuccess(message) {
    warningMessage.textContent = message;
    warningMessage.className = 'warning-message success'; // Apply success styling
    warningMessage.style.display = 'block';
    setTimeout(() => {
      warningMessage.style.display = 'none';
    }, 3000);
  }

  // Render the products table
  function renderProductsTable() {
    productsTableBody.innerHTML = '';
    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>
          <button class="update-btn" data-id="${product.id}">Update</button>
        </td>
      `;
      productsTableBody.appendChild(row);
    });

    // Attach event listeners to update buttons
    document.querySelectorAll('.update-btn').forEach(button => {
      button.addEventListener('click', event => {
        const productId = parseInt(event.target.getAttribute('data-id'));
        startUpdate(productId);
      });
    });
  }

  // Render the discounted products table
  function renderDiscountedTable() {
    discountedProductsTableBody.innerHTML = '';
    products.forEach(product => {
      if (product.discountedPrice !== null) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>${product.discountedPrice.toFixed(2)}</td>
        `;
        discountedProductsTableBody.appendChild(row);
      }
    });
  }

  // Start updating a product
  function startUpdate(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    idInput.value = product.id;
    nameInput.value = product.name;
    priceInput.value = product.price;

    idInput.disabled = true;
    isUpdating = true;
    updatingProductId = productId;

    updateProductBtn.style.display = 'block';
    addProductBtn.disabled = true;
  }

  // Add a new product
  addProductBtn.addEventListener('click', () => {
    const id = parseInt(idInput.value);
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!id || !name || !price) {
      showError('All fields are required!');
      return;
    }

    if (products.some(product => product.id === id)) {
      showError('Product ID must be unique!');
      return;
    }

    products.push({ id, name, price, discountedPrice: null });
    renderProductsTable();

    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    showSuccess('Product added successfully!');
  });

  // Update an existing product
  updateProductBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!name || !price) {
      showError('All fields are required!');
      return;
    }

    const product = products.find(p => p.id === updatingProductId);
    if (!product) return;

    product.name = name;
    product.price = price;
    product.discountedPrice = null; // Reset discounted price

    renderProductsTable();

    idInput.value = '';
    nameInput.value = '';
    priceInput.value = '';
    idInput.disabled = false;
    isUpdating = false;
    updatingProductId = null;

    updateProductBtn.style.display = 'none';
    addProductBtn.disabled = false;
    showSuccess('Product updated successfully!');
  });

  // View Products Button
  viewProductsBtn.addEventListener('click', () => {
    productsSection.style.display = 'block';
    renderProductsTable();
  });

  // Apply Discount
  applyDiscountBtn.addEventListener('click', () => {
    const discount = parseFloat(discountInput.value);

    if (isNaN(discount) || discount < 0 || discount > 100) {
      return;
    }

    products.forEach(product => {
      product.discountedPrice =
        product.price - (product.price * discount) / 100;
    });

    renderDiscountedTable();
    discountedProductsSection.style.display = 'block';
  });
});
