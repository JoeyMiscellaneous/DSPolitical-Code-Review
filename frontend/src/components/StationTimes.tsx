import {
  Button,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { getStationNextTrainsQuery } from "../hooks/getStationNextTrains";
import type { SymfonyError } from "./ErrorPage";

export const StationTimes = () => {
  const { stationCode } = useParams();
  const navigate = useNavigate();

  const {
    data: stationNextTrains,
    isLoading,
    error,
    refetch,
  } = getStationNextTrainsQuery(stationCode);

  if (error) {
    const errorData = error?.response?.data as SymfonyError;
    navigate("/error?errorMessage=" + errorData?.message);
    return <></>;
  }

  if (isLoading) return <CircularProgress sx={{ alignSelf: "center" }} />;

  return (
    <Stack alignItems="center">
      <Button onClick={() => refetch()}>Refresh arrival times</Button>
      <Typography variant="subtitle2">
        Note: Arrival times refresh every 5 seconds by default
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Car</TableCell>
            <TableCell>Line</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Min</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stationNextTrains
            ?.sort((a, b) => a.destinationName.localeCompare(b.destinationName))
            .map((snt, idx) => {
              return (
                <TableRow key={idx}>
                  <TableCell>{snt.car}</TableCell>
                  <TableCell>{snt.line}</TableCell>
                  <TableCell>{snt.destinationName}</TableCell>
                  <TableCell>{snt.min ? snt.min : "N/A"}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Stack>
  );
};
