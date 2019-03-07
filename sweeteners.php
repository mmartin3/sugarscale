<?php
$json = $_GET["json"] == "1";
include "class/Sweetener.php";
include "sweetener_list.php";

if ( $json )
{
	header("Content-Type:text/plain");
	
	echo json_encode($categories);
}

else
{
	header("Content-Type:text/plain");

	foreach ( $categories as $category => $sweeteners )
	{
		uasort($sweeteners, "sort_sweeteners");
		
		foreach ( $sweeteners as $key => $sweetener )
		{
			echo "$sweetener->name\n";
		}
	}
}

?>
