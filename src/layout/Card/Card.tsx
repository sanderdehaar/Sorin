import './Card.css';
import { QuestionCircle } from "@mynaui/icons-react";
import { Config } from '@mynaui/icons-react';

interface CardProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  cardInfo?: boolean;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

const Card: React.FC<CardProps> = ({ title, children, className, cardInfo = true, showFilters = false, onToggleFilters }) => {
  return (
    <div className={`card ${className ? className : ''}`}>
      {(title || cardInfo) && (
        <div className="card__top">
          {title && <h3 className="card__title">{title}</h3>}
          {cardInfo && <QuestionCircle className="icon" />}
          
          {showFilters && (
            <button className="filter__button" onClick={onToggleFilters}>
              <Config /><span>Filter</span>
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;