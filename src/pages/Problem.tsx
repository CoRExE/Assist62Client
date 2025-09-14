import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Problem, DecisionStep, Choice, NavigationChoice, UrlChoice, FinalChoice } from '../types/api';

const ProblemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [currentStep, setCurrentStep] = useState<DecisionStep | null>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) return;
      try {
        const problemRes = await api.get<Problem>(`/problem/${id}`);
        setProblem(problemRes.data);
        setCurrentStep(problemRes.data.firstStep);
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };

    fetchProblem();
  }, [id]);

  const handleChoice = (choice: Choice) => {
    if ('nextStep' in choice) {
      setCurrentStep((choice as NavigationChoice).nextStep);
    } else if ('url' in choice) {
      window.open((choice as UrlChoice).url, '_blank');
    } else if ('conclusionText' in choice) {
      // You can display the conclusion in a modal or a dedicated section
      alert((choice as FinalChoice).conclusionText);
    }
  };

  if (!problem || !currentStep) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{problem.title}</h1>
      <p>{problem.description}</p>

      <hr />

      <div>
        <h2>{currentStep.text}</h2>
        {currentStep.imageUrl && <img src={currentStep.imageUrl} alt="Step illustration" />}
        
        <ul>
          {currentStep.choices.map((choice) => (
            <li key={choice.id}>
              <button onClick={() => handleChoice(choice)}>{choice.text}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemPage;
