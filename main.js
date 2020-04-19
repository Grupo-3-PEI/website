window.onload = init;

function init(){
    const map = new ol.Map({
        view: new ol.View({
            center: [-963767.2963970036, 4957997.271053271],
            zoom: 14,
            maxZoom: 50,
            minZoom: 4
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'js-map'      
    })

    map.on('click', function(e){
        console.log(e.coordinate);
    })

    map.addControl(new ol.control.FullScreen());

    // vector layers
    const circleStyle = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 10
    })

    const tucs = new ol.layer.VectorImage({
        source: new ol.source.Vector({
            url: 'map1.geojson',
            format: new ol.format.GeoJSON()
        }),
        visible: true,
        style: new ol.style.Style({
            image: circleStyle
        })
    })
    
    map.addLayer(tucs);

    map.on('click', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            console.log(feature);
        })
    })


}

//function createLayer(){
//return new ol.layer.Vector({
    // source: new ol.source.Vector({
      //  url: 'map1.geojson',
    //    format: new ol.format.GeoJSON()
  //  }),
//});
//}