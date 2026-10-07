# The Mingle

A premium event site and admin desk for The Mingle.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

The admin email and password live in `.env.local`. That file is not part of the repository. Set the same values in Netlify’s environment settings, and do not paste them into the code.

## What is real

- The public site, RSVP form, age check (21–35), confirmation, QR invitation, and calendar file once a date exists.
- The admin desk: guests, RSVP status, notes, attendance, content, gallery, schedule, FAQ, analytics.
- Guest records live in one Supabase table, `mingle_app`, when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in `.env.local`. The service role stays on the server. Sample guests are not copied into that shared database.
- If those keys are missing, the site falls back to `data/store.json` on this machine. Sample guests in that file are marked as demonstration data and can be removed in Settings.
- Entrance music plays the official YouTube videos for “Need You”, “Love Don't Cost A Dime”, and “Again”. The files are not downloaded or hosted here.

## What is prepared, not live

- Payments. `paymentEnabled` is false. Paystack and Flutterwave sit behind one interface and only run when their secret keys exist.
- Email, WhatsApp, and SMS. Messages are saved. They are not sent.
- The database table is `public.mingle_app` (`supabase/schema.sql`). Run that file in the SQL editor only if the table is missing.

Date, venue, ticket price, organiser, phone, email, and social links are blank on purpose. Set them in Admin → Event.
