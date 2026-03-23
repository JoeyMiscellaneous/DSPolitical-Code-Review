import {
  Autocomplete,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getStationsQuery } from "../hooks/getStations";

export const StationPicker = () => {
  const { stationCode } = useParams();
  const { data: stations, error, isLoading } = getStationsQuery();
  const currentStation = stations?.find((s) => s.Code == stationCode);

  const navigate = useNavigate();

  const handleChange = (stationCode: string | undefined) => {
    if (!stationCode) return;
    navigate("/station/" + stationCode);
  };

  const stationOptions =
    stations?.map((s) => {
      return { label: s.Name, id: s.Code };
    }) ?? [];

  if (isLoading) return <CircularProgress />;
  if (error) return <TextField disabled />;

  return (
    <>
      <Stack alignItems="center">
        {currentStation ? (
          <Typography variant="h5">{currentStation.Name}</Typography>
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
