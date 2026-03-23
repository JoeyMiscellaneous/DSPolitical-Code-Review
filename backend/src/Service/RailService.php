<?php

namespace App\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Log\Logger;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class RailService
{
    private Logger $logger;
    private HttpClientInterface $client;
    private string $wmataApiKey;
    private string $wmataUrl;

    public function __construct(
        LoggerInterface $logger,
        HttpClientInterface $client,
        string $wmataApiKey,
        string $wmataUrl
    ) {
        $this->logger = $logger;
        $this->client = $client;
        $this->wmataApiKey = $wmataApiKey;
        $this->wmataUrl = $wmataUrl;
    }

    public function getStations(): array
    {
        $response = $this->client->request(
            'GET',
            $this->wmataUrl . '/Rail.svc/json/jStations', [
                'headers' => [
                    'api_key' => $this->wmataApiKey
                ],
            ]
        );

        $statusCode = $response->getStatusCode();
        $contentType = $response->getHeaders()['content-type'][0];
        $content = $response->getContent();
        $content = $response->toArray();

        return $content;
    }

    public function getStationNextTrains(string $stationCode): array
    {
        $response = $this->client->request(
            'GET',
            $this->wmataUrl . '/StationPrediction.svc/json/GetPrediction/' . $stationCode, [
                'headers' => [
                    'api_key' => $this->wmataApiKey
                ],
            ]
        );

        $statusCode = $response->getStatusCode();
        $contentType = $response->getHeaders()['content-type'][0];
        $content = $response->getContent();
        $content = $response->toArray();

        return $content;
    }
}
