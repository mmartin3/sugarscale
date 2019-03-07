function SugarscaleUI(converter)
{
	this.converter = converter;
}

(function($)
 {
	SugarscaleUI.prototype.updateEquation = function(product, isLiquid)
	{
		$("#measure2_value").html(this.converter.formatMeasurement(product, isLiquid));
	};

	SugarscaleUI.prototype.toggleLiquid = function()
	{
		$("#measure1_measures [data-liquid=1]").prop("disabled", !$("#measure1_sweeteners :selected").data("liquid"));
	};

	SugarscaleUI.prototype.togglePackets = function()
	{
		var packets = $("#measure1_sweeteners :selected").data("packets");
		$("#option_packets").prop("disabled", !packets).val(packets * $("#option_tsp").val());
	};

	SugarscaleUI.prototype.toggleXylitolWarning = function()
	{
		$("#xylitol_warning").toggle(($("#measure1_sweeteners").val() || "").indexOf("xylitol") >= 0 || ($("#measure2_sweeteners").val() || "").indexOf("xylitol") >= 0);
	};

	SugarscaleUI.prototype.toggleLiquidNote = function()
	{
		$("#liquid_note").toggle($("#measure1_sweeteners :selected").data("liquid") == "0" && $("#measure2_sweeteners :selected").data("liquid") == "1");
		$("#dry_note").toggle($("#measure1_sweeteners :selected").data("liquid") == "1" && $("#measure2_sweeteners :selected").data("liquid") == "0");
	};

	SugarscaleUI.prototype.toggleCupS = function()
	{
		$("#option_cups").text($("#measure1_value").val() == 1 ? "cup" : "cups");
		
		if ( $("#measure1_measures+span input").val().substring(0, 3) == "cup" )
		{
			$("#measure1_measures+span input").val($("#option_cups").text());
		}
	};

	SugarscaleUI.prototype.setSweeteners = function(sweetener1, sweetener2)
	{
		if ( sweetener1 )
		{
			$("#measure1_sweeteners").val(sweetener1);
		}
		
		if ( sweetener2 )
		{
			$("#measure2_sweeteners").val(sweetener2);
		}
		
		var text1 = $("#measure1_sweeteners :selected").text(), text2 = $("#measure2_sweeteners :selected").text();
		$("#measure1_sweeteners+span input").val(text1);
		$("#measure2_sweeteners+span input").val(text2);
	};

	SugarscaleUI.prototype.setMeasurement = function(value, units)
	{
		$("#measure1_value").val(value);
		$("#measure1_measures").val(units);
	};
 })(jQuery);