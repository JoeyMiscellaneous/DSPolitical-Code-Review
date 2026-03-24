import { Button, Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router";

export interface SymfonyError {
  message: string;
}

export const ErrorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get("errorMessage");

  return (
    <Stack alignItems="center">
      <Typography variant="h5">Something went wrong!</Typography>
      {errorMessage && (
        <Typography variant="subtitle1">{errorMessage}</Typography>
      )}
      <Typography variant="body1">Please try again later</Typography>
      <Button onClick={() => navigate("/")}>Return to home page</Button>
    </Stack>
  );
};
