import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5003/api/students";

function App() {
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        course: "",
        age: ""
    });

    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_URL);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, formData);
                alert("Student updated successfully");
            } else {
                await axios.post(API_URL, {
                    ...formData,
                    age: Number(formData.age)
                });
                alert("Student added successfully");
            }

            setFormData({
                name: "",
                email: "",
                course: "",
                age: ""
            });

            setEditingId(null);
            fetchStudents();

        } catch (error) {
            console.error("Error saving student:", error);
            alert("Unable to save student");
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            email: student.email,
            course: student.course,
            age: student.age
        });

        setEditingId(student.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Student deleted successfully");
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Unable to delete student");
        }
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            email: "",
            course: "",
            age: ""
        });

        setEditingId(null);
    };

    return (
        <div style={styles.container}>
            <h1>Student Management System</h1>

            <div style={styles.formContainer}>
                <h2>{editingId ? "Update Student" : "Add Student"}</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="course"
                        placeholder="Enter Course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="age"
                        placeholder="Enter Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        {editingId ? "Update Student" : "Add Student"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <h2>Student List</h2>

            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan="6">
                                No students found
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.course}</td>
                                <td>{student.age}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(student)}
                                        style={styles.editButton}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        style={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        width: "80%",
        margin: "30px auto",
        fontFamily: "Arial",
        textAlign: "center"
    },

    formContainer: {
        width: "400px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px"
    },

    editButton: {
        marginRight: "5px",
        padding: "6px 12px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px"
    },

    deleteButton: {
        padding: "6px 12px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "4px"
    },

    cancelButton: {
        marginLeft: "5px",
        padding: "8px 15px",
        backgroundColor: "#777",
        color: "white",
        border: "none",
        borderRadius: "4px"
    }
};

export default App;
