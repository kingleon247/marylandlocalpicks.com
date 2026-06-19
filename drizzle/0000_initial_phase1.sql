CREATE TYPE "public"."activity_actor_type" AS ENUM('user', 'system', 'stripe_webhook', 'ai_agent', 'import_script', 'commissiongps');--> statement-breakpoint
CREATE TYPE "public"."business_source" AS ENUM('seeded', 'web_intake', 'vapi_call', 'staff_created', 'import');--> statement-breakpoint
CREATE TYPE "public"."claim_status" AS ENUM('unclaimed', 'claim_pending', 'claimed');--> statement-breakpoint
CREATE TYPE "public"."edition_status" AS ENUM('draft', 'selling', 'locked', 'in_production', 'mailed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'published', 'free_claimed', 'unpublished');--> statement-breakpoint
CREATE TYPE "public"."package_key" AS ENUM('half_spot', 'standard_spot', 'double_spot');--> statement-breakpoint
CREATE TYPE "public"."placement_level" AS ENUM('standard', 'featured', 'featured_premium');--> statement-breakpoint
CREATE TYPE "public"."reservation_kind" AS ENUM('advertiser_hold', 'advertiser_reservation', 'staff_hold', 'internal_allocation');--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('held', 'awaiting_payment', 'paid', 'in_production', 'completed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"state" varchar(2) NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"name" varchar(180) NOT NULL,
	"category_id" uuid,
	"city_slug" varchar(120),
	"google_place_id" varchar(180),
	"description" text,
	"tagline" varchar(240),
	"public_phone" varchar(40),
	"public_email" varchar(180),
	"website" text,
	"address" text,
	"service_area" text,
	"hours" jsonb,
	"social_urls" jsonb,
	"claim_status" "claim_status" DEFAULT 'unclaimed' NOT NULL,
	"claimed_by_org_id" uuid,
	"listing_status" "listing_status" DEFAULT 'draft' NOT NULL,
	"current_placement_level" "placement_level" DEFAULT 'standard' NOT NULL,
	"source" "business_source" NOT NULL,
	"source_reference" varchar(255),
	"commissiongps_lead_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "businesses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "edition_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"edition_id" uuid NOT NULL,
	"package_key" "package_key" NOT NULL,
	"display_name" varchar(120) NOT NULL,
	"half_units_consumed" integer NOT NULL,
	"price_cents" integer NOT NULL,
	"stripe_price_id_test" varchar(255),
	"stripe_price_id_live" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_edition_packages_half_units_positive" CHECK ("edition_packages"."half_units_consumed" > 0)
);
--> statement-breakpoint
CREATE TABLE "mailing_editions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_slug" varchar(120) NOT NULL,
	"name" varchar(180) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"drop_number" integer,
	"physical_capacity_half_units" integer DEFAULT 32 NOT NULL,
	"mail_date" timestamp with time zone,
	"sales_open_at" timestamp with time zone,
	"sales_close_at" timestamp with time zone,
	"status" "edition_status" DEFAULT 'draft' NOT NULL,
	"notes" varchar(1000),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mailing_editions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_mailing_editions_capacity_nonneg" CHECK ("mailing_editions"."physical_capacity_half_units" >= 0)
);
--> statement-breakpoint
CREATE TABLE "reservation_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reservation_id" uuid NOT NULL,
	"from_status" "reservation_status",
	"to_status" "reservation_status" NOT NULL,
	"reason" varchar(500),
	"actor_type" "activity_actor_type" NOT NULL,
	"actor_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"edition_id" uuid NOT NULL,
	"advertiser_org_id" uuid,
	"business_id" uuid,
	"buyer_email" varchar(180),
	"buyer_name" varchar(180),
	"package_key" "package_key",
	"kind" "reservation_kind" NOT NULL,
	"status" "reservation_status" NOT NULL,
	"half_units_consumed" integer NOT NULL,
	"price_cents" integer,
	"currency" varchar(8) DEFAULT 'usd' NOT NULL,
	"assigned_salesperson_id" uuid,
	"stripe_checkout_session_id" varchar(255),
	"stripe_payment_intent_id" varchar(255),
	"hold_expires_at" timestamp with time zone,
	"paid_at" timestamp with time zone,
	"released_at" timestamp with time zone,
	"release_reason" varchar(255),
	"source" "business_source" NOT NULL,
	"source_reference" varchar(255),
	"commissiongps_lead_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_reservations_half_units_positive" CHECK ("reservations"."half_units_consumed" > 0),
	CONSTRAINT "chk_internal_allocation_exactly_two" CHECK ("reservations"."kind" <> 'internal_allocation' OR "reservations"."half_units_consumed" = 2)
);
--> statement-breakpoint
CREATE TABLE "activity_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_type" "activity_actor_type" NOT NULL,
	"actor_id" uuid,
	"actor_label" varchar(255),
	"action" varchar(120) NOT NULL,
	"entity_type" varchar(120) NOT NULL,
	"entity_id" uuid NOT NULL,
	"reservation_id" uuid,
	"advertiser_org_id" uuid,
	"previous_value" jsonb,
	"new_value" jsonb,
	"metadata" jsonb,
	"request_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "edition_packages" ADD CONSTRAINT "edition_packages_edition_id_mailing_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."mailing_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservation_status_history" ADD CONSTRAINT "reservation_status_history_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_edition_id_mailing_editions_id_fk" FOREIGN KEY ("edition_id") REFERENCES "public"."mailing_editions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_events" ADD CONSTRAINT "activity_events_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_businesses_google_place_id" ON "businesses" USING btree ("google_place_id") WHERE "businesses"."google_place_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_businesses_city_listing" ON "businesses" USING btree ("city_slug","listing_status");--> statement-breakpoint
CREATE INDEX "idx_businesses_claim_status" ON "businesses" USING btree ("claim_status");--> statement-breakpoint
CREATE INDEX "idx_businesses_claimed_by_org" ON "businesses" USING btree ("claimed_by_org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_edition_packages_edition_key" ON "edition_packages" USING btree ("edition_id","package_key");--> statement-breakpoint
CREATE INDEX "idx_mailing_editions_status" ON "mailing_editions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_mailing_editions_city" ON "mailing_editions" USING btree ("city_slug");--> statement-breakpoint
CREATE INDEX "idx_reservation_status_history_reservation" ON "reservation_status_history" USING btree ("reservation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_reservations_edition_status" ON "reservations" USING btree ("edition_id","status");--> statement-breakpoint
CREATE INDEX "idx_reservations_edition_kind_status" ON "reservations" USING btree ("edition_id","kind","status");--> statement-breakpoint
CREATE INDEX "idx_reservations_advertiser_org" ON "reservations" USING btree ("advertiser_org_id");--> statement-breakpoint
CREATE INDEX "idx_reservations_business" ON "reservations" USING btree ("business_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_reservations_checkout_session" ON "reservations" USING btree ("stripe_checkout_session_id") WHERE "reservations"."stripe_checkout_session_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_reservations_hold_expiry" ON "reservations" USING btree ("hold_expires_at") WHERE "reservations"."status" IN ('held', 'awaiting_payment');--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_active_internal_allocation_per_edition" ON "reservations" USING btree ("edition_id") WHERE "reservations"."kind" = 'internal_allocation' AND "reservations"."status" IN ('held', 'awaiting_payment', 'paid', 'in_production', 'completed');--> statement-breakpoint
CREATE INDEX "idx_activity_events_entity" ON "activity_events" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_activity_events_reservation" ON "activity_events" USING btree ("reservation_id");--> statement-breakpoint
CREATE INDEX "idx_activity_events_advertiser_org" ON "activity_events" USING btree ("advertiser_org_id");--> statement-breakpoint
CREATE INDEX "idx_activity_events_created_at" ON "activity_events" USING btree ("created_at");