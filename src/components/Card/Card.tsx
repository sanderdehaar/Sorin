import React from 'react';
import './Card.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  loading?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', style, loading }) => {
  return (
    <div className={`card ${className}`} style={style}>
      {loading ? <LoadingSpinner /> : children}
    </div>
  );
};

export default Card;