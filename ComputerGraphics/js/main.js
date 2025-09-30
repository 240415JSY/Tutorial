import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

// === 기본 세팅 ===
const scene = new THREE.Scene();

// 카메라 설정
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 15);

// 렌더러 설정
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff); // 바탕 흰색
document.body.appendChild(renderer.domElement);

// 빛
const light = new THREE.SpotLight(0xffffff, 1.5);
light.position.set(0, 10, 10); // 위 + 약간 앞
light.angle = Math.PI / 5;     // 각도를 조금 더 넓게
scene.add(light);
scene.add(light.target);

// 그림자 활성화
light.castShadow = true;
renderer.shadowMap.enabled = true;

// === Avatar 루트 그룹 ===
const avatar = new THREE.Group();

// === 피부 재질 정의 ===
const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffe0bd });

// === 몸통과 골반 ===
const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
const torso = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1), shirtMaterial);
avatar.add(torso);

const pelvis = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), shirtMaterial);
pelvis.position.y = -2;
avatar.add(pelvis);

// === 목 ===
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32), skinMaterial);
neck.position.set(0, 1.5, 0);
avatar.add(neck);

// === 머리 그룹 ===
const headGroup = new THREE.Group();
headGroup.position.y = 3;
avatar.add(headGroup);

// 머리카락 (반구)
const hairMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const hair = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hairMaterial);
hair.position.y = 0.3;
headGroup.add(hair);

// 머리
const head = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), skinMaterial);
headGroup.add(head);

// 얼굴 요소
//1. 눈
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), eyeMaterial);
leftEye.position.set(-0.4, 0.2, 0.9);
headGroup.add(leftEye);

const rightEye = leftEye.clone();
rightEye.position.set(0.4, 0.2, 0.9);
headGroup.add(rightEye);

//2. 코
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 16), skinMaterial);
nose.rotation.x = Math.PI / 2;
nose.position.set(0, 0, 1);
headGroup.add(nose);

//3. 입
const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), new THREE.MeshStandardMaterial({ color: 0xff0000 }));
mouth.position.set(0, -0.4, 0.9);
headGroup.add(mouth);

//4. 귀
const leftEar = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), skinMaterial);
leftEar.position.set(-1, 0, 0);
headGroup.add(leftEar);

const rightEar = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), skinMaterial);
rightEar.position.set(1, 0, 0);
headGroup.add(rightEar);

// === 팔 ===
function createArm(side = "left") {
  const armGroup = new THREE.Group();

  const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.5), shirtMaterial);
  upperArm.position.y = -0.75;
  armGroup.add(upperArm);

  const lowerArm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, 0.5), shirtMaterial);
  lowerArm.position.y = -1.2;
  upperArm.add(lowerArm);

  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.4), skinMaterial);
  hand.position.y = -0.6;
  lowerArm.add(hand);

  // 손가락
  for (let i = 0; i < 5; i++) {
    const finger = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), skinMaterial);
    finger.position.set(-0.2 + i * 0.1, -0.3, 0);
    hand.add(finger);
  }

  armGroup.position.set(side === "left" ? -1.25 : 1.25, 1, 0);
  return armGroup;
}
const leftArm = createArm("left");
const rightArm = createArm("right");
avatar.add(leftArm);
avatar.add(rightArm);

// === 다리 ===
function createLeg(side = "left") {
  const legGroup = new THREE.Group();

  const pantsMaterial = new THREE.MeshStandardMaterial({ color: 0x4682B4 });

  const upperLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.6), pantsMaterial);
  upperLeg.position.y = -0.2;
  legGroup.add(upperLeg);

  const lowerLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.8, 0.6), pantsMaterial);
  lowerLeg.position.y = -1.5;
  upperLeg.add(lowerLeg);

  const foot = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 1.2), skinMaterial);
  foot.position.y = -0.8;
  lowerLeg.add(foot);

  for (let i = 0; i < 5; i++) {
    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.4), skinMaterial);
    toe.position.set(-0.3 + i * 0.15, 0.05, 0.6);
    foot.add(toe);
  }

  legGroup.position.set(side === "left" ? -0.7 : 0.7, -3, 0);
  return legGroup;
}
const leftLeg = createLeg("left");
const rightLeg = createLeg("right");
avatar.add(leftLeg);
avatar.add(rightLeg);

// === 액세서리(안경) ===
const glasses = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 100), eyeMaterial);
glasses.position.set(-0.4, 0.2, 0.95);
headGroup.add(glasses);

const glasses2 = glasses.clone();
glasses2.position.x = 0.4;
headGroup.add(glasses2);

// === Scene에 추가 ===
scene.add(avatar);

function animate() {
  requestAnimationFrame(animate);
  avatar.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();