import React, { useEffect } from 'react';
import { Scene, Color, Fog, PerspectiveCamera, Vector3, WebGLRenderer, Mesh, PlaneGeometry, MeshPhongMaterial, HemisphereLight, DirectionalLight, sRGBEncoding } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var camera, cameraTarget, scene, renderer, controls;
function Stl(width, height, url, objectColor, gridLineColor, skyboxColor, groundColor, lightColor, volume) {
  scene = new Scene();
  scene.background = new Color(skyboxColor);
  scene.fog = new Fog(0xa0a0a0, 200, 1000);
  camera = new PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(200, 100, 200);
  cameraTarget = new Vector3(0, 0, 0);
  camera.position.z = 5 * 2;
  renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize(width, height);
  document.getElementById('stlviewer').innerHTML = '';
  document.getElementById('stlviewer').appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  var ground = new Mesh(new PlaneGeometry(2000, 2000), new MeshPhongMaterial({
    color: groundColor,
    depthWrite: false
  }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
  var hemiLight = new HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);
  var directionalLight = new DirectionalLight(lightColor);
  directionalLight.position.set(0, 200, 100);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.top = 180;
  directionalLight.shadow.camera.bottom = -100;
  directionalLight.shadow.camera.left = -120;
  directionalLight.shadow.camera.right = 120;
  scene.add(directionalLight);
  var loader = new STLLoader();
  loader.load(url, function (geometry) {
    var material = new MeshPhongMaterial({
      color: objectColor,
      specular: 0x111111,
      shininess: 200
    });
    var mesh = new Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(-Math.PI / 2, 0, 0);
    mesh.scale.set(1.5, 1.5, 1.5);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var signedVolumeOfTriangle = function signedVolumeOfTriangle(p1, p2, p3) {
      return p1.dot(p2.cross(p3)) / 6.0;
    };

    var position = geometry.attributes.position;
    var faces = position.count / 3;
    var sum = 0;
    var p1 = new Vector3(),
        p2 = new Vector3(),
        p3 = new Vector3();

    for (var i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      sum += signedVolumeOfTriangle(p1, p2, p3);
    }

    volume(sum);
    scene.add(mesh);
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;

  var animate = function animate() {
    requestAnimationFrame(animate);
    render();
  };

  var render = function render() {
    camera.lookAt(cameraTarget);
    renderer.render(scene, camera);
  };

  animate();
}

var StlViewer = function StlViewer(_ref) {
  var width = _ref.width,
      height = _ref.height,
      url = _ref.url,
      objectColor = _ref.objectColor,
      gridLineColor = _ref.gridLineColor,
      skyboxColor = _ref.skyboxColor,
      groundColor = _ref.groundColor,
      lightColor = _ref.lightColor,
      volume = _ref.volume;
  useEffect(function () {
    Stl(width, height, url, objectColor, gridLineColor, skyboxColor, groundColor, lightColor, volume);
  }, [url]);
  return /*#__PURE__*/React.createElement("div", {
    id: "stlviewer"
  });
};

export { StlViewer };
//# sourceMappingURL=index.modern.js.map
