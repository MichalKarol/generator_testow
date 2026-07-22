import { Outlet, createRootRoute } from "@tanstack/react-router";
import "./base.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
