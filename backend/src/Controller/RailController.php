<?php

namespace App\Controller;

use App\Service\RailService;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

#[AsController]
class RailController
{
    #[Route('/get-stations')]
    public function getStations(RailService $service, LoggerInterface $logger) : Response
    {
        $stations = $service->getStations();

        return new JsonResponse($stations);
    }

    #[Route('/get-station-next-trains/{stationCode}')]
    public function getStationNextTrains(string $stationCode, RailService $service, LoggerInterface $logger) : Response
    {
        $nextTrains = $service->getStationNextTrains($stationCode);

        return new JsonResponse($nextTrains);
    }
}
