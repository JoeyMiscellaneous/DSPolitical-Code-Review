import { Outlet } from "react-router";
import "./App.css";
import { StationPicker } from "./components/StationPicker";
import { Stack, Typography } from "@mui/material";

function App() {
  return (
    <Stack spacing={1} direction="column">
      <StationPicker />
      <Outlet />
    </Stack>
  );
}

export default App;
