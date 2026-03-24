import { pool } from './db.js';
import fs from 'fs';

async function extractSchema() {
    try {
        const query = `
            SELECT t.table_name, c.column_name, c.data_type, c.character_maximum_length 
            FROM information_schema.tables t
            JOIN information_schema.columns c ON t.table_name = c.table_name
            WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
            ORDER BY t.table_name, c.ordinal_position;
        `;
        const res = await pool.query(query);
        let output = "--- Extracted Neon Schema ---\n";
        
        let currentTable = "";
        res.rows.forEach(row => {
            if (currentTable !== row.table_name) {
                currentTable = row.table_name;
                output += `\nTABLE: ${currentTable}\n`;
            }
            output += `  - ${row.column_name}: ${row.data_type} ${row.character_maximum_length ? '('+row.character_maximum_length+')' : ''}\n`;
        });

        fs.writeFileSync('../neon_schema_export.txt', output);
        console.log("Schema exported successfully!");
        process.exit(0);
    } catch(err) {
        console.error("Schema extraction failed:", err);
        process.exit(1);
    }
}
extractSchema();
