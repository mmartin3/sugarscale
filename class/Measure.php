<?php
class Measure
{
	function __construct($name, $ratio = 1, $liquid = false, $units = "us")
	{
		$this->name = $name;
		$this->ratio = $ratio;
		$this->liquid = $liquid;
		$this->units = $units;
	}
}

?>
