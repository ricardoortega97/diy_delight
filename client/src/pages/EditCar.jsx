import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCustomItem, updateCustomItem, deleteCustomItem } from '../services/customItemsAPI'
import { getAllFeatures } from '../services/featuresAPI'
import FeatureOptions from '../components/FeatureOptions'
import '../App.css'
import '../css/Features.css'
import '../css/EditCar.css'

const EditCar = (props) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [car, setCar] = useState({
        name: '',
        base_price: 60000,
        total_price: '',
        features: []
    });
    
    const [allFeatures, setAllFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeatureOptions, setSelectedFeatureOptions] = useState({});
    const [isConvertible, setIsConvertible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                const carData = await getCustomItem(id);
                
                const featuresData = await getAllFeatures();
                
                setCar(carData);
                setAllFeatures(featuresData);
                
                if (carData.selectedFeatures && carData.selectedFeatures.length > 0) {
                    const optionsMap = {};
                    
                    const convertibleOption = carData.selectedFeatures.find(
                        f => f.feature_name.toLowerCase() === 'convertible' && 
                            f.option_name.toLowerCase().includes('yes')
                    );
                    
                    if (convertibleOption) {
                        setIsConvertible(true);
                    }
                    
                    carData.selectedFeatures.forEach(feature => {
                        const featureId = feature.feature_id;
                        
                        if (feature.feature_name.toLowerCase() !== 'convertible') {
                            optionsMap[featureId] = {
                                id: feature.feature_option_id,
                                name: feature.option_name,
                                price: feature.price_adjustment
                            };
                        }
                    });
                    
                    setSelectedFeatureOptions(optionsMap);
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load car data. Please try again.');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCar((prevCar) => ({
            ...prevCar,
            [name]: value
        }));
    };

    const handleFeatureSelect = (featureId, option) => {
        setSelectedFeatureOptions(prev => ({
            ...prev,
            [featureId]: option
        }));
    };
    
    const handleConvertibleChange = (e) => {
        setIsConvertible(e.target.checked);
    };
    
    const calculateTotalPrice = () => {
        let total = parseFloat(car.base_price);

        Object.values(selectedFeatureOptions).forEach(option => {
            if (option && option.price) {
                total += parseFloat(option.price);
            }
        });
        
        if (isConvertible) {
            const convertibleFeature = allFeatures.find(f => f.name.toLowerCase() === 'convertible');
            if (convertibleFeature) {
                const yesOption = convertibleFeature.options.find(o => o.name.toLowerCase().includes('yes'));
                if (yesOption) {
                    total += parseFloat(yesOption.price_adjustment);
                }
            }
        }
        
        return total;
    };
    
    useEffect(() => {
        if (!loading) {
            const newTotal = calculateTotalPrice();
            setCar(prev => ({
                ...prev,
                total_price: newTotal
            }));
        }
    }, [selectedFeatureOptions, isConvertible, car.base_price, allFeatures]);
    
    const handleSave = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const featureOptions = Object.entries(selectedFeatureOptions).map(([featureId, option]) => ({
                feature_option_id: option.id
            }));
            
            if (isConvertible) {
                const convertibleFeature = allFeatures.find(f => f.name.toLowerCase() === 'convertible');
                if (convertibleFeature) {
                    const yesOption = convertibleFeature.options.find(o => o.name.toLowerCase().includes('yes'));
                    if (yesOption) {
                        featureOptions.push({
                            feature_option_id: yesOption.id
                        });
                    }
                }
            }
            
            const updatedCar = {
                name: car.name,
                base_price: car.base_price,
                total_price: car.total_price, 
                features: featureOptions
            };
            
            await updateCustomItem(id, updatedCar);
            
            navigate(`/customcars/${id}`);
        } catch (err) {
            console.error('Error updating car:', err);
            setError('Failed to update car. Please try again.');

        }
    };
    
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this custom car? This action cannot be undone.')) {
            try {
                setLoading(true);
                await deleteCustomItem(id);
                navigate('/customcars');
            } catch (err) {
                console.error('Error deleting car:', err);
                setError('Failed to delete car. Please try again.');

            }
        }
    };
    
    const [selectedFeature, setSelectedFeature] = useState(null);
    
    if (loading) {
        return (
            <div className="loading-spinner">
                <p>Loading car details...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <Link to={`/customcars/${id}`}>Back to Car Details</Link>
            </div>
        );
    }

    const convertibleFeature = allFeatures.find(f => f.name.toLowerCase() === 'convertible');
    
    const nonConvertibleFeatures = allFeatures.filter(f => f.name.toLowerCase() !== 'convertible');

    return (
        <div className="edit-car-container">
            <h1>Edit Custom Car</h1>
            
            <form className="edit-car-form" onSubmit={handleSave}>
                <div className="form-section">
                    <label htmlFor="name">Car Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={car.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                
                <div className="form-section">
                    <h2>Selected Features</h2>
                    <div className="car-options-row">
                        {nonConvertibleFeatures.map(feature => (
                            <div key={feature.id} className="feature-button-container">
                                <button
                                    type="button"
                                    className={`feature-button ${selectedFeatureOptions[feature.id] ? 'selected' : ''}`}
                                    onClick={() => setSelectedFeature(feature)}
                                >
                                    {feature.name}
                                    {selectedFeatureOptions[feature.id] && (
                                        <span className="selected-option-name">
                                            : {selectedFeatureOptions[feature.id].name}
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
                                        onChange={handleConvertibleChange}
                                    />
                                    Convertible
                                </label>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="form-section">
                    <div className="total-price">
                        Total Price: ${parseFloat(car.total_price).toLocaleString()}
                    </div>
                </div>
                
                <div className="form-actions">
                    <div className="form-actions-left">
                        <button 
                            type="button" 
                            className="delete-button" 
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete Car
                        </button>
                    </div>
                    <div className="form-actions-right">
                        <Link to={`/customcars/${id}`} className="cancel-button">Cancel</Link>
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
            
            {/* Feature Options Modal */}
            {selectedFeature && (
                <FeatureOptions
                    features={[{
                        ...selectedFeature,
                        selectedOption: selectedFeatureOptions[selectedFeature.id] || null
                    }]}
                    onSelectedOption={(featureId, option) => {
                        handleFeatureSelect(featureId, option);
                    }}
                    onClose={() => setSelectedFeature(null)}
                />
            )}
        </div>
    );
}

export default EditCar