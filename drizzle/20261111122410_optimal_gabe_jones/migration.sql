CREATE TYPE "product_category" AS ENUM('milk', 'curd', 'paneer', 'ghee', 'butter', 'buttermilk', 'cream', 'other');--> statement-breakpoint
CREATE TYPE "productUnitEnum" AS ENUM('litre', 'kg', 'packet', 'piece');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL UNIQUE,
	"description" varchar(255),
	"unit" "productUnitEnum" NOT NULL,
	"price" double precision NOT NULL,
	"quantity" double precision NOT NULL,
	"image_url" varchar(255),
	"product_category" "product_category" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT '2026-11-18 12:24:10.410';