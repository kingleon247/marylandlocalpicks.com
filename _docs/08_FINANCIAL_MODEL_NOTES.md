# Maryland Local Picks — Financial Model Notes

## Page 8: Cost Assumptions, Pricing Logic, Break-Even Thinking, and Recurring Revenue Model

### 1. Purpose

This document defines the financial thinking for Maryland Local Picks.

It is not a final spreadsheet.

It explains what the spreadsheet should calculate and what decisions the numbers should support.

The core financial question is not only:

**“Can the card make a profit?”**

The better question is:

**“Does the card generate enough profit, advertiser relationships, resident opt-ins, and repeatable local visibility to justify the time?”**

### 2. Main Cost Categories

Each print edition has hard costs and labor costs.

Hard costs:

- printing
- USPS EDDM postage
- shipping/freight if not included
- supplies
- payment processing fees
- design tools if needed
- optional paid design help
- optional sample printing

Labor costs:

- route planning
- prospecting
- selling
- follow-up
- asset collection
- ad design
- proofing
- landing page setup
- QR setup/testing
- EDDM prep
- Post Office drop-off
- reporting
- renewals

Do not evaluate the card only by hard-cost profit.

A $1,000 profit is not good if it takes 80 hours and produces no renewals.

### 3. USPS EDDM Cost

The working model should use the current USPS EDDM Retail rate at the time of planning.

Important:

- rates can change
- rules can change
- verify before each mailing
- EDDM is route-based, not exact-count based

Formula:

`postage_cost = piece_count × current_eddm_rate`

Example planning inputs:

- 2,500 pieces
- 5,000 pieces
- actual route-count total

The spreadsheet should let the rate be changed manually.

### 4. Printing Cost

Printing cost depends on:

- size
- quantity
- paper stock
- finish
- turnaround time
- membership/discount tier if any
- shipping inclusion

Do not assume shipping is included.

The spreadsheet should include:

- print size
- print quantity
- base print price
- membership fee if applicable
- shipping cost
- tax if applicable
- total print cost

Formula:

`total_print_cost = base_print_price + membership_fee + shipping + tax`

### 5. Supplies and Miscellaneous

Include a small budget for:

- rubber bands/straps
- boxes/totes
- labels/paper
- ink/printing forms
- fuel
- parking
- sample prints
- replacement materials

Formula:

`misc_cost = supplies + fuel + sample_prints + other`

### 6. Payment Processing Fees

If using Stripe or card payments, include fees.

Formula example:

`processing_fee = revenue × fee_percent + transaction_count × fixed_fee`

The model should allow:

- percent fee
- per-transaction fee
- number of advertisers
- manual override

### 7. Total Hard Cost

Formula:

`total_hard_cost = postage_cost + total_print_cost + misc_cost + processing_fees`

This is the true cash cost before labor.

### 8. Labor Hours

Track estimated hours by category.

Suggested categories:

- route planning
- prospect list building
- selling
- follow-up
- asset collection
- design/proofing
- landing pages/QR setup
- print order/admin
- EDDM prep/drop-off
- reporting/renewals

Formula:

`total_hours = sum(all_hour_categories)`

Optional labor-value formula:

`labor_value = total_hours × target_hourly_rate`

This helps decide whether the project is worth the time.

### 9. Placement Revenue

Revenue depends on ad sizes sold.

Suggested size categories:

- half
- single
- double
- quad

Inputs:

- quantity sold per size
- price per size
- comp/free placements
- house placements
- discounts or bonuses
- multi-card bundles

Formula:

`print_revenue = (half_sold × half_price) + (single_sold × single_price) + (double_sold × double_price) + (quad_sold × quad_price)`

Do not count unpaid/reserved placements as revenue.

### 10. Digital Revenue

Digital revenue can include:

- monthly digital-only listing
- paid Pick of the Week
- social promotion
- call tracking monthly add-on
- website setup fee
- website hosting/maintenance
- future AI answering

Formula:

`monthly_recurring_revenue = digital_listings + call_tracking + website_maintenance + AI_answering + other_recurring`

### 11. Gross Profit

Formula:

`gross_profit = total_revenue - total_hard_cost`

For one print edition:

`edition_gross_profit = print_revenue + one_time_addons - total_hard_cost`

For recurring business:

`total_monthly_revenue = monthly_recurring_revenue + other_monthly_income`

### 12. Profit Per Hour

This is critical.

Formula:

`profit_per_hour = gross_profit / total_hours`

Example decision rule:

If a card creates profit but very low profit per hour, the system needs:

- higher pricing
- more repeat advertisers
- better follow-up
- more prepay packages
- less manual design time
- better sales targeting
- VA/admin help
- fewer low-value advertisers

### 13. Break-Even Spots

Break-even can be calculated by spot price.

Formula:

`break_even_spots = total_hard_cost / average_spot_price`

But mixed sizes are better modeled by units.

Unit model:

- half = 1 unit
- single = 2 units
- double = 4 units
- quad = 8 units

The spreadsheet should calculate:

- total units available
- units sold
- revenue by units
- remaining units
- revenue needed to break even
- profit at current fill level

### 14. Minimum-to-Mail Rule

Do not mail just because the card was planned.

Minimum-to-mail should consider:

- hard costs covered
- reasonable profit
- enough advertiser variety
- enough value for residents
- enough proof value for future sales
- enough time return

Possible rule:

Mail only if:

1. hard costs are covered,
2. there is enough profit to justify the work,
3. the card looks credible,
4. there is at least one strong resident-friendly offer,
5. advertisers are paid.

Strategic exception:

A low-profit first card may be acceptable if it creates a strong physical sample, proves the sales process, and sets up renewals.

Do not make that exception repeatedly.

### 15. 2,500 vs 5,000 Decision

2,500 advantages:

- lower cash risk
- easier first launch
- lower price point
- less physical handling
- easier to test sales motion

5,000 advantages:

- stronger reach
- stronger advertiser value
- stronger farm coverage
- easier to justify premium pricing
- better brand repetition

Decision:

For Drop #1, 2,500 is usually the safer validation run.

After validation, choose mail quantity based on farm coverage and advertiser demand, not only margin.

### 16. Single vs Recurring Revenue

One-time card revenue is useful but less stable.

Recurring products make the business better.

Recurring revenue sources:

- every-six-week print reservation
- digital-only monthly listing
- monthly call tracking
- website hosting/maintenance
- AI answering later
- review/reputation service
- digital advertising retainers

The card should feed recurring products.

### 17. Prepay Model

Prepay packages improve cash flow and reduce reselling pressure.

Suggested packages:

- 1 mailing
- 3 mailings
- 6 mailings
- annual 8 mailings

The model should calculate:

- cash collected upfront
- revenue recognized per edition
- remaining prepaid obligations
- bonus costs
- discount cost if any

Use bonuses more than discounts.

Good bonuses:

- Pick of the Week credit
- social promotion
- priority placement
- category priority
- rate lock
- landing page upgrade
- report package

### 18. Annual Package Logic

At one mailing every six weeks, annual means approximately 8 mailings.

Annual package should include:

- 8 print placements
- landing page active all year
- offer updates
- priority placement
- category lock option
- Pick of the Week credits
- quarterly report
- first right of refusal

The annual price should not be discounted too heavily.

The real value is consistency, category protection, and priority.

### 19. Digital-Only Downsell Math

Digital-only should have very low hard cost once the site exists.

Main costs:

- time to build/update landing page
- hosting/server
- support
- occasional reporting
- optional social/promo work

Because hard cost is low, even modest monthly pricing can add up.

Digital-only is valuable because it:

- saves non-renewals
- creates entry-level revenue
- fills city page
- builds advertiser roster
- creates upsell path to print
- creates upsell path to Pick of the Week/call tracking

### 20. Call Tracking Math

Call tracking has real ongoing costs.

Costs may include:

- tracking number monthly cost
- per-minute usage
- call forwarding usage
- recording storage if used
- admin/support time

Pricing should cover:

- number cost
- usage cost
- reporting value
- setup time
- margin

Do not include real call tracking free for everyone.

Basic tap tracking can be included.

Real call tracking should be premium.

### 21. Pick of the Week Math

Pick of the Week has low hard cost and high strategic value.

Costs:

- content creation
- page update
- social post if included
- email mention if included
- reporting

Revenue models:

- standalone paid weekly feature
- add-on to print advertiser
- bonus for prepaid advertiser
- free anchor promotion

Pick of the Week can become an important digital revenue stream once the site has traffic.

### 22. Key Metrics to Track

For each edition:

- businesses contacted
- conversations
- proposals sent
- payment links sent
- spots sold
- revenue collected
- hard cost
- gross profit
- estimated hours
- profit per hour
- QR scans
- landing page views
- call taps
- email taps
- directions taps
- renewals
- digital-only saves
- prepay conversions
- Pick of the Week sales

For each advertiser:

- placement type
- amount paid
- size
- edition(s)
- QR scans
- page views
- call taps
- actual calls if tracked
- renewal status
- upsell status

### 23. Spreadsheet Tabs Needed

Suggested spreadsheet tabs:

1. Assumptions
2. Print/Postage Costs
3. Placement Inventory
4. Revenue by Edition
5. Break-Even Calculator
6. Labor Hours
7. Profit Per Hour
8. Recurring Revenue
9. Prepaid Packages
10. Advertiser Tracker
11. Renewal Tracker
12. Actual Results

### 24. Decision Rules

Use the numbers to make decisions, not to procrastinate.

Good uses of the financial model:

- set minimum price
- decide 2,500 vs 5,000
- decide if card should mail
- price packages
- track profit per hour
- decide when to hire help
- decide when to raise prices

Bad uses:

- endlessly tweaking numbers instead of selling
- pretending unpaid interest is revenue
- ignoring labor time
- underpricing because printing looks cheap
- adding services before advertisers exist

### 25. Financial North Star

The card is successful when it creates:

- cash profit
- repeat advertisers
- digital-only saves
- homeowner/resident opt-ins
- advertiser relationships
- future service opportunities
- local brand recognition

If a card only creates one-time profit but no renewal base, improve the system.

If a card creates moderate profit but strong renewals and relationships, it may be more valuable than the first numbers show.
