const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Category = require("./models/Category");
const Product = require("./models/Product");
const Cart = require("./models/Cart");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ShoppingCartDB")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB Error:", error));

app.get("/", (req, res) => {
    res.send("Shopping Cart API is running");
});

app.post("/api/categories", async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: "Unable to create category" });
    }
});

app.get("/api/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.log("Category Error:", error);
        res.status(500).json({ message: "Unable to fetch categories" });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Unable to create product" });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().populate("categoryId");
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch products" });
    }
});

app.post("/api/cart", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
        } else {
            const existingItem = cart.items.find(
                item => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Unable to add product to cart" });
    }
});

app.get("/api/cart/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        }).populate("items.productId");

        res.json(cart || { userId: req.params.userId, items: [] });
    } catch (error) {
        res.status(500).json({ message: "Unable to fetch cart" });
    }
});

app.delete("/api/cart/:userId/:productId", async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== req.params.productId
        );

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: "Unable to remove product from cart"
        });
    }
});

app.listen(5002, () => {
    console.log("Server running at http://localhost:5002");
});