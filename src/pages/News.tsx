import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { News } from '../types/api';

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRes = await api.get<News[]>('/news/all');
        setNews(newsRes.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>News</h1>
      <input
        type="text"
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredNews.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
            <span>{new Date(item.creationDate).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsPage;
