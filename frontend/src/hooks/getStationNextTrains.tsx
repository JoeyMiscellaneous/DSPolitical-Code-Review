import { useQuery, skipToken } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface Train {
  destinationName: string;
  min: string;
  line: string;
  car: string;
}

const getStationNextTrains = async (stationCode: string) => {
  return await axios
    .get<Train[]>(
      import.meta.env.VITE_BACKEND_URL +
        "/get-station-next-trains/" +
        stationCode,
    )
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const getStationNextTrainsQuery = (stationCode: string | undefined) =>
  useQuery<Train[], AxiosError>({
    queryKey: ["stationNextTrains", stationCode],
    queryFn: stationCode ? () => getStationNextTrains(stationCode) : skipToken,
    staleTime: 0, // e.g. Query completes the microsecond before the times update
    retry: false,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchIntervalInBackground: false, // Don't refetch if not viewing that tab
  });
