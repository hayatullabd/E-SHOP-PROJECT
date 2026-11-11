const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || "https://e-shop-project-omega.vercel.app").replace(/\/$/, "");

const server_url = `${baseUrl}/api/v1`;
export const server_url_v2 = `${baseUrl}/api/v2`;
export const server_url_v4 = `${baseUrl}/api/v4`;

export default server_url;
