import React, { useState, useEffect } from 'react';
import '../css/Features.css';
import FeatureOptions from './FeatureOptions';

const CustomCarForm = ({ features, onCreateCar }) => {
    const [carName, setCarName] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isConvertible, setIsConvertible] = useState(false);
    const [basePrice] = useState(60000); 
    const [selectedFeature, setSelectedFeature] = useState(null); 
    
    const calculateTotalPrice = () => {
        let total = basePrice;
        
        Object.values(selectedOptions).forEach(option => {
            if (option && option.price) {
                total += parseFloat(option.price);
            }
        });

        if (isConvertible) {
            const convertibleFeature = features.find(f => f.name === 'convertible');
            if (convertibleFeature) {
                const yesOption = convertibleFeature.options.find(o => o.name.includes('yes'));
                if (yesOption) {
                    total += parseFloat(yesOption.price);
                }
            }
        }
        
        return total;
    };
    
    const handleSelectOption = (featureId, option) => {
        if (option === null) {
            setSelectedOptions(prev => {
                const newOptions = {...prev};
                delete newOptions[featureId];
                return newOptions;
            });
        } else {

            setSelectedOptions(prev => ({
                ...prev,
                [featureId]: option
            }));
        }
    };
    
    const handleCreateCar = (e) => {
        e.preventDefault();
        
        const selectedFeatures = Object.entries(selectedOptions).map(([featureId, option]) => ({
            feature_option_id: option.id
        }));
        
        if (isConvertible) {
            const convertibleFeature = features.find(f => f.name === 'convertible');
            if (convertibleFeature) {
                const yesOption = convertibleFeature.options.find(o => o.name.includes('yes'));
                if (yesOption) {
                    selectedFeatures.push({
                        feature_option_id: yesOption.id
                    });
                }
            }
        }
        
        const carData = {
            name: carName,
            base_price: basePrice,
            total_price: calculateTotalPrice(),
            features: selectedFeatures
        };
        
        onCreateCar(carData);
    };
    
    // Find the convertible feature
    const convertibleFeature = features.find(f => f.name === 'convertible');
    
    // Filter out the convertible feature from the list
    const nonConvertibleFeatures = features.filter(f => f.name !== 'convertible');
    
    // Check if feature should be disabled
    const isFeatureDisabled = (feature) => {
        return isConvertible && feature.name === 'roof';
    };

    // If convertible is checked and roof is selected, deselect it
    useEffect(() => {
        if (isConvertible) {
            const roofFeature = features.find(f => f.name === 'roof');
            if (roofFeature && selectedOptions[roofFeature.id]) {
                setSelectedOptions(prev => {
                    const newOptions = {...prev};
                    delete newOptions[roofFeature.id];
                    return newOptions;
                });
            }
        }
    }, [isConvertible]);

    return (
        <div className="custom-car-form">
            <div className="car-options-row">
                {nonConvertibleFeatures.map(feature => (
                    <div key={feature.id} className="feature-button-container">
                        <button 
                            className={`feature-button ${selectedOptions[feature.id] ? 'selected' : ''}`}
                            disabled={isFeatureDisabled(feature)}
                            onClick={() => {
                                if (!isFeatureDisabled(feature)) {
                                    setSelectedFeature(feature);
                                }
                            }}
                        >
                            {feature.name}
                            {feature.name === 'roof' && isConvertible && (
                                <span className="disabled-note">(Not available with convertible)</span>
                            )}
                            {selectedOptions[feature.id] && (
                                <span className="selected-option-name">
                                    {selectedOptions[feature.id].name}
                                </span>
                            )}
                        </button>
                    </div>
                ))}
                
                {convertibleFeature && (
                    <div className="convertible-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={isConvertible}
                                onChange={(e) => setIsConvertible(e.target.checked)}
                            />
                            Convertible
                        </label>
                    </div>
                )}
            </div>
            
            <div className="car-name-section">
                <div className="total-price">
                    Total Price: ${calculateTotalPrice().toLocaleString()}
                </div>
                <div className="car-name-input">
                    <label htmlFor="carName">Name Your Custom Car:</label>
                    <input
                        type="text"
                        id="carName"
                        value={carName}
                        onChange={(e) => setCarName(e.target.value)}
                        placeholder="Enter a name for your custom car"
                        required
                    />
                </div>
                <button 
                    className="create-car-button"
                    onClick={handleCreateCar}
                    disabled={!carName}
                >
                    Create Custom Car
                </button>
            </div>
            
            {/* Feature Options Modal */}
            {selectedFeature && (
                <FeatureOptions 
                    features={[{
                        ...selectedFeature,
                        selectedOption: selectedOptions[selectedFeature.id] || null
                    }]}
                    onSelectedOption={(featureId, option) => {
                        handleSelectOption(featureId, option);
                    }}
                    onClose={() => {
                        setSelectedFeature(null); 
                    }}
                />
            )}
        </div>
    );
};

export default CustomCarForm;