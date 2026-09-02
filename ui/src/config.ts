const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export const apiUrl = configuredApiUrl ?? "";

export function resolveApiResource(resourcePath: string): string {
    if (!configuredApiUrl || !resourcePath.startsWith("/")) {
        return resourcePath;
    }

    return new URL(resourcePath, `${configuredApiUrl}/`).toString();
}
