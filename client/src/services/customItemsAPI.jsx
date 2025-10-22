const createCustomItem = async (customItemData) => {
    const response = await fetch('/api/custom-items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customItemData),
    });
    const data = await response.json();
    return data;
};

const getAllCustomItems = async () => {
    const response = await fetch('/api/custom-items');
    const data = await response.json();
    return data;
};

const getCustomItem = async (id) => {
    const response = await fetch(`/api/custom-items/${id}`);
    const data = await response.json();
    return data;
};

const updateCustomItem = async (id, customItemData) => {
    const response = await fetch(`/api/custom-items/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customItemData),
    });
    const data = await response.json();
    return data;
};

const deleteCustomItem = async (id) => {
    const response = await fetch(`/api/custom-items/${id}`, {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
};

export { createCustomItem, getAllCustomItems, getCustomItem, updateCustomItem, deleteCustomItem };