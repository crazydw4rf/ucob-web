import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("about", "routes/about.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  ...prefix("dashboard", [
    layout("routes/dashboard.tsx", [
      index("routes/dashboard._index.tsx"),
      route("buy", "routes/dashboard.buy.tsx"),
      route("sell", "routes/dashboard.sell.tsx"),
      route("transactions", "routes/dashboard.transactions.tsx"),
      route("profile", "routes/dashboard.profile.tsx"),
      route("info", "routes/dashboard.info.tsx"),
      route("admin", "routes/dashboard.admin._index.tsx"),
      route("admin/transactions", "routes/dashboard.admin.transactions.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
