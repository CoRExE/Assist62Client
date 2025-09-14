import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAppStore } from '../store';
import { Category } from '../types/api';

const ProfilePage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const [subsRes, favsRes, allCatsRes] = await Promise.all([
          api.get<Category[]>(`/user/${user.id}/subscriptions`),
          api.get<Category[]>(`/user/${user.id}/favorites`),
          api.get<Category[]>('/category/all'),
        ]);

        setSubscriptions(subsRes.data);
        setFavorites(favsRes.data);
        setAllCategories(allCatsRes.data);
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      }
    };

    fetchData();
  }, [user]);

  const handleSubscriptionChange = async (categoryId: number, isSubscribed: boolean) => {
    if (!user) return;
    const url = `/user/${user.id}/subscriptions/${categoryId}`;
    try {
      if (isSubscribed) {
        await api.delete(url);
        setSubscriptions(subscriptions.filter((c) => c.id !== categoryId));
      } else {
        await api.post(url);
        const category = allCategories.find((c) => c.id === categoryId);
        if (category) setSubscriptions([...subscriptions, category]);
      }
    } catch (error) {
      console.error('Failed to update subscription', error);
    }
  };

  const handleFavoriteChange = async (categoryId: number, isFavorite: boolean) => {
    if (!user) return;
    const url = `/user/${user.id}/favorites/${categoryId}`;
    try {
      if (isFavorite) {
        await api.delete(url);
        setFavorites(favorites.filter((c) => c.id !== categoryId));
      } else {
        await api.post(url);
        const category = allCategories.find((c) => c.id === categoryId);
        if (category) setFavorites([...favorites, category]);
      }
    } catch (error) {
      console.error('Failed to update favorite', error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <h2>Manage Subscriptions</h2>
      {allCategories.map((category) => {
        const isSubscribed = subscriptions.some((s) => s.id === category.id);
        return (
          <div key={category.id}>
            <label>
              <input
                type="checkbox"
                checked={isSubscribed}
                onChange={() => handleSubscriptionChange(category.id, isSubscribed)}
              />
              {category.name}
            </label>
          </div>
        );
      })}

      <h2>Manage Favorites</h2>
      {allCategories.map((category) => {
        const isFavorite = favorites.some((f) => f.id === category.id);
        return (
          <div key={category.id}>
            <label>
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={() => handleFavoriteChange(category.id, isFavorite)}
              />
              {category.name}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default ProfilePage;
