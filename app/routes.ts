import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/pages/main.tsx"),route('login','routes/pages/login.tsx'),route('createpost','routes/pages/create.tsx')] satisfies RouteConfig;
