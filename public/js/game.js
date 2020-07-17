/* Create scene, camera and renderer */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
/* Create Earth geometry */
var sphereGeometry = new THREE.SphereGeometry( 2, 32, 32 );

/* Load Earth textures */
var loader = new THREE.TextureLoader();

var textureDiffuseDay = loader.load( "textures/earth/8k_earth_daymap.jpg" );
var textureDiffuseNight = new THREE.TextureLoader().load( "textures/earth/8k_earth_nightmap.jpg" );
var textureAlphaClouds = new THREE.TextureLoader().load( "textures/earth/8k_earth_clouds.jpg" );

/* Create Earth material */
var material = new THREE.MeshLambertMaterial();

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

    doneLoading = true;
}

function animate() {
    requestAnimationFrame( animate );
    
    if(doneLoading){
        sphere.animate();
    }

	renderer.render( scene, camera );
}
animate();

var myGame = {
    startRenderer : function(){
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
    },

    addSphere : function (){
        scene.add( sphere );

        camera.position.z = 5;
    },

    setTextures : function(){

        material.map = textureDiffuseDay;

    },

    addLight(){
        light.position.set(100, 200, 300);
        light.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        scene.add( light );
    }
}

sphere.animate = function(){
    sphere.rotation.y += 0.0005;
}