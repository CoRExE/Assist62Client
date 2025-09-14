import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { News } from '../../types/api';

const NewsManager: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [editingNews, setEditingNews] = useState<Partial<News> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<News[]>('/news/all');
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };
    fetchNews();
  }, []);

  const handleSave = async () => {
    if (!editingNews) return;

    const newsData = {
        title: editingNews.title,
        content: editingNews.content,
        type: editingNews.type || 'INFO',
    };

    try {
      if (isCreating) {
        const response = await api.post<News>('/news/', newsData);
        setNews([...news, response.data]);
      } else {
        const response = await api.put<News>(`/news/${editingNews.id}`, newsData);
        setNews(news.map(n => n.id === editingNews.id ? response.data : n));
      }
      setEditingNews(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to save news', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/news/${id}`);
      setNews(news.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete news', error);
    }
  };

  const startEditing = (item: News) => {
    setIsCreating(false);
    setEditingNews(item);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingNews({ title: '', content: '', type: 'INFO' });
  };

  const renderEditForm = () => {
    if (!editingNews) return null;

    return (
        <div>
            <h3>{isCreating ? 'Create News' : 'Edit News'}</h3>
            <input
                type="text"
                placeholder="Title"
                value={editingNews.title}
                onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
            />
            <textarea
                placeholder="Content"
                value={editingNews.content}
                onChange={(e) => setEditingNews({ ...editingNews, content: e.target.value })}
                rows={10}
            />
            <select
                value={editingNews.type}
                onChange={(e) => setEditingNews({ ...editingNews, type: e.target.value as News['type'] })}
            >
                <option value="INFO">INFO</option>
                <option value="ALERT">ALERT</option>
                <option value="UPDATE">UPDATE</option>
            </select>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => { setEditingNews(null); setIsCreating(false); }}>Cancel</button>
        </div>
    );
  }

  return (
    <div>
      <h2>Manage News</h2>
      {!editingNews && <button onClick={startCreating}>Create New Article</button>}
      {renderEditForm()}
      <ul>
        {news.map(item => (
          <li key={item.id}>
            <strong>{item.title}</strong><br />
            <small>{item.type} - {new Date(item.creationDate).toLocaleDateString()}</small><br/>
            <button onClick={() => startEditing(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsManager;
