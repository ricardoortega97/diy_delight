import React, { useState } from "react";
import '../css/Features.css';

const FeatureList = ({ features, onSelectFeature }) => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleFeatureClick = (feature) => {
        setSelectedFeature(feature.id);
        onSelectFeature(feature);
    };

    return (
        <ul className="feature-list">
            {features.map((feature) => (
                <li 
                    key={feature.id}
                    onClick={() => handleFeatureClick(feature)}
                    className={selectedFeature === feature.id ? 'selected-feature' : ''}
                >
                    {feature.name}
                </li>
            ))}
        </ul>
    );
};

export default FeatureList;