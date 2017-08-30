# Leaflet.HtmlLegend

A simple Leaflet plugin for creating legends with HTML.

*Tested with Leaflet 1.1.0*

This is a forked version from [consbio/Leaflet.HtmlLegend](https://github.com/consbio/Leaflet.HtmlLegend)
but using [Leaflet.SmallWidget](https://gitlab.com/socioambiental/Leaflet.SmallWidget) as dependency.

## Install

From NPM:

```bash
npm install leaflet-html-legend
```


## Usage

Include the CSS:

```html
<link rel="stylesheet" href="L.Control.HtmlLegend.css" />
```


Include the JavaScript:

```html
<script src="L.Control.HtmlLegend.min.js"></script>
```


Options:
```
{
    position: 'topright',
    legends: [],   // array of legend entries. see below for the structure
    collapseSimple: false,  // if true, legend entries that are from a simple renderer will use compact presentation
    detectStretched: false,  // if true, will test to see if legend entries look stretched.  These are usually in sets of 3 with the middle element having no label.
    collapsedOnInit: false,  // if true, legends will be collapsed when a new instance is initialized.
    defaultOpacity: 1, // default opacity for layers in specified in legends.
    visibleIcon: 'leaflet-html-legend-icon-eye',  // css class for the visible icon on opacity slider
    hiddenIcon: 'leaflet-html-legend-icon-eye-slash',  // css class for the hidden icon on opacity slider
    toggleIcon: 'leaflet-html-legend-icon-eye-slash'  // css class for the icon on visibility toggle button
}
```



Each entry in `legends` array can have the following keys:
* name
* array of elements


Each element has:
* label (optional)
* html (optional): string representaiton of an HTML elemnt that goes into the legend block
* style (optional): an object containing css styling of the legend block


See the [example](//consbio.github.io/Leaflet.HtmlLegend) for usage details.

## Contributors:
* [Kaveh Karimi](https://github.com/ka7eh)
