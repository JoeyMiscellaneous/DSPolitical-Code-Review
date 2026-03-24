import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface Station {
  code: string;
  name: string;
}

const getStations = async () => {
  return await axios
    .get<Station[]>(import.meta.env.VITE_BACKEND_URL + "/get-stations")
    .then((res) => res.data);
};

export const getStationsQuery = () =>
  useQuery<Station[], AxiosError>({
    queryKey: ["stations"],
    queryFn: getStations,
    retry: false,
  });
