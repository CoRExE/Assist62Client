import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Category, Problem } from '../types/api';

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return;
      try {
        const [categoryRes, problemsRes] = await Promise.all([
          api.get<Category>(`/category/${id}`),
          api.get<Problem[]>(`/problem/category/${id}`),
        ]);
        setCategory(categoryRes.data);
        setProblems(problemsRes.data);
      } catch (error) {
        console.error('Failed to fetch category data', error);
      }
    };

    fetchCategoryData();
  }, [id]);

  if (!category) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{category.name}</h1>
      {category.parent && <Link to={`/category/${category.parent.id}`}>Go to parent: {category.parent.name}</Link>}

      <h2>Subcategories</h2>
      <ul>
        {category.children.map((child) => (
          <li key={child.id}>
            <Link to={`/category/${child.id}`}>{child.name}</Link>
          </li>
        ))}
      </ul>

      <h2>Problems</h2>
      <ul>
        {problems.map((problem) => (
          <li key={problem.id}>
            <Link to={`/problem/${problem.id}`}>{problem.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;