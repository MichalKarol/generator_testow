import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_raw/database/$id/tests/$testId/groups")(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  return <Outlet />;
}
