import { useState } from "react";
import { useMediaQuery, useTheme, Box, Card, CardMedia, CardContent, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useCars } from "../hooks/useCars";

export function CarList() {
  const { cars, loading, error } = useCars();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"model-asc" | "model-desc">("model-asc");
  const [yearFilter, setYearFilter] = useState<string>("all");
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

  const years = Array.from(new Set(cars.map((car) => car.year))).sort(
    (a, b) => a - b
  );

  const filtered = cars
    .filter((car) =>
      car.model.toLowerCase().includes(search.toLowerCase())
    )
    .filter((car) => {
      if (yearFilter === "all") {
        return true;
      }
      return String(car.year) === yearFilter;
    })
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
        <FormControl>
          <InputLabel id="car-year-label">Year</InputLabel>
          <Select
            labelId="car-year-label"
            label="Year"
            value={yearFilter}
            onChange={(event) => setYearFilter(event.target.value)}
          >
            <MenuItem value="all">All years</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={String(year)}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {filtered.map((car) => (
          <Card key={car.id}>
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
        ))}
      </Box>
    </Box>
  );
}


