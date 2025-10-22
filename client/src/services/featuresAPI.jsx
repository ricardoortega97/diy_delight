const getAllFeatures = async () => {
    const response = await fetch('/api/features');
    const data = await response.json();
    
    const featuresMap = {};
    
    const baseFeatures = [
        { id: 1, name: 'color', options: [] },
        { id: 2, name: 'wheels', options: [] },
        { id: 3, name: 'interior', options: [] },
        { id: 4, name: 'roof', options: [] },
        { id: 5, name: 'convertible', options: [] }
    ];
    
    baseFeatures.forEach(feature => {
        featuresMap[feature.id] = {
            ...feature
        };
    });
    
    data.forEach(row => {
        const featureId = row.feature_id;
        
        if (featuresMap[featureId]) {
            featuresMap[featureId].options.push({
                id: row.id,
                name: row.name,
                price: row.price_adjustment
            });
        }
    });
    
    return Object.values(featuresMap);
};

export { getAllFeatures };