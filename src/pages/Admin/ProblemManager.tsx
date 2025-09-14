import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Problem, Category } from '../../types/api';

const ProblemManager: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProblem, setEditingProblem] = useState<Partial<Problem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [problemsRes, categoriesRes] = await Promise.all([
          api.get<Problem[]>('/problem/all'),
          api.get<Category[]>('/category/all'),
        ]);
        setProblems(problemsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!editingProblem) return;

    const problemData = {
        title: editingProblem.title,
        description: editingProblem.description,
        // The API expects the category ID, not the object
        category: { id: editingProblem.category?.id },
    };

    try {
      if (isCreating) {
        const response = await api.post<Problem>('/problem/', problemData);
        setProblems([...problems, response.data]);
      } else {
        const response = await api.put<Problem>(`/problem/${editingProblem.id}`, problemData);
        setProblems(problems.map(p => p.id === editingProblem.id ? response.data : p));
      }
      setEditingProblem(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save problem', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/problem/${id}`);
      setProblems(problems.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete problem', error);
    }
  };

  const startEditing = (problem: Problem) => {
    setIsCreating(false);
    setEditingProblem(problem);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingProblem({ title: '', description: '', category: categories[0] });
  };

  const renderEditForm = () => {
    if (!editingProblem) return null;

    return (
        <div>
            <h3>{isCreating ? 'Create Problem' : 'Edit Problem'}</h3>
            <input
                type="text"
                placeholder="Title"
                value={editingProblem.title}
                onChange={(e) => setEditingProblem({ ...editingProblem, title: e.target.value })}
            />
            <textarea
                placeholder="Description"
                value={editingProblem.description}
                onChange={(e) => setEditingProblem({ ...editingProblem, description: e.target.value })}
            />
            <select
                value={editingProblem.category?.id}
                onChange={(e) => {
                    const cat = categories.find(c => c.id === parseInt(e.target.value));
                    if (cat) setEditingProblem({ ...editingProblem, category: cat });
                }}
            >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => { setEditingProblem(null); setIsCreating(false); }}>Cancel</button>
        </div>
    );
  }

  return (
    <div>
      <h2>Manage Problems</h2>
      {!editingProblem && <button onClick={startCreating}>Create New Problem</button>}
      {renderEditForm()}
      <ul>
        {problems.map(problem => (
          <li key={problem.id}>
            <strong>{problem.title}</strong> ({problem.category.name})<br />
            <button onClick={() => startEditing(problem)}>Edit</button>
            <button onClick={() => handleDelete(problem.id)}>Delete</button>
            {/* TODO: Add link to edit decision tree */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemManager;
