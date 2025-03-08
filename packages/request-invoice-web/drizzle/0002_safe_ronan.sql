CREATE TABLE "user_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"wallet_address" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'seller' NOT NULL,
	"description" varchar(255),
	"amount" varchar(50),
	"currency" varchar(20),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"client" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_requests_request_id_unique" UNIQUE("request_id")
);
