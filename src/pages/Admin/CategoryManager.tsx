import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Category } from '../../types/api';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>('/category/all');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await api.post<Category>('/category/', { name: newCategoryName });
      setCategories([...categories, response.data]);
      setNewCategoryName('');
    } catch (error) {
      console.error('Failed to create category', error);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingCategory) return;
    try {
      await api.put(`/category/${id}`, { name: editingCategory.name });
      setCategories(categories.map(c => c.id === id ? editingCategory : c));
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/category/${id}`);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  return (
    <div>
      <h2>Manage Categories</h2>
      <div>
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New category name"
        />
        <button onClick={handleCreate}>Create</button>
      </div>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {editingCategory?.id === category.id ? (
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              />
            ) : (
              <span>{category.name}</span>
            )}
            {editingCategory?.id === category.id ? (
              <button onClick={() => handleUpdate(category.id)}>Save</button>
            ) : (
              <button onClick={() => setEditingCategory(category)}>Edit</button>
            )}
            <button onClick={() => handleDelete(category.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryManager;
