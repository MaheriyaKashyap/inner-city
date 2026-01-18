export type RSVPStatus = 'going' | 'interested';

export interface RSVP {
  event_id: string;
  user_email: string;
  status: RSVPStatus;
}
