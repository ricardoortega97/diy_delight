const getAllCars = async () => {
    const response = await fetch('/api/cars')
    const data = await response.json()
    return data
};

const getCar = async (carId) => {
    const response = await fetch(`/api/cars/${carId}`);
    const data = await response.json();
    return data;
};

const createCar = async (carData) => {
    const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
    });
    const data = await response.json();
    return data;
};

export { getAllCars, getCar, createCar }; 
