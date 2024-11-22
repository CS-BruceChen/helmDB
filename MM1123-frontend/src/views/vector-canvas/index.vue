<template>
  <div ref="threeContainer" class="threeCanvas">
    <div class="tips">
      <div class="tips-title">Vector Space</div>
      <div class="tips-desc">Drag to rotate, hold ctrl and drag to pan</div>
    </div>
    <div class="visible-control">
      <a-space>
        <a-button shape="round" @click="handleCitationOutVisible">
          <EyeOutlined v-if="isCitationOutVisible" />
          <EyeInvisibleOutlined v-else />
          cites
        </a-button>
        <a-button shape="round" @click="handleCitationInVisible">
          <EyeOutlined v-if="isCitationInVisible" />
          <EyeInvisibleOutlined v-else />
          cited
        </a-button>
      </a-space>

    </div>
  </div>
</template>

<script setup lang="js">
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { getAllPoints,getResultPoints } from './visualization/points';
import { getCitationInEdges, getCitationOutEdges } from './visualization/edges';
import { executionStore } from '@/stores';

const threeContainer = ref(null);
const execution = executionStore();
const isCitationOutVisible = ref(true);
const isCitationInVisible = ref(true);

let scene, camera, renderer;
let pointGeometry, pointMaterial, points;
let controls;

onMounted(() => {
  init();
  animate();
});

onUnmounted(() => {
  if (renderer !== undefined) {
    renderer.dispose();
  }
});

function init() {
  scene = new THREE.Scene();

  // 设置相机
  const wd = threeContainer.value.clientWidth;
  const ht = threeContainer.value.clientHeight;
  camera = new THREE.PerspectiveCamera(75, wd / ht, 0.1, 1000);
  camera.position.z = 15;
  camera.position.x=12;

  // 设置渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  // 设置为父容器大小
  renderer.setSize(wd, ht);
  threeContainer.value.appendChild(renderer.domElement);

  // 创建点的几何体和材质
  pointGeometry = new THREE.BufferGeometry();
  const positions = getAllPoints();
  pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  pointMaterial = new THREE.PointsMaterial({
    color: 0x00b96b,
    size: 2,
    sizeAttenuation: false, // 关闭点大小的衰减，使得点的大小不受相机远近的影响
    transparent: true, // 开启透明度
    opacity: 0.5, // 设置点的透明度为 0.5
  });

  // 创建点
  points = new THREE.Points(pointGeometry, pointMaterial);
  scene.add(points);

  // 创建轨道控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 启用阻尼效果
  controls.dampingFactor = 0.25; // 阻尼系数
  controls.enableZoom = true; // 启用缩放
  controls.zoomSpeed = 1.0; // 缩放速度
  controls.enablePan = true;

}

function animate() {
  requestAnimationFrame(animate);

  // 更新轨道控制器
  controls.update();
  // 可以在这里添加点的动画代码

  renderer.render(scene, camera);
}

// 存储上一次的结果
let resultGeometry, resultMaterial, resultPoints;
let citationOutLinesGeo, citationOutLinesMtr, citationOutLines;
let citationOutPointsGeo, citationOutPointsMtr, citationOutPoints;
let citationInLinesGeo, citationInLinesMtr, citationInLines;
let citationInPointsGeo, citationInPointsMtr, citationInPoints;
// 监听executionStore.status的变化,
watch(() => execution.status, (newStatus) => {
  if (newStatus === 'finished') {
    // 如果上一次结果不为空，先移除
    if (resultPoints !== undefined) {
      scene.remove(resultPoints);
    }
    if (citationOutLines !== undefined) {
      scene.remove(citationOutLines);
    }
    if (citationOutPoints !== undefined) {
      scene.remove(citationOutPoints);
    }
    if (citationInLines !== undefined) {
      scene.remove(citationInLines);
    }
    if (citationInPoints !== undefined) {
      scene.remove(citationInPoints);
    }
    // console.log('Query Results: ', execution.currResult);
    // 在points中找到对应位置的点
    const resultIDs = execution.currResult;
    addPoints(resultIDs);
    addOutLines(resultIDs);
    addInLines(resultIDs);
  }
}, { immediate: true });

function addPoints(resultIDs) {
  // 绘制resultPoints，颜色为红色，点大小为5
  resultGeometry = new THREE.BufferGeometry();
  const positions = getResultPoints(resultIDs); 
  resultGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  resultMaterial = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 4,
    sizeAttenuation: false // 关闭点大小的衰减，使得点的大小不受相机远近的影响
  });
  resultPoints = new THREE.Points(resultGeometry, resultMaterial);
  scene.add(resultPoints);
}

function addOutLines(resultIDs) {
  // // 创建边的几何体和材质
  citationOutLinesGeo = new THREE.BufferGeometry();
  const [edges, citedPoints] = getCitationOutEdges(resultIDs);
  citationOutLinesGeo.setAttribute('position', new THREE.BufferAttribute(edges, 3));
  citationOutLinesMtr = new THREE.LineBasicMaterial({
    color: 0x0000ff,
    linewidth: 1,
    transparent: true, // 开启透明度
    opacity: 0.5, // 设置边的透明度为 0.5
  });
  // 创建边
  citationOutLines = new THREE.LineSegments(citationOutLinesGeo, citationOutLinesMtr);
  scene.add(citationOutLines);

  citationOutPointsGeo = new THREE.BufferGeometry();
  citationOutPointsGeo.setAttribute('position', new THREE.BufferAttribute(citedPoints, 3));
  citationOutPointsMtr = new THREE.PointsMaterial({
    color: 0x0000ff,
    size: 3,
    sizeAttenuation: false // 关闭点大小的衰减，使得点的大小不受相机远近的影响
  });
  citationOutPoints = new THREE.Points(citationOutPointsGeo, citationOutPointsMtr);
  scene.add(citationOutPoints);
}

function addInLines(resultIDs) {
  // // 创建边的几何体和材质
  citationInLinesGeo = new THREE.BufferGeometry();
  const [edges, citedPoints] = getCitationInEdges(resultIDs);
  citationInLinesGeo.setAttribute('position', new THREE.BufferAttribute(edges, 3));
  citationInLinesMtr = new THREE.LineBasicMaterial({
    color: 0xd4380d,
    linewidth: 1,
    transparent: true, // 开启透明度
    opacity: 0.5, // 设置边的透明度为 0.5
  });
  // 创建边
  citationInLines = new THREE.LineSegments(citationInLinesGeo, citationInLinesMtr);
  scene.add(citationInLines);
  citationInPointsGeo = new THREE.BufferGeometry();
  citationInPointsGeo.setAttribute('position', new THREE.BufferAttribute(citedPoints, 3));
  citationInPointsMtr = new THREE.PointsMaterial({
    color: 0xd4380d,
    size: 3,
    sizeAttenuation: false // 关闭点大小的衰减，使得点的大小不受相机远近的影响
  });
  citationInPoints = new THREE.Points(citationInPointsGeo, citationInPointsMtr);
  scene.add(citationInPoints);
}

function handleCitationOutVisible() {
  if (citationOutLines !== undefined && citationOutPoints !== undefined) {
    isCitationOutVisible.value = !isCitationOutVisible.value;
    if (isCitationOutVisible.value) {
      scene.add(citationOutLines);
      scene.add(citationOutPoints);
    } else {
      scene.remove(citationOutLines);
      scene.remove(citationOutPoints);
    }
  }
}

function handleCitationInVisible() {
  if (citationInLines !== undefined && citationInPoints !== undefined) {
    isCitationInVisible.value = !isCitationInVisible.value;
    if (isCitationInVisible.value) {
      scene.add(citationInLines);
      scene.add(citationInPoints);
    } else {
      scene.remove(citationInLines);
      scene.remove(citationInPoints);
    }
  }
}
</script>

<style scoped>
/* 确保容器填满父元素 */
.threeCanvas {
  width: 100%;
  height: 100%;
  position: relative;
}

/* .threeCanvas::before {
  content: "Vector Space";
  position: absolute;
  right: 1%;
  font-family: "Kanit", sans-serif;
  font-weight: 500;
  font-style: italic;
  font-size: 48px;
} */

.tips {
  position: absolute;
  top: 1%;
  right: 1%;
}

.tips-title {
  font-family: "Kanit", sans-serif;
  font-weight: 500;
  font-style: italic;
  font-size: 48px;
}

.tips-desc {
  font-family: "Kanit", sans-serif;
  font-weight: 500;
  font-style: italic;
  font-size: 16px;
  opacity: 0.5;
}

.visible-control {
  position: absolute;
  bottom: 1%;
  left: 1%;
}
</style>