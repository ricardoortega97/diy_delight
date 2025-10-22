import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCustomItem } from '../services/customItemsAPI'
import '../App.css'
import '../css/CarDetails.css'

const CarDetails = (props) => {
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                setLoading(true)
                const data = await getCustomItem(id)
                setCar(data)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching car details:', err)
                setError('Failed to load car details. Please try again.')
                setLoading(false)
            }
        }

        fetchCarDetails()
    }, [id])

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        })
    }

    if (error) {
        return (
            <div className="error-message">
                <p>{error}</p>
                <Link to="/customcars">Back to Custom Cars</Link>
            </div>
        )
    }

    if (!car) {
        return (
            <div className="error-message">
                <p>Car not found</p>
                <Link to="/customcars">Back to Custom Cars</Link>
            </div>
        )
    }

    const groupedFeatures = {}
    
    if (car.selectedFeatures) {
        car.selectedFeatures.forEach(feature => {
            if (!groupedFeatures[feature.feature_name]) {
                groupedFeatures[feature.feature_name] = []
            }
            groupedFeatures[feature.feature_name].push(feature)
        })
    }

    return (
        <div className="car-details-container">
            <div className="car-details-header">
                <h1 className="car-details-name">{car.name}</h1>
                <div className="car-details-price">{formatPrice(car.total_price)}</div>
            </div>
            
            <div className="car-details-section">
                <h3>Base Price</h3>
                <p style={{color: "navy"}}>{formatPrice(car.base_price)}</p>
            </div>
            
            <div className="car-details-section">
                <h3>Selected Features</h3>
                
                {car.selectedFeatures && car.selectedFeatures.length > 0 ? (
                    <div className="feature-list">
                        {Object.entries(groupedFeatures).map(([featureName, options]) => (
                            <div key={featureName} className="feature-item">
                                <span className="feature-name">{featureName}</span>
                                {options.map(option => (
                                    <div key={option.id} className="option-details">
                                        <span className="option-name">{option.option_name}</span>
                                        <span className="option-price">{formatPrice(option.price_adjustment)}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No custom features selected</p>
                )}
            </div>
            
            <div className="car-actions">
                <Link to="/customcars" className="back-button">Back to Cars</Link>
                <Link to={`/edit/${car.id}`} className="edit-button">Edit Car</Link>
            </div>
        </div>
    )
}

export default CarDetails