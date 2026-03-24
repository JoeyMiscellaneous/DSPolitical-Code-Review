import { Stack } from "@mui/material";
import { Outlet } from "react-router";
import "./App.css";
import { StationPicker } from "./components/StationPicker";

function App() {
  return (
    <Stack spacing={1} direction="column">
      <StationPicker />
      <Outlet />
    </Stack>
  );
}

export default App;
