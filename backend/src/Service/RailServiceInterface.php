<?php

namespace App\Service;

use App\Dto\RailServiceDtos\StationDtos\StationArrayDto;
use App\Dto\RailServiceDtos\TrainDtos\TrainArrayDto;

interface RailServiceInterface
{
    /**
     * @return StationArrayDto An array of stations
     */
    public function getStations(): StationArrayDto;

    /**
     * @return TrainArrayDto An array of trains
     */
    public function getStationNextTrains(string $stationCode): TrainArrayDto;
}
