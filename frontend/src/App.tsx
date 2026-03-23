import { Outlet } from "react-router";
import "./App.css";
import { StationPicker } from "./components/StationPicker";

function App() {
  return (
    <>
      <h2>Station Times</h2>
      <StationPicker />
      <Outlet />
    </>
  );
}

export default App;
