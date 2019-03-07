function Sugarscale()
{
	this.converter = new CupConverter();
	this.ui = new SugarscaleUI(this.converter);
	this.controller = new SugarscaleController(this.converter, this.ui);
}
