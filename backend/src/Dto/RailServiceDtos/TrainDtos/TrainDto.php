<?php

namespace App\Dto\RailServiceDtos\TrainDtos;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\SerializedName;

class TrainDto
{
	#[Assert\NotBlank]
	#[SerializedName('DestinationName')]
	public string $destinationName;

	#[Assert\NotBlank]
	#[SerializedName('Line')]
	public string $line;

	#[SerializedName('Min')]
	public ?string $min;

	#[SerializedName('Car')]
	public ?string $car;

	/** @param string $destinationName */
	/** @param string $min */
	/** @param string $line */
	/** @param string $car */
	public function __construct(string $destinationName, string $line, ?string $min, ?string $car) {
		$this->destinationName = $destinationName;
		$this->line = $line; 
		$this->min = $min; 
		$this->car = $car; 
	}
}
