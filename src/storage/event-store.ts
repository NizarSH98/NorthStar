import { Pool } from 'pg';
import { Event, UUID } from '../models/types';
import { randomUUID } from 'crypto';

export class EventStore {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString });
  }

  async append(
    entity_type: Event['entity_type'],
    entity_id: UUID,
    event_type: Event['event_type'],
    payload: Record<string, any>
  ): Promise<Event> {
    const event_id = randomUUID();
    const timestamp = new Date();

    const result = await this.pool.query(
      `INSERT INTO event_log (event_id, entity_type, entity_id, event_type, payload, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [event_id, entity_type, entity_id, event_type, JSON.stringify(payload), timestamp]
    );

    return result.rows[0];
  }

  async getEvents(entity_id: UUID): Promise<Event[]> {
    const result = await this.pool.query(
      'SELECT * FROM event_log WHERE entity_id = $1 ORDER BY timestamp ASC',
      [entity_id]
    );
    return result.rows;
  }

  async getEventsByType(entity_type: Event['entity_type']): Promise<Event[]> {
    const result = await this.pool.query(
      'SELECT * FROM event_log WHERE entity_type = $1 ORDER BY timestamp DESC LIMIT 100',
      [entity_type]
    );
    return result.rows;
  }

  async replayEvents(entity_id: UUID): Promise<any> {
    const events = await this.getEvents(entity_id);
    let state: any = {};

    for (const event of events) {
      state = { ...state, ...event.payload };
    }

    return { state, events };
  }
}
