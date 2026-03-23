import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";

interface Station {
  Code: string;
  Name: string;
}

const getStations = async () => {
  return await axios
    .get(import.meta.env.VITE_BACKEND_URL + "/get-stations")
    .then((res): Station[] => res?.data["Stations"])
    .catch((err) => {
      console.error(err);
    });
};

export const StationPicker = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["stations"],
    queryFn: getStations,
  });

  const navigate = useNavigate();
  const handleChange = (stationCode: string | undefined) => {
    if (!stationCode) return;
    navigate("/station/" + stationCode, { replace: true });
  };

  const stationOptions =
    data?.map((s) => {
      return { label: s.Name, id: s.Code };
    }) ?? [];

  if (isLoading) return <CircularProgress />;
  if (error) return <TextField disabled />;

  return (
    <Autocomplete
      options={stationOptions}
      getOptionKey={(option) => option.id}
      renderInput={(params) => <TextField {...params} label="Station" />}
      onChange={(_, value) => handleChange(value?.id)}
    />
  );
};
