$.widget("custom.combobox",
{
    _create: function()
    {
        this.wrapper = $("<span>")
            .addClass("custom-combobox")
            .insertAfter(this.element);

        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton();
    },

    _createAutocomplete: function()
    {
        var selected = this.element.children(":selected"),
            value = selected.val() ? selected.text() : "";

        this.input = $("<input>")
            .appendTo(this.wrapper)
            .val(value)
            .attr("title", "")
            .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
            .autocomplete(
            {
                delay: 0,
                minLength: 0,
                source: $.proxy(this, "_source")
            })
            .tooltip(
            {
                classes:
                {
                    "ui-tooltip": "ui-state-highlight"
                }
            });
			
			this.input.autocomplete("instance")._renderItem = function(ul, item)
			{
				if ( item )
				{
					var li = $("<li>")
						.attr("data-value", item.value)
						.append(item.label)
						.appendTo(ul);
						
					if ( item.disabled )
					{
						li.click(function() { return false; }).addClass("group_title");
					}
					
					else
					{
						li.addClass("grouped_item");
					}
						
					return li;
				}
			};

        this._on(this.input,
        {
            autocompleteselect: function(event, ui)
            {
                ui.item.option.selected = true;
                this._trigger("select", event,
                {
                    item: ui.item.option
                });
            },

            autocompletechange: "_removeIfInvalid"
        });
    },

    _createShowAllButton: function()
    {
        var input = this.input,
            wasOpen = false;

        $("<a>")
            .attr("tabIndex", -1)
            .appendTo(this.wrapper)
            .button(
            {
                icons:
                {
                    primary: "ui-icon-triangle-1-s"
                },
                text: false
            })
            .removeClass("ui-corner-all")
            .addClass("custom-combobox-toggle ui-corner-right")
            .on("mousedown", function()
            {
                wasOpen = input.autocomplete("widget").is(":visible");
            })
            .on("click", function()
            {
                input.trigger("focus");

                // Close if already visible
                if (wasOpen)
                {
                    return;
                }

                // Pass empty string as value to search for, displaying all results
                input.autocomplete("search", "");
            });
    },

    _source: function(request, response)
    {
        response(this._suggest(this.element, request.term));
    },

    _suggest: function(elem, term)
    {
        if ( elem.children("optgroup").length )
        {
            var opts = [],
                mapOptions = this._mapOptions;

            elem.children("optgroup").each(function()
            {
                var sub = mapOptions($(this).children("option"), term).get();

                if ( sub.length )
                {
                    sub.unshift(
                    {
                        label: $(this).attr("label"),
                        value: "",
                        option: this,
                        disabled: true
                    });
                }

                $.merge(opts, sub);
            });

            return opts;
        }

        return this._mapOptions(elem.children("option"), term);
    },

    _mapOptions: function(opts, term)
    {
		var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
		
        return opts.map(function()
        {
			if ( !this.disabled || this.disabled == "false" )
			{
			    var text = $(this).text();

				var option = {
					label: text,
					value: text,
					option: this
				};

				if ( this.value && (!term || matcher.test(text)) )
				{
					return option;
				}

				if ( $(this).data("tags") )
				{
					var tags = $(this).data("tags").split(",");
					text = text.toLowerCase();
					
					for ( var i in tags )
					{
						if ( tags[i].indexOf(term) >= 0 )
						{
							return option;
						}
					}
				}
			}
        });
    },

    _removeIfInvalid: function(event, ui)
    {

        // Selected an item, nothing to do
        if ( ui.item )
        {
            return;
        }

        // Search for a match (case-insensitive)
        var value = this.input.val(),
            valueLowerCase = value.toLowerCase(),
            valid = false;
			
        this.element.find("option").each(function()
        {
            if ( $(this).text().toLowerCase() === valueLowerCase )
            {
                this.selected = valid = true;
                return false;
            }
        });

        // Found a match, nothing to do
        if ( valid )
        {
            return;
        }

        // Remove invalid value
        this.input.val(this.element.find(":selected").text());
		
        this._delay(function()
        {
            this.input.tooltip("close").attr("title", "");
        }, 2500);
		
        this.input.autocomplete("instance").term = "";
    },

    _destroy: function()
    {
        this.wrapper.remove();
        this.element.show();
    }
});