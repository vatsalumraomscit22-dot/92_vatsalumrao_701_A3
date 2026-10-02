import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [categoryName, setCategoryName] = useState("");
    const [parentId, setParentId] = useState("");

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [stock, setStock] = useState("");

    const [message, setMessage] = useState("");

    const loadCategories = async () => {
        const response = await axios.get("http://localhost:5002/api/categories");
        setCategories(response.data);
    };

    const loadProducts = async () => {
        const response = await axios.get("http://localhost:5002/api/products");
        setProducts(response.data);
    };

    useEffect(() => {
        loadCategories();
        loadProducts();
    }, []);

    const addCategory = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5002/api/categories", {
                name: categoryName,
                parentId: parentId || null
            });

            setMessage("Category added successfully");
            setCategoryName("");
            setParentId("");
            loadCategories();
        } catch (error) {
            setMessage("Unable to add category");
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();

        try {
            await axios.post("http://localhost:5002/api/products", {
                name: productName,
                price: Number(price),
                description,
                categoryId: productCategory,
                stock: Number(stock)
            });

            setMessage("Product added successfully");
            setProductName("");
            setPrice("");
            setDescription("");
            setProductCategory("");
            setStock("");
            loadProducts();
        } catch (error) {
            setMessage("Unable to add product");
        }
    };

    return (
        <div>
            <h1>Shopping Cart Admin Panel</h1>

            <h2>Add Category</h2>

            <form onSubmit={addCategory}>
                <label>Category Name:</label>
                <br />
                <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                />

                <br />
                <br />

                <label>Parent Category:</label>
                <br />

                <select
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                >
                    <option value="">Main Category</option>

                    {categories
                        .filter(category => category.parentId === null)
                        .map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                </select>

                <br />
                <br />

                <button type="submit">Add Category</button>
            </form>

            <h2>Categories</h2>

            <ul>
                {categories.map(category => (
                    <li key={category._id}>
                        {category.name}
                        {category.parentId && " (Subcategory)"}
                    </li>
                ))}
            </ul>

            <h2>Add Product</h2>

            <form onSubmit={addProduct}>
                <label>Product Name:</label>
                <br />
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />

                <br />
                <br />

                <label>Price:</label>
                <br />
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />

                <br />
                <br />

                <label>Description:</label>
                <br />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <br />
                <br />

                <label>Category:</label>
                <br />

                <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>

                    {categories
                        .filter(category => category.parentId !== null)
                        .map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                </select>

                <br />
                <br />

                <label>Stock:</label>
                <br />
                <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />

                <br />
                <br />

                <button type="submit">Add Product</button>
            </form>

            <br />

            {message && <p>{message}</p>}

            <h2>Products</h2>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.categoryId.name}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;