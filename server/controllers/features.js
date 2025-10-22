import { pool } from '../config/database.js';

const getAllFeatures = async (req, res) => {
    try {
        // Get both features and feature options
        const result = await pool.query(`
            SELECT fo.id, fo.feature_id, fo.name, fo.price_adjustment
            FROM feature_options fo
            ORDER BY fo.feature_id, fo.id
        `);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching features', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getAllFeatures };