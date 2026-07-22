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
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/store";
import { useState, type SubmitEvent } from "react";
import { RemoveDialog } from "@/components/RemoveDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { openUrl } from "@/utils";

export const Route = createFileRoute("/_navbar/")({
  component: Index,
});

function Index() {
  const store = useStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loadDataOpen, setLoadDataOpen] = useState(false);
  const [removeId, setRemoveId] = useState(-1);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    store.createDatabase(formJson.name);
    navigate({
      to: `/database/$id`,
      params: { id: store.databases.length.toString() },
    });
  };

  const handleLoadFile = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const reader = new FileReader();

    reader.onload = function (e) {
      const textFileContent = e.target?.result;
      if (!textFileContent) {
        throw Error("Invalid file");
      }
      const data = JSON.parse(textFileContent.toString());
      store.loadData(data);
      setLoadDataOpen(false);
    };

    reader.onerror = function () {
      throw Error(`Error reading file: ${reader.error}`);
    };
    reader.readAsText(formJson.file);
  };

  const saveStore = () => {
    const data = JSON.stringify(store);
    const url = URL.createObjectURL(
      new Blob([data], { type: "application/json" }),
    );
    openUrl(url, "dane_generatora_testow.json");
  };

  return (
    <Box>
      <Container>
        <Stack direction="column" spacing={2} sx={{ pt: 4 }}>
          <Stack direction="row">
            <Button onClick={() => setLoadDataOpen(true)}>Załaduj dane</Button>
            <Button onClick={() => saveStore()}>Zapisz dane</Button>
          </Stack>
          {store.databases.map(({ name }, idx) => (
            <Box key={`${name}-${idx}`}>
              <Card>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <CardActionArea
                    sx={{ flex: 1 }}
                    onClick={() =>
                      navigate({
                        to: `/database/$id`,
                        params: { id: idx.toString() },
                      })
                    }
                  >
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button onClick={() => setRemoveId(idx)} color="error">
                      <DeleteIcon />
                      Usuń
                    </Button>
                  </CardActions>
                </Stack>
              </Card>
            </Box>
          ))}

          <Box
            sx={{
              pt: 4,
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button onClick={() => setOpen(true)}>Nowa baza pytań</Button>
          </Box>
        </Stack>
      </Container>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nowa baza pytań</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Baza pytań ma na celu zebranie podobnych grup pytań w jednym
            zestawie (np. jedna grupa tematyczna).
          </DialogContentText>
          <form onSubmit={handleSubmit} id="database-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Nazwa bazy pytań"
              type="text"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
          <Button color="success" type="submit" form="database-form">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
      <RemoveDialog
        title="Usuń bazę pytań"
        description="Bazy pytań nie będzie można przywrócić!"
        onRemove={() => store.removeDatabase(removeId)}
        open={removeId !== -1}
        close={() => setRemoveId(-1)}
      />

      <Dialog
        open={loadDataOpen}
        onClose={() => setLoadDataOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Załaduj dane</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Baza pytań ma na celu zebranie podobnych grup pytań w jednym
            zestawie (np. jedna grupa tematyczna).
          </DialogContentText>
          <form onSubmit={handleLoadFile} id="load-data-form">
            <TextField
              type="file"
              autoFocus
              required
              margin="dense"
              id="file"
              name="file"
              label="Plik z danymi"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setLoadDataOpen(false)}>
            Anuluj
          </Button>
          <Button color="success" type="submit" form="load-data-form">
            Ładuj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
