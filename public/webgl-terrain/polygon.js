////////////////////////////////////////////////////////////////////////////////
// Polygon Creation Exercise
// Your task is to complete the function PolygonGeometry(sides)
// which takes 1 argument:
//   sides - how many edges the polygon has.
// Return the mesh that defines the minimum number of triangles necessary
// to draw the polygon.
// Radius of the polygon is 1. Center of the polygon is at 0, 0.
////////////////////////////////////////////////////////////////////////////////
/*global, THREE, Coordinates, $, document, window*/

var camera, scene, renderer;
var windowScale;


var coord2ToVec3 = function (coord2, height) {
    height = height || 0;
    return new THREE.Vector3(coord2[0], height, -coord2[1]);
};

function PolygonGeom3D() {
    var geometry = {};
    var height = 10;
    
    Polygon = "666084.23 4757811.3,666186.64 4757816.64,666255.53 4757820.24,666256.23 4757841.86,666261.25 4757863.35,666262.21 4757865.73,666266.29 4757875.89,666272.78 4757887.64,666248.51 4757897.41,666235.4 4757892,666230.4 4757892.65,666219.28 4757900.92,666206.47 4757917.51,666200.5 4757925.73,666197.78 4757930.36,666194.2 4757937.37,666192.13 4757943.69,666189.5 4757949.97,666180.4 4757949.28,666174.21 4757950.78,666174.37 4757953.61,666180.24 4757959.15,666179.03 4757959.23,666157.13 4757986.27,666145.67 4757998.58,666140.16 4758009.08,666126.35 4758051.74,666118.88 4758060.16,666104.04 4758070.4,666091.46 4758084.32,666084.3 4758095.27,666081.58 4758104.83,666081.33 4758117.92,666083.1 4758126.03,666087.72 4758133.59,666113.4 4758151.47,666128.3 4758162.06,666132.9 4758167.15,666136.48 4758171.47,666136.46 4758173.28,666133.29 4758175.8,666092.05 4758188.58,666088.51 4758191.77,666087.17 4758195.65,666087.44 4758200.13,666092.45 4758221.77,666094.19 4758234.83,666084.21 4758237.01,666075.72 4758242.09,666070.95 4758248.07,666068.91 4758252.55,666066.9 4758263.25,666061.7 4758264.1,666057.02 4758267.04,666045.97 4758282.13,666019.47 4758289.77,666012.19 4758295.84,666005.83 4758304.06,666001.39 4758306.55,665998.44 4758302.62,665995.57 4758293.77,665992.15 4758287.45,665967.67 4758257.41,665961.36 4758251.69,665952.2 4758246.13,665950.84 4758241.9,665952.88 4758237.77,665970.46 4758227.95,665982.56 4758215.2,666002.13 4758203.09,666009.2 4758196.11,666033.25 4758164.64,666051.05 4758149.9,666063.63 4758142.22,666067.58 4758138.49,666067.67 4758135.25,666063.02 4758132.72,666042.02 4758131.04,666023.6 4758133.5,666010.31 4758137.34,665997.7 4758143.07,665993.51 4758143.03,665991.35 4758141.19,665992.05 4758136.96,666030.66 4758068.05,666041.79 4758057.64,666046.48 4758055.59,666057.08 4758053.49,666060.43 4758051.2,666072.68 4758037.16,666072.63 4758032.68,666070.62 4758031.14,666066.68 4758030.54,666042.64 4758030.56,666022.05 4758027.45,666012.96 4758027.11,666005.87 4758030,665990.77 4758039.62,665966.95 4758046.11,665907.18 4758046.11,665902.42 4758044.42,665899.37 4758039.84,665895.95 4758029.34,665895.73 4758024.82,665897.38 4758020.14,665900.92 4758017.2,665922.24 4758008.82,665932.82 4758001.74,665937.85 4757994.07,665945.21 4757979.19,665952.48 4757970.42,665974.25 4757961.45,665977.99 4757957.91,665981.83 4757951.49,665985.48 4757937,665988.96 4757927.99,665999.26 4757909.77,666001.67 4757899.32,666002.79 4757885.13,666004.82 4757878.31,666020.44 4757854.21,666023.47 4757845.85,666026.28 4757832.01,666029.77 4757826.73,666034.66 4757822.7,666042.7 4757819.21,666052.8 4757818.9,666067.77 4757822.82,666075.4 4757819.88,666084.23 4757811.3"
    .split(',')
    .map(function (coord) {
        var point = coord.split(' ')
        return [parseFloat(point[0]), parseFloat(point[1])];
    });

    geometry.coordinates = Polygon;

    var geo = new THREE.Geometry();
    var vertex = (!height && geometry.coordinates.length > 2) ? coord3ToVec3(geometry.coordinates) : coord2ToVec3(geometry.coordinates, height);
    geo.vertices.push(coord2ToVec3(geometry.coordinates, height));
    //material = new THREE.ParticleBasicMaterial({
    //    color: new THREE.Color(0xff0000),
    //    sizeAttenuation: false,
    //    size: 32,
    //    map: this.symbol,
    //    alphaTest: 0.5
    //});

    return geo;
}

function PolygonGeometry(sides) {
    var geo = new THREE.Geometry();
	
    // generate vertices
    for ( var pt = 0 ; pt < sides; pt++ )
    {
        // Add 90 degrees so we start at +Y axis, rotate counterclockwise around
        var angle = (Math.PI/2) + (pt / sides) * 2 * Math.PI;

        var x = Math.cos( angle );
        var y = Math.sin( angle );
		
        // YOUR CODE HERE
        //Save the vertex location - fill in the code
        geo.vertices.push( new THREE.Vector3(x,y,0));

    }
    
    for ( var i = 0; i< sides-2; i++) {
        geo.faces.push( new THREE.Face3(0,i+1,i+2));
        
    }
    
    
    // Write the code to generate minimum number of faces for the polygon.
    
    

    // Return the geometry object
    return geo;
}

    function init() {
        //  Setting up some parameters
        var canvasWidth = 846;
        var canvasHeight = 494;
        var canvasRatio = canvasWidth / canvasHeight;
        // scene
        scene = new THREE.Scene();

        // Camera: Y up, X right, Z up
        windowScale = 4;
        var windowWidth = windowScale * canvasRatio;
        var windowHeight = windowScale;

        camera = new THREE.OrthographicCamera( windowWidth / - 2, windowWidth / 2, windowHeight / 2, windowHeight / - 2, 0, 40 );
	
        var focus = new THREE.Vector3( 0,1,0 );
        camera.position.x = focus.x;
        camera.position.y = focus.y;
        camera.position.z = 10;
        camera.lookAt(focus);

        renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: true});
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
        renderer.setSize( canvasWidth, canvasHeight );
        //renderer.setClearColorHex( 0xffffff, 1.0 );

    }
    function showGrids() {
        // Background grid and axes. Grid step size is 1, axes cross at 0, 0
        Coordinates.drawGrid({size:100,scale:1,orientation:"z"});
        Coordinates.drawAxes({axisLength:4,axisOrientation:"x",axisRadius:0.02});
        Coordinates.drawAxes({axisLength:3,axisOrientation:"y",axisRadius:0.02});
    }
    function addToDOM() {
        var container = document.getElementById('container');
        var canvas = container.getElementsByTagName('canvas');
        if (canvas.length>0) {
            container.removeChild(canvas[0]);
        }
        container.appendChild( renderer.domElement );
    }
    function render() {
        renderer.render( scene, camera );
    }

    // Main body of the script


    try {
        init();
        //showGrids();
        //var geo = PolygonGeometry(5);
        var geo = PolygonGeom3D();
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
        var mesh = new THREE.Mesh( geo, material );
        scene.add( mesh );
        addToDOM();
        render();
    } catch (e) {
        console.log(e.message);
        var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
        $('#container').append(errorReport+e);
    }
