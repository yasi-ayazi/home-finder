import path from "node:path";
import { z } from "zod";

const environmentSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce.number().int().positive().max(65535).default(3000),
    DATABASE_URL: z
        .string()
        .url()
        .default(
            "postgres://home_finder:home_finder@localhost:5432/home_finder",
        ),
    UI_ORIGIN: z.string().url().default("http://localhost:5173"),
    STORAGE_ROOT: z
        .string()
        .min(1)
        .default(path.resolve(process.cwd(), "storage")),
});

export type Environment = z.infer<typeof environmentSchema>;

export function loadEnvironment(
    input: NodeJS.ProcessEnv = process.env,
): Environment {
    const result = environmentSchema.safeParse(input);

    if (!result.success) {
        throw new Error(
            `Invalid environment configuration: ${z.prettifyError(result.error)}`,
        );
    }

    return result.data;
}
