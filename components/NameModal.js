import React from 'react';

const NameModal = ({ names, onSelectName, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Selecione seu nome</h2>
        <ul>
          {names.map((name, index) => (
            <li key={index} onClick={() => onSelectName(name)}>
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NameModal;
