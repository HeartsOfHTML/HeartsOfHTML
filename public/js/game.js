/* Imports */
//const dat = require('dat.gui');

const gui = new dat.GUI();

/* Create scene, camera and renderer */
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

/* Create the controls */
var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
//orbitControls.maxDistance = 5;
orbitControls.minDistance = 2.2;
orbitControls.dampingFactor = 0.7;
orbitControls.rotateSpeed = 0.4;
orbitControls.enableDamping = true;

/* Create Earth geometry */
var planeData = {
    width: 180,
    height: 70,
    widthSegments: 280,
    heightSegments: 150
}

var planeGeometry = new THREE.PlaneGeometry( planeData.width, planeData.height, planeData.widthSegments, planeData.heightSegments );

/* Load Earth textures */
var loader = new THREE.TextureLoader();

var textureProvinceMap = loader.load( "textures/earth/provinces.png" );
textureProvinceMap.magFilter = THREE.NearestFilter;
var textureHeightMap = loader.load( "textures/earth/heightmap.png" );
//var textureDiffuseNight = loader.load( "textures/earth/8k_earth_nightmap.jpg" );
//var textureAlphaClouds = loader.load( "textures/earth/8k_earth_clouds.jpg" );
var textureNormalMap = loader.load( "textures/earth/world_normal.png" );
//var textureSpecularMap = loader.load( "textures/earth/8k_earth_specular_map.png" );
//var textureBumpMap = loader.load( "textures/earth/8k_earth_bump_map.png" );

/* Create Earth material */
var material = new THREE.MeshPhongMaterial();
material.displacementScale = 1;


// make light:
var light = new THREE.PointLight( 0xffffff );

/* Create Vertex Shader */
function vertexShader() {
    return `
        varying vec2 vUv; 
  
        void main() {
            vUv = uv; 

            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition; 
        }
    `
}
  
/* Create Fragment Shader */
function fragmentShader() {
    return `
        uniform vec3 colorA; 
        uniform vec3 colorB; 
        varying vec2 vUv;
        uniform sampler2D texture1;

        //Add red to the end color
        vec4 addColor(vec4 color){
            return color + vec4(1.0, 0.0, 0.0, 0.0);
        }

        //Check the color of the map with the color of the province we want to paint
        bool checkColor(vec3 color, vec4 map){

            //Turn the vec3 int into vec3 float
            vec3 newC = color * vec3(1.0, 1.0, 1.0);

            //Check R, G & B
            if(newC.r == map.r && newC.g == map.g && newC.b == map.b ){
                return true;
            }

            return false;
        }

        void main() {
            vec4 pMap = texture2D(texture1, vUv);
            vec4 unNormalized = pMap * vec4(255.0, 255.0, 255.0, 1.0);
            vec4 finalC = vec4(0.0, 0.0, 0.0, 1.0);

            if(checkColor(vec3(172, 51 , 137), unNormalized)){
                finalC = addColor(finalC);
            }

            if(checkColor(vec3(130, 81 , 79), unNormalized)){
                finalC = addColor(finalC);
            }

            gl_FragColor = finalC;
        }
    `
}

/* Create surface shader */
var materialCustom = new THREE.ShaderMaterial( {

	uniforms: {

            colorB: {type: 'vec3', value: new THREE.Color("rgb(172, 51, 137)")},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)},
            texture1: {type: 't', value: textureProvinceMap}

	},

	vertexShader: vertexShader(),

	fragmentShader: fragmentShader()

} );

/* Create Earth */
var earth = new THREE.Mesh( planeGeometry, materialCustom );

var doneLoading = false;

window.onload = function() {
    startGame();
}

function startGame() {
    myGame.startRenderer();
    myGame.setTextures();
    myGame.addEarth();
    myGame.addLight();
    myGame.setCamera();

    doneLoading = true;
}

function animate() {
    requestAnimationFrame( animate );
    
    if(doneLoading){
        //earth.animate();
    }

    orbitControls.update();
	renderer.render( scene, camera );
}
animate();

var myGame = {
    startRenderer : function(){
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
    },

    addEarth : function (){
        scene.add( earth );
    },

    setTextures : function(){

        material.map = textureProvinceMap;
        material.displacementMap = textureHeightMap;
        material.normalMap = textureNormalMap; //breaks wireframe?

    },

    addLight : function(){
        light.position.set(100, 200, 300);
        light.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        scene.add( light );
    },

    setCamera : function(){
        camera.position.set( 0, 20, 100 );
        orbitControls.update();
    }
}

earth.animate = function(){
    earth.rotation.y += 0.0005;
}

function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    render();
}

var terrain = gui.addFolder('Terrain');
terrain.add(planeData, 'width', 1, 300).onChange(regeneratePlaneGeometry);
terrain.add(planeData, 'height', 1, 200).onChange(regeneratePlaneGeometry);
terrain.add(planeData, 'widthSegments', 1, 500).onChange(regeneratePlaneGeometry);
terrain.add(planeData, 'heightSegments', 1, 300).onChange(regeneratePlaneGeometry);
terrain.add(material, 'wireframe');
terrain.add(material, 'displacementScale', 1, 5);
terrain.add(material, 'displacementBias', 0, 100);
terrain.open();

function regeneratePlaneGeometry(){
    var newGeometry = new THREE.PlaneGeometry(
        planeData.width, planeData.height,
        planeData.widthSegments, planeData.heightSegments
    );
    earth.geometry.dispose();
    earth.geometry = newGeometry;
}