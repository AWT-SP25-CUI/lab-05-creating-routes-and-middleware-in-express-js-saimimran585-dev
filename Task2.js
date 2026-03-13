const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
const loggerMiddleware = (req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
};

app.use(loggerMiddleware);
let products = [
{ id: 1, name: "Laptop", price: 800, category: "electronics", inStock: true },
{ id: 2, name: "Phone", price: 500, category: "electronics", inStock: false },
{ id: 3, name: "Shoes", price: 80, category: "fashion", inStock: true },
{ id: 4, name: "Watch", price: 150, category: "fashion", inStock: true }
];

app.get('/products', (req, res) => {
    let result = products;
    const { category, maxPrice, inStock } = req.query;
    if (category) {
        result = result.filter(p => p.category === category);
    }

    if (maxPrice) {
        result = result.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (inStock !== undefined) {
        const stockValue = inStock === 'true';
        result = result.filter(p => p.inStock === stockValue);
    }
    res.json(result);
});

app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({
            error: "Product not found"
        });
    }
    res.json(product);
});
app.post('/products', (req, res) => {
    const { name, price, category, inStock } = req.body;
    
    if (!name || price === undefined || !category || inStock === undefined) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }
    if (typeof name !== "string" || typeof category !== "string") {
        return res.status(400).json({
            error: "Invalid data type for name or category"
        });
    }

    if (typeof price !== "number" || typeof inStock !== "boolean") {
        return res.status(400).json({
            error: "Invalid data type for price or inStock"
        });
    }
    const newProduct = {
        id: products.length + 1,
        name,
        price,
        category,
        inStock
    };
    products.push(newProduct);
    res.status(201).json({
        message: "Product added successfully",
        product: newProduct
    });
});
app.use((req, res) => {
    res.status(404).json({
        error: "Invalid route"
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);}
});
