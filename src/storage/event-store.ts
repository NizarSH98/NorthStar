import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export class EventStore {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async append(event: any): Promise<any> {
    const event_id = uuidv4();
    const timestamp = new Date();
    
    const result = await this.pool.query(
      `INSERT INTO event_log (event_id, entity_type, entity_id, event_type, payload, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [event_id, event.entity_type, event.entity_id, event.event_type, event.payload, timestamp]
    );
    
    return result.rows[0];
  }

  async getEvents(entity_id: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM event_log WHERE entity_id = $1 ORDER BY timestamp ASC',
      [entity_id]
    );
    return result.rows;
  }
}
