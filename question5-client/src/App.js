import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Login() {
    const [empid, setEmpid] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const login = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    empid,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            window.location.href = "/home";
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div>
            <h1>Employee Login</h1>

            {message && <p style={{ color: "red" }}>{message}</p>}

            <form onSubmit={login}>
                <label>Employee ID:</label>
                <br />
                <input
                    type="text"
                    value={empid}
                    onChange={(e) => setEmpid(e.target.value)}
                    required
                />

                <br /><br />

                <label>Password:</label>
                <br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

function Home() {
    return (
        <div>
            <h1>Employee Home</h1>

            <p>
                <Link to="/profile">Page 1 - Profile</Link>
            </p>

            <p>
                <Link to="/leave">Page 2 - Leave Application</Link>
            </p>

            <p>
                <Link to="/leaves">List Leave Applications</Link>
            </p>

            <p>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                >
                    Logout
                </button>
            </p>
        </div>
    );
}

function Profile() {
    const [employee, setEmployee] = useState(null);
    const [message, setMessage] = useState("");

    const getProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setEmployee(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to load profile"
            );
        }
    };

    useEffect(() => {
    getProfile();
    }, []);

    return (
        <div>
            <h1>Employee Profile</h1>

            {message && <p>{message}</p>}

            {employee && (
                <div>
                    <p><b>Employee ID:</b> {employee.empid}</p>
                    <p><b>Name:</b> {employee.name}</p>
                    <p><b>Email:</b> {employee.email}</p>
                    <p><b>Basic Salary:</b> {employee.basicSalary}</p>
                    <p><b>HRA:</b> {employee.hra}</p>
                    <p><b>DA:</b> {employee.da}</p>
                    <p><b>Gross Salary:</b> {employee.grossSalary}</p>
                </div>
            )}

            <Link to="/home">Back to Home</Link>
        </div>
    );
}

function Leave() {
    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [grant, setGrant] = useState("Yes");
    const [message, setMessage] = useState("");

    const addLeave = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                "http://localhost:5000/api/leaves",
                {
                    date,
                    reason,
                    grant
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(response.data.message);
            setDate("");
            setReason("");
            setGrant("Yes");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to add leave"
            );
        }
    };

    return (
        <div>
            <h1>Leave Application</h1>

            {message && <p>{message}</p>}

            <form onSubmit={addLeave}>
                <label>Date:</label>
                <br />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />

                <br /><br />

                <label>Reason:</label>
                <br />
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />

                <br /><br />

                <label>Grant:</label>
                <br />

                <input
                    type="radio"
                    value="Yes"
                    checked={grant === "Yes"}
                    onChange={(e) => setGrant(e.target.value)}
                />
                Yes

                <input
                    type="radio"
                    value="No"
                    checked={grant === "No"}
                    onChange={(e) => setGrant(e.target.value)}
                />
                No

                <br /><br />

                <button type="submit">Add Leave</button>
            </form>

            <br />

            <Link to="/home">Back to Home</Link>
        </div>
    );
}

function Leaves() {
    const [leaves, setLeaves] = useState([]);
    const [message, setMessage] = useState("");

    const getLeaves = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/leaves",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setLeaves(response.data);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to load leaves"
            );
        }
    };

    useEffect(() => {
        getLeaves();
    }, []);

    return (
        <div>
            <h1>Leave Applications</h1>

            {message && <p>{message}</p>}

            {leaves.length === 0 ? (
                <p>No leave applications found.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reason</th>
                            <th>Grant</th>
                        </tr>
                    </thead>

                    <tbody>
                        {leaves.map((leave) => (
                            <tr key={leave._id}>
                                <td>
                                    {new Date(leave.date).toLocaleDateString()}
                                </td>
                                <td>{leave.reason}</td>
                                <td>{leave.grant}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <br />

            <Link to="/home">Back to Home</Link>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;