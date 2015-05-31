var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene;

// Load terry

var loader = new THREE.JSONLoader();
var animationTerry;
var skinnedMeshTerry;
loader.load('./terry.json', function (geometry, materials) {
	skinnedMeshTerry = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
	skinnedMeshTerry.position.y = 150;
    skinnedMeshTerry.position.z = -200;
	skinnedMeshTerry.scale.set(10, 10, 10);
	scene.add(skinnedMeshTerry);

    var materials = skinnedMeshTerry.material.materials;

    for (var k in materials) {
        materials[k].skinning = true;
    }

    THREE.AnimationHandler.add(skinnedMeshTerry.geometry.animation);
    animationTerry = new THREE.Animation(skinnedMeshTerry, "ArmatureAction", THREE.AnimationHandler.CATMULLROM);
    animationTerry.play(false, 0);
});

// Load raptor

var animationRaptor;
var skinnedMeshRaptor;
loader.load('./anotherdino.json', function (geometry, materials) {
    skinnedMeshRaptor = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials));
    skinnedMeshRaptor.position.y = -50;
    skinnedMeshRaptor.position.z = -200;
    skinnedMeshRaptor.rotation.y = 90;
    skinnedMeshRaptor.scale.set(50, 50, 50);
    scene.add(skinnedMeshRaptor);

    var materials = skinnedMeshRaptor.material.materials;

    for (var k in materials) {
        materials[k].skinning = true;
    }

    THREE.AnimationHandler.add(skinnedMeshRaptor.geometry.animation);
    animationRaptor = new THREE.Animation(skinnedMeshRaptor, "ArmatureAction1", THREE.AnimationHandler.CATMULLROM);
    animationRaptor.play(false, 0);
});

var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.y = 160;
camera.position.z = 400;

scene.add(camera);

// Skybox
            
var imagePrefix = "images/dawnmountain-";
var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
var imageSuffix = ".png";
var skyGeometry = new THREE.CubeGeometry( 500, 500, 500 );  

var materialArray = [];
for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix),
        side: THREE.BackSide
    }));
var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
scene.add( skyBox );

var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

var directionalLight = new THREE.DirectionalLight( 0xffeedd );
directionalLight.position.set( 0, 0, 1 ).normalize();
scene.add( directionalLight );

var clock = new THREE.Clock;
var currentSequence = 'standing';

function render() {
	requestAnimationFrame(render);
	
	var delta = clock.getDelta();

	if (animationTerry) animationTerry.update(delta);
    
    animationTerry.play(false, 0); // play the animation not looped, from 0s
	

    if (animationRaptor) animationRaptor.update(delta);
    
    animationRaptor.play(false, 0); // play the animation not looped, from 0s

	renderer.render(scene, camera);
}

document.addEventListener('keyup', function (e) {
	if (e.keyCode == 'A'.charCodeAt(0)) {
		currentSequence = (currentSequence == 'standing' ? 'walking': 'standing');
	}
});

render();
