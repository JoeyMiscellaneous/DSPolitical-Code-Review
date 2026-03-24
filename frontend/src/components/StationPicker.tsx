import {
  Autocomplete,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getStationsQuery } from "../hooks/getStations";
import type { SymfonyError } from "./ErrorPage";

export const StationPicker = () => {
  const { stationCode } = useParams();
  const { data: stations, error, isLoading } = getStationsQuery(); // Could have used a provider, but React Query best practices say to just recall the custom hook
  const currentStation = stations?.find((s) => s.code == stationCode);

  const navigate = useNavigate();

  const handleChange = (stationCode: string | undefined) => {
    if (!stationCode) return;
    navigate("/station/" + stationCode);
  };

  const stationOptions =
    stations?.map((s) => {
      return { label: s.name, id: s.code };
    }) ?? [];

  if (error) {
    const errorData = error?.response?.data as SymfonyError;
    navigate("/error?errorMessage=" + errorData?.message);
  }

  if (isLoading) return <CircularProgress sx={{ alignSelf: "center" }} />;

  return (
    <>
      <Stack alignItems="center">
        {currentStation ? (
          <Typography variant="h5">{currentStation.name}</Typography>
        ) : (
          <Typography variant="h5">Station Times</Typography>
        )}
      </Stack>
      <Autocomplete
        options={stationOptions}
        getOptionKey={(option) => option.id}
        renderInput={(params) => <TextField {...params} label="Station" />}
        onChange={(_, value) => handleChange(value?.id)}
      />
    </>
  );
};
