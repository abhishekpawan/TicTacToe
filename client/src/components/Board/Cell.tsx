import React from 'react';
import '../../styles/Cell.css';

interface CellProps {
  value: string | null;
  index: number;
  onClick: () => void;
  isActive: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isActive }) => {
  const handleClick = () => {
    if (isActive) {
      onClick();
    }
  };

  return (
    <div 
      className={`cell ${value ? `cell-${value.toLowerCase()}` : ''} ${isActive ? 'active' : ''}`} 
      onClick={handleClick}
    >
      {value && (
        <span className="cell-value">
          {value === 'X' ? (
            <svg viewBox="0 0 24 24" className="x-mark">
              <path className="x-mark-line1" d="M 5,5 L 19,19" />
              <path className="x-mark-line2" d="M 19,5 L 5,19" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="o-mark">
              <circle cx="12" cy="12" r="7" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
};

export default Cell; 