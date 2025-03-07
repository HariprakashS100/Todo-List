import "./App.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
//json server link
const USER_URL = "http://localhost:3002/Users";
//creating state
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editTaskData, setEditTaskData] = useState(null);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("");

  // Fetch users from JSON server
  useEffect(() => {
    fetch(USER_URL)
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // Add Task
  const addTask = (e) => {
    e.preventDefault();
    if (!name || !email || !value || !status) return;
    const newTask = { name, email, value, status };

    fetch(USER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => setTasks([...tasks, data]));

    setName("");
    setEmail("");
    setValue("");
    setStatus("");
    toast("Task added sucessfully");
  };

  // Delete Task
  const deleteTask = (id) => {
    fetch(`${USER_URL}/${id}`, { method: "DELETE" }).then(
      () => setTasks(tasks.filter((user) => user.id !== id)),
      toast("Task deleted sucessfully")
    );
  };

  // Edit Task
  const editTask = (user) => {
    setEditTaskData(user);
    setName(user.name);
    setEmail(user.email);
    setValue(user.value);
    setStatus(user.status);
  };

  // Update Task
  const updateTask = (e) => {
    e.preventDefault();
    if (!name || !email || !value || !status) return;

    fetch(`${USER_URL}/${editTaskData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, value, status }),
    }).then(() => {
      setTasks(
        tasks.map((u) =>
          u.id === editTaskData.id ? { ...u, name, email, value, status } : u
        )
      );
      setEditTaskData(null);
      setName("");
      setEmail("");
      setValue("");
      setStatus("");
      toast("Task updated sucessfully");
    });
  };
  //select dropdown list
  const options = [
    { label: "High", value: "High" },
    { label: "Medium", value: "Medium" },
    { label: "Low", value: "Low" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h2>Task Management</h2>
      <br></br>

      <form onSubmit={editTaskData ? updateTask : addTask}>
        <label>Task Name</label>
        <input
          class="form-control"
          type="text"
          placeholder="Enter the name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br></br>
        <label>Email</label>
        <input
          class="form-control"
          type="email"
          placeholder="Enter the email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br></br>
        <label>priority</label>
        <select
          className="form-select"
          onChange={(e) => setValue(e.target.value)}
        >
          {options.map((option) => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        <br></br>
        <label>Status</label>
        <br></br>
        <input
          type="radio"
          value={status}
          name="s"
          onClick={() => setStatus("pending")}
        />
        &nbsp;
        <i class="bi bi-hourglass-bottom"></i>
        pending &nbsp;
        <input
          type="radio"
          value={status}
          name="s"
          onClick={() => setStatus("completed")}
        />
        &nbsp;
        <i class="bi bi-check-circle-fill"></i> completed
        <br></br>
        <br></br>
        <button type="submit" class="btn btn-success">
          {editTaskData ? "Update" : "Add"} Task
        </button>
        <ToastContainer />
      </form>
      <br></br>
      <br></br>
      <br></br>
      <table border="1" rules="all" width="550" height="400" margin="50">
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Priority</th>
          <th>Status</th>
          <th colspan="2">Action</th>
        </tr>
        <tbody class="table table-striped table-hover">
          {tasks.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.value}</td>
              <td>{user.status}</td>
              <td>
                <button class="btn btn-primary" onClick={() => editTask(user)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  class="btn btn-danger"
                  onClick={() => deleteTask(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default App;
