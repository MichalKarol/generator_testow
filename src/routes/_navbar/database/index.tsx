import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_navbar/database/")({
  component: () => <Navigate to="/" />,
});
