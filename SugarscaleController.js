function SugarscaleController(converter, ui)
{
	this.converter = converter;
	this.ui = ui;
	this.init();
}

(function($)
 {
	SugarscaleController.prototype.init = function()
	{
		$($.proxy(this.start, this));
	};

	SugarscaleController.prototype.start = function()
	{
		var controller = this;
		var handler = $.proxy(controller.autocompleteSelect, controller);
		var spin = function(event, ui) { controller.spin(event, ui, controller.converter); };
		var enterValue = $.proxy(controller.enterValue, controller);
		
		var update = function()
		{
			controller.converter.evalInput();
			controller.convert();
			controller.saveState();
			controller.ui.toggleCupS();
		};
		
		this.loadState();
		
		if ( $("#measure1_sweeteners :selected").text().indexOf("packets") >= 0 )
		{
			controller.autoSelect("packets");
		}
		
		$("select").combobox();
		$(".custom-combobox-input").on("autocompleteselect", handler);
		handler();
		
		$("#measure1_value").spinner({ min: 0, stop: spin }).off().on("keydown", function(event)
			{
				if ( event.which == 8 || event.which == 46 )
				{
					return true;
				}
				
				return !!event.key.replace(/[^0-9.-\/ ]/g, "");				
			}).on("keyup", function(event)
			{
				var inputVal = $("#measure1_value").val();
				var lastChar = (inputVal && inputVal.length > 1) ? inputVal.substring(inputVal.length - 1) : inputVal;
				
				if ( lastChar.toString().replace(/[^0-9]/g, "") == "" )
				{
					return false;
				}
				
				var tokens = (inputVal || "").split(" ");
				
				if ( tokens && tokens.length > 1 && !tokens[1].replace(/[0-9]/g, "") )
				{
					return false;
				}				
				
				update();
				return false;
			}).on("change", function(event)
			{
				update();
			});
		
		$(".swap").click($.proxy(controller.swap, controller));
		
		$("#measure1_sweeteners+span input, #measure2_sweeteners+span input").each(function()
		{
			$(this).click(function() { $(this).select(); });
			$(this).val($(this).parent().prev().find(":selected").text());
		});
	};
	
	SugarscaleController.prototype.convert = function()
	{
		this.validateUnits();
		this.toggleInfo();
		this.updateEquation(this.converter.convert());
	};
	
	SugarscaleController.prototype.autocompleteSelect = function(event, ui)
	{
		if ( event && event.target && $(event.target).is("#measure1_sweeteners+span input") && ui && ui.item && ui.item.label && ui.item.label.indexOf("packets") >= 0 )
		{
			this.autoSelect("packets", event, ui);
			this.toggleInfo();
		}
		
		this.convert();
		this.toggleInfo();
		this.saveState();
	};
	
	SugarscaleController.prototype.autoSelect = function(units, event, ui)
	{
		$("#measure1_measures option").prop("selected", false).removeAttr("selected");
		$("#option_" + units).prop("selected", true).parent().next().children().val(units);
	};
	
	SugarscaleController.prototype.spin = function(event, ui, converter)
	{
		var oldValue = this.value;
		converter.evalInput();
		
		if ( ui )
		{
			incr = (ui.value > this.value || Math.floor(this.value) == ui.value) ? 1.0 : -1.0;
			newValue = parseFloat(this.value) + parseFloat(incr);
			$(this).val(newValue);
		}
		
		this.convert();
		this.saveState();
		this.ui.toggleCupS();
		return false;
	};
	
	SugarscaleController.prototype.toggleInfo = function()
	{
		this.ui.toggleLiquid();
		this.ui.togglePackets();
		this.ui.toggleXylitolWarning();
		this.ui.toggleLiquidNote();
		this.ui.toggleCupS();
	};

	SugarscaleController.prototype.updateEquation = function(measure2, isLiquid)
	{
		this.ui.updateEquation(measure2, isLiquid);
	};

	SugarscaleController.prototype.saveState = function()
	{
		$.cookie("sweetener1", $("#measure1_sweeteners").val(), { expires: 365, path: "/" });
		$.cookie("sweetener2", $("#measure2_sweeteners").val(), { expires: 365, path: "/" });
		$.cookie("measure1", $("#measure1_value").val(), { expires: 365, path: "/" });
		$.cookie("units", $("#measure1_measures").val(), { expires: 365, path: "/" });
	};

	SugarscaleController.prototype.loadState = function()
	{
		var cookie1 = $.cookie("sweetener1"), cookie2 = $.cookie("sweetener2"), cookie3 = $.cookie("measure1"), cookie4 = $.cookie("units");
		
		if ( cookie1 && $("#measure1_sweeteners [value='" + cookie1 + "']").length )
		{
			this.ui.setSweeteners(cookie1);
		}
		
		if ( cookie2 && $("#measure2_sweeteners [value='" + cookie1 + "']").length )
		{
			this.ui.setSweeteners(null, cookie2);
		}
		
		if ( !isNaN(cookie3) && cookie4 && $("#measure1_measures [value='" + cookie4 + "']").length )
		{
			this.ui.setMeasurement(cookie3, cookie4);
		}
	};

	SugarscaleController.prototype.swap = function()
	{
		this.ui.setSweeteners($("#measure2_sweeteners").val(), $("#measure1_sweeteners").val());
		this.toggleInfo();
		this.autocompleteSelect();
	};
	
	SugarscaleController.prototype.validateUnits = function()
	{
		if ( $("#measure1_measures :selected").text() == "packets" )
		{
			if ( !$("#measure1_sweeteners :selected").data("packets") )
			{
				$("#measure1_measures").val("1").next().children().val($("#measure1_measures :selected").text());
			}
		}
		
		if ( $("#measure1_measures :selected").data("liquid") == "1" )
		{
			if ( !$("#measure1_sweeteners :selected").data("liquid") != "1" )
			{
				$("#measure1_measures").val("1").next().children().val($("#measure1_measures :selected").text());
			}
		}
	};
 })(jQuery);