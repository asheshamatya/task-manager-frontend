import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await axios.get('http://localhost:5000/tasks');
    setTasks(data);
  };

  const addTask = async () => {
    if (!task) return;
    if (editingId) {
      const { data } = await axios.put(`http://localhost:5000/tasks/${editingId}`, { title: task });
      const updatedTasks = tasks.map(t => (t._id === editingId ? data : t));
      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      const { data } = await axios.post('http://localhost:5000/tasks', { title: task });
      setTasks([...tasks, data]);
    }
    setTask('');
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setTask(title);
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <input value={task} onChange={e => setTask(e.target.value)} placeholder="Add or edit a task" />
      <button onClick={addTask}>{editingId ? 'Save Changes' : 'Add Task'}</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title}
            <div>
              <button onClick={() => startEditing(task._id, task.title)}>Edit</button>
              <button onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
