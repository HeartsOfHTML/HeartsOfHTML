/* Create scene, camera and renderer */
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();

/* Create the controls */
var orbitControls = new THREE.OrbitControls( camera, renderer.domElement );
orbitControls.maxDistance = 5;
orbitControls.minDistance = 2.2;
orbitControls.dampingFactor = 0.7;
orbitControls.rotateSpeed = 0.4;
orbitControls.enableDamping = true;

/* Create Earth geometry */
var sphereGeometry = new THREE.SphereGeometry( 2, 64, 64 );

/* Load Earth textures */
var loader = new THREE.TextureLoader();

var textureDiffuseDay = loader.load( "textures/earth/8k_earth_daymap.jpg" );
var textureDiffuseNight = loader.load( "textures/earth/8k_earth_nightmap.jpg" );
var textureAlphaClouds = loader.load( "textures/earth/8k_earth_clouds.jpg" );
var textureNormalMap = loader.load( "textures/earth/8k_earth_normal_map.png" );
var textureSpecularMap = loader.load( "textures/earth/8k_earth_specular_map.png" );
var textureBumpMap = loader.load( "textures/earth/8k_earth_bump_map.png" );

/* Create Earth material */
var material = new THREE.MeshPhongMaterial();

/* Create Earth */
var sphere = new THREE.Mesh( sphereGeometry, material );

// make light:
var light = new THREE.PointLight( 0xffffff );

var doneLoading = false;

window.onload = function() {
    startGame();
}

function startGame() {
    myGame.startRenderer();
    myGame.setTextures();
    myGame.addSphere();
    myGame.addLight();
    myGame.setCamera();

    doneLoading = true;
}

function animate() {
    requestAnimationFrame( animate );
    
    if(doneLoading){
        $('body').fadeIn();
    }

    orbitControls.update();
	renderer.render( scene, camera );
}
animate();

var myGame = {
    startRenderer : function(){
        
        renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
        document.body.prepend( renderer.domElement );
    },

    addSphere : function (){
        scene.add( sphere );
    },

    setTextures : function(){

        material.map = textureDiffuseDay;
        material.normalMap = textureNormalMap;
        material.specularMap = textureSpecularMap;
        material.bumpMap = textureBumpMap;
        material.reflectivity = 1;
        material.shininess = 50;
        material.normalScale = new THREE.Vector2(3, 3);
        material.bumpScale = 2;
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

sphere.animate = function(){
    sphere.rotation.y += 0.0005;
}