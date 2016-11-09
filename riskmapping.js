// Create the map and center it in country o choice (lat,long)
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3hleGFraXMiLCJhIjoiY2l1cTF0ejYyMDAybjJ0bno0eW9xc2xoaCJ9.ZJSNBZU45LFx-dsyS9A_yw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gxexakis/civaxm9ga005a2ip2wiqadpzi',
    center: [23.801414, 38.292803],
    zoom: 5.8
});

map.on('load', function() {

    var label_number = 0

    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['largest-energy-stations'] });
        // if there are features within the given radius of the click event,
        if (features.length) {

            // fly to the location of the click event
            map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: 10,
                duration: 1000
            });


            // fill the sidebar with the respective information
            document.getElementById('stn_list').innerHTML = '\
                <li>name: <strong>'+features[0].properties.name+'</strong></li>\
                <li>type: <strong>'+features[0].properties.type+'</strong></li>\
                <li>power (MW): <strong>'+features[0].properties.power_mwatt+'</strong></li>\
                <li>stations #: <strong>'+features[0].properties.stations_number+'</strong></li>\
                ';

            if (features[0].properties.type=="thermal power station") {

                document.getElementById('env_list').innerHTML = '\
                    <li>Pressure on natural resources.</li>\
                    <li>Liquid waste.</li>\
                    <li>Solid waste.</li>\
                    <li>Pollutants (VOC, NOX, SOX, PM10, CO, CO2, etc).</li>\
                    <li>Greenhouse gas production.</li>\
                    <li>Dust and noise.</li>\
                    ';

                document.getElementById('soc_list').innerHTML = '\
                    <li>Community health and safety.</li>\
                    <li>Strain on infrastructure and public nuisance.</li>\
                    ';

            } else if (features[0].properties.type=="hydroelectric power station") {

            }

            // add an effect radius effect
            if (map.getLayer("effect_radius")) {
                map.removeSource("effect_center");
                map.removeLayer("effect_radius");
                if (label_number) {
                    for (var i = 0; i < label_number; i++) {
                        map.removeSource('selectedLabel'+i)
                        map.removeLayer('selectedLabel'+i)
                    }
                }
            }

            map.addSource("effect_center", {
                "type": "geojson",
                "data": {
                  "type": "FeatureCollection",
                  "features": [{
                    "type": "Feature",
                    "geometry": {
                      "type": "Point",
                      "coordinates": features[0].geometry.coordinates
                    } 
                  }]
                }
            });

            var radiusInMeters = 20000
            const metersToPixelsAtMaxZoom = (meters, latitude) =>
                meters / 0.075 / Math.cos(latitude * Math.PI / 180)

            map.addLayer({
                "id": "effect_radius",
                "type": "circle",
                "source": "effect_center",
                "paint": {
                  "circle-radius": {
                    stops: [
                      [0, 0],
                      [20, metersToPixelsAtMaxZoom(radiusInMeters, 
                        features[0].geometry.coordinates[1])]
                    ],
                    base: 2
                  },
                  "circle-color": "red",
                  "circle-opacity": 0.3
                } 
            });
        }
    });

    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['largest-energy-stations']});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

});
