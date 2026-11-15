CREATE TABLE "product_crates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"units_per_crate" integer NOT NULL,
	"crate_price" double precision NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_crates_product_id_units_unique" UNIQUE("product_id","units_per_crate")
);
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT '2026-11-22 12:37:32.937';--> statement-breakpoint
ALTER TABLE "product_crates" ADD CONSTRAINT "product_crates_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;