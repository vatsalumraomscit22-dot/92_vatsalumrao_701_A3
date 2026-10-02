import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [message, setMessage] = useState("");

    const userId = "user1";

    const loadProducts = async () => {
        const response = await axios.get("http://localhost:5002/api/products");
        setProducts(response.data);
    };

    const loadCategories = async () => {
    const response = await axios.get("http://localhost:5002/api/categories");
    setCategories(response.data);
};

    const loadCart = async () => {
        const response = await axios.get(
            `http://localhost:5002/api/cart/${userId}`
        );
        setCart(response.data.items);
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
        loadCart();
    }, []);

    const addToCart = async (productId) => {
        try {
            await axios.post("http://localhost:5002/api/cart", {
                userId,
                productId,
                quantity: 1
            });

            setMessage("Product added to cart");
            loadCart();
        } catch (error) {
            setMessage("Unable to add product to cart");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(
                `http://localhost:5002/api/cart/${userId}/${productId}`
            );

            setMessage("Product removed from cart");
            loadCart();
        } catch (error) {
            setMessage("Unable to remove product from cart");
        }
    };

    return (
        <div>
            <h1>Shopping Cart User Site</h1>
                <label>Filter by Category: </label>

<select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
>
    <option value="">All Categories</option>

    {categories
        .filter(category => category.parentId === null)
        .map(category => (
            <optgroup key={category._id} label={category.name}>
                {categories
                    .filter(subcategory =>
                        subcategory.parentId === category._id
                    )
                    .map(subcategory => (
                        <option
                            key={subcategory._id}
                            value={subcategory._id}
                        >
                            {subcategory.name}
                        </option>
                    ))}
            </optgroup>
        ))}
</select>

            <h2>Products</h2>

            {products
    .filter(
        product =>
            selectedCategory === "" ||
            product.categoryId._id === selectedCategory
    )
    .map(product => (
                <div key={product._id}>
                    <h3>{product.name}</h3>
                    <p>Price: ₹{product.price}</p>
                    <p>{product.description}</p>
                    <p>Category: {product.categoryId.name}</p>
                    <p>Stock: {product.stock}</p>

                    <button onClick={() => addToCart(product._id)}>
                        Add to Cart
                    </button>

                    <hr />
                </div>
            ))}

            {message && <p>{message}</p>}

              <h2>My Cart</h2>

        {cart.length === 0 ? (
            <p>Cart is empty</p>
        ) : (
            <div>
                <table border="1" cellPadding="8">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cart.map(item => (
                            <tr key={item._id}>
                                <td>{item.productId.name}</td>
                                <td>₹{item.productId.price}</td>
                                <td>{item.quantity}</td>
                                <td>₹{item.productId.price * item.quantity}</td>
                                <td>
                                <button onClick={() => removeFromCart(item.productId._id)}>
                                    Remove
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3>
                    Grand Total: ₹
                    {cart.reduce(
                        (total, item) =>
                            total + item.productId.price * item.quantity,
                        0
                    )}
                </h3>
            </div>
        )}
        </div>
    );
}

export default App;