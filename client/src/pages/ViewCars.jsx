import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../css/Features.css'
import '../css/ViewCars.css'

const ViewCars = (props) => {
    const [cars, setCars] = React.useState([])

    useEffect(() => {
        setCars(props.data || [])   
    }, [props])

    // Format currency for price display
    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
    }

    return (
        <div className="view-cars-container">
            <h1>Custom Cars</h1>
            
            {cars.length === 0 ? (
                <div className="no-cars-message">
                    <p>No custom cars found. Create your first custom car!</p>
                    <Link to="/" className="create-car-link">Create Custom Car</Link>
                </div>
            ) : (
                <div className="car-grid">
                    {cars.map(car => (
                        <div key={car.id} className="car-card">
                            <h2 className="car-name">{car.name}</h2>
                            <div className="car-details">
                                <p className="car-price">Total: {formatPrice(car.total_price)}</p>
                                <p className="feature-count">
                                    {car.feature_count} Feature{car.feature_count !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="car-actions">
                                <Link to={`/customcars/${car.id}`} className="view-details-button">
                                    View Details
                                </Link>
                                <Link to={`/edit/${car.id}`} className="edit-car-button">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ViewCars