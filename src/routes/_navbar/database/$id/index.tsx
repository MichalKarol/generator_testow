import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/store";
import { useState, type SubmitEvent } from "react";
import NumberField from "@/components/NumberField";
import { generateTestGroups } from "@/utils";
import { RemoveDialog } from "@/components/RemoveDialog";
import DeleteIcon from "@mui/icons-material/Delete";

export const Route = createFileRoute("/_navbar/database/$id/")({
  component: Database,
});

type DynamicSimpleQuestionDialog = {
  open: boolean;
  close: () => void;
  handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};
const DynamicSimpleQuestionDialog = ({
  open,
  close,
  handleSubmit,
}: DynamicSimpleQuestionDialog) => {
  const [numberOfAnswers, setNumberOfAnswers] = useState(4);
  return (
    <Dialog open={open} onClose={() => close()} maxWidth="md" fullWidth>
      <DialogTitle>Nowe pytanie zamknięte</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="simple-question-form">
          <TextField
            autoFocus
            multiline
            required
            minRows={2}
            margin="dense"
            id="question"
            name="question"
            label="Pytanie zamknięte"
            type="text"
            fullWidth
            variant="standard"
          />
          <NumberField
            value={numberOfAnswers}
            onValueChange={(value) => value && setNumberOfAnswers(value)}
          />
          <input type="hidden" value={numberOfAnswers} name="numberOfAnswers" />

          <Stack direction="row">
            <Stack direction="column" sx={{ flex: 1 }}>
              {new Array(numberOfAnswers).fill(null).map((_, idx) => (
                <TextField
                  key={idx}
                  required
                  margin="dense"
                  id={`answer[${idx}]`}
                  name={`answer[${idx}]`}
                  label={`Odpowiedź ${idx + 1}`}
                  type="text"
                  fullWidth
                  variant="standard"
                />
              ))}
            </Stack>
            <RadioGroup
              defaultValue="female"
              name="radio-buttons-group"
              aria-required="true"
            >
              <Stack direction="column">
                {new Array(numberOfAnswers).fill(null).map((_, idx) => (
                  <Radio key={idx} value={idx} required sx={{ mt: 2 }} />
                ))}
              </Stack>
            </RadioGroup>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => close()}>
          Anuluj
        </Button>
        <Button color="success" type="submit" form="simple-question-form">
          Zapisz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function Database() {
  const store = useStore();
  const { id } = Route.useParams();
  const databaseId = Number.parseInt(id);
  const navigate = useNavigate();

  const [simpleQuestionOpen, setSimpleQuestionOpen] = useState(false);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [testsOpen, setTestsOpen] = useState(false);
  const [remove, setRemove] = useState<
    | { type: "simpleQuestion"; id: number }
    | { type: "prescriptionQuestion"; id: number }
    | { type: "test"; id: number }
    | null
  >(null);

  const handleSimpleQuestionSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    store.addSimpleQuestion(databaseId, {
      question: formJson.question,
      answers: new Array(Number.parseInt(formJson.numberOfAnswers))
        .fill(null)
        .map((_, idx) => ({
          answer: formJson[`answer[${idx}]`],
          correct: formJson["radio-buttons-group"] === idx.toString(),
        })),
    });
    setSimpleQuestionOpen(false);
  };

  const handlePrescriptionSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    store.addPrescriptionQuestion(databaseId, {
      question: formJson.question,
    });
    setPrescriptionOpen(false);
  };

  const handleTestSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    store.createTest(databaseId, {
      title: formJson.title,
      subtitle: formJson.subtitle,
      createdAt: new Date().toISOString(),
      seed: Math.random(),
      groups: generateTestGroups(
        Number.parseInt(formJson.groups),
        Math.random(),
        Number.parseInt(formJson.simpleQuestionsSample),
        store.databases[databaseId].simpleQuestions,
        Number.parseInt(formJson.prescriptionQuestionsSample),
        store.databases[databaseId].prescriptionQuestions,
      ),
    });
    navigate({
      to: "/database/$id/tests/$testId",
      params: {
        id,
        testId: store.databases[databaseId].tests.length.toString(),
      },
    });
  };

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
            <Typography variant="h3">Pytania</Typography>
            {store.databases[databaseId].simpleQuestions.map(
              ({ question, answers }, idx) => (
                <Box key={`${question}-${idx}`}>
                  <Card>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="overline">
                          {idx + 1}. Pytanie zamknięte
                        </Typography>
                        <Typography gutterBottom variant="h5">
                          {question}
                        </Typography>
                        <Divider />
                        <Stack direction="column">
                          {answers.map((answer, answerIdx) => (
                            <Typography
                              key={`${answer.answer}-${answerIdx}`}
                              gutterBottom
                              variant="h5"
                              color={answer.correct ? "success" : "error"}
                            >
                              {answer.answer}
                            </Typography>
                          ))}
                        </Stack>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() =>
                            setRemove({ type: "simpleQuestion", id: idx })
                          }
                          color="error"
                        >
                          <DeleteIcon />
                          Usuń
                        </Button>
                      </CardActions>
                    </Stack>
                  </Card>
                </Box>
              ),
            )}
            {store.databases[databaseId].prescriptionQuestions.map(
              ({ question }, idx) => (
                <Box key={`${question}-${idx}`}>
                  <Card>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: "space-between" }}
                    >
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="overline">
                          {store.databases[databaseId].simpleQuestions.length +
                            idx +
                            1}
                          . Zadanie z receptą
                        </Typography>
                        <Typography gutterBottom variant="h5">
                          {question}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() =>
                            setRemove({ type: "prescriptionQuestion", id: idx })
                          }
                          color="error"
                        >
                          <DeleteIcon />
                          Usuń
                        </Button>
                      </CardActions>
                    </Stack>
                  </Card>
                </Box>
              ),
            )}
          </Stack>
        </Container>
        <Container sx={{ flex: 1 }}>
          <Box
            sx={{
              position: "sticky",
              top: 0,
            }}
          >
            <Box
              sx={{
                pt: 8,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                gap: 4,
              }}
            >
              <Button onClick={() => setSimpleQuestionOpen(true)}>
                Nowe pytanie zamknięte
              </Button>
              <Button onClick={() => setPrescriptionOpen(true)}>
                Nowa zadanie z receptą
              </Button>
            </Box>
            <Divider sx={{ mt: 4, mb: 4 }} />
            <Box>
              <Stack direction="column" spacing={2}>
                <Typography variant="h3" align="center">
                  Zestawy testowe
                </Typography>
                {store.databases[databaseId].tests.map(
                  ({ title, subtitle }, idx) => (
                    <Box key={`${title}-${idx}`}>
                      <Card>
                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between" }}
                        >
                          <CardActionArea
                            sx={{ flex: 1 }}
                            onClick={() =>
                              navigate({
                                to: "/database/$id/tests/$testId",
                                params: { id, testId: idx.toString() },
                              })
                            }
                          >
                            <CardContent>
                              <Typography variant="overline">
                                {idx + 1}. Zestaw testowy
                              </Typography>
                              <Typography gutterBottom variant="h5">
                                {title}
                              </Typography>
                              <Typography gutterBottom variant="caption">
                                {subtitle}
                              </Typography>
                            </CardContent>
                          </CardActionArea>
                          <CardActions>
                            <Button
                              onClick={() =>
                                setRemove({ type: "test", id: idx })
                              }
                              color="error"
                            >
                              <DeleteIcon />
                              Usuń
                            </Button>
                          </CardActions>
                        </Stack>
                      </Card>
                    </Box>
                  ),
                )}
                <Button
                  onClick={() => setTestsOpen(true)}
                  sx={{ mt: 4 }}
                  color="error"
                >
                  Nowy zestaw testów
                </Button>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <DynamicSimpleQuestionDialog
        open={simpleQuestionOpen}
        close={() => setSimpleQuestionOpen(false)}
        handleSubmit={handleSimpleQuestionSubmit}
      />

      <Dialog
        open={prescriptionOpen}
        onClose={() => setPrescriptionOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Zadanie z receptą</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePrescriptionSubmit} id="prescription-form">
            <TextField
              autoFocus
              required
              multiline
              minRows={3}
              margin="dense"
              id="question"
              name="question"
              label="Pytanie"
              type="text"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setPrescriptionOpen(false)}>
            Anuluj
          </Button>
          <Button color="success" type="submit" form="prescription-form">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={testsOpen}
        onClose={() => setTestsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nowy zestaw testów</DialogTitle>
        <DialogContent>
          <form onSubmit={handleTestSubmit} id="test-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Tytuł zestawu"
              placeholder="Egzamin Farmakologia"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="subtitle"
              name="subtitle"
              label="Podtytuł zestawu"
              placeholder="Pielęgniarstwo 2026"
              type="text"
              fullWidth
              variant="standard"
            />
            <Stack spacing={1} sx={{ mt: 2 }}>
              <NumberField
                label="Ilość grup"
                name="groups"
                min={1}
                max={15}
                defaultValue={1}
              />
              <NumberField
                label="Ilość pytań zamkniętych"
                name="simpleQuestionsSample"
                min={1}
                max={store.databases[databaseId].simpleQuestions.length}
                defaultValue={Math.min(
                  store.databases[databaseId].simpleQuestions.length,
                  20,
                )}
              />
              <NumberField
                label="Ilość zadań z receptą"
                name="prescriptionQuestionsSample"
                min={1}
                max={store.databases[databaseId].prescriptionQuestions.length}
                defaultValue={1}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setTestsOpen(false)}>
            Anuluj
          </Button>
          <Button color="success" type="submit" form="test-form">
            Utwórz
          </Button>
        </DialogActions>
      </Dialog>

      <RemoveDialog
        title="Usuń pytanie"
        description="Pytania nie będzie można przywrócić!"
        onRemove={() =>
          remove
            ? remove.type === "simpleQuestion"
              ? store.removeSimpleQuestion(databaseId, remove.id)
              : store.removePrescriptionQuestion(databaseId, remove.id)
            : null
        }
        open={
          remove?.type === "simpleQuestion" ||
          remove?.type === "prescriptionQuestion"
        }
        close={() => setRemove(null)}
      />
      <RemoveDialog
        title="Usuń zestaw testowy"
        description="Zestawu testowego nie będzie można przywrócić!"
        onRemove={() =>
          remove ? store.removeTest(databaseId, remove.id) : null
        }
        open={remove?.type === "test"}
        close={() => setRemove(null)}
      />
    </Box>
  );
}
