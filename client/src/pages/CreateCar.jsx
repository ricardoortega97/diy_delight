import React, { useState, useEffect } from 'react'
import '../App.css'
import '../css/Features.css'
import CustomCarForm from '../components/CustomCarForm'
import { getAllFeatures } from '../services/featuresAPI'
import { createCustomItem } from '../services/customItemsAPI'
import { useNavigate } from 'react-router-dom'

const CreateCar = (props) => {
    const navigate = useNavigate();
    const [features, setFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setIsLoading(true);
        getAllFeatures()
            .then((data) => {
                setFeatures(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error loading features:', err);
                setIsLoading(false);
                setMessage('Failed to load features. Please try again later.');
            });
    }, []);
    
    const handleCreateCar = async (carData) => {
        try {
            setIsLoading(true);
            setMessage('');
            
            const result = await createCustomItem(carData);
            
            setMessage('Custom car created successfully!');
            console.log('Created custom car:', result);
            
            navigate('/customcars');
            
        } catch (error) {
            console.error('Error creating custom car:', error);
            setMessage('Failed to create custom car. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="create-car-page">
            <div className="feature-selection">
                <h2>Customize Your Car</h2>
                
                {isLoading ? (
                    <p>Loading features...</p>
                ) : message ? (
                    <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
                        {message}
                    </div>
                ) : features && features.length > 0 ? (
                    <CustomCarForm
                        features={features}
                        onCreateCar={handleCreateCar}
                    />
                ) : (
                    <p>No features available. Please try again later.</p>
                )}
            </div>
        </div>
    )
}

export default CreateCar