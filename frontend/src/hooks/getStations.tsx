import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

export const getStationsQuery = () =>
  useQuery({ queryKey: ["stations"], queryFn: getStations });
