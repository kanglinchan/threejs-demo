<script setup>
import { createHydrationRenderer, onMounted, reactive, ref, toRefs } from 'vue'
import * as THREE from 'three';
// 引入扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 引入扩展库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// import { GroundedSkybox } from 'three/examples/jsm/objects/GroundedSkybox.js';
// import { DRACOLoader } from 'three/examples/jms/loaders/DRACOLoader.js';
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import leftViewIcon from '../assets/images/侧视图.png';
import topViewIcon from '../assets/images/俯视图.png';
import frontViewIcon from '../assets/images/正视图.png';
import showIcon from '../assets/images/显示.png';
import hideIcon from '../assets/images/隐藏.png';
import fullsrceenIcon from '../assets/images/最大化4.png';
import resetIcon from '../assets/images/轴测图.png';
import NProgress from 'nprogress' // 进度条


const state = reactive({
  squareUrl:
    'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    data: []
})

const { squareUrl, data } = toRefs(state)




var cameraPosition = {
  topView: { x: 0, y: 300, z: 0 }, // 顶视图
  leftView: { x: -300, y: 0, z: 0 }, // 左视图
  frontView: { x: 0, y: 0, z: 300 }, // 正视图（前视图）
  reset: { x: 300, y: 300, z: 300 }, // 正视图（前视图）
};

function lookAt(scene, position) {
  camera.position.set(position.x, position.y, position.z);
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}



function setOrthographicProjection(size, near, far) {
  camera.projectionMatrix.makeOrthographic(
    size * window.innerWidth / window.innerHeight, // left, right
    size, // bottom, top
    near,
    far
  );
  renderer.render(scene, camera);
}


let model = null
let width = 300; //宽度
let height = 300; //高度



// 创建3D场景对象Scene
const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper( 40 );
scene.add(axesHelper);


// 创建地平面网格
const gridHelper = new THREE.GridHelper(40, 40); // 参数分别为网格的尺寸和网格分割线数
gridHelper.position.setZ(0)
scene.add(gridHelper);


//创建一个长方体几何对象Geometry
// const geometry = new THREE.BoxGeometry(100, 100, 100); 


//创建一个材质对象Material
// const material = new THREE.MeshBasicMaterial({
//     color: 0xff0000,
// }); 


// 个参数分别为几何体geometry、材质material
// const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh

//设置网格模型在三维空间中的位置坐标，默认是坐标原点
// mesh.position.set(0,10,0);
// scene.add(mesh); `

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(60, 60, 60);
scene.add(directionalLight);

const dirHelper = new THREE.DirectionalLightHelper( directionalLight, 5);
scene.add( dirHelper );


// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 1500);

//相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(200, 200, 200); 
camera.lookAt(0, 0, 0);  //y轴上位置10


const renderer = new THREE.WebGLRenderer({
  antialias:true,
  alpha: true
});

renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)


const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
    console.log( camera)
});//监听鼠标、键盘事件



  function resizeCameraAndRenderer(){
     // 重置渲染器输出画布canvas尺寸
     const container = document.querySelector('.main')
      const width = container.clientWidth; //宽度
      const height = container.clientHeight; //高度
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  }


  window.onresize = resizeCameraAndRenderer

    const stats = new Stats();
    stats.domElement.style.position = "absolute"




  // 渲染函数
  function render() {
    //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
    stats.update();
    renderer.render(scene, camera); //执行渲染操作
    requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
  }




  

function initGUI(){
  // 实例化一个gui对象
    const gui = new GUI();
    // gui.add(axesHelper, 'size',5, 1);
    const positionFolder = gui.addFolder('位置');//子菜单的子菜单
    positionFolder.add(model.position, 'x',-400,400);
    positionFolder.add(model.position, 'y',-400,400);
    positionFolder.add(model.position, 'z',-400,400);



    const lightFolder = gui.addFolder('灯光');//子菜单的子菜单
    const lightAttrs = {
        R: 100,
        angle: 0,
        intensity: 3
    };
    lightFolder.add(lightAttrs, 'intensity', 1, 10).onChange(function(value){
        directionalLight.intensity = lightAttrs.intensity
        dirHelper.update();
    });
    lightFolder.add(lightAttrs, 'R', 0, 300).onChange(function(value){
        directionalLight.position.x = value * Math.cos(lightAttrs.angle);
        directionalLight.position.z = value * Math.sin(lightAttrs.angle);
        dirHelper.update();
    });
    lightFolder.add(lightAttrs, 'angle', 0, Math.PI*2).onChange(function(value){
        directionalLight.position.x = lightAttrs.R * Math.cos(value);
        directionalLight.position.z = lightAttrs.R * Math.sin(value);
        dirHelper.update();
    });


}

// // 材质颜色color
// gui.addColor(attrs, 'color').onChange(function(value){
//     material.color.set(value);
// });
// // 材质高光颜色specular
// gui.addColor(attrs, 'specular').onChange(function(value){
//     material.specular.set(value);
// });

// // 环境光强度

// // 平行光强度
// gui.add(directionalLight, 'intensity',0,2);
// // 平行光位置
// gui.add(directionalLight.position, 'x',-400,400);
// gui.add(directionalLight.position, 'y',-400,400);
// gui.add(directionalLight.position, 'z',-400,400);


function loadMode(){
    return new Promise((resolve)=>{
      NProgress.start()
      const loader = new GLTFLoader();
        loader.load('assess/dragon-gltf/scene.gltf', function (gltf) {
        NProgress.done()
          resolve(gltf)
      },function(xhr) {
        // 进度更新
        var progress = (xhr.loaded / xhr.total) * 100;
        NProgress.set(progress);
      },);
    })
}

// envmap
const genCubeUrls = function ( prefix, postfix ) {

  return [
    prefix + 'px' + postfix, prefix + 'nx' + postfix,
    prefix + 'py' + postfix, prefix + 'ny' + postfix,
    prefix + 'pz' + postfix, prefix + 'nz' + postfix
  ];

};



function initTureCube(){
  const urls = genCubeUrls( 'assess/texture3/', '.jpg' );
  return new Promise((resolve)=>{
    NProgress.start()
    const textureCube = new THREE.CubeTextureLoader()
    
    .load(urls, (texture)=>{
      NProgress.done()
        resolve(texture)
    }, function(xhr) {
      // 进度更新
      var progress = (xhr.loaded / xhr.total) * 100;
      NProgress.set(progress);
    }, ()=>{
      NProgress.done()
    });
  })
   
}



onMounted( async ()=>{

  const container = document.querySelector('.main')
  resizeCameraAndRenderer()
  render(stats);

  container.appendChild(renderer.domElement);
  container.appendChild(stats.domElement);
  const cubeTexture = await initTureCube()

  scene.background = cubeTexture;

  // lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeTexture ) );



    const gltf = await loadMode()

    
    gltf.scene.scale.set(10, 10, 10); // 根据需要调整缩放值
    model = gltf.scene
    gltf.scene.traverse(function (obj) {
        if (obj.isMesh) { //判断是否是网格模型
            obj.material.envMap = cubeTexture; //设置环境贴图
            obj.material.envMapIntensity = 1.0;
        }

    scene.add(gltf.scene);
    initGUI()
    const models = createTree([model])
    // console.log(data)
    state.data = models
  })

 

})




function handleClickNavItem(action){

  switch(action){
    case 'leftView':
    case 'topView':
    case 'frontView':
    case 'reset':
    const position = cameraPosition[action]
    lookAt(scene, position);

      break;
    case 'fullscreen':
    renderer.domElement.requestFullscreen();
      break;

    case "show":
    model.visible = true

      break;
    case 'hide':
    model.visible = false
      break
    
  }
}


const handleNodeClick = (data) => {
  const target = model.getObjectByName(data.label);
  if (target) {
    
    // const edgeGeometry = new THREE.EdgesGeometry(target.geometry, 1); // 创建边框几何体
    // const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    // const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    // scene.add(edges);
    // console.log(edges)
  }
}



function createTree(models){
  
 return models.map((mode)=>{
    const children = createTree(mode.children)

    return {
      label: mode.name,
      children: children,
      id: mode.id
    }

  })
  
}

const defaultProps = {
  children: 'children',
  label: 'label',
}

</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header">
            <div class="header__title">
              <el-avatar shape="square" size="small" :src="squareUrl" />
              <span class="header__text">ThreeJs demo</span>
            </div>

            <div class="header__nav">
                <span class="header__nav-item" @click="handleClickNavItem('fullscreen')" title="全屏">
                  <img :src="fullsrceenIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('reset')" title="复位">
                  <img :src="resetIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('topView')" title="顶视图">
                  <img :src="topViewIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('leftView')" title="左视图">
                  <img :src="leftViewIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('frontView')" title="正视图">
                  <img :src="frontViewIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('show')" title="显示">
                  <img :src="showIcon" alt="">
                </span>
                <span class="header__nav-item" @click="handleClickNavItem('hide')" title="隐藏">
                  <img :src="hideIcon" alt="">
                </span>
            </div>
            
        </div>
      </el-header>
      <el-container>
        <el-aside>

          <div style="padding: 10px;">
            模型结构树
          </div>

          <div class="aside">
            <el-tree
              style="width:420px"
              default-expand-all
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
            />

          </div>
        </el-aside>
        <el-main>
          <div class="main">

            



          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>

.header{
  align-items: flex-start;
  align-items: center;
  display: flex;
 
  height: 60px;
}

.header__title{
  align-items: flex-start;
  align-items: center;
  display: flex;
  height: 60px;
}

.header__nav{
  margin-left: 100px;
  height: 60px;
  align-items: flex-start;
  align-items: center;
  display: flex;
}

.header__nav-item {
  margin: 0 10px;
  height: 24px;
}

.header__nav img{
  height: 24px;
  vertical-align: top;
  cursor: pointer;
}

.header__text{
  margin-left: 10px;
}

.main{
  position: relative;
  height: calc(100vh - 60px);
  overflow: hidden;
}
.aside{
  overflow-x: auto;
  height: calc(100vh - 104px);
  width: 100%;
}

  



</style>

<style>

.el-main{
  border-left: 1px solid #444;
  padding: 0 !important;
}
.el-header{
  border-bottom: 1px solid #444;
}

.lil-gui.autoPlace{
 top: 60px !important;
 right: 0;
}
</style>