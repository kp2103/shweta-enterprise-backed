CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" varchar(100) NOT NULL UNIQUE,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "retailers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"shop_name" varchar(150) NOT NULL,
	"gst_no" varchar,
	"phone" varchar(20) NOT NULL,
	"shop_photo_url" varchar(255),
	"address" text NOT NULL,
	"postal_code" varchar(10) NOT NULL,
	"area" varchar(25) NOT NULL,
	"city" varchar(50) NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_unique" UNIQUE("role_id","permission_id")
);
--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "role_type";--> statement-breakpoint
CREATE TYPE "role_type" AS ENUM('RETAILER', 'DISTRIBUTOR');--> statement-breakpoint
ALTER TABLE "roles" ALTER COLUMN "role" SET DATA TYPE "role_type" USING "role"::"role_type";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT '2026-11-12 02:47:08.692';--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_role_key" UNIQUE("role");--> statement-breakpoint
ALTER TABLE "retailers" ADD CONSTRAINT "retailers_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE;