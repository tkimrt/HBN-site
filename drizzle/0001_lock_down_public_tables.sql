-- The application reaches Postgres only through its server-side DATABASE_URL.
-- Anonymous browser clients do not need direct PostgREST access to any table.
--
-- RLS blocks row operations, while the explicit revokes also close operations
-- such as TRUNCATE that are outside RLS. The server's `postgres` role retains
-- access and BYPASSRLS, so public pages, contact submissions, and the protected
-- admin area continue to use the same application data path.

ALTER TABLE "public"."articles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."enquiries" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

REVOKE ALL PRIVILEGES ON TABLE
  "public"."articles",
  "public"."events",
  "public"."enquiries"
FROM PUBLIC, anon, authenticated;
--> statement-breakpoint

REVOKE ALL PRIVILEGES ON SEQUENCE
  "public"."articles_id_seq",
  "public"."events_id_seq",
  "public"."enquiries_id_seq"
FROM PUBLIC, anon, authenticated;
--> statement-breakpoint

-- Keep future Drizzle-created tables closed by default as well.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, anon, authenticated;
--> statement-breakpoint

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, anon, authenticated;
