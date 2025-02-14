CREATE TABLE IF NOT EXISTS "Invoice" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "invoiceNumber" text NOT NULL,
  "vendor" text NOT NULL,
  "amount" numeric NOT NULL,
  "invoiceDate" timestamp NOT NULL,
  "dueDate" timestamp NOT NULL,
  "ocrTimestamp" timestamp DEFAULT now() NOT NULL,
  "source" text,
  "userId" uuid NOT NULL,
  CONSTRAINT "Invoice_id_pk" PRIMARY KEY("id"),
  CONSTRAINT "Invoice_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action
);

CREATE TABLE IF NOT EXISTS "AdminObligation" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "obligation" text NOT NULL,
  "dueDate" timestamp NOT NULL,
  "notes" text,
  "ocrTimestamp" timestamp DEFAULT now() NOT NULL,
  "source" text,
  "userId" uuid NOT NULL,
  CONSTRAINT "AdminObligation_id_pk" PRIMARY KEY("id"),
  CONSTRAINT "AdminObligation_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE no action ON UPDATE no action
);
