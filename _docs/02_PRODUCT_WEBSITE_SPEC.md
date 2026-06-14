# Maryland Local Picks — Product & Website Specification


> **Document role:** Product behavior, public routes, user flows, website feature requirements, and platform roadmap.
>
> **Cursor/Codex/Claude usage:** This file is intended to be read from `_docs/` as project context. Follow the phase boundaries. Do not build later-phase features unless explicitly requested.

## Page 2: Website Structure, Features, User Flows, and Platform Roadmap

### 1. Product Purpose

The Maryland Local Picks website is the digital platform behind the printed local advertising card.

The website should support three connected goals:

1. **Homeowner/resident engagement**
   Residents scan QR codes from the printed card, visit the site, browse local businesses, view offers, and opt into the email list.

2. **Advertiser value**
   Businesses that pay for a card placement receive a digital presence that continues working after the physical card is delivered. This makes the ad more valuable and creates a reason to renew.

3. **Recurring revenue and future services**
   The website creates the foundation for digital-only listings, paid Pick of the Week promotions, social promotion packages, call tracking, AI answering, website upsells, and other marketing services.

The website should feel like a curated local guide, not a cheap coupon site.

Core positioning:

**Maryland Local Picks**
*Local businesses, offers, and places worth knowing.*

City edition example:

**Catonsville Local Picks**
*A printed card and digital guide featuring selected local businesses, offers, and places worth knowing.*

### 2. Primary Audiences

The site serves four audiences.

#### A. Residents / Homeowners

They arrive from:

* QR code on the printed card
* QR code for a specific business
* Facebook/social promotion
* email newsletter
* Google search
* shared business landing pages

They want:

* local offers
* trusted business recommendations
* easy call/email/directions buttons
* simple browsing by category
* useful local picks
* reasons to return

#### B. Local Businesses / Advertisers

They arrive from:

* sales conversations
* QR code on media kit
* referral from another business
* “Advertise with us” CTA
* seeing another business featured

They want:

* what it costs
* where the card is mailed
* what they get
* how many households it reaches
* whether digital is included
* how to reserve a spot
* proof that the campaign works

#### C. Internal Operator / Admin

The business owner or team needs to manage:

* cities
* mailing editions
* businesses
* placements
* ad sizes
* payments
* digital-only listings
* offers
* Pick of the Week promotions
* QR codes
* tracking data
* call tracking numbers
* reports
* renewals

#### D. Future Advertiser Dashboard Users

Eventually, advertisers should be able to log in and manage:

* business profile
* logo/photos
* offer/coupon
* hours
* services
* testimonials
* landing page content
* analytics
* call tracking reports
* renewal status
* payment plan

This dashboard should not be required for the first launch.

### 3. Site Architecture

The site should use path-based city routing.

Recommended structure:

* `marylandlocalpicks.com/`
* `marylandlocalpicks.com/catonsville`
* `marylandlocalpicks.com/catonsville/offers`
* `marylandlocalpicks.com/catonsville/picks`
* `marylandlocalpicks.com/advertise`
* `marylandlocalpicks.com/b/[business-slug]`
* `marylandlocalpicks.com/q/[short-code]`
* `marylandlocalpicks.com/admin`
* `marylandlocalpicks.com/dashboard`

Path-based routing is preferred at launch because it is simpler than city subdomains.

Use:

* `/catonsville`
* `/towson`
* `/columbia`
* `/ellicott-city`

Avoid starting with:

* `catonsville.marylandlocalpicks.com`

Subdomains can be added later if a city edition becomes large enough to justify its own subdomain.

### 4. Public Routes

#### `/`

The homepage introduces Maryland Local Picks as a statewide local guide and advertising platform.

It should include:

* brand explanation
* tagline
* city edition links
* short explanation of printed cards
* short explanation of digital business pages
* resident CTA
* business advertiser CTA

Primary CTA:

**Explore Local Picks**

Secondary CTA:

**Advertise With Us**

At launch, the homepage can be simple and point mainly to Catonsville.

#### `/{city}`

Example:

`/catonsville`

This is the main city edition page.

It should function as both:

* the digital version of the printed card
* the local guide page for that city

Sections:

1. Hero
   Example:
   **Catonsville Local Picks**
   *Local businesses, offers, and places worth knowing.*

2. Current edition intro
   Explain that this edition is connected to the printed card mailed to local households.

3. Featured / Pick of the Week section
   Shows one or multiple current featured local deals or businesses.

4. Offers section
   Highlights active offers/coupons.

5. Business categories
   Group businesses by category, such as:

   * home services
   * food & drink
   * health & wellness
   * auto
   * professional services
   * real estate/homeowner resources
   * shopping/local retail

6. Business cards
   Each business card should include:

   * logo or photo
   * business name
   * category
   * short tagline
   * current offer if available
   * CTA to view landing page

7. Email opt-in
   This is strategically important.
   Example CTA:
   **Get Catonsville Local Picks in your inbox.**

8. Business advertiser CTA
   Example:
   **Own a local business? Get featured in the next Catonsville Local Picks card.**

#### `/{city}/offers`

This page displays all active offers for the city.

Purpose:

* gives residents a reason to return
* gives advertisers more value
* gives social posts and emails a destination
* supports “deal of the week” promotion

Offer cards should include:

* business name
* offer text
* expiration date
* image/logo
* CTA to business landing page
* CTA to call or get directions

#### `/{city}/picks`

This page is the archive and current feed for local picks.

This should support:

* Pick of the Week
* multiple weekly picks
* paid featured picks
* free anchor picks
* seasonal picks
* “staff picks”
* promoted deals

The page should make the site feel alive between mailings.

#### `/advertise`

This page sells the business opportunity.

It should explain:

* printed card placement
* digital landing page included
* QR code traffic
* city directory listing
* current offer/coupon placement
* Pick of the Week opportunities
* social promotion add-ons
* call tracking add-ons
* recurring options
* prepay options
* category/ZIP/route lock options

This page should have a simple inquiry form at launch.

Form fields:

* business name
* contact name
* phone
* email
* website
* business category
* city/ZIP of interest
* interested in print, digital, Pick of the Week, call tracking, or other
* message

At launch, the form can submit to email or a simple backend endpoint. Later, it should create a lead in the CRM.

#### `/b/[business-slug]`

This is the canonical business landing page.

This should be a real conversion landing page, not just a directory listing.

Each business landing page should include:

1. Hero section

   * business name
   * logo
   * hero image
   * headline
   * tagline
   * category
   * “Featured in Catonsville Local Picks” trust label

2. Primary CTA

   * Call button
   * If the business has a SignalWire tracking number, use the tracking number.
   * If not, use the business’s direct number and track call-button taps.

3. Secondary CTAs

   * Email
   * Directions
   * Visit website
   * Save contact
   * Share page

4. Current offer

   * headline
   * offer text
   * expiration date
   * redemption instructions
   * disclaimer if needed

5. Services section
   Useful for home service and professional businesses.

6. About section
   Short business description.

7. Gallery section
   Before/after photos, product photos, storefront photos, food photos, etc.

8. Testimonials / reviews
   Can be manually entered at first. Later may connect to Google review data.

9. Hours
   Day-by-day hours.
   Later, calculate open/closed status automatically.

10. Service area
    Useful for contractors, real estate, home services, mobile businesses.

11. Map / directions
    Optional for location-based businesses.

12. Newsletter opt-in
    The landing page should also help grow the Maryland Local Picks / Maryland Property Watch audience.

13. Back link
    Example:
    **Back to Catonsville Local Picks**

The business landing page is also a future upsell tool.

Sales angle:

**“You’re not just getting a box on a card. You’re getting a local landing page we can send people to from the card, QR code, email, and social.”**

#### `/q/[short-code]`

This is the QR tracking route.

Purpose:

* log QR scan
* identify which business
* identify which card/mailing edition
* identify which city/route if possible
* redirect to the business landing page or city page

Example:

* `marylandlocalpicks.com/q/A7K92`

This short code might represent:

* business: ABC Plumbing
* city: Catonsville
* edition: Drop 1
* placement: single spot
* QR source: printed card

This lets Maryland Local Picks report:

* QR scans from the card
* landing page views
* call taps
* email taps
* directions taps
* offer clicks

Each business can have its own QR code.

The card can also have one main QR code pointing to the full city page.

Best setup:

* one card-level QR code to `/{city}`
* one QR code per business to `/q/[short-code]`

### 5. Advertiser Product Features

Each print advertiser receives:

* printed card placement
* digital business landing page
* listing on city page
* offer/coupon placement if provided
* QR code destination
* basic tap tracking
* opportunity to renew
* opportunity to upgrade

Each digital-only advertiser receives:

* landing page
* listing on city page
* offer/coupon placement
* basic tap tracking
* no printed placement

Each Pick of the Week advertiser receives:

* featured placement on city page
* feature in `/picks`
* landing page link
* possible email mention
* optional Facebook/social promotion
* optional limited-time deal structure

### 6. Pick of the Week System

Pick of the Week should be treated as a real product.

It can be used in three ways:

#### A. Free anchor feature

Use this for a beloved local business that makes the site/card more valuable.

Example:

* popular pizza shop
* coffee shop
* ice cream shop
* car wash
* local restaurant

Purpose:

* gives residents a reason to scan/keep the card
* warms up a future paid advertiser
* makes the card feel useful instead of ad-heavy

#### B. Paid weekly feature

A business pays to be the featured pick for a week.

Included:

* homepage/city page placement
* `/picks` page placement
* link to business landing page
* current offer/deal
* optional email mention
* optional Facebook/social post

#### C. Add-on bonus for prepaid advertisers

A business that prepays for multiple mailings or an annual package can receive one or more Pick of the Week placements as a bonus.

This is better than discounting too heavily.

Example:

* Pay for 3 mailings: one Pick of the Week credit
* Pay for 6 mailings: two Pick of the Week credits
* Pay for annual package: quarterly Pick of the Week feature

### 7. Social Promotion Add-On

Social promotion should be tied to featured picks and offers.

Possible channels:

* Facebook page
* local Facebook groups where allowed
* Instagram
* short video/reel later
* email newsletter
* Maryland Property Watch cross-promotion where relevant

Social promotion package could include:

* one Facebook post
* one Instagram post
* inclusion in weekly email
* boosted post later if ad budget is provided

Important distinction:

Maryland Local Picks should not promise specific leads or sales.

Better wording:

**“We’ll feature your offer on the Catonsville Local Picks page and promote it through our local social channels.”**

### 8. Tracking Features

There should be two levels of tracking.

#### A. Basic Tap Tracking

Included with print and digital placements.

Track:

* page views
* QR scans
* call-button taps
* email-button taps
* directions taps
* website clicks
* offer clicks

Important wording:

Use **call taps**, not **calls**, unless using a real tracking number.

A tap is not proof that the call connected. It only proves that someone tapped the call button.

#### B. SignalWire Call Tracking

Premium add-on.

A SignalWire number forwards to the business’s real number.

This allows reporting on:

* real inbound calls
* call timestamps
* call duration
* caller number if available
* missed/answered call status if supported
* recording link if recording is enabled

If calls are recorded, Maryland all-party consent rules must be considered. The system should include a call announcement before recording.

Example:

**“This call may be recorded for quality and service purposes.”**

Call tracking is also the foundation for future AI answering.

### 9. Future AI Answering Service

AI answering should be treated as a later upsell, not part of launch.

The future path:

1. Business starts with print/card placement.
2. Business gets landing page.
3. Business upgrades to SignalWire call tracking.
4. Business sees call volume/reporting.
5. Business upgrades to AI answering or call handling.

Possible AI answering features:

* answer missed calls
* qualify leads
* collect name/phone/email
* ask service-related questions
* book appointments
* send SMS follow-up
* notify business owner
* create CRM lead

This should not be built until there are advertisers who would pay for it.

### 10. Admin Features

Admin dashboard should eventually allow internal management of:

* cities
* editions/mailings
* businesses
* categories
* placements
* ad sizes
* placement status
* payments
* offers
* Pick of the Week
* QR short codes
* tracking reports
* SignalWire numbers
* call logs
* newsletter subscribers
* advertiser leads
* renewals

At launch, a full admin dashboard is not required. Static data or simple database entries are acceptable.

### 11. Advertiser Dashboard

Advertiser dashboard should be Phase 3 or later.

Features:

* edit business profile
* update logo
* update photos
* update offer/coupon
* update services
* update hours
* view QR scans
* view page views
* view call taps
* view email/directions taps
* view real call tracking if upgraded
* renew placement
* buy Pick of the Week
* request social promotion
* manage payment method

This is valuable, but it is not needed to sell the first card.

### 12. Multi-City and Multi-Card Support

The app should be designed for multiple cities from day one, even if only Catonsville launches first.

A business should be a global record.

A business can appear in:

* one city
* multiple cities
* one mailing edition
* multiple mailing editions
* one ZIP
* multiple ZIPs

A business that wants 5,000 households could be placed on two 2,500-household card editions.

This should not require duplicate business pages.

Use one canonical business page, with separate placement/QR tracking per edition.

Example:

ABC Plumbing has one landing page:

`/b/abc-plumbing`

But it may have multiple QR codes:

* Catonsville Drop 1 QR
* Catonsville Drop 2 QR
* Arbutus Drop 1 QR

Each QR code logs separately.

### 13. Placement Size System

The platform should support multiple ad sizes.

Suggested sizes:

* half
* single
* double
* quad

Instead of thinking only in fixed ad count, the platform should treat a card as having a total amount of available placement space.

Each placement consumes units.

Example:

* half = 1 unit
* single = 2 units
* double = 4 units
* quad = 8 units

Each edition has a total unit capacity.

This allows flexible filling as advertisers come in.

The software should eventually warn:

* how many units are sold
* how many remain
* whether a new placement fits
* which categories are already taken
* whether exclusivity conflicts exist

### 14. Category, ZIP, and Route Locks

Some advertisers may want more control.

Possible premium options:

#### Category exclusivity

Only one business in a category appears on that edition.

Example:

* one plumber
* one electrician
* one roofer
* one Realtor
* one dentist

#### ZIP lock

A business can pay to appear in every mailing for a ZIP or city.

Example:

* “I want to be on every Catonsville card.”

#### Route lock

A business can lock specific EDDM routes if the platform later tracks routes at that level.

Example:

* business wants only higher-income routes
* business wants routes near its storefront
* business wants to avoid areas outside its service area

This can become a premium feature later.

### 15. Renewal and Rotation Logic

The card should stay fresh.

Not every business needs to appear on every card. Some businesses can rotate in and out by city, ZIP, route, season, or category.

Reasons to rotate:

* keep the card from feeling stale
* feature seasonal businesses
* create scarcity
* allow new advertisers in
* avoid showing the same exact card every six weeks

Reasons to lock certain placements:

* strategic business relationships
* annual advertisers
* high-value categories
* Realtor/farming placement
* businesses paying for exclusivity
* major sponsors

The platform should support both:

* rotating advertisers
* locked recurring advertisers

### 16. Payment Integration Roadmap

Launch should use simple payment links or manual invoicing.

Do not build custom checkout for the first version.

Phase 1:

* Stripe Payment Links
* manual payment tracking
* upfront payment required

Phase 2:

* store placement payment status
* record payment amount
* record billing type
* track prepaid mailings

Phase 3:

* Stripe subscriptions
* digital-only recurring billing
* call tracking monthly add-on
* Pick of the Week purchases
* advertiser dashboard billing

Payment types to support later:

* one-time print placement
* recurring print reservation every six weeks
* monthly digital-only listing
* monthly call tracking add-on
* prepaid 3-mailing package
* prepaid 6-mailing package
* annual 8-mailing package
* paid Pick of the Week
* custom website setup fee
* recurring website/hosting/maintenance
* AI answering monthly plan

### 17. Data Model Outline

Core tables/entities:

#### cities

Stores city editions.

Fields:

* id
* slug
* name
* state
* description
* status

#### editions

Represents a specific mailing/drop.

Fields:

* id
* city_id
* drop_number
* name
* mail_date
* piece_count
* status
* total_units
* notes

#### businesses

Canonical business record.

Fields:

* id
* google_place_id
* slug
* name
* category_id
* headline
* tagline
* about
* services
* hours
* logo_url
* hero_url
* gallery_urls
* testimonials
* website
* phone
* email
* address
* service_area
* tracking_number
* status

#### categories

Business categories.

Fields:

* id
* name
* slug
* sort_order

#### placements

Connects a business to a specific edition.

Fields:

* id
* business_id
* edition_id
* type
* size
* units
* price
* billing_interval
* status
* paid
* payment_status
* is_category_exclusive
* is_zip_locked
* short_code

Placement type examples:

* print
* digital
* house
* free_anchor
* sponsor

Size examples:

* half
* single
* double
* quad

#### offers

Business offers/coupons.

Fields:

* id
* business_id
* edition_id
* title
* text
* starts_on
* expires_on
* redemption_instructions
* status

#### picks

Pick of the Week / featured deal system.

Fields:

* id
* city_id
* business_id
* title
* deal_text
* image_url
* starts_on
* ends_on
* is_paid
* position
* status
* social_promotion_included

#### events

Basic tracking.

Fields:

* id
* business_id
* edition_id
* placement_id
* kind
* source
* short_code
* hashed_ip
* user_agent
* created_at

Event kinds:

* qr_scan
* page_view
* call_tap
* email_tap
* directions_tap
* website_click
* offer_click

#### calls

SignalWire real call tracking.

Fields:

* id
* business_id
* placement_id
* tracking_number
* forwarded_to
* from_number
* started_at
* ended_at
* duration_seconds
* status
* recording_url
* created_at

#### subscribers

Email opt-ins.

Fields:

* id
* email
* city_id
* source_tag
* zip
* consent
* created_at

#### leads

Advertiser inquiries.

Fields:

* id
* business_name
* contact_name
* phone
* email
* city_interest
* category
* interest_type
* message
* status
* created_at

#### commitments

Optional future table for locks/exclusivity.

Fields:

* id
* business_id
* city_id
* category_id
* type
* starts_on
* ends_on
* status

Commitment types:

* category_exclusive
* zip_lock
* route_lock
* annual_sponsor
* recurring_print

### 18. Build Phases

#### Phase 1 — Public MVP

Build:

* homepage
* Catonsville page
* Advertise page
* static/mock business landing pages
* mock offers
* mock Pick of the Week
* basic email opt-in placeholder
* clean design
* README and docs

Do not build:

* auth
* dashboard
* Stripe
* SignalWire
* database CRUD
* AI answering
* full admin

Goal:

Create a sellable public presence that can be shown to businesses.

#### Phase 2 — Data-Backed MVP

Build:

* database schema
* city records
* business records
* edition records
* placements
* offers
* picks
* QR short codes
* basic tracking API
* advertiser inquiry storage
* subscriber storage

Goal:

Make the first real card manageable without hardcoding everything.

#### Phase 3 — Advertiser Value Layer

Build:

* full business landing pages
* tap tracking reports
* QR scan reports
* Pick of the Week scheduling
* digital-only listings
* renewal tracking
* admin dashboard

Goal:

Turn print advertisers into ongoing digital advertisers.

#### Phase 4 — Payment and Recurring Revenue

Build:

* Stripe subscriptions
* prepaid packages
* digital-only billing
* call tracking billing
* Pick of the Week purchases
* annual advertiser packages
* advertiser dashboard billing view

Goal:

Create predictable recurring revenue.

#### Phase 5 — SignalWire and Services Ladder

Build:

* SignalWire tracking number provisioning
* call forwarding
* call logs
* call reports
* optional recording with consent announcement
* AI answering service
* missed-call follow-up
* lead capture from calls

Goal:

Turn Maryland Local Picks into a broader local marketing services platform.

### 19. MVP Cut Line

The site should be planned for the full platform but built in a disciplined order.

The first version only needs to help sell and fulfill the first card.

The first version should answer:

* What is Maryland Local Picks?
* What is Catonsville Local Picks?
* What does a local business get?
* What does the resident see when they scan?
* How does a business inquire?
* What does a business landing page look like?

Everything else can wait.

The danger is building a beautiful platform before any advertiser has paid.

The correct approach:

**Design the whole system. Build the smallest version that helps sell the first edition.**