<?php

namespace App\Dto\RailServiceDtos\StationDtos;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\SerializedName;

class StationArrayDto
{
	#[Assert\NotBlank]
	#[SerializedName('Stations')]
	/** @var StationDto[] */
	public array $stations;

	/** @param StationDto[] $stations */
	public function __construct(array $stations) {
		$this->stations = $stations;
	}
}
