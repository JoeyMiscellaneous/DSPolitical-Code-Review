import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useParams } from "react-router";
import { getStationNextTrainsQuery } from "../hooks/getStationNextTrains";

export const StationTimes = () => {
  const { stationCode } = useParams();

  const {
    data: stationNextTrains,
    isLoading,
    error,
    refetch,
  } = getStationNextTrainsQuery(stationCode);

  if (stationNextTrains) console.log(stationNextTrains);
  if (isLoading) return <CircularProgress />;
  if (error) return <TextField disabled />;

  return (
    <>
      <Button onClick={() => refetch()}>Refresh arrival times</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Car</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Min</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stationNextTrains
            ?.sort((a, b) => a.DestinationName.localeCompare(b.DestinationName))
            .map((snt, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{snt.Car}</TableCell>
                  <TableCell>{snt.DestinationName}</TableCell>
                  <TableCell>{snt.Min ? snt.Min : "N/A"}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};
