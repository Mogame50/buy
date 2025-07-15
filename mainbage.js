document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productsDisplay = document.getElementById('productsDisplay');
    const noProductsMessage = document.getElementById('noProductsMessage');

    // دالة لجلب المنتجات من Local Storage
    function getProducts() {
        const productsJSON = localStorage.getItem('products');
        return productsJSON ? JSON.parse(productsJSON) : [];
    }

    // دالة لحفظ المنتجات في Local Storage
    function saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // دالة لعرض المنتجات
    function displayProducts() {
        const products = getProducts();
        productsDisplay.innerHTML = ''; // تفريغ المحتوى القديم

        if (products.length === 0) {
            noProductsMessage.style.display = 'block'; // إظهار رسالة "لا يوجد منتجات"
        } else {
            noProductsMessage.style.display = 'none'; // إخفاء الرسالة
            products.forEach((product, index) => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                // بناء كارت المنتج
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-card-content">
                        <h3>${product.name}</h3>
                        <p class="description">${product.description}</p>
                        <div class="price-info">
                            ${product.discountedPrice ? 
                                `<span class="discounted-price">${parseFloat(product.discountedPrice).toFixed(2)} جنيه</span>
                                <span class="original-price">${parseFloat(product.price).toFixed(2)} جنيه</span>`
                                : <span class="no-discount-price">${parseFloat(product.price).toFixed(2)} جنيه</span>
                            }
                        </div>
                        <button class="delete-product-btn" data-index="${index}">حذف المنتج</button>
                    </div>
                `;
                productsDisplay.appendChild(productCard);
            });

            // إضافة حدث "click" لأزرار الحذف
            document.querySelectorAll('.delete-product-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const indexToDelete = parseInt(event.target.dataset.index);
                    deleteProduct(indexToDelete);
                });
            });
        }
    }

    // دالة لحذف منتج
    function deleteProduct(index) {
        const products = getProducts();
        products.splice(index, 1); // إزالة العنصر من المصفوفة
        saveProducts(products); // حفظ المصفوفة بعد الحذف
        displayProducts(); // إعادة عرض المنتجات
    }

    // معالجة إرسال الفورم
    productForm.addEventListener('submit', (event) => {
        event.preventDefault(); // منع الإرسال الافتراضي

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productDiscountedPrice = document.getElementById('productDiscountedPrice').value;
        const productImage = document.getElementById('productImage').value;
        const productDescription = document.getElementById('productDescription').value;

        const newProduct = {
            name: productName,
            price: productPrice,
            discountedPrice: productDiscountedPrice || null, // لو مفيش خصم يبقى null
            image: productImage,
            description: productDescription
        };

        const products = getProducts();
        products.push(newProduct); // إضافة المنتج الجديد للمصفوفة
        saveProducts(products); // حفظ المصفوفة الجديدة

        productForm.reset(); // تفريغ الفورم بعد الإضافة
        displayProducts(); // تحديث عرض المنتجات
    });

    // عند تحميل الصفحة لأول مرة، اعرض المنتجات الموجودة
    displayProducts();
});