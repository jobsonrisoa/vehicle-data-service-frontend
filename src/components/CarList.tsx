import { useState } from "react";
import { useMediaQuery, useTheme, Box, Grid, Card, CardMedia, CardContent, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useCars } from "../hooks/useCars";

export function CarList() {
  const { cars, loading, error } = useCars();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"model-asc" | "model-desc">("model-asc");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <Typography>Loading cars</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <Typography color="error">Unable to load cars</Typography>
      </Box>
    );
  }

  const filtered = cars
    .filter((car) =>
      car.model.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "model-asc") {
        return a.model.localeCompare(b.model);
      }
      return b.model.localeCompare(a.model);
    });

  function imageFor(car: (typeof cars)[number]) {
    if (isMobile) {
      return car.mobile;
    }
    if (isTablet) {
      return car.tablet;
    }
    return car.desktop;
  }

  return (
    <Box padding={4}>
      <Box display="flex" gap={2} marginBottom={3} flexWrap="wrap">
        <TextField
          label="Model"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FormControl>
          <InputLabel id="car-sort-label">Sort</InputLabel>
          <Select
            labelId="car-sort-label"
            label="Sort"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "model-asc" | "model-desc")
            }
          >
            <MenuItem value="model-asc">Model A-Z</MenuItem>
            <MenuItem value="model-desc">Model Z-A</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {filtered.map((car) => (
          <Grid item key={car.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={imageFor(car)}
                alt={`${car.make} ${car.model}`}
              />
              <CardContent>
                <Typography variant="h6">
                  {car.make} {car.model}
                </Typography>
                <Typography variant="body2">{car.year}</Typography>
                <Typography variant="body2">{car.color}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


