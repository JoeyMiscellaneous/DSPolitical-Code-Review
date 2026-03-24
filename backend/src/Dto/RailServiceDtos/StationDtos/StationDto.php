<?php

namespace App\Dto\RailServiceDtos\StationDtos;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Attribute\SerializedName;

class StationDto
{
	#[Assert\NotBlank]
	#[SerializedName('Code')]
	public string $code;

	#[Assert\NotBlank]
	#[SerializedName('Name')]
	public string $name;

	/** @param string $code */
	/** @param string $name*/
	public function __construct(string $code, string $name) {
		$this->code = $code;
		$this->name = $name;
	}
}
