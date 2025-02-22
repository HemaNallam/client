import React, { useState, useRef } from "react";
import useGetData from "../api/useGetData";
import usePostData from "../api/usePostData";
import useUpdateData from "../api/useUpdateData";
import useDeleteData from "../api/useDeleteData";
import useSearchData from "../api/useSearchData";
import "./About.css";

    

    const About = () => {
        const API_URL = process.env.REACT_APP_BACKEND_SERVER_URL;
        const { data, loading, error, setData } = useGetData(API_URL);
        const { postData, loading: postLoading, error: postError } = usePostData(API_URL);
        const { updateData, loading: updateLoading, error: updateError } = useUpdateData(API_URL, setData);
        const { deleteData } = useDeleteData(API_URL);
    
    const { searchQuery, setSearchQuery, filteredData } = useSearchData(data);

    const [task, setTask] = useState({ title: "", description: "", status: "pending" });
    const [editId, setEditId] = useState(null);
    const formRef = useRef(null);

    const taskListRef = useRef(null); // Reference for task list

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newOrUpdatedTask = null;
    
        if (editId) {
            newOrUpdatedTask = await updateData(editId, task);
            if (newOrUpdatedTask) {
                setData((prevData) => prevData.map((t) => (t._id === editId ? newOrUpdatedTask : t)));
                setEditId(null);
            }
        } else {
            newOrUpdatedTask = await postData(task);
            if (newOrUpdatedTask) {
                setData((prevData) => [...prevData, newOrUpdatedTask]);
            }
        }
    
        setTask({ title: "", description: "", status: "pending" });
    
        // Scroll to task list after adding/updating
        if (taskListRef.current) {
            taskListRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    

    const handleDelete = async (id) => {
        const success = await deleteData(id);
        if (success) {
            setData((prevData) => prevData.filter((task) => task._id !== id));
        }
    };

    const handleEdit = (task) => {
        setTask(task);
        setEditId(task._id);
        formRef.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="about-container">
            <h1 className="about-title">About</h1>
            <p className="about-description">This is the about page</p>

            {/* Search Section */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Task List Section */}
            <div className="task-section" ref={taskListRef}>

                <h2 className="section-title">Data from Backend</h2>
                {loading ? (
                    <p className="loading">Loading...</p>
                ) : error ? (
                    <p className="error">Error: {error}</p>
                ) : (
                    <ul className="task-list">
                        {filteredData.length > 0 ? (
                            filteredData.map((task) => (
                                <li key={task._id} className="task-item">
                                    <strong>Title:</strong> {task.title} <br />
                                    <strong>Description:</strong> {task.description} <br />
                                    <strong>Status:</strong> {task.status} <br />
                                    <button onClick={() => handleEdit(task)} className="edit-button">Update</button>
                                    <button onClick={() => handleDelete(task._id)} className="delete-button">Delete</button>
                                    <hr />
                                </li>
                            ))
                        ) : (
                            <p>No tasks found.</p>
                        )}
                    </ul>
                )}
            </div>

            {/* Form Section */}
            <div className="form-section" ref={formRef}>
                <h2 className="section-title">{editId ? "Edit Task" : "Add a New Task"}</h2>
                <form onSubmit={handleSubmit} className="task-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        required
                        className="input-field"
                    />
                    <select
                        value={task.status}
                        onChange={(e) => setTask({ ...task, status: e.target.value })}
                        className="input-field"
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button type="submit" disabled={postLoading || updateLoading} className="submit-button">
                        {editId ? "Update Task" : "Add Task"}
                    </button>
                </form>
                {(postLoading || updateLoading) && <p className="loading">Processing...</p>}
                {(postError || updateError) && <p className="error">Error: {postError || updateError}</p>}
            </div>
        </div>
    );
};

export default About;