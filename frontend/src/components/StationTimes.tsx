import { CircularProgress, TextField } from "@mui/material";
import { skipToken, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";

const getStationNextTrains = async (stationCode: string) => {
  return await axios
    .get(
      import.meta.env.VITE_BACKEND_URL +
        "/get-station-next-trains/" +
        stationCode,
    )
    .then((res) => res)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const StationTimes = () => {
  const { stationCode } = useParams();

  const { data, error, isLoading } = useQuery({
    queryKey: ["stationNextTrains", stationCode],
    queryFn: stationCode ? () => getStationNextTrains(stationCode) : skipToken,
  });

  if (data) console.log(data);
  if (isLoading) return <CircularProgress />;
  if (error) return <TextField disabled />;

  return <>stationCode</>;
};
