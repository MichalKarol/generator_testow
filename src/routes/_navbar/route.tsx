import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import {
  Outlet,
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  AppBar,
  Box,
  Button,
  ScopedCssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";

const NavbarLayout = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <>
      <ScopedCssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {canGoBack ? (
              <Button onClick={() => router.history.back()}>
                <ArrowBackIos sx={{ color: "white" }} />
              </Button>
            ) : (
              <Box sx={{ pr: 8 }} />
            )}
            <Typography variant="h5">Generator testów</Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
};
export const Route = createFileRoute("/_navbar")({
  component: NavbarLayout,
});
