import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/store";
import { CustomButtonLink } from "@/components/CustomButtonLink";

export const Route = createFileRoute("/_navbar/database/$id/tests/$testId/")({
  component: Database,
});

function Database() {
  const store = useStore();
  const { id, testId } = Route.useParams();
  const databaseId = Number.parseInt(id);
  const testid = Number.parseInt(testId);
  const test = store.databases[databaseId].tests[testid];

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          pt: 4,
        }}
      >
        <Container sx={{ flex: 3 }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h3">{test.title}</Typography>
            <Typography variant="h5">{test.subtitle}</Typography>
            {test.groups.map((_, idx) => (
              <Box key={`${idx}`}>
                <Card>
                  <CardContent>
                    <Typography variant="overline">Grupa {idx + 1}</Typography>
                    <Stack direction="row" spacing={4}>
                      <CustomButtonLink
                        to="/database/$id/tests/$testId/groups/$groupId/test"
                        params={{ id, testId, groupId: idx.toString() }}
                        target="_blank"
                      >
                        Test
                      </CustomButtonLink>

                      <CustomButtonLink
                        to="/database/$id/tests/$testId/groups/$groupId/key"
                        params={{ id, testId, groupId: idx.toString() }}
                        target="_blank"
                      >
                        Klucz odpowiedzi
                      </CustomButtonLink>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
