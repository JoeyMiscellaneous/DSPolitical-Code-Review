<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use App\Service\RailServiceInterface;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Dto\RailServiceDtos\StationDtos\StationArrayDto;
use App\Dto\RailServiceDtos\TrainDtos\TrainArrayDto;

class RailService implements RailServiceInterface
{
    private Logger $logger;
    private HttpClientInterface $client;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;
    private string $wmataApiKey;
    private string $wmataUrl;

    public function __construct(
        LoggerInterface $logger,
        HttpClientInterface $client,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        string $wmataApiKey,
        string $wmataUrl
    ) {
        $this->logger = $logger;
        $this->client = $client;
        $this->serializer = $serializer;
        $this->validator = $validator;
        $this->wmataApiKey = $wmataApiKey;
        $this->wmataUrl = $wmataUrl;
    }

    // https://symfony.com/doc/current/rate_limiter.html 
    // TODO: Inject rate limiter in params, 

    /**
     * @return StationArrayDto An array of stations
     */
    public function getStations(): StationArrayDto
    {
        // TODO: Limit usage based on IP address. I like the idea of using `wait();`, and then putting a spinner or some indication of a query moving slowly on the front end for queries that are taking a while

        $response = $this->client->request(
            'GET',
            $this->wmataUrl . '/Rail.svc/json/jStations', [
                'headers' => [
                    'api_key' => $this->wmataApiKey
                ],
            ]
        );

        $statusCode = $response->getStatusCode();
        if ($statusCode == 429) {
            throw new TooManyRequestsHttpException();
        }

        $stations = $response->getContent();

        $dto = $this->serializer->deserialize($stations, StationArrayDto::class, 'json');

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            $this->logger->error('WMATA API sent invalid station data', ['errors' => $errorsString]);
            throw new \RuntimeException();
        }

        return $dto; 
    }

    /**
     * @return TrainArrayDto An array of trains
     */
    public function getStationNextTrains(string $stationCode): TrainArrayDto
    {
        // TODO: Limit usage based on IP address. I like the idea of using `wait();`, and then putting a spinner or some indication of a query moving slowly on the front end for queries that are taking a while

        $response = $this->client->request(
            'GET',
            $this->wmataUrl . '/StationPrediction.svc/json/GetPrediction/' . $stationCode, [
                'headers' => [
                    'api_key' => $this->wmataApiKey
                ],
            ]
        );

        $statusCode = $response->getStatusCode();
        if ($statusCode == 429) {
            throw new TooManyRequestsHttpException();
        }

        $trains = $response->getContent();

        $dto = $this->serializer->deserialize($trains, TrainArrayDto::class, 'json');

        $errors = $this->validator->validate($dto);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            $this->logger->error('WMATA API sent invalid station next train data', ['errors' => $errorsString]);
            throw new \RuntimeException();
        }

        return $dto;
    }
}
