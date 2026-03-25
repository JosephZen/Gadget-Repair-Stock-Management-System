import { pool } from './db.js';
import fs from 'fs';

async function test() {
    try {
        const res = await pool.query("SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'supplier_links'");
        fs.writeFileSync('schema_output.json', JSON.stringify(res.rows, null, 2));
        console.log("Schema written to schema_output.json");

    } catch (err) {
        console.error("Test Failed:", err);
    } finally {
        process.exit(0);
    }
}

test();
