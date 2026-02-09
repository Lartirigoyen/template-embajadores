CREATE TABLE IF NOT EXISTS "app"."ejemplo_tabla" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"id_publico" uuid DEFAULT gen_random_uuid() NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"fecha_creacion" timestamp with time zone DEFAULT now() NOT NULL,
	"fecha_actualizacion" timestamp with time zone DEFAULT now() NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"adicional" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "ejemplo_tabla_id_publico_unique" UNIQUE("id_publico")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ejemplo_tabla_id_publico" ON "app"."ejemplo_tabla" USING btree ("id_publico");