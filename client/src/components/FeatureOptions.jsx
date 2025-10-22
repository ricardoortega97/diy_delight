import React, { useState, useEffect, useRef } from "react";
import '../css/Features.css';

const FeatureOptions = ({ features, onSelectedOption, onClose }) => {
    const dialogRef = useRef(null);
    const [tempSelection, setTempSelection] = useState(null);

    const feature = features && features.length > 0 ? features[0] : null;
    
    useEffect(() => {
        if (feature && feature.selectedOption) {
            setTempSelection(feature.selectedOption.id);
        } else {
            setTempSelection(null);
        }
    }, [feature]);
    
    useEffect(() => {
        if (feature) {
            if (dialogRef.current && !dialogRef.current.open) {
                dialogRef.current.showModal();
            }
        }
    }, [feature]);
    
    const closeModal = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        if (onClose) {
            onClose();
        }
    };
    
    const handleOptionSelect = (option) => {
        if (tempSelection === option.id) {
            setTempSelection(null);
        } else {
            setTempSelection(option.id);
        }
    };
    
    const handleDone = () => {

        if (feature) {
            const selectedOption = tempSelection ? 
                feature.options.find(o => o.id === tempSelection) : 
                null;
            
            onSelectedOption(feature.id, selectedOption);
        }
        
        closeModal();
    };
    
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape' && dialogRef.current && dialogRef.current.open) {
                handleDone(); 
            }
        };
        
        document.addEventListener('keydown', handleEscape);
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [tempSelection]);

    if (!feature) return <p>Loading features...</p>;
    
    return (
        <div className="feature-options">
            <dialog ref={dialogRef}>
                <article>
                    <header>
                        <h3>Select an option for {feature.name}</h3>
                    </header>
                    <ul className="options-list">
                        {feature.options && feature.options.map((option) => (
                            <li 
                                key={option.id}
                                onClick={() => handleOptionSelect(option)}
                                className={`option-item ${tempSelection === option.id ? 'selected-option' : ''}`}
                            >
                                <span className="option-name">{option.name}</span>
                                <span className="option-price">
                                    ${option.price}
                                    {tempSelection === option.id && (
                                        <span className="checkmark"> ✓</span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <footer>
                        <button 
                            className="modal-close-button"
                            onClick={handleDone}
                        >
                            Done
                        </button>
                    </footer>
                </article>
            </dialog>
        </div>
    );
};

export default FeatureOptions;