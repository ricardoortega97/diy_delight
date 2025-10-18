import { pool } from './database.js';
import dotenv from '../config/dotenv.js';
import featureOptions from '../data/featureOptions.js';
import features from '../data/features.js';

const custom_items = [];
const custom_item_features = [];

const createCustomItemsTables = async () => {
    const createTableQuery = `
    -- drop in order that avoids FK conflicts
    DROP TABLE IF EXISTS custom_item_features;
    DROP TABLE IF EXISTS feature_options;
    DROP TABLE IF EXISTS features;
    DROP TABLE IF EXISTS custom_items;

    CREATE TABLE custom_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE features (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
    );

    CREATE TABLE feature_options (
        id SERIAL PRIMARY KEY,
        feature_id INT REFERENCES features(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        price_adjustment DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE custom_item_features (
        id SERIAL PRIMARY KEY,
        custom_item_id INT REFERENCES custom_items(id) ON DELETE CASCADE,
        feature_option_id INT REFERENCES feature_options(id) ON DELETE CASCADE
    );
    `;

    try {
        await pool.query(createTableQuery);
        console.log('Custom items tables created successfully');
    } catch (err) {
        console.error('Error creating custom items tables', err);
        throw err;
    }
};

const seedCustomItemsData = async () => {
    try {
        await createCustomItemsTables();

        if (custom_items.length === 0) console.log('No custom_items to seed (skipping)');
        for (const item of custom_items) {
            const insertCustomItemsQuery = `INSERT INTO custom_items (name, base_price, total_price)
            VALUES ($1, $2, $3) RETURNING id`;
            const values = [
                item.name,
                item.base_price,
                item.total_price
            ];
            try {
                const res = await pool.query(insertCustomItemsQuery, values);
                console.log(`Inserted custom item with ID: ${res.rows[0].id}`);
            } catch (err) {
                console.error('Error inserting custom item', err);
            }
        }

        if (!Array.isArray(features) || features.length === 0) console.log('No features to seed (skipping)');
        for (const feature of features) {
            const insertFeatureQuery = `INSERT INTO features (name) VALUES ($1) RETURNING id`;
            const values = [feature.name];
            try {
                const res = await pool.query(insertFeatureQuery, values);
                console.log(`Inserted feature with ID: ${res.rows[0].id}`);
            } catch (err) {
                console.error('Error inserting feature', err);
            }
        }

        if (!Array.isArray(featureOptions) || featureOptions.length === 0) console.log('No featureOptions to seed (skipping)');
        for (const option of featureOptions) {
            const insertFeatureOptionQuery = `INSERT INTO feature_options (feature_id, name, price_adjustment) VALUES ($1, $2, $3) RETURNING id`;
            const values = [
                option.feature_id,
                option.name, 
                option.price_adjustment
            ];
            try {
                const res = await pool.query(insertFeatureOptionQuery, values);
                console.log(`Inserted feature option with ID: ${res.rows[0].id}`);
            } catch (err) {
                console.error('Error inserting feature option', err);
            }
        }

        if (custom_item_features.length === 0) console.log('No custom_item_features to seed (skipping)');
        for (const cif of custom_item_features) {
            const insertCustomItemFeatureQuery = `INSERT INTO custom_item_features (custom_item_id, feature_option_id) VALUES ($1, $2) RETURNING id`;
            const values = [
                cif.custom_item_id,
                cif.feature_option_id
            ];
            try {
                const res = await pool.query(insertCustomItemFeatureQuery, values);
                console.log(`Inserted custom item feature with ID: ${res.rows[0].id}`);
            } catch (err) {
                console.error('Error inserting custom item feature', err);
            }
        }

        console.log('Custom items data seeded successfully');
    } catch (err) {
        console.error('Error seeding custom items data', err);
    }
};

seedCustomItemsData();


