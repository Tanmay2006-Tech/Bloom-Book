CREATE TABLE "memories" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"media_url" text,
	"media_type" text,
	"date" date,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cafes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text,
	"date" date,
	"rating" integer,
	"what_we_ate" text,
	"photo_url" text,
	"reflection" text,
	"would_visit_again" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text,
	"status" text,
	"rating" integer,
	"quote" text,
	"reflection" text,
	"cover_url" text,
	"is_stayed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text,
	"genre" text,
	"rating" integer,
	"what_it_reminded" text,
	"poster_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"emoji" text,
	"title" text NOT NULL,
	"notes" text,
	"is_done" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "capsules" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"unlock_at" timestamp with time zone NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kitchen_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text,
	"recipe" text,
	"photo_url" text,
	"rating" integer,
	"mood" text,
	"notes" text,
	"would_make_again" boolean DEFAULT true NOT NULL,
	"date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "random_reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"category" text,
	"rating" integer,
	"vibe_check" text,
	"review" text NOT NULL,
	"photo_url" text,
	"would_recommend" boolean DEFAULT true NOT NULL,
	"date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "memories_created_at_idx" ON "memories" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "memories_favorite_idx" ON "memories" USING btree ("is_favorite");--> statement-breakpoint
CREATE INDEX "cafes_created_at_idx" ON "cafes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "books_created_at_idx" ON "books" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "books_status_idx" ON "books" USING btree ("status");--> statement-breakpoint
CREATE INDEX "movies_created_at_idx" ON "movies" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "wishlist_created_at_idx" ON "wishlist" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "capsules_created_at_idx" ON "capsules" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "capsules_unlock_at_idx" ON "capsules" USING btree ("unlock_at");--> statement-breakpoint
CREATE INDEX "kitchen_entries_created_at_idx" ON "kitchen_entries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "kitchen_entries_type_idx" ON "kitchen_entries" USING btree ("type");--> statement-breakpoint
CREATE INDEX "random_reviews_created_at_idx" ON "random_reviews" USING btree ("created_at");