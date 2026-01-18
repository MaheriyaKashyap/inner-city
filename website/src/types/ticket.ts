export type TicketType = 'neural_key' | 'ticketmaster';

export type TicketStatus = 'active' | 'used' | 'expired';

export interface Ticket {
  event_id: string;
  user_email: string;
  ticket_type?: TicketType;
  status?: TicketStatus;
  qr_code?: string;
  gate?: string;
  section?: string;
  purchase_date?: string; // ISO date-time string
}
