import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', favoriteColor: '', favoriteFood: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/profiles`);
      if (Array.isArray(res.data)) {
        setStudents(res.data);
      } else {
        console.error("Expected an array, but received:", res.data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/api/profiles/${editingId}`, { ...form });
      setEditingId(null);
    } else {
      await axios.post(`${API_URL}/api/profiles`, { ...form, likes: 0 });
    }
    setForm({ name: '', favoriteColor: '', favoriteFood: '' });
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      favoriteColor: student.favoriteColor,
      favoriteFood: student.favoriteFood,
    });
    setEditingId(student.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/api/profiles/${id}`);
    fetchStudents();
  };

  const incrementLikes = async (id) => {
    await axios.patch(`${API_URL}/api/profiles/${id}/likes`);
    fetchStudents();
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: '#87CEEB' }}>
      <h2 className="mb-4 text-center">Student Profile Form</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            name="favoriteColor"
            placeholder="Favorite Color"
            value={form.favoriteColor}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control w-50 mx-auto"
            name="favoriteFood"
            placeholder="Favorite Food"
            value={form.favoriteFood}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary w-50 mx-auto d-block">
          {editingId ? 'Update' : 'Add'} Student
        </button>
      </form>

      <h3>Student Profiles</h3>
      <div className="row">
        {students.map((student) => (
          <div className="col-md-4" key={student.id}>
            <div
              className="card mb-4 student-card"
              style={{
                borderColor: student.favoriteColor,
                borderWidth: '2px',
                backgroundColor: '#f8f9fa',
              }}
            >
              <div className="card-body">
                <h5
                  className="card-title"
                  style={{ color: student.favoriteColor }}
                >
                  {student.name}
                </h5>
                <p className="card-text">
                  <strong>Student ID:</strong> {student.id}
                </p>
                <p className="card-text">
                  <strong>Favorite Color:</strong> {student.favoriteColor}
                </p>
                <p className="card-text">
                  <strong>Favorite Food:</strong> {student.favoriteFood}
                </p>
                <p className="card-text">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => incrementLikes(student.id)}
                    style={{ fontSize: '1.5rem' }}
                  >
                    ❤️ {student.likes}
                  </button>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3>Student List</h3>
      <table className="table table-bordered mb-5">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Favorite Color</th>
            <th>Favorite Food</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.favoriteColor}</td>
              <td>{student.favoriteFood}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(student)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>
        {`
          .student-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .student-card:hover {
            transform: translateY(-10px);
            box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
            cursor: pointer;
          }
          .student-card .card-body {
            transition: background-color 0.3s ease;
          }
          .student-card:hover .card-body {
            background-color: #f1f1f1;
          }
        `}
      </style>
    </div>
  );
}

export default App;
