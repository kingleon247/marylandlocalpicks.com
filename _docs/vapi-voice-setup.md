# Vapi Voice Setup (Inbound Advertiser Phone Assistant)

This document covers the backend integration that lets a [Vapi](https://vapi.ai)
phone assistant answer inbound advertiser calls for Maryland Local Picks and
capture advertiser leads.

> **Scope of this phase.** Backend webhook + local storage + docs only. The Vapi
> assistant itself is configured in the Vapi dashboard, not in this app. There is
> no browser voice widget yet, and this is deliberately not a CRM.

## What this integration does

- Connects the public advertiser phone number to a Vapi assistant.
- Receives Vapi webhook events at a single endpoint and authenticates them.
- Normalizes and stores each call (status, transcript, recording URL, summary,
  caller info) to local server storage.
- Exposes a custom tool, **`createAdvertiserLead`**, that the assistant calls to
  save an advertiser lead — the voice equivalent of the `/advertiser-intake`
  form. Leads land under `storage/vapi-calls/` so the operator can read them.

## Public phone number

| Form    | Value           |
| ------- | --------------- |
| Display | 443-94-PICKS    |
| Numeric | (443) 947-4257  |
| E.164   | +14439474257    |

## Required environment variables

Set these in `.env.local` (local) and in the production environment. See
`.env.example`.

| Variable                   | Required | Purpose                                                                 |
| -------------------------- | -------- | ----------------------------------------------------------------------- |
| `VAPI_WEBHOOK_SECRET`      | Prod     | Shared secret to authenticate incoming Vapi webhooks. Blank = dev only. |
| `VAPI_ASSISTANT_ID`        | Optional | Assistant id; returned for `assistant-request` events when present.     |
| `VAPI_PHONE_NUMBER`        | Yes      | Public advertiser number in E.164 (`+14439474257`).                     |
| `MLP_INTERNAL_NOTIFY_EMAIL`| Optional | Internal email for future lead notifications. Unused for now.           |

If `VAPI_WEBHOOK_SECRET` is **set**, requests must present it or they are
rejected with `401`. If it is **unset**, requests are accepted and a warning is
logged — intended for local development only.

## Webhook URL

```text
https://marylandlocalpicks.com/api/vapi/webhook
```

Configure this as the **Server URL** on the Vapi assistant (or phone number),
and set the matching **Server URL Secret** to the value of
`VAPI_WEBHOOK_SECRET`.

### Authentication

The endpoint accepts the secret via either header:

- `Authorization: Bearer ${VAPI_WEBHOOK_SECRET}`
- `x-vapi-secret: ${VAPI_WEBHOOK_SECRET}`

### Handled event types

The single endpoint receives all Vapi server messages and dispatches on
`message.type`:

| Event                 | Behavior                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| `status-update`       | Stores basic call status.                                                 |
| `transcript`          | Appends finalized transcript snippets.                                    |
| `conversation-update` | Stores the rendered conversation transcript.                              |
| `tool-calls` / `function-call` | Runs `createAdvertiserLead`; returns a spoken confirmation.      |
| `end-of-call-report`  | Stores summary, transcript, recording URL, caller number, start/end times, and any extracted lead fields. |
| `assistant-request`   | Acknowledges; returns `VAPI_ASSISTANT_ID` if configured.                  |
| _unknown_             | Stored raw; never crashes. Always returns `200` quickly.                  |

## Storage

Each call is written to:

```text
storage/vapi-calls/{safe-call-id-or-timestamp}/call.json
```

`storage/` is gitignored and not publicly served. Records are upserted as events
arrive across a call, so fields fill in over time. Each record keeps a
`rawPayloads` array of every webhook message for debugging, alongside normalized
fields:

```jsonc
{
  "id": "...",
  "source": "vapi",
  "callId": "...",
  "phoneNumber": "+14439474257",
  "callerNumber": "+1...",
  "callerName": null,
  "businessName": "...",
  "contactName": "...",
  "email": "...",
  "website": "...",
  "category": "...",
  "desiredPackage": "standardSpot", // "halfSpot" | "standardSpot" | "doubleSpot" | null
  "market": "Catonsville",          // or null
  "budgetOrQuestions": "...",
  "callSummary": "...",
  "transcript": "...",
  "recordingUrl": "...",
  "status": "ended",
  "startedAt": "...",
  "endedAt": "...",
  "createdAt": "...",
  "updatedAt": "...",
  "rawPayloads": []
}
```

## Suggested Vapi assistant

**Purpose:** Answer inbound advertiser calls for Maryland Local Picks, explain
the premium 9x12 postcard mailed to 10,000 local homes, qualify the business,
capture contact info, package interest, and call-back needs.

### Suggested tool: `createAdvertiserLead`

Configure a custom function/tool on the assistant with the Server URL above.

Arguments:

```jsonc
{
  "businessName": "string",
  "contactName": "string",
  "phone": "string",
  "email": "string",
  "website": "string",
  "category": "string",
  "desiredPackage": "halfSpot | standardSpot | doubleSpot",
  "market": "string",
  "notes": "string"
}
```

On success the endpoint returns a response the assistant can speak from:

```json
{
  "result": "Lead saved",
  "message": "Got it. I saved your information and someone from Maryland Local Picks can follow up."
}
```

### Suggested assistant prompt / script

Paste the following as the assistant's system prompt in the Vapi dashboard.

```text
Assistant identity:
You are the phone assistant for Maryland Local Picks, a local advertising
postcard and business discovery platform.

Main job:
Help local business owners understand the advertising offer and capture their
info for follow-up.

Offer:
Maryland Local Picks is preparing a premium 9x12 postcard mailing to 10,000
local homes. Local businesses can reserve ad space. Packages are half spot,
standard spot, and double spot. Standard spot is the recommended/default option.

Tone:
Professional, friendly, local, concise. Do not sound like a robot. Do not
overpromise results.

Call flow:
- Greet caller.
- Ask if they are calling about advertising or something else.
- If advertising:
  - Briefly explain the postcard.
  - Ask business name.
  - Ask contact name.
  - Ask best phone/email.
  - Ask business category.
  - Ask whether they want half, standard, or double spot.
  - Ask if they already have artwork/logo/photos.
  - Ask any notes/questions.
  - Use createAdvertiserLead tool.
  - Tell them someone will follow up.
- If consumer/general caller:
  - Take a message.
- If caller asks for exact pricing:
  - Use the current package data from the website if available, otherwise say
    pricing is shown on the advertise/reserve page and a team member can confirm.
- If caller asks whether results are guaranteed:
  - Say no advertising can honestly guarantee results, but the goal is strong
    local visibility in 10,000 homes.
- If caller wants a human:
  - Take their info and mark urgent follow-up.
- Keep answers short.
- Do not invent unsupported deadlines.
- Do not take payment over the phone.
```

For reference, current published package pricing (see
`src/data/advertiser-packages.ts`): Half Spot $350, Standard Spot $600
(recommended), Double Spot $1,100.

## Local testing

Vapi must reach a public URL, so expose your local dev server with a tunnel.

1. Run the app:

   ```bash
   npm run dev
   ```

2. Start a tunnel (either works):

   ```bash
   ngrok http 3000
   # or
   vapi listen --forward-to localhost:3000/api/vapi/webhook
   ```

3. Put the tunnel URL + `/api/vapi/webhook` as the assistant's Server URL in the
   Vapi dashboard, and set the Server URL Secret.

4. Smoke-test the endpoint directly (simulates a lead tool call):

   ```bash
   curl -X POST http://localhost:3000/api/vapi/webhook \
     -H "Content-Type: application/json" \
     -H "x-vapi-secret: $VAPI_WEBHOOK_SECRET" \
     -d '{
       "message": {
         "type": "tool-calls",
         "call": { "id": "test-call-1", "customer": { "number": "+14105551234" } },
         "toolCalls": [{
           "id": "tc_1",
           "type": "function",
           "function": {
             "name": "createAdvertiserLead",
             "arguments": "{\"businessName\":\"Joe’s Plumbing\",\"contactName\":\"Joe\",\"phone\":\"+14105551234\",\"email\":\"joe@example.com\",\"category\":\"Plumbing\",\"desiredPackage\":\"standardSpot\",\"market\":\"Catonsville\",\"notes\":\"Wants a callback\"}"
           }
         }]
       }
     }'
   ```

   Then check `storage/vapi-calls/test-call-1/call.json`.

## Production deployment checklist

- [ ] `VAPI_PHONE_NUMBER=+14439474257` set in the production environment.
- [ ] `VAPI_WEBHOOK_SECRET` set to a strong random value in production **and** in
      the Vapi dashboard Server URL Secret (they must match).
- [ ] `VAPI_ASSISTANT_ID` set if using `assistant-request` handling.
- [ ] Vapi assistant Server URL points to
      `https://marylandlocalpicks.com/api/vapi/webhook`.
- [ ] Vapi phone number `+14439474257` is attached to the assistant.
- [ ] `createAdvertiserLead` tool is configured with the arguments above.
- [ ] Confirmed a test call writes a record under `storage/vapi-calls/`.
- [ ] **Hosting note:** local filesystem storage requires a serverful/persistent
      deployment (not ephemeral serverless). Review storage durability before
      going live, consistent with the web intake storage caveat in `README.md`.
- [ ] **Legal/consent:** before enabling call recording or AI answering in
      production, complete a Maryland all-party consent and legal review (see
      `_docs/02_PRODUCT_WEBSITE_SPEC.md` and `README.md`).
```

## Do not (this phase)

- Do not build the Vapi assistant in the app UI.
- Do not add a browser voice widget.
- Do not build a CRM or admin dashboard.
- Do not take payment over the phone.
