import { useQuery, skipToken } from "@tanstack/react-query";
import axios from "axios";

interface Train {
  Car: number;
  DestinationCode: string;
  DestinationName: string;
  Group: number;
  LocationCode: string;
  LocationName: string;
  Min: number;
}

const getStationNextTrains = async (stationCode: string) => {
  return await axios
    .get(
      import.meta.env.VITE_BACKEND_URL +
        "/get-station-next-trains/" +
        stationCode,
    )
    .then((res): Train[] => res?.data["Trains"])
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const getStationNextTrainsQuery = (stationCode: string | undefined) =>
  useQuery({
    queryKey: ["stationNextTrains", stationCode],
    queryFn: stationCode ? () => getStationNextTrains(stationCode) : skipToken,
    staleTime: 0, // e.g. Query completes the microsecond before the times update
  });
