<?php
echo "<div id=measure1_wrapper>";
echo "<input type=text id=measure1_value value=1>";
echo "<select id=measure1_measures>";

include_once "class/Sweetener.php";
include_once "class/Measure.php";
include "sweetener_list.php";
include "measurement_list.php";

foreach ( $measurements as $measure )
{
	$liquid = intval($measure->liquid);
	echo "<option value='$measure->ratio' data-liquid='$liquid' data-units='$measure->units' id='option_$measure->name'";
	
	if ( $measure->name == "cups" )
	{
		echo " selected";
	}
	
	echo ">$measure->name</option>";
}

echo "</select>";
echo "<select id=measure1_sweeteners>";
					
foreach ( $categories as $title => $sweeteners )
{
	uasort($sweeteners, "sort_sweeteners");
	echo "<optgroup label='$title'>";
	
	foreach ( $sweeteners as $id => $sweetener )
	{
		$liquid = intval($sweetener->liquid);
		$tags = $sweetener->tags ? implode(",", $sweetener->tags) : "";
		echo "<option value='$id' data-ratio='$sweetener->ratio' data-liquid='$liquid' data-packets='$sweetener->packets' data-tags='$tags' data-packets_ratio='$sweetener->packets_ratio'";
		
		if ( $id == "sugar" )
		{
			echo " selected";
		}
		
		echo ">$sweetener->name</option>";
	}
	
	echo "</optgroup>";
}

echo "</select>";
echo "<a class='ui-button ui-widget ui-button-icon-only ui-corner-all swap' role='button'><span class='ui-button-icon ui-icon ui-icon-arrowthick-1-s'></span><span class='ui-button-icon-space'> </span><span class='ui-button-icon ui-icon ui-icon-arrowthick-1-n'></span></a>";
echo "</div>\n";
echo "<div id=arrow>&#8681;</div>";
echo "<div id=measure2_wrapper>";
echo "<span id=measure2_value></span> ";

echo "<select id=measure2_sweeteners>";

foreach ( $categories as $title => $sweeteners )
{
	uasort($sweeteners, "sort_sweeteners");
	echo "<optgroup label='$title'>";
	
	foreach ( $sweeteners as $id => $sweetener )
	{
		$liquid = intval($sweetener->liquid);
		$tags = $sweetener->tags ? implode(",", $sweetener->tags) : "";
		echo "<option value='$id' data-ratio='$sweetener->ratio' data-liquid='$liquid' data-packets='$sweetener->packets' data-tags='$tags' data-packets_ratio='$sweetener->packets_ratio'";
		
		if ( $id == "truvia" )
		{
			echo " selected";
		}
		
		echo ">$sweetener->name</option>";
	}
	
	echo "</optgroup>";
}

echo "</select>";
echo "<a class='ui-button ui-widget ui-button-icon-only ui-corner-all swap' role='button'><span class='ui-button-icon ui-icon ui-icon-arrowthick-1-s'></span><span class='ui-button-icon-space'> </span><span class='ui-button-icon ui-icon ui-icon-arrowthick-1-n'></span></a>";
echo "</div>\n";
?>
