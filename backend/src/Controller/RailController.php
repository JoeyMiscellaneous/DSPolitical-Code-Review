<?php

namespace App\Controller;

use App\Service\RailServiceInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
class RailController
{
    #[Route('/get-stations')]
    public function getStations(RailServiceInterface $railService, LoggerInterface $logger) : Response
    {
        try {
            $stations = $railService->getStations();
            return new JsonResponse($stations->stations);
        } catch (TooManyRequestsHttpException $e) {
            return new JsonResponse(['message' => 'Too many requests'], 429);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['message' => 'WMATA error'], 502);
        }
    }

    #[Route('/get-station-next-trains/{stationCode}')]
    public function getStationNextTrains(string $stationCode, RailServiceInterface $railService, LoggerInterface $logger) : Response
    {
        try {
            $nextTrains = $railService->getStationNextTrains($stationCode);
            return new JsonResponse($nextTrains->trains);
        } catch (TooManyRequestsHttpException $e) {
            return new JsonResponse(['message' => 'Too many requests'], 429);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['message' => 'WMATA error'], 502);
        }
    }
}
