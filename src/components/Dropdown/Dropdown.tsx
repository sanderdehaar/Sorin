import './Dropdown.css';

interface DropdownProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, selectedValue, onSelect, isOpen, onToggle }) => (
  <div className="dropdown">
    <label className="dropdown__label">{label}</label>
    <button className="dropdown__toggle" onClick={onToggle}>
      {selectedValue || 'Select'}
    </button>

    {isOpen && (
      <div className="dropdown__menu">
        {options.map((option) => (
          <div
            key={option}
            className="dropdown__item"
            onClick={() => {
              onSelect(option);
              onToggle();
            }}
          >
            {option}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Dropdown;