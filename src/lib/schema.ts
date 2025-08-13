import {
  pgTable,
  bigserial,
  bigint,
  text,
  timestamp,
  numeric,
  integer,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  stackUserId: text("stack_user_id").unique(),
  role: text("role").notNull(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const talentProfiles = pgTable("talent_profiles", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  userId: bigint("user_id", { mode: "number" }).notNull().unique(),
  headline: text("headline"),
  bio: text("bio"),
  location: text("location"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const services = pgTable("services", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  profileId: bigint("profile_id", { mode: "number" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 12, scale: 2 }),
  currency: text("currency"),
  durationMinutes: integer("duration_minutes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  profileId: bigint("profile_id", { mode: "number" }).notNull(),
  mediaUrl: text("media_url").notNull(),
  title: text("title"),
  description: text("description"),
  visibility: text("visibility").notNull().default("public"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const bookings = pgTable("bookings", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  serviceId: bigint("service_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  status: text("status").notNull().default("requested"),
  scheduleStart: timestamp("schedule_start", { withTimezone: true }),
  scheduleEnd: timestamp("schedule_end", { withTimezone: true }),
  priceAgreed: numeric("price_agreed", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  bookingId: bigint("booking_id", { mode: "number" }).notNull(),
  provider: text("provider").notNull(),
  providerRef: text("provider_ref"),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  currency: text("currency"),
  status: text("status").notNull(),
  rawPayload: text("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reviews = pgTable("reviews", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  bookingId: bigint("booking_id", { mode: "number" }).notNull(),
  rating: integer("rating"),
  comment: text("comment"),
  reviewerId: bigint("reviewer_id", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
