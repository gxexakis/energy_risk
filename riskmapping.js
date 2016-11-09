// Create the map and center it in country o choice (lat,long)
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3hleGFraXMiLCJhIjoiY2l1cTF0ejYyMDAybjJ0bno0eW9xc2xoaCJ9.ZJSNBZU45LFx-dsyS9A_yw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/gxexakis/civbaum36007l2imge4h6t8yf',
    center: [23.801414, 38.292803],
    zoom: 5.8
});

map.on('load', function() {

    var label_number = 0

    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: [
        	'thermal-power-stations',
        	'hydroelectric-power-stations',
        	'wind-parks'
        	] });
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
                <li>units #: <strong>'+features[0].properties.stations_number+'</strong></li>\
                ';

            if (features[0].properties['principal fuel']) {
	            document.getElementById('stn_list').innerHTML = document.getElementById('stn_list').innerHTML + '\
	            	<li>principal fuel: <strong>'+features[0].properties["principal fuel"]+'</strong></li>\
					';
            }

			document.getElementById('env_list').innerHTML = ''
			document.getElementById('soc_list').innerHTML = ''


            var circle_color = "red"

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
                    <li>Employee health and safety.</li>\
                    ';


            } else if (features[0].properties.type=="hydroelectric power station") {

               document.getElementById('env_list').innerHTML = '\
                    <li>Natural hazards and risks - Dam failure.</li>\
                    <li>Habitat depletion, fragmentation and degradation.</li>\
                    <li>Water quality.</li>\
                    <li>Transformer/equipment failure or oil leaks.</li>\
                    ';

                document.getElementById('soc_list').innerHTML = '\
                    <li>Natural hazards and risks - Dam failure - extreme flood risk.</li>\
                    ';

                circle_color = "blue"
            } else if (features[0].properties.type=="wind park") {

               document.getElementById('env_list').innerHTML = '\
                    <li>Landscape scarring and visual impact scarring.</li>\
                    <li>Community Health and Safety - noise, odor, vibration dust creation.</li>\
                    <li>Natural hazards and risks e.g. turbine failure during adverse weather conditions.</li>\
                    <li>Risk to avian populations.</li>\
                    ';
                    
                document.getElementById('soc_list').innerHTML = '\
                    <li>Landscape scarring, and visual impact - decrease in property value.</li>\
                    <li>Noise - perceived vs. actual.</li>\
                    ';

                circle_color = "green"
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
                  "circle-color": circle_color,
                  "circle-opacity": 0.3
                } 
            });
        }
    });

    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: [
        	'thermal-power-stations',
        	'hydroelectric-power-stations',
        	'wind-parks'
        	]});
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

});
