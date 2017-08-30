L.Control.HtmlLegend = L.Control.SmallWidget.extend({
  _activeLayers : 0,
  _alwaysShow   : false,
  _map          : null,
  _legendTitle  : null,
  _legendTitle  : null,
  _name         : 'html-legend',
  _icon         : 'fa-map-o',
  //_icon       : 'fa-map-signs',

  options: {
    position        : 'topright',
    legends         : [],    // array of legend entries - see README for format
    collapseSimple  : false, // if true, legend entries that are from a simple renderer will use compact presentation
    detectStretched : false, // if true, will test to see if legend entries look stretched; these are usually in sets of 3 with the middle element having no label.
    collapsedOnInit : false, // if true, legends will be collapsed when a new instance is initialized.
    collapsed       : false, // if true, the whole control will be collpased by default
    defaultOpacity  : 1,
    visibleIcon     : 'leaflet-html-legend-icon-eye',
    hiddenIcon      : 'leaflet-html-legend-icon-eye-slash',
    toggleIcon      : 'leaflet-html-legend-icon-eye'
  },

  render: function (map) {
    this._map = map;

    // Control title
    this._legendTitle = L.DomUtil.create('h3', this.options.collapsed == true ? 'legend-title closed' : 'legend-title', this._container);
    L.DomUtil.create('div', 'legend-caret', this._legendTitle);
    L.DomUtil.create('span', null, this._legendTitle).innerHTML = 'Legend';

    this.options.legends.forEach(function (legend) {
      if (!legend.elements) {
        return
      }

      var elements  = legend.elements;
      var className = 'legend-block';

      if (this.options.detectStretched) {
        if (elements.length === 3 && elements[0].label !== '' && elements[1].label === '' && elements[2].label !== '') {
          className += ' legend-stretched';
        }
      }

      var block = L.DomUtil.create('div', className, this._container);

      if (this.options.collapseSimple && elements.length === 1 && !elements[0].label) {
        this._addElement(elements[0].html, legend.name, elements[0].style, block);
        this._connectLayer(block, legend);
        return;
      }

      if (legend.name) {
        var header = L.DomUtil.create('h4', null, block);
        L.DomUtil.create('div', 'legend-caret', header);
        L.DomUtil.create('span', null, header).innerHTML = legend.name;

        if (this.options.collapsedOnInit) {
          L.DomUtil.addClass(header, 'closed');
        }

        L.DomEvent.on(header, 'click', function () {
          if (L.DomUtil.hasClass(header, 'closed')) {
            L.DomUtil.removeClass(header, 'closed');
          }
          else {
            L.DomUtil.addClass(header, 'closed');
          }
        }, this);
      }

      var elementContainer = L.DomUtil.create('div', 'legend-elements', block);

      elements.forEach(function (element) {
        this._addElement(element.html, element.label, element.style, elementContainer);
      }, this);

      this._connectLayer(block, legend);

    }, this);

    this._checkVisibility();
  },

  _addElement: function (html, label, style, container) {
    var row = L.DomUtil.create('div', 'legend-row', container);
    var symbol = L.DomUtil.create('span', 'symbol', row);
    for (var k in style) {
      symbol.style[k] = style[k];
    }
    symbol.innerHTML = html;
    if (!!label) {
      L.DomUtil.create('label', null, row).innerHTML = label;
    }
  },

  _updateOpacity: function (layer, opacity) {
    if (typeof layer.setOpacity === 'function') {
      layer.setOpacity(opacity);
    } else if (typeof layer.setStyle === 'function') {
      layer.setStyle({opacity: opacity});
    }
  },

  _connectLayer: function (container, legend) {
    var layer = legend.layer;

    if (!layer) {
      this._alwaysShow = true;
      return
    }

    var opacity = layer.opacity || this.options.defaultOpacity || 1;
    this._updateOpacity(layer, opacity);

    if (this._map.hasLayer(layer)) {
      this._activeLayers++;
    } else {
      container.style.display = 'none';
    }

    container.classList.add('layer-control');

    var toggleButton = L.DomUtil.create('i', 'visibility-toggle ' + this.options.toggleIcon, container);
    toggleButton.dataset.visibileOpacity = opacity;
    L.DomEvent.on(toggleButton, 'click', function (e) {
      var button = e.target;
      if (L.DomUtil.hasClass(button, 'disabled')) {
        L.DomUtil.removeClass(button, 'disabled')
        this._updateOpacity(layer, button.dataset.visibileOpacity);
      } else {
        L.DomUtil.addClass(button, 'disabled')
        this._updateOpacity(layer, 0);
      }
    }.bind(this));

    var opacityController = L.DomUtil.create('span', 'opacity-slider', container);

    L.DomUtil.create('span', 'slider-label', opacityController).innerHTML = 'Transparency:';

    L.DomUtil.create('i', this.options.visibleIcon, opacityController);

    var opacitySlider = L.DomUtil.create('input', null, opacityController);
    opacitySlider.type = 'range';
    opacitySlider.min = 0;
    opacitySlider.max = 1;
    opacitySlider.step = 0.1;
    opacitySlider.onchange = function (e) {
      var opacity = 1 - e.target.value || 0;
      this._updateOpacity(layer, opacity)
      toggleButton.dataset.visibileOpacity = opacity;
      L.DomUtil.removeClass(toggleButton, 'disabled');
    }.bind(this);
    opacitySlider.value = 1 - (opacity);

    L.DomUtil.create('i', this.options.hiddenIcon, opacityController);

    this._map.on('layeradd', function (e) {
      if (e.layer == layer) {
        this._activeLayers++;
        container.style.display = '';
        this._checkVisibility();
      }
    }.bind(this)).on('layerremove', function (e) {
      if (e.layer == layer) {
        this._activeLayers--;
        container.style.display = 'none';
        this._checkVisibility();
      }
    }.bind(this));
  },

  _checkVisibility: function () {
    if (this._alwaysShow || this._activeLayers) {
      this._container.style.display = '';
    } else {
      this._container.style.display = 'none';
    }
  }
});

L.control.htmllegend = function (options) {
  return new L.Control.HtmlLegend(options);
};
