import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAppStore } from '../store';
import { Category, News } from '../types/api';

const Home: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [rootCategories, setRootCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Category[]>([]);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [newsRes, rootCategoriesRes, favoritesRes] = await Promise.all([
          api.get<News[]>('/news/all'),
          api.get<Category[]>('/category/root'),
          api.get<Category[]>(`/user/${user.id}/favorites`),
        ]);

        setNews(newsRes.data);
        setRootCategories(rootCategoriesRes.data);
        setFavorites(favoritesRes.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Recent News</h2>
        <ul>
          {news.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Root Categories</h2>
        <ul>
          {rootCategories.map((category) => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>My Favorites</h2>
        <ul>
          {favorites.map((category) => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`}>{category.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Home;
