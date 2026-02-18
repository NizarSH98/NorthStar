"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStore = void 0;
const pg_1 = require("pg");
const uuid_1 = require("uuid");
class EventStore {
    constructor(connectionString) {
        this.pool = new pg_1.Pool({ connectionString });
    }
    async append(event) {
        const event_id = (0, uuid_1.v4)();
        const timestamp = new Date();
        const result = await this.pool.query(`INSERT INTO event_log (event_id, entity_type, entity_id, event_type, payload, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [event_id, event.entity_type, event.entity_id, event.event_type, event.payload, timestamp]);
        return result.rows[0];
    }
    async getEvents(entity_id) {
        const result = await this.pool.query('SELECT * FROM event_log WHERE entity_id = $1 ORDER BY timestamp ASC', [entity_id]);
        return result.rows;
    }
}
exports.EventStore = EventStore;
