<?php

namespace App\Dto\RailServiceDtos\TrainDtos;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\SerializedName;

class TrainArrayDto
{
	#[Assert\NotBlank]
	#[SerializedName('Trains')]
	/** @var TrainDto[] */
	public array $trains;

	/** @param TrainDto[] $trains */
	public function __construct(array $trains) {
		$this->trains = $trains;
	}
}
