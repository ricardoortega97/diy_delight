import { pool } from '../config/database.js';

const getAllCustomItems = async (req, res) => {
    try {
        // Get all custom items
        const itemsResult = await pool.query('SELECT * FROM custom_items ORDER BY created_at DESC');
        
        // For each item, get a count of features
        const itemsWithFeatures = await Promise.all(itemsResult.rows.map(async (item) => {
            const featureCountQuery = `
                SELECT COUNT(*) as feature_count 
                FROM custom_item_features 
                WHERE custom_item_id = $1
            `;
            const countResult = await pool.query(featureCountQuery, [item.id]);
            
            return {
                ...item,
                feature_count: parseInt(countResult.rows[0].feature_count)
            };
        }));
        
        res.status(200).json(itemsWithFeatures);
    } catch (err) {
        console.error('Error fetching custom items', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCustomItemById = async (req, res) => {
    const { id } = req.params;
    try {
        // Get the basic custom item info
        const itemResult = await pool.query('SELECT * FROM custom_items WHERE id = $1', [id]);
        
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: 'Custom item not found' });
        }
        
        // Get the selected feature options
        const featuresQuery = `
            SELECT cif.id, cif.feature_option_id, fo.name AS option_name, 
                fo.price_adjustment, f.id AS feature_id, f.name AS feature_name
            FROM custom_item_features cif
            JOIN feature_options fo ON cif.feature_option_id = fo.id
            JOIN features f ON fo.feature_id = f.id
            WHERE cif.custom_item_id = $1
        `;
        
        const featuresResult = await pool.query(featuresQuery, [id]);
        
        // Return the item with its features
        const customItem = {
            ...itemResult.rows[0],
            selectedFeatures: featuresResult.rows
        };
        
        res.status(200).json(customItem);
    } catch (err) {
        console.error('Error fetching custom item by ID', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createCustomItem = async (req, res) => {
    const { name, base_price, total_price, features } = req.body;
    
    // Begin a transaction
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // First, insert the custom item
        const customItemResult = await client.query(
            'INSERT INTO custom_items (name, base_price, total_price) VALUES ($1, $2, $3) RETURNING *',
            [name, base_price, total_price]
        );
        
        const customItemId = customItemResult.rows[0].id;
        
        // Then, insert each feature option
        if (Array.isArray(features) && features.length > 0) {
            for (const feature of features) {
                await client.query(
                    'INSERT INTO custom_item_features (custom_item_id, feature_option_id) VALUES ($1, $2)',
                    [customItemId, feature.feature_option_id]
                );
            }
        }
        
        await client.query('COMMIT');
        
        // Return the created custom item with its ID
        res.status(201).json({
            ...customItemResult.rows[0],
            features: features || []
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error creating custom item', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

const updateCustomItem = async (req, res) => {
    const { id } = req.params;
    const { name, base_price, total_price, features } = req.body;
    
    // Begin a transaction
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // First, check if the item exists
        const checkResult = await client.query(
            'SELECT id FROM custom_items WHERE id = $1',
            [id]
        );
        
        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Custom item not found' });
        }
        
        // Update the basic custom item information
        const updateResult = await client.query(
            'UPDATE custom_items SET name = $1, base_price = $2, total_price = $3 WHERE id = $4 RETURNING *',
            [name, base_price, total_price, id]
        );
        
        // If features are provided, update them
        if (Array.isArray(features)) {
            // First, delete all existing feature options for this item
            await client.query(
                'DELETE FROM custom_item_features WHERE custom_item_id = $1',
                [id]
            );
            
            // Then insert the new feature options
            for (const feature of features) {
                await client.query(
                    'INSERT INTO custom_item_features (custom_item_id, feature_option_id) VALUES ($1, $2)',
                    [id, feature.feature_option_id]
                );
            }
        }
        
        await client.query('COMMIT');
        
        // Get the updated item with its features
        const featuresQuery = `
            SELECT cif.id, cif.feature_option_id, fo.name AS option_name, 
                fo.price_adjustment, f.id AS feature_id, f.name AS feature_name
            FROM custom_item_features cif
            JOIN feature_options fo ON cif.feature_option_id = fo.id
            JOIN features f ON fo.feature_id = f.id
            WHERE cif.custom_item_id = $1
        `;
        
        const featuresResult = await pool.query(featuresQuery, [id]);
        
        // Return the updated item with its features
        const customItem = {
            ...updateResult.rows[0],
            selectedFeatures: featuresResult.rows
        };
        
        res.status(200).json(customItem);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating custom item', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

const deleteCustomItem = async (req, res) => {
    const { id } = req.params;
    
    // Begin a transaction
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // First check if the item exists
        const checkResult = await client.query(
            'SELECT id FROM custom_items WHERE id = $1',
            [id]
        );
        
        if (checkResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Custom item not found' });
        }
        
        await client.query('DELETE FROM custom_item_features WHERE custom_item_id = $1', [id]);
        
        // Then delete the custom item
        await client.query('DELETE FROM custom_items WHERE id = $1', [id]);
        
        await client.query('COMMIT');
        
        res.status(200).json({ message: 'Custom item and related features deleted successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error deleting custom item', err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        client.release();
    }
};

export default { getAllCustomItems, getCustomItemById, createCustomItem, updateCustomItem, deleteCustomItem };