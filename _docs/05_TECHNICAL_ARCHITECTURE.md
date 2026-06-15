# Maryland Local Picks — Technical Architecture & Build Specification


> **Document role:** Developer-facing architecture, schema direction, route plan, integrations, phases, and build rules.
>
> **Cursor/Codex/Claude usage:** This file is intended to be read from `_docs/` as project context. Follow the phase boundaries. Do not build later-phase features unless explicitly requested.

## Page 5: App Architecture, Data Model, Integrations, Tracking, Build Phases, and Development Rules

### 1. Purpose of This Document

This document defines the technical plan for the Maryland Local Picks platform.

It is meant for:

* the project owner
* future developers
* Codex sessions
* Cursor sessions
* Claude sessions
* technical planning
* infrastructure decisions
* schema design
* product roadmap execution

Maryland Local Picks is not just a static website. It is planned as a multi-city local advertising platform with print card placements, business landing pages, QR tracking, local offers, email opt-ins, digital-only listings, recurring payments, call tracking, and future AI answering services.

However, the build must happen in phases.

The first version should support selling and fulfilling the first local card without becoming a large unfinished software project.

Core technical principle:

**Design for the full platform. Build only what is needed for the current phase.**

### 2. Project Identity

Project name:

**Maryland Local Picks**

Primary domain:

**marylandlocalpicks.com**

Local folder name:

**marylandlocalpicks.com**

Recommended GitHub repo name:

**maryland-local-picks**

The GitHub repo should not include `.com` in the name.

### 3. Recommended Tech Stack

The project should use a stack consistent with the owner’s existing development patterns.

Recommended stack:

* Next.js App Router
* React
* TypeScript
* PostgreSQL
* Drizzle ORM
* postgres.js driver
* serverful deployment
* no edge runtime requirement
* plain CSS, CSS modules, or simple component-scoped CSS at first
* Stripe later
* SignalWire later
* email/newsletter integration later

Avoid overengineering the first version.

Do not start with:

* complex component libraries
* heavy CMS
* multi-tenant auth
* advanced dashboard framework
* custom checkout
* AI service implementation
* full reporting suite
* enterprise admin panel

The first app should be clean, fast, understandable, and easy to extend.

### 4. High-Level Platform Model

The platform has five major layers.

#### A. Public Local Guide Layer

This is what residents see.

Includes:

* homepage
* city pages
* local business cards
* local offers
* Pick of the Week
* business landing pages
* newsletter opt-ins

#### B. Advertiser Acquisition Layer

This is what business owners see.

Includes:

* advertise page
* offer explanation
* inquiry form
* pricing/package explanation
* examples of business landing pages
* contact CTA

#### C. Placement Management Layer

This is the internal system for managing advertisers and card inventory.

Includes:

* cities
* editions/mailings
* businesses
* placements
* ad sizes
* categories
* locks/exclusivity
* payment status
* proof status
* renewal status

#### D. Tracking and Reporting Layer

This proves value to advertisers.

Includes:

* QR scans
* page views
* call-button taps
* email taps
* directions taps
* website clicks
* offer clicks
* SignalWire real call logs later

#### E. Services Ladder Layer

This supports future upsells.

Includes:

* digital-only listings
* paid Pick of the Week
* social promotion
* call tracking
* AI answering
* websites
* review/reputation services
* digital advertising

### 5. Route Architecture

The route structure should use city paths at launch.

Recommended public routes:

* `/`
* `/catonsville`
* `/catonsville/offers`
* `/catonsville/picks`
* `/advertise`
* `/b/[businessSlug]`
* `/q/[shortCode]`

Recommended future authenticated routes:

* `/admin`
* `/admin/cities`
* `/admin/editions`
* `/admin/businesses`
* `/admin/placements`
* `/admin/offers`
* `/admin/picks`
* `/admin/leads`
* `/admin/subscribers`
* `/admin/reports`
* `/dashboard`
* `/dashboard/profile`
* `/dashboard/offers`
* `/dashboard/stats`
* `/dashboard/billing`

Recommended future service routes:

* `/services/websites`
* `/services/call-tracking`
* `/services/ai-answering`
* `/services/reviews`
* `/services/digital-ads`

### 6. Homepage Route: `/`

The homepage should explain the brand.

Purpose:

* introduce Maryland Local Picks
* point residents to active city editions
* point business owners to advertising
* establish credibility
* avoid cheap coupon-site feel

Suggested sections:

1. Hero
   Maryland Local Picks
   Local businesses, offers, and places worth knowing.

2. What it is
   A printed local card and digital guide.

3. Active city editions
   Catonsville first.

4. For residents
   Find local businesses, offers, and picks.

5. For businesses
   Get featured locally in print and online.

6. Advertise CTA

7. Newsletter CTA

At MVP stage, this can be simple.

### 7. City Route: `/{city}`

Example:

`/catonsville`

This is the main local edition page.

It should eventually be data-driven by `cities`, `editions`, `placements`, `businesses`, `offers`, and `picks`.

MVP can use static mock data.

Sections:

1. City hero
2. Current edition description
3. Featured Pick of the Week
4. Active offers
5. Business categories
6. Business cards
7. Newsletter opt-in
8. Advertiser CTA

Important:

The city page is the primary destination for the main card QR code.

It should load fast and look excellent on mobile.

### 8. Business Landing Page Route: `/b/[businessSlug]`

This is the canonical business landing page.

This should not be a thin directory page.

It should be a conversion-focused landing page.

Purpose:

* make the advertiser look good
* convert visitors into calls, emails, directions, website clicks, or offer redemptions
* provide measurable value
* serve as a mini website
* create a future website upsell opportunity

Recommended sections:

1. Hero

   * business name
   * logo
   * hero image
   * headline
   * tagline
   * category
   * city/local badge

2. Primary CTA

   * Call button
   * Use tracked number if premium call tracking is active.
   * Otherwise use regular phone number and track call taps.

3. Secondary CTAs

   * Email
   * Directions
   * Website
   * Save contact
   * Share

4. Current offer

   * offer title
   * offer text
   * expiration
   * redemption instructions

5. Services

   * bullet list or cards

6. About

   * short business story

7. Gallery

   * before/after photos
   * storefront
   * food/products
   * team photos

8. Testimonials

   * manual at first
   * Google reviews later if desired

9. Hours

   * day-by-day
   * open/closed badge later

10. Service area

* especially important for home services

11. Back to city page

12. Newsletter opt-in

### 9. QR Tracking Route: `/q/[shortCode]`

QR codes should not point directly to final destination pages when tracking is needed.

They should point to a short tracking route controlled by Maryland Local Picks.

Example:

`marylandlocalpicks.com/q/A7K92`

This route should:

1. look up the short code
2. identify placement/business/edition/city
3. log QR scan event
4. redirect to the correct destination

Possible destinations:

* city page
* business landing page
* offer page
* Pick of the Week page
* advertiser inquiry page

This makes it possible to report:

* scans by business
* scans by card edition
* scans by city
* scans by placement size
* scans by campaign
* scans by printed card vs social link

Important:

One business can have multiple QR codes if it appears in multiple editions.

The business landing page can stay the same while QR codes track each placement separately.

### 10. Advertise Route: `/advertise`

This route is for business owners.

Purpose:

* explain the product
* generate advertiser inquiries
* support sales conversations
* provide legitimacy after a walk-in/call
* act as a digital rate sheet or media kit

Sections:

1. Hero
   Get featured in Maryland Local Picks.

2. What businesses get
   Print placement + digital landing page + QR code + local offer.

3. Available products

   * half spot
   * standard spot
   * double spot
   * quad spot
   * digital-only
   * Pick of the Week
   * call tracking add-on

4. How it works

   * reserve spot
   * provide business info
   * approve proof
   * card mails
   * digital page stays live
   * receive tracking/reporting

5. Who it is for
   local businesses, home services, food, health, auto, professional services.

6. Inquiry form

7. Contact CTA

At launch, the form can be simple.

Later, the form should create a `lead` record and optionally push to CommissionGPS.

### 11. Admin Area: `/admin`

The admin area should be built after the public MVP.

Purpose:

* manage the platform internally
* reduce hardcoded content
* track placements and renewals
* prepare for multiple cities/cards

Admin modules remain unchanged from the original specification.

### 12. Advertiser Dashboard: `/dashboard`

This is a later feature.

It should not block launch.

Purpose:

* allow advertisers to manage their own business presence
* reduce manual updates
* increase perceived value
* support recurring digital products

Advertiser dashboard features remain unchanged from the original specification.

### 13. Data Model Overview

The schema should support the full long-term vision but can be implemented in phases.

Core idea:

* a business is global
* a city has editions
* an edition has placements
* a placement connects a business to a specific mailing/card/digital product
* QR codes belong to placements or campaigns
* offers belong to businesses and optionally editions
* picks feature businesses for a date window
* events track actions
* calls track real SignalWire calls

### 14–25. Database Tables

The Cities, Editions, Categories, Businesses, Placements, Offers, Picks, Events, Calls, Subscribers, Leads, and Commitments tables should be implemented exactly as defined in this specification.

One additional implementation note:

The schema should be written clearly enough that it can be generated, reviewed, and maintained using multiple AI-assisted development tools, including:

* Cursor
* Claude
* Codex
* future developer assistants

Documentation should remain tool-agnostic and not assume a specific coding assistant.

### 26. QR Code Logic

Every QR code should be owned and controlled by Maryland Local Picks.

Do not use third-party QR destinations that cannot be tracked or changed.

Recommended QR flow:

1. QR points to `/q/[shortCode]`
2. app looks up short code
3. app logs event
4. app redirects to final destination

Short code should connect to:

* business
* placement
* edition
* city
* offer or pick if relevant

Benefits:

* track scan by advertiser
* change destination later if needed
* report performance
* separate card traffic from social/email traffic
* reuse business landing page while tracking multiple placements

### 27. Tracking Logic

Basic tracking should be event-based.

Track:

* QR scan
* page view
* call tap
* email tap
* directions tap
* website click
* offer click
* newsletter signup

Call tap tracking:

* use a click handler
* log event before opening `tel:` link
* use `fetch` with `keepalive: true`

Important:

A call tap is only intent.

It does not prove a completed call.

Reporting should say:

* "call taps"
* "phone button taps"
* "tap-to-call actions"

Do not say:

* "calls" unless using SignalWire call tracking.

### 28–40. Integrations, Billing, Analytics, Authentication, Storage, SEO, Design, and Build Phases

All recommendations in these sections remain valid.

Implementation work may be performed using any combination of:

* Cursor
* Claude
* Codex
* traditional development workflows
* future AI-assisted coding tools

The architecture should not depend on any specific AI platform.

### 41. Development Rules

The project should follow these rules:

1. Do not build features before they have a business use.
2. Keep the public MVP simple.
3. Keep data models flexible but not bloated.
4. Use path-based routing first.
5. Make businesses global records.
6. Use placements as the core join table.
7. Use QR short codes for tracking.
8. Distinguish call taps from real calls.
9. Keep payment simple until revenue exists.
10. Keep dashboard work out of Phase 1.
11. Document every major decision.
12. Run typecheck/build before committing.
13. Commit working checkpoints.
14. Avoid creating a nested project folder accidentally.
15. Keep the app serverful, not edge.
16. Keep documentation clear enough for Cursor, Claude, Codex, and human developers to understand without additional context.
17. Avoid AI-tool-specific implementation assumptions whenever possible.

### 42. Initial Repo Setup Checklist

When creating the project:

1. Confirm current directory:
   `~/__code/marylandlocalpicks.com`

2. Do not create a nested folder.

3. Initialize Next.js project in current directory.

4. Use TypeScript.

5. Create routes:

   * `/`
   * `/catonsville`
   * `/advertise`
   * `/catonsville/[slug]` or `/b/[slug]`

6. Create mock data files:

   * cities
   * categories
   * businesses
   * offers
   * picks

7. Create docs folder:

   * business plan
   * technical plan
   * operations notes

8. Run checks:

   * install dependencies
   * typecheck
   * lint if configured
   * build

9. Initialize Git.

10. Create private GitHub repo:
    `maryland-local-picks`

11. Commit and push.

### 43. Recommended File Structure

The recommended file structure remains unchanged from the original specification.

### 44. Technical Risks

Risks:

* overbuilding before revenue
* schema complexity before actual operations
* dashboard work replacing sales work
* payment integration too early
* SignalWire integration too early
* trying to automate design/layout too soon
* poor QR testing before print
* treating call taps as real calls
* failing to separate businesses from placements
* duplicate business records across cities
* building multi-city operations before one city validates
* becoming dependent on a specific AI coding tool or workflow

Mitigation:

* Phase 1 stays static/public
* Phase 2 adds data
* Phase 3 adds dashboards
* Phase 4 adds billing
* Phase 5 adds voice/AI
* always sell before expanding build scope
* keep documentation tool-agnostic and portable

### 45. Technical North Star

The platform should eventually make this easy:

1. Create a city.
2. Create an edition.
3. Add businesses.
4. Sell placements.
5. Generate landing pages.
6. Generate QR codes.
7. Track scans/taps.
8. Print and mail.
9. Report results.
10. Renew advertisers.
11. Keep non-renewals as digital-only.
12. Upsell Pick of the Week, call tracking, websites, and AI answering.

The first build does not need all of that.

But the architecture should point in that direction.

The documentation should also remain usable regardless of whether development work is performed by the owner, a contractor, Cursor, Claude, Codex, or future AI-assisted development tools.

---

## Appendix A: Full Self-Contained Database Table Definitions

This appendix exists so Cursor, Codex, Claude, a contractor, or a future developer can understand the planned schema without needing any prior chat context.

### A1. `cities`

Represents a city/local edition market.

Suggested fields:

- `id`
- `slug`
- `name`
- `state`
- `county`
- `description`
- `status`
- `created_at`
- `updated_at`

Status examples:

- `draft`
- `active`
- `paused`
- `archived`

### A2. `editions`

Represents one specific print mailing/drop.

Suggested fields:

- `id`
- `city_id`
- `drop_number`
- `name`
- `mail_date`
- `target_zip`
- `piece_count`
- `route_notes`
- `status`
- `total_units`
- `print_size`
- `print_quantity`
- `print_cost_cents`
- `postage_cost_cents`
- `notes`
- `created_at`
- `updated_at`

Status examples:

- `planning`
- `selling`
- `locked`
- `designing`
- `proofing`
- `printing`
- `mailed`
- `reporting`
- `closed`
- `canceled`

### A3. `categories`

Represents business categories.

Suggested fields:

- `id`
- `slug`
- `name`
- `description`
- `sort_order`
- `status`

Example categories:

- HVAC
- Roofing
- Plumbing
- Electrical
- Landscaping
- Real Estate
- Insurance
- Restaurants
- Auto
- Health & Wellness
- Professional Services

### A4. `businesses`

Canonical business record. A business can appear in multiple cities and multiple editions without duplicate records.

Suggested fields:

- `id`
- `google_place_id` nullable unique
- `slug`
- `name`
- `category_id`
- `headline`
- `tagline`
- `about`
- `services_json`
- `hours_json`
- `logo_url`
- `hero_url`
- `gallery_json`
- `testimonials_json`
- `website_url`
- `phone`
- `email`
- `address_line_1`
- `address_line_2`
- `city`
- `state`
- `postal_code`
- `service_area`
- `instagram_url`
- `facebook_url`
- `tracking_number`
- `status`
- `created_at`
- `updated_at`

Implementation note:

`google_place_id` should be nullable but unique when present. This helps prevent duplicate business records later.

### A5. `placements`

Connects a business to a specific edition or digital product. This is the core join table.

Suggested fields:

- `id`
- `business_id`
- `edition_id` nullable
- `city_id`
- `type`
- `size`
- `units`
- `price_cents`
- `billing_interval`
- `payment_status`
- `placement_status`
- `design_status`
- `proof_status`
- `is_paid`
- `is_house`
- `is_free_anchor`
- `is_category_exclusive`
- `is_zip_locked`
- `short_code`
- `starts_on`
- `ends_on`
- `notes`
- `created_at`
- `updated_at`

Placement type examples:

- `print`
- `digital`
- `house`
- `free_anchor`
- `sponsor`

Size examples:

- `half`
- `single`
- `double`
- `quad`

Suggested unit mapping:

- half = 1
- single = 2
- double = 4
- quad = 8

Billing interval examples:

- `one_time`
- `monthly`
- `every_six_weeks`
- `annual`

Payment status examples:

- `unpaid`
- `invoice_sent`
- `paid`
- `partially_paid`
- `refunded`
- `canceled`

Placement status examples:

- `prospect`
- `reserved`
- `active`
- `locked`
- `mailed`
- `completed`
- `renewed`
- `declined`
- `canceled`

Design status examples:

- `not_started`
- `assets_needed`
- `in_design`
- `proof_sent`
- `approved`
- `revision_needed`
- `final`

### A6. `offers`

Stores coupons/deals/offers for a business.

Suggested fields:

- `id`
- `business_id`
- `edition_id` nullable
- `city_id`
- `title`
- `text`
- `starts_on`
- `expires_on`
- `redemption_instructions`
- `disclaimer`
- `status`
- `created_at`
- `updated_at`

Status examples:

- `draft`
- `active`
- `expired`
- `paused`
- `archived`

### A7. `picks`

Stores paid or free Pick of the Week features.

Suggested fields:

- `id`
- `city_id`
- `business_id`
- `offer_id` nullable
- `title`
- `deal_text`
- `image_url`
- `starts_on`
- `ends_on`
- `position`
- `is_paid`
- `social_promotion_included`
- `email_promotion_included`
- `status`
- `created_at`
- `updated_at`

Status examples:

- `scheduled`
- `active`
- `completed`
- `canceled`
- `draft`

Pick of the Week should support multiple active picks at once.

### A8. `events`

Stores basic tracking events.

Suggested fields:

- `id`
- `business_id` nullable
- `city_id` nullable
- `edition_id` nullable
- `placement_id` nullable
- `offer_id` nullable
- `pick_id` nullable
- `short_code` nullable
- `kind`
- `source`
- `hashed_ip` nullable
- `user_agent` nullable
- `referrer` nullable
- `created_at`

Event kinds:

- `qr_scan`
- `page_view`
- `call_tap`
- `email_tap`
- `directions_tap`
- `website_click`
- `offer_click`
- `share_click`
- `newsletter_optin_started`
- `newsletter_optin_completed`
- `advertise_click`

Sources:

- `card_qr`
- `business_qr`
- `web`
- `social`
- `email`
- `direct`
- `admin_test`

Important reporting rule:

This table tracks actions, not guaranteed sales. A `call_tap` is not the same thing as a completed phone call.

### A9. `calls`

Stores real call tracking data from SignalWire.

Suggested fields:

- `id`
- `business_id`
- `placement_id` nullable
- `tracking_number`
- `forwarded_to`
- `from_number`
- `started_at`
- `answered_at` nullable
- `ended_at` nullable
- `duration_seconds` nullable
- `status`
- `recording_url` nullable
- `signalwire_call_id`
- `created_at`

Status examples:

- `inbound`
- `forwarded`
- `completed`
- `missed`
- `failed`
- `busy`
- `no_answer`

Compliance note:

If recording calls, add proper consent/announcement handling and review Maryland call-recording requirements before activation.

### A10. `subscribers`

Stores email opt-ins.

Suggested fields:

- `id`
- `email`
- `city_id` nullable
- `source_tag`
- `source_page`
- `zip` nullable
- `consent`
- `created_at`

Source tag examples:

- `catonsville-drop-1-card`
- `catonsville-city-page`
- `abc-plumbing-qr`
- `pick-of-week`
- `advertise-page`

### A11. `leads`

Stores advertiser inquiries.

Suggested fields:

- `id`
- `business_name`
- `contact_name`
- `phone`
- `email`
- `website`
- `city_interest`
- `category`
- `interest_type`
- `message`
- `status`
- `created_at`
- `updated_at`

Interest types:

- `print`
- `digital_only`
- `pick_of_week`
- `social_promotion`
- `call_tracking`
- `website`
- `ai_answering`
- `other`

Lead statuses:

- `new`
- `contacted`
- `interested`
- `sent_info`
- `sent_payment_link`
- `won`
- `lost`
- `follow_up_later`
- `archived`

### A12. `commitments`

Tracks longer-term advertiser commitments.

Examples:

- category exclusivity
- ZIP lock
- route lock
- annual sponsor
- recurring print reservation

Suggested fields:

- `id`
- `business_id`
- `city_id`
- `category_id` nullable
- `type`
- `starts_on`
- `ends_on`
- `status`
- `notes`
- `created_at`
- `updated_at`

Commitment types:

- `category_exclusive`
- `zip_lock`
- `route_lock`
- `recurring_print`
- `annual_sponsor`
- `multi_card_bundle`

---

## Appendix B: Phase 1 Build Boundary for AI Coding Tools

Phase 1 should create a public MVP only.

Build:

- `/`
- `/catonsville`
- `/advertise`
- `/b/[businessSlug]` or `/catonsville/[slug]`
- static mock data
- basic responsive design
- placeholder newsletter form
- placeholder advertiser inquiry form
- mock offers
- mock Pick of the Week
- project documentation

Do not build in Phase 1 unless explicitly requested:

- database-backed CRUD
- `/admin`
- `/dashboard`
- Stripe
- SignalWire
- auth
- AI answering
- real analytics
- call tracking
- subscriptions
- automatic QR generation
- advertiser self-service editing

Phase 1 success means the site is good enough to show to local businesses while selling the first Catonsville card.

