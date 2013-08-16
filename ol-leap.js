var map = new ol.Map({
  target: 'ol-map',
  layers: [
    new ol.layer.TileLayer({
      source: new ol.source.OSM()
      // source: new ol.source.Stamen({
      //   layer: 'watercolor'
      // })
    })
  ],
  view: new ol.View2D({
    center: [0, 0],
    zoom: 2
  })
});
var view = map.getView().getView2D();

var translationFrame;
Leap.loop({enableGestures: true}, function(frame) {
  if (frame.valid) {
    for (var i = 0; i < frame.gestures.length; i++) {
      var gesture = frame.gestures[0];
      if (gesture.type == "circle") {
        var direction = gesture.normal[2] > 0 ? 1 : -1;
        // zoom
        var resolution = view.getResolution();
        view.setResolution(resolution + (resolution * direction * 0.008));
        return;
      }
    }

    if (frame.fingers.length == 1) {
      if (!translationFrame) {
        translationFrame = frame;
      } else {
        // pan
        var delta = frame.translation(translationFrame);
        var center = view.getCenter();
        var resolution = view.getResolution() / 8;
        view.setCenter([center[0] + delta[0] * resolution, center[1] + delta[1] * resolution]);
        return;
      }
    }
  }
});
