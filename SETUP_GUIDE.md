# Vatsal Backend Setup & Migration Guide

## Admin User Setup (One-time)

To create the initial admin user, run the seed script:

```bash
cd server
node scripts/seedAdmin.js
```

**Default Credentials:**
- Email: `admin@vatsal.local`
- Password: `admin123` (⚠️ **CHANGE THIS IMMEDIATELY** after first login)

## Environment Variables
### MongoDB username index issue
If you see errors like:

```
MongoServerError: E11000 duplicate key error collection: vatsal.users index: username_1 dup key: { username: null }
```

it means the database has a unique index on `username` that was created before we made the field sparse/optional.  Documents with `username: null` conflict because the index treats `null` as a value.

To resolve:

1. Remove any null usernames from existing records:
   ```js
   db.users.updateMany({ username: null }, { $unset: { username: 1 } });
   ```
2. Drop the old index and let Mongoose recreate it with the proper options:
   ```js
   db.users.dropIndex('username_1');
   ```
   (Mongoose will recreate a sparse partial index on next startup.)
3. In future the code only sets `username` for elders, so null values are never inserted.

This fix is included in the schema (`partialFilterExpression` + `sparse: true`) and registration logic.

### Environment Variables
Create a `.env` file in the `server` directory with:

```env
MONGODB_URI=mongodb://localhost:27017/vatsal
JWT_SECRET=your-secret-key-here
PORT=5000

# Email Service Configuration (optional, for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Database Models Updates

### User Model
- ✅ Added `elderIds[]` — supports families linking multiple elders
- ✅ Added `isActive` flag — tracks provider activation status
- ✅ Added support for roles: `elder`, `family`, `doctor`, `companion`, `nurse`, `admin`

### Booking Model
- ✅ Added `elder` field — links each booking to the elder user
- ✅ Added `serviceType` enum — `Doctor`, `Companion`, `Event`
- ✅ Added `confirmationStatus` — tracks provider confirmation state (`Waiting`, `Confirmed`, `Rejected`)
- ✅ Added `confirmedBy` — tracks which provider confirmed the booking
- ✅ Updated `status` enum — added `Pending Confirmation` and `Rejected` states

## API Endpoints

### Auth Routes
- `POST /api/auth/register` — Register new user (supports all roles + multi-elder)
- `POST /api/auth/login` — Login (blocked for inactive providers)
- `GET /api/auth/me` — Get current user profile + linked elders (protected)

### Admin Routes (admin-only)
- `GET /api/admin/pending-providers` — List providers awaiting activation
- `GET /api/admin/active-providers` — List all active providers
- `PUT /api/admin/activate/:providerId` — Activate provider + send email
- `PUT /api/admin/deactivate/:providerId` — Deactivate provider
- `GET /api/admin/signups` — View all signups by role
- `GET /api/admin/providers/browse` — Browse active providers (protected: elder/family)

### Booking Routes
- `POST /api/bookings/create` — Create booking (family selects elder + service type)
- `GET /api/bookings/my-bookings?elderId=...` — Get bookings for specific elder
- `GET /api/bookings/pending` — Get pending confirmations (provider-only)
- `PUT /api/bookings/:bookingId/confirm` — Provider confirms booking
- `PUT /api/bookings/:bookingId/reject` — Provider rejects booking

### Health Routes (Updated)
- `GET /api/health/list?elderId=...` — Family can request specific elder's data

## Workflow

### 1. Provider Registration & Activation
1. Provider signs up as `doctor`, `companion`, or `nurse`
2. Account created with `isActive: false`
3. Admin reviews pending providers at `/api/admin/pending-providers`
4. Admin activates provider → activation email sent
5. Provider can now log in and receive bookings

### 2. Booking Confirmation
1. Family books companion/event with service date/time
2. Booking created with `confirmationStatus: Waiting`
3. Provider receives booking notification
4. Provider confirms/rejects via `/api/bookings/:bookingId/confirm` or `/reject`
5. Elder sees confirmed booking on dashboard
6. Family receives confirmation email

### 3. Family Manages Multiple Elders
1. Family registers with `elderUsername` to link one elder
2. Family can view linked elder's data via dropdown
3. All bookings for linked elder visible in one view
4. Each booking action applies to selected elder

## Email Service

Currently uses **nodemailer** (can swap for SendGrid, AWS SES, etc.)

Emails sent:
- **Provider activation** → confirmation + login instructions
- **Booking request** → to provider (needs confirmation)
- **Booking confirmed** → to family (confirmation received)
- **Booking rejected** → to family (cancellation reason)

To disable emails during testing, commenting out email calls in `emailService.js`

## Testing Checklist

- [ ] Run seed script to create admin
- [ ] Admin login works
- [ ] Provider signup appears in pending list
- [ ] Admin can activate provider
- [ ] Provider can login after activation
- [ ] Family can select multiple elders
- [ ] Family can book companion
- [ ] Provider can confirm/reject bookings
- [ ] Bookings appear on elder dashboard

## Future Enhancements

- [ ] Expand signup forms per role (speciality for doctors, experience for companions, etc.)
- [ ] Provider availability calendar
- [ ] Real-time notifications (WebSocket)
- [ ] Payment integration
- [ ] Rating system for providers
- [ ] Bulk admin operations (approve multiple providers)
