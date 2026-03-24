<?php

namespace App\Controller;

use App\Service\RailService;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsController]
class RailController
{
    #[Route('/get-stations')]
    public function getStations(RailService $service, LoggerInterface $logger) : Response
    {
        try {
            $stations = $service->getStations();
            return new JsonResponse($stations->stations);
        } catch (TooManyRequestsHttpException $e) {
            return new JsonResponse(['message' => 'Too many requests'], 429);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['message' => 'WMATA error'], 429);
        }
    }

    #[Route('/get-station-next-trains/{stationCode}')]
    public function getStationNextTrains(string $stationCode, RailService $service, LoggerInterface $logger) : Response
    {
        try {
            $nextTrains = $service->getStationNextTrains($stationCode);
            return new JsonResponse($nextTrains->trains);
        } catch (TooManyRequestsHttpException $e) {
            return new JsonResponse(['message' => 'Too many requests'], 429);
        } catch (\RuntimeException $e) {
            return new JsonResponse(['message' => 'WMATA error'], 429);
        }
    }
}
