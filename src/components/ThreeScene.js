import React, { Component } from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

class ThreeScene extends Component {
  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0, 2, 4);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.ambientLight.position.set(0, 0, 0);
    this.scene.add(this.ambientLight);
    
    this.mainLight = new THREE.PointLight(0xffffff, 0.8);
    this.mainLight.position.set(25, 50, 25);
    this.scene.add(this.mainLight);

    window.addEventListener('resize', this.handleResize, false);

    const loader = new GLTFLoader();
    const group = new THREE.Group();

    this.group = group;

    loader.load('/static/models/ghost.glb', 
      gltf => {
        console.log(gltf);

        this.group.add(...gltf.scene.children);

        this.group.children.forEach((c, i) => {
          this.group.children[i].material = new THREE.MeshPhysicalMaterial({
            metalness: 0.5,
            roughness: 0.5
          });
        });

        this.scene.add(this.group);

        this.group.scale.set(40, 40, 40);

        console.log(this.group);
      },
      progress => {

      },
      error => {
        console.log(error)
      }
    );

    // const geometry = new THREE.BoxGeometry(30, 30, 30);
    // const material = new THREE.MeshPhysicalMaterial({
    //   metalness: 0.5,
    //   roughness: 0.5
    // });

    // this.mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.mesh);

    this.start();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);

    this.stop();

    this.mount.removeChild(this.renderer.domElement);
  }

  handleResize = () => {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    if (this.group) {
      this.group.rotation.z += 0.01;
      this.group.rotation.x += 0.01;
      this.group.rotation.y += 0.01;
    }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        className='three'
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default ThreeScene;
