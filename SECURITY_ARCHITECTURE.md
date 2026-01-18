# Inner City Ticketing: Security Architecture & Threat Model

## 1. Threat Model for Underground/Personal-Hosted Events

### Threat Actors & Attack Vectors

#### T1: Fake Ticket Generation
- **Actor**: Malicious user, compromised organizer account
- **Attack**: Generate valid-looking tickets without payment or inventory deduction
- **Impact**: Overselling, revenue loss, venue capacity issues
- **Mitigation**: Server-side ticket generation only, cryptographic signatures, payment verification before issuance

#### T2: QR Code Screenshot/Replay
- **Actor**: Ticket holder, scalper
- **Attack**: Screenshot QR code and share/reuse multiple times
- **Impact**: Multiple entries with single ticket, capacity overflow
- **Mitigation**: Time-based rotating QR codes, one-time-use tokens, real-time validation with server state

#### T3: Overselling Inventory
- **Actor**: Organizer, race condition exploiters
- **Attack**: Sell more tickets than available capacity (intentional or race condition)
- **Impact**: Venue overcrowding, safety issues, refund liability
- **Mitigation**: Atomic inventory operations, database constraints, pre-reservation locks

#### T4: Payment Chargebacks
- **Actor**: Buyer (fraudulent or legitimate dispute)
- **Attack**: Purchase ticket, attend event, then chargeback payment
- **Impact**: Revenue loss, Stripe fees, potential account suspension
- **Mitigation**: Clear refund policy, evidence collection (check-in logs), Stripe Radar, hold periods

#### T5: Organizer Scams
- **Actor**: Fake/malicious organizer
- **Attack**: Create fake events, collect payments, never deliver event
- **Impact**: User trust loss, financial fraud, platform liability
- **Mitigation**: Organizer verification tiers, escrow/hold periods, user reporting, event verification

#### T6: Staff Device Offline/Network Issues
- **Actor**: Environmental (network failure, device battery)
- **Attack**: N/A (operational risk)
- **Impact**: Cannot validate tickets, entry delays, potential bypass
- **Mitigation**: Offline-capable validation, cached ticket database, fallback manual verification

#### T7: Collusion Attacks
- **Actor**: Organizer + staff, multiple staff members
- **Attack**: Staff manually marks tickets as checked-in without scanning, or organizer issues "free" tickets
- **Impact**: Revenue loss, inventory manipulation
- **Mitigation**: Audit logs, dual verification, organizer cannot issue tickets post-sale, immutable check-in records

#### T8: Ticket Transfer/Resale Fraud
- **Actor**: Seller, buyer, middleman
- **Attack**: Transfer ticket multiple times, sell fake transfers, transfer after check-in
- **Impact**: Double-selling, invalid transfers, confusion at venue
- **Impact**: Transfer state machine, atomic transfers, check-in validation prevents transfer

---

## 2. Security Goals & Non-Goals

### Security Goals ✅

1. **Ticket Integrity**: Every ticket is cryptographically verifiable and cannot be forged
2. **Inventory Consistency**: Inventory cannot go negative; overselling is prevented at database level
3. **Payment Reconciliation**: Every ticket maps to a verified payment; chargebacks are traceable
4. **One-Time Use**: Each ticket can be checked in exactly once
5. **Audit Trail**: All ticket operations (purchase, transfer, check-in) are immutable and auditable
6. **Offline Resilience**: Check-in works with cached data when network is unavailable
7. **Organizer Accountability**: Organizer actions are logged; cannot retroactively modify sold tickets
8. **Transfer Security**: Transfers are atomic, verifiable, and cannot be double-spent

### Non-Goals ❌

1. **Perfect Anonymity**: We track user identity for fraud prevention and legal compliance
2. **Zero-Downtime**: Acceptable to have brief maintenance windows; prioritize correctness over uptime
3. **Decentralized**: Centralized database for consistency; blockchain not required
4. **Real-Time Fraud Detection**: Basic fraud checks only; advanced ML-based fraud detection is future work
5. **Multi-Currency**: USD only initially; crypto payments are future consideration
6. **Refund Automation**: Manual review for refunds to prevent abuse; automated only for cancellations

---

## 3. Proposed Architecture

### Stack Overview

- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Backend Logic**: Supabase Edge Functions (Deno) for critical operations
- **Payment Processing**: Stripe Connect (marketplace model) for organizer payouts
- **Authentication**: Supabase Auth (email/password, OAuth)
- **Real-time**: Supabase Realtime for live inventory updates
- **File Storage**: Supabase Storage for event media
- **Frontend**: React/TypeScript (existing)

### Database Schema (Core Tables)

```sql
-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  city_id UUID REFERENCES cities(id) NOT NULL,
  tier TEXT CHECK (tier IN ('community', 'official')) NOT NULL,
  title TEXT NOT NULL,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  venue_name TEXT NOT NULL,
  address TEXT,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  ticket_price_cents INTEGER NOT NULL CHECK (ticket_price_cents >= 0),
  status TEXT CHECK (status IN ('draft', 'active', 'cancelled', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket Inventory (prevents overselling)
CREATE TABLE ticket_inventory (
  event_id UUID REFERENCES events(id) ON DELETE CASCADE PRIMARY KEY,
  total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
  sold_count INTEGER DEFAULT 0 CHECK (sold_count >= 0),
  reserved_count INTEGER DEFAULT 0 CHECK (reserved_count >= 0),
  CHECK (sold_count + reserved_count <= total_capacity),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  transfer_from_id UUID REFERENCES auth.users(id), -- NULL if original purchase
  qr_secret TEXT NOT NULL UNIQUE, -- Cryptographic secret for QR generation
  qr_rotation_nonce INTEGER DEFAULT 0, -- Increments for time-based rotation
  status TEXT CHECK (status IN ('active', 'transferred', 'checked_in', 'refunded', 'expired')) DEFAULT 'active',
  ticket_type TEXT NOT NULL,
  purchase_price_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE, -- Links to Stripe payment
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES auth.users(id), -- Staff member who checked in
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Auto-expire after event ends
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment Records (reconciliation)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) UNIQUE NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL, -- Our cut
  organizer_payout_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  stripe_connect_account_id TEXT NOT NULL, -- Organizer's Stripe Connect account
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'disputed')) DEFAULT 'pending',
  chargeback_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transfers (audit trail)
CREATE TABLE ticket_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) NOT NULL,
  from_user_id UUID REFERENCES auth.users(id) NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) NOT NULL,
  transfer_price_cents INTEGER DEFAULT 0, -- 0 for free transfers
  status TEXT CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Check-in Logs (immutable audit trail)
CREATE TABLE check_in_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  checked_in_by UUID REFERENCES auth.users(id) NOT NULL, -- Staff member
  device_id TEXT, -- Staff device identifier
  qr_secret TEXT NOT NULL, -- Snapshot of QR at check-in time
  qr_nonce INTEGER NOT NULL, -- Snapshot of nonce
  location_lat DECIMAL(10, 8), -- Optional GPS
  location_lng DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Organizer Accounts (Stripe Connect)
CREATE TABLE organizer_accounts (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  stripe_connect_account_id TEXT UNIQUE NOT NULL,
  verification_status TEXT CHECK (verification_status IN ('unverified', 'pending', 'verified')) DEFAULT 'unverified',
  payout_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_buyer_id ON tickets(buyer_id);
CREATE INDEX idx_tickets_qr_secret ON tickets(qr_secret);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_check_in_logs_ticket_id ON check_in_logs(ticket_id);
CREATE INDEX idx_check_in_logs_event_id ON check_in_logs(event_id);
CREATE INDEX idx_payments_stripe_pi_id ON payments(stripe_payment_intent_id);
```

### Row Level Security (RLS) Policies

```sql
-- Users can only read their own tickets
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = transfer_from_id);

-- Organizers can view tickets for their events
CREATE POLICY "Organizers can view event tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Only system/edge functions can insert tickets
CREATE POLICY "Only service role can insert tickets"
  ON tickets FOR INSERT
  WITH CHECK (false); -- Enforced via Edge Function

-- Check-in logs are append-only (no updates/deletes)
CREATE POLICY "Anyone authenticated can read check-in logs"
  ON check_in_logs FOR SELECT
  USING (auth.role() = 'authenticated');
```

### Edge Functions Architecture

#### `purchase-ticket` (Deno/Supabase Edge Function)
- **Input**: `{ eventId, ticketType, paymentMethodId }`
- **Process**:
  1. Validate event exists and is active
  2. Reserve inventory atomically (SELECT FOR UPDATE)
  3. Create Stripe PaymentIntent with Connect account
  4. On payment success: generate ticket with cryptographic QR secret
  5. Update inventory (sold_count++)
  6. Create payment record
- **Output**: `{ ticketId, qrCodeUrl }`
- **Invariants**: Inventory never goes negative; payment must succeed before ticket creation

#### `check-in-ticket` (Deno/Supabase Edge Function)
- **Input**: `{ qrSecret, qrNonce, eventId, staffUserId }`
- **Process**:
  1. Lookup ticket by qr_secret
  2. Validate ticket status is 'active' (not checked_in, not transferred)
  3. Validate event_id matches
  4. Validate qr_nonce matches (within tolerance for clock skew)
  5. Atomic update: ticket.status = 'checked_in', checked_in_at = NOW()
  6. Insert immutable check_in_log record
- **Output**: `{ success: true, ticketId }` or error
- **Invariants**: Ticket can only be checked in once; check-in is logged immutably

#### `transfer-ticket` (Deno/Supabase Edge Function)
- **Input**: `{ ticketId, toUserId, transferPriceCents? }`
- **Process**:
  1. Validate ticket belongs to current user
  2. Validate ticket status is 'active' (not checked_in)
  3. Validate event hasn't started
  4. Create transfer record (status: 'pending')
  5. If paid transfer: process payment
  6. Atomic update: ticket.buyer_id = toUserId, ticket.status = 'transferred'
  7. Update transfer record (status: 'completed')
- **Output**: `{ transferId, newTicketOwner }`
- **Invariants**: Transfer is atomic; ticket cannot be transferred after check-in

#### `generate-qr-code` (Deno/Supabase Edge Function)
- **Input**: `{ ticketId }`
- **Process**:
  1. Fetch ticket with current qr_secret and qr_rotation_nonce
  2. Generate time-based token: `HMAC-SHA256(qr_secret + qr_rotation_nonce + current_hour)`
  3. Return QR code data URL
- **Output**: `{ qrCodeDataUrl, expiresAt }`
- **Note**: QR codes rotate hourly; nonce increments on each rotation

#### `sync-staff-offline` (Deno/Supabase Edge Function)
- **Input**: `{ eventId, lastSyncTimestamp }`
- **Process**:
  1. Return all tickets for event that are 'active' status
  2. Include qr_secret, qr_rotation_nonce, ticket metadata
  3. Client caches for offline validation
- **Output**: `{ tickets: [...], syncTimestamp }`

### Stripe Connect Integration

- **Model**: Marketplace (Stripe Connect)
- **Flow**:
  1. Organizer connects Stripe account via OAuth
  2. We store `stripe_connect_account_id` in `organizer_accounts`
  3. On ticket purchase: Create PaymentIntent with `on_behalf_of` = organizer's Connect account
  4. Application fee: 10% (configurable)
  5. Payout: Automatic to organizer (7-day delay for chargeback protection)
- **Chargeback Handling**: Webhook listens for disputes; mark payment as 'disputed', notify organizer

---

## 4. Core Invariants (MUST Hold)

### I1: Inventory Consistency
```
FORALL event_id: 
  ticket_inventory.sold_count + ticket_inventory.reserved_count <= ticket_inventory.total_capacity
```
- **Enforcement**: Database CHECK constraint + atomic SELECT FOR UPDATE in purchase flow
- **Violation Detection**: Database constraint violation triggers rollback

### I2: One Ticket, One Check-In
```
FORALL ticket_id:
  COUNT(check_in_logs WHERE ticket_id = X) <= 1
  AND ticket.status = 'checked_in' IFF EXISTS(check_in_log WHERE ticket_id = X)
```
- **Enforcement**: Atomic UPDATE with WHERE status = 'active'; check-in log insertion in same transaction
- **Violation Detection**: Duplicate check-in attempt returns error; log shows attempt

### I3: Payment-Ticket Reconciliation
```
FORALL ticket_id WHERE ticket.status != 'refunded':
  EXISTS(payment WHERE payment.ticket_id = ticket_id AND payment.status = 'succeeded')
```
- **Enforcement**: Ticket creation only after PaymentIntent succeeds; foreign key constraint
- **Violation Detection**: Daily reconciliation job flags orphaned tickets or payments

### I4: Transfer Validity
```
FORALL ticket_id:
  ticket.status = 'transferred' IFF EXISTS(transfer WHERE transfer.ticket_id = ticket_id AND transfer.status = 'completed')
  AND ticket.status != 'checked_in' -> transfer allowed
```
- **Enforcement**: Transfer function validates status before allowing transfer
- **Violation Detection**: Transfer attempt on checked-in ticket returns error

### I5: QR Code Uniqueness
```
FORALL qr_secret: COUNT(tickets WHERE qr_secret = X) = 1
```
- **Enforcement**: UNIQUE constraint on qr_secret column
- **Violation Detection**: Database constraint violation on ticket creation

### I6: Immutable Check-In Logs
```
FORALL check_in_log_id: 
  check_in_log.created_at is immutable
  AND check_in_log.ticket_id, qr_secret, checked_in_by are immutable
```
- **Enforcement**: No UPDATE/DELETE policies on check_in_logs; append-only
- **Violation Detection**: RLS policy prevents modifications

### I7: Organizer Cannot Issue Post-Sale Tickets
```
FORALL ticket_id:
  ticket.created_at >= event.start_at - 24h OR ticket is refunded/replaced
```
- **Enforcement**: Edge function validates event timing before ticket creation
- **Note**: Allow 24h grace period for legitimate replacements

---

## 5. Phased MVP Plan

### Phase 1: RSVP + External Links (Weeks 1-2)
**Goal**: Validate event discovery and engagement without payment risk

**Features**:
- RSVP system (Going/Interested) - no payment
- External ticket links (Ticketmaster, Eventbrite) - redirect only
- Event creation and listing
- Basic user profiles

**Database**:
- `events` table (simplified, no capacity/pricing)
- `rsvps` table (user_id, event_id, status: 'going' | 'interested')
- No tickets, no payments

**Security**: Minimal (RLS on RSVPs, basic auth)

---

### Phase 2: Native Tickets (Weeks 3-6)
**Goal**: End-to-end ticket purchase and check-in

**Features**:
- Stripe Connect onboarding for organizers
- Ticket purchase flow (PaymentIntent → ticket creation)
- QR code generation and display
- Basic check-in (online only)
- Wallet view

**Database**:
- Full schema as described above
- `ticket_inventory`, `tickets`, `payments`, `check_in_logs`

**Edge Functions**:
- `purchase-ticket`
- `check-in-ticket`
- `generate-qr-code`

**Security**: Full RLS, inventory constraints, payment reconciliation

**Testing**: 
- Load test inventory reservation (race conditions)
- Test chargeback scenarios
- Test duplicate check-in attempts

---

### Phase 3: Resale/Transfer (Weeks 7-10)
**Goal**: Enable ticket transfers and resale marketplace

**Features**:
- Free transfers (user-to-user)
- Paid transfers (resale with platform fee)
- Transfer marketplace/listing
- Transfer notifications

**Database**:
- `ticket_transfers` table
- Update `tickets` with transfer_from_id

**Edge Functions**:
- `transfer-ticket`
- `list-transfer` (optional marketplace)

**Security**: Transfer validation, prevent transfer after check-in

**Testing**:
- Test transfer after check-in (should fail)
- Test double-transfer attempts
- Test paid transfer payment flow

---

### Phase 4: Offline Check-In (Weeks 11-12)
**Goal**: Staff can check in tickets without internet

**Features**:
- Offline ticket database sync (staff app)
- Local QR validation with cached secrets
- Sync check-ins when online
- Conflict resolution (if ticket checked in elsewhere)

**Edge Functions**:
- `sync-staff-offline` (already described)

**Client**: Staff PWA with IndexedDB cache

**Security**: Cached secrets expire after 24h; sync validates against server state

---

## 6. Implementation Flow: Purchase → Ticket → Wallet → Check-In → Payout

### Flow Diagram (Bullet Format)

```
┌─────────────────────────────────────────────────────────────────┐
│ PURCHASE FLOW                                                    │
└─────────────────────────────────────────────────────────────────┘

1. User selects event + ticket type
   └─> Frontend: EventDetail.tsx → Purchase button

2. Frontend calls Edge Function: purchase-ticket
   POST /functions/v1/purchase-ticket
   Body: { eventId, ticketType, paymentMethodId }

3. Edge Function: purchase-ticket
   ├─> Validate event exists, is active, has capacity
   ├─> BEGIN TRANSACTION
   ├─> SELECT FOR UPDATE ticket_inventory WHERE event_id = X
   │   └─> Lock row to prevent race conditions
   ├─> Check: sold_count + reserved_count < total_capacity
   │   └─> If false: ROLLBACK, return "Sold out"
   ├─> UPDATE ticket_inventory SET reserved_count = reserved_count + 1
   ├─> Create Stripe PaymentIntent
   │   ├─> amount: event.ticket_price_cents
   │   ├─> application_fee_amount: 10% of amount
   │   ├─> on_behalf_of: organizer.stripe_connect_account_id
   │   └─> payment_method: paymentMethodId
   ├─> Confirm PaymentIntent (charge card)
   │   └─> If fails: ROLLBACK, release reservation
   ├─> Generate cryptographic qr_secret: crypto.randomUUID()
   ├─> INSERT INTO tickets
   │   ├─> id: gen_random_uuid()
   │   ├─> event_id, buyer_id, qr_secret
   │   ├─> status: 'active'
   │   ├─> stripe_payment_intent_id
   │   └─> expires_at: event.end_at + 1 day
   ├─> UPDATE ticket_inventory
   │   ├─> sold_count = sold_count + 1
   │   └─> reserved_count = reserved_count - 1
   ├─> INSERT INTO payments
   │   ├─> ticket_id, event_id, buyer_id, organizer_id
   │   ├─> amount_cents, platform_fee_cents, organizer_payout_cents
   │   ├─> stripe_payment_intent_id
   │   └─> status: 'succeeded'
   └─> COMMIT TRANSACTION
   └─> Return: { ticketId, qrSecret }

4. Frontend receives ticketId
   └─> Call generate-qr-code Edge Function
   └─> Display QR code in Wallet screen
   └─> Show success notification


┌─────────────────────────────────────────────────────────────────┐
│ TICKET ISSUANCE (QR Code Generation)                            │
└─────────────────────────────────────────────────────────────────┘

1. User opens Wallet screen
   └─> Frontend: Wallet.tsx → Fetch user tickets

2. For each ticket, call Edge Function: generate-qr-code
   GET /functions/v1/generate-qr-code?ticketId=XXX

3. Edge Function: generate-qr-code
   ├─> SELECT ticket WHERE id = ticketId AND buyer_id = auth.uid()
   ├─> Validate ticket.status = 'active'
   ├─> Calculate current hour: Math.floor(Date.now() / 3600000)
   ├─> Generate token: HMAC-SHA256(
   │     qr_secret + 
   │     qr_rotation_nonce + 
   │     current_hour
   │   )
   ├─> Encode token as QR code (data URL)
   └─> Return: { qrCodeDataUrl, expiresAt: next_hour }

4. Frontend displays QR code
   └─> QR rotates every hour (client refetches)


┌─────────────────────────────────────────────────────────────────┐
│ CHECK-IN FLOW                                                    │
└─────────────────────────────────────────────────────────────────┘

1. Staff opens check-in app (PWA or native)
   └─> Authenticate as staff user (organizer or delegated staff)

2. Staff scans QR code (or manually enters)
   └─> Extract token from QR

3. Staff app calls Edge Function: check-in-ticket
   POST /functions/v1/check-in-ticket
   Body: { qrToken, eventId, staffUserId, deviceId?, location? }

4. Edge Function: check-in-ticket
   ├─> Decode qrToken to extract qr_secret + nonce + hour
   ├─> BEGIN TRANSACTION
   ├─> SELECT ticket WHERE qr_secret = X FOR UPDATE
   │   └─> Lock ticket row
   ├─> Validate ticket exists
   ├─> Validate ticket.event_id = eventId
   ├─> Validate ticket.status = 'active'
   │   └─> If 'checked_in': ROLLBACK, return "Already checked in"
   ├─> Validate ticket.qr_rotation_nonce matches (within tolerance)
   ├─> Validate ticket.expires_at > NOW()
   │   └─> If expired: ROLLBACK, return "Ticket expired"
   ├─> UPDATE tickets
   │   ├─> status = 'checked_in'
   │   ├─> checked_in_at = NOW()
   │   └─> checked_in_by = staffUserId
   ├─> INSERT INTO check_in_logs (immutable)
   │   ├─> ticket_id, event_id, checked_in_by
   │   ├─> qr_secret (snapshot), qr_nonce (snapshot)
   │   ├─> device_id, location (optional)
   │   └─> created_at = NOW()
   └─> COMMIT TRANSACTION
   └─> Return: { success: true, ticketId, checkedInAt }

5. Staff app shows success
   └─> Update UI, play success sound
   └─> If offline: Queue for sync when online


┌─────────────────────────────────────────────────────────────────┐
│ OFFLINE CHECK-IN (Phase 4)                                      │
└─────────────────────────────────────────────────────────────────┘

1. Staff app syncs tickets before event
   └─> Call sync-staff-offline Edge Function
   └─> Cache tickets in IndexedDB (PWA) or SQLite (native)

2. When offline:
   ├─> Validate QR token locally (same HMAC algorithm)
   ├─> Check cached ticket status
   ├─> If valid: Mark as checked-in locally
   └─> Queue check-in for sync

3. When online:
   ├─> Sync queued check-ins to server
   ├─> Server validates (may fail if checked in elsewhere)
   └─> Resolve conflicts (show to staff for manual review)


┌─────────────────────────────────────────────────────────────────┐
│ PAYOUT FLOW (Stripe Connect)                                    │
└─────────────────────────────────────────────────────────────────┘

1. Payment succeeds (from Purchase Flow)
   └─> Stripe PaymentIntent status = 'succeeded'
   └─> Payment record created with status = 'succeeded'

2. Stripe automatically transfers to organizer's Connect account
   └─> Amount: organizer_payout_cents
   └─> Timeline: 7 days after payment (chargeback protection)
   └─> Platform fee retained by Inner City account

3. Webhook: stripe.payout.paid
   └─> Update payment record (optional: add payout_id)

4. Webhook: stripe.charge.dispute.created
   ├─> Update payment.status = 'disputed'
   ├─> INSERT INTO payment_disputes (if tracking table exists)
   ├─> Notify organizer via email/in-app
   └─> Hold future payouts until dispute resolved


┌─────────────────────────────────────────────────────────────────┐
│ TRANSFER FLOW (Phase 3)                                         │
└─────────────────────────────────────────────────────────────────┘

1. User initiates transfer
   └─> Frontend: Wallet.tsx → Transfer button

2. Frontend calls Edge Function: transfer-ticket
   POST /functions/v1/transfer-ticket
   Body: { ticketId, toUserId, transferPriceCents? }

3. Edge Function: transfer-ticket
   ├─> BEGIN TRANSACTION
   ├─> SELECT ticket WHERE id = ticketId FOR UPDATE
   ├─> Validate ticket.buyer_id = auth.uid()
   ├─> Validate ticket.status = 'active'
   │   └─> If 'checked_in': ROLLBACK, return "Cannot transfer checked-in ticket"
   ├─> SELECT event WHERE id = ticket.event_id
   ├─> Validate event.start_at > NOW()
   │   └─> If event started: ROLLBACK, return "Event has started"
   ├─> INSERT INTO ticket_transfers
   │   ├─> ticket_id, from_user_id, to_user_id
   │   ├─> transfer_price_cents (0 if free)
   │   └─> status = 'pending'
   ├─> If transferPriceCents > 0:
   │   ├─> Create Stripe PaymentIntent (buyer pays)
   │   ├─> Application fee: 10% of transfer_price_cents
   │   └─> On success: proceed
   ├─> UPDATE tickets
   │   ├─> buyer_id = toUserId
   │   ├─> transfer_from_id = old_buyer_id
   │   └─> status = 'transferred'
   ├─> UPDATE ticket_transfers
   │   └─> status = 'completed', completed_at = NOW()
   └─> COMMIT TRANSACTION
   └─> Return: { transferId, newOwner }

4. Frontend updates Wallet
   └─> Ticket removed from sender's wallet
   └─> Notification sent to recipient
```

---

## 7. Additional Security Considerations

### Rate Limiting
- Purchase attempts: 5 per minute per user
- Check-in attempts: 100 per minute per staff member
- QR generation: 10 per minute per user

### Monitoring & Alerts
- Inventory going negative (should never happen)
- Duplicate check-in attempts (potential fraud)
- Chargeback rate > 2% (organizer risk)
- Failed payment rate > 10% (payment issue)

### Backup & Recovery
- Daily database backups (Supabase automatic)
- Point-in-time recovery (PostgreSQL WAL)
- Test restore procedures monthly

### Compliance
- PCI-DSS: Stripe handles card data (we never touch it)
- GDPR: User data deletion on request
- Tax: Organizer responsible for tax collection (we provide transaction records)

---

## 8. Testing Strategy

### Unit Tests
- Inventory reservation logic (race conditions)
- QR code generation/validation
- Transfer validation rules

### Integration Tests
- End-to-end purchase flow
- Check-in flow (online + offline)
- Transfer flow
- Payment reconciliation

### Load Tests
- Concurrent purchases (test inventory locking)
- Concurrent check-ins (test duplicate prevention)
- QR code generation under load

### Security Tests
- Attempt to create ticket without payment
- Attempt duplicate check-in
- Attempt to transfer checked-in ticket
- Attempt to oversell inventory (race condition)

---

## Appendix: Edge Function Code Structure

```
supabase/functions/
├── purchase-ticket/
│   ├── index.ts
│   └── types.ts
├── check-in-ticket/
│   ├── index.ts
│   └── types.ts
├── transfer-ticket/
│   ├── index.ts
│   └── types.ts
├── generate-qr-code/
│   ├── index.ts
│   └── types.ts
└── sync-staff-offline/
    ├── index.ts
    └── types.ts
```

Each function:
- Validates auth token
- Performs business logic
- Uses Supabase client with service role for database operations
- Returns JSON response
- Handles errors gracefully

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Author**: Security & Backend Architecture Team
