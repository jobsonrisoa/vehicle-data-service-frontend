import { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { v4 as uuid } from "uuid";
import { useCars } from "../hooks/useCars";

export function CarForm() {
  const { addLocalCar } = useCars();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!make || !model || !year || !color) {
      return;
    }

    const numericYear = Number(year);

    if (!Number.isFinite(numericYear)) {
      return;
    }

    addLocalCar({
      id: uuid(),
      make,
      model,
      year: numericYear,
      color,
      mobile: "",
      tablet: "",
      desktop: "",
    });

    setMake("");
    setModel("");
    setYear("");
    setColor("");
  }

  return (
    <Box padding={4} component="form" onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Make"
            value={make}
            onChange={(event) => setMake(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Year"
            value={year}
            onChange={(event) => setYear(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Add Car
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}


