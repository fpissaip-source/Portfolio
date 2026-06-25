import * as THREE from "three";
import type { GLTF } from "three-stdlib";

const PI = Math.PI;

type XYZ = [number, number, number];

function standard(
  color: THREE.ColorRepresentation,
  roughness = 0.65,
  metalness = 0.02,
  emissive?: THREE.ColorRepresentation
) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive: emissive ?? 0x000000,
    emissiveIntensity: emissive ? 1.8 : 0,
  });
}

function mesh(
  parent: THREE.Object3D,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  name: string,
  position: XYZ,
  rotation: XYZ = [0, 0, 0],
  scale: XYZ = [1, 1, 1]
) {
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.scale.set(...scale);
  object.castShadow = true;
  object.receiveShadow = true;
  parent.add(object);
  return object;
}

function group(parent: THREE.Object3D, name: string, position: XYZ = [0, 0, 0]) {
  const object = new THREE.Group();
  object.name = name;
  object.position.set(...position);
  parent.add(object);
  return object;
}

function createEye(
  parent: THREE.Object3D,
  name: string,
  x: number,
  skinDepth: number,
  materials: ReturnType<typeof createMaterials>
) {
  const eye = group(parent, name, [x, 0.28, skinDepth]);
  mesh(
    eye,
    new THREE.SphereGeometry(0.43, 24, 16),
    materials.eyeWhite,
    `${name}White`,
    [0, 0, 0],
    [0, 0, 0],
    [1, 1.16, 0.38]
  );
  mesh(
    eye,
    new THREE.SphereGeometry(0.23, 20, 14),
    materials.iris,
    `${name}Iris`,
    [0, -0.02, 0.35],
    [0, 0, 0],
    [1, 1.08, 0.3]
  );
  mesh(
    eye,
    new THREE.SphereGeometry(0.105, 16, 12),
    materials.pupil,
    `${name}Pupil`,
    [0, -0.02, 0.46],
    [0, 0, 0],
    [1, 1, 0.25]
  );
  mesh(
    eye,
    new THREE.SphereGeometry(0.045, 12, 8),
    materials.highlight,
    `${name}Highlight`,
    [-0.055, 0.07, 0.515]
  );
  return eye;
}

function createMaterials() {
  return {
    skin: standard("#b97858", 0.72),
    skinLight: standard("#c88a68", 0.72),
    beard: standard("#17131b", 0.5),
    hair: standard("#121017", 0.48),
    cap: standard("#a9abb2", 0.68),
    capDark: standard("#25262e", 0.54),
    headphone: standard("#15161d", 0.38, 0.18),
    headphoneMetal: standard("#4d4f5b", 0.3, 0.45),
    hoodie: standard("#303139", 0.82),
    hoodieDark: standard("#22232a", 0.86),
    pants: standard("#1d1f27", 0.88),
    shoe: standard("#eeeeef", 0.66),
    sole: standard("#bbbcc2", 0.75),
    eyeWhite: standard("#fffaf2", 0.5),
    iris: standard("#5c311f", 0.45),
    pupil: standard("#070508", 0.35),
    highlight: standard("#ffffff", 0.2, 0, "#ffffff"),
    desk: standard("#40313a", 0.74),
    deskEdge: standard("#1d1b21", 0.62),
    monitor: standard("#202129", 0.42, 0.2),
    monitorBack: standard("#13141a", 0.52, 0.15),
    keyboard: standard("#292a32", 0.48, 0.08),
    key: standard("#4d4058", 0.6),
    chair: standard("#29252f", 0.8),
    chairAccent: standard("#59416c", 0.65),
    screen: standard("#8e6bff", 0.25, 0.05, "#9b7cff"),
    floor: new THREE.MeshStandardMaterial({
      color: "#1a141d",
      roughness: 1,
      transparent: true,
      opacity: 0.24,
    }),
  };
}

function createFace(root: THREE.Object3D, materials: ReturnType<typeof createMaterials>) {
  const neck = group(root, "spine005", [0, 10.7, 0]);
  mesh(
    neck,
    new THREE.CylinderGeometry(0.62, 0.76, 1.2, 24),
    materials.skin,
    "Neck",
    [0, 0.32, 0]
  );

  const head = group(neck, "spine006", [0, 2.1, 0]);
  mesh(
    head,
    new THREE.SphereGeometry(1.62, 40, 28),
    materials.skinLight,
    "Face",
    [0, 0, 0],
    [0, 0, 0],
    [1, 1.08, 0.94]
  );

  mesh(
    head,
    new THREE.SphereGeometry(1.66, 36, 20, 0, PI * 2, PI * 0.5, PI * 0.5),
    materials.beard,
    "Beard",
    [0, -0.12, 0.03],
    [0, 0, 0],
    [1.01, 1.04, 0.96]
  );

  mesh(
    head,
    new THREE.CapsuleGeometry(0.11, 0.48, 5, 12),
    materials.beard,
    "MustacheLeft",
    [-0.25, -0.42, 1.36],
    [0, 0, PI * 0.55]
  );
  mesh(
    head,
    new THREE.CapsuleGeometry(0.11, 0.48, 5, 12),
    materials.beard,
    "MustacheRight",
    [0.25, -0.42, 1.36],
    [0, 0, -PI * 0.55]
  );

  createEye(head, "EyeLeft", -0.56, 1.31, materials);
  createEye(head, "EyeRight", 0.56, 1.31, materials);

  mesh(
    head,
    new THREE.CapsuleGeometry(0.075, 0.58, 4, 10),
    materials.hair,
    "EyebrowLeft",
    [-0.56, 0.83, 1.34],
    [0.02, 0, PI * 0.52]
  );
  mesh(
    head,
    new THREE.CapsuleGeometry(0.075, 0.58, 4, 10),
    materials.hair,
    "EyebrowRight",
    [0.56, 0.83, 1.34],
    [-0.02, 0, PI * 0.48]
  );

  mesh(
    head,
    new THREE.SphereGeometry(0.23, 20, 14),
    materials.skin,
    "Nose",
    [0, -0.05, 1.52],
    [0, 0, 0],
    [0.8, 1.1, 0.8]
  );

  mesh(
    head,
    new THREE.TorusGeometry(0.36, 0.055, 10, 24, PI),
    materials.skin,
    "Smile",
    [0, -0.82, 1.42],
    [PI, 0, 0]
  );

  mesh(
    head,
    new THREE.SphereGeometry(1.64, 36, 20, 0, PI * 2, 0, PI * 0.51),
    materials.cap,
    "CapCrown",
    [0, 1.02, -0.05],
    [0, 0, 0],
    [1.02, 0.72, 1.01]
  );
  mesh(
    head,
    new THREE.BoxGeometry(2.15, 0.16, 1.08),
    materials.capDark,
    "CapBrim",
    [0, 1.04, 1.18],
    [-0.09, 0, 0]
  );

  mesh(
    head,
    new THREE.TorusGeometry(1.78, 0.13, 12, 48, PI),
    materials.headphoneMetal,
    "HeadphoneBand",
    [0, 0.32, 0],
    [0, 0, 0]
  );
  mesh(
    head,
    new THREE.CylinderGeometry(0.48, 0.48, 0.34, 28),
    materials.headphone,
    "HeadphoneLeft",
    [-1.69, 0.02, 0],
    [0, 0, PI * 0.5]
  );
  mesh(
    head,
    new THREE.CylinderGeometry(0.48, 0.48, 0.34, 28),
    materials.headphone,
    "HeadphoneRight",
    [1.69, 0.02, 0],
    [0, 0, PI * 0.5]
  );

  return { neck, head };
}

function createBody(root: THREE.Object3D, materials: ReturnType<typeof createMaterials>) {
  const torso = group(root, "Torso", [0, 8.65, 0]);
  mesh(
    torso,
    new THREE.CapsuleGeometry(1.55, 2.15, 8, 28),
    materials.hoodie,
    "Hoodie",
    [0, 0, 0],
    [0, 0, 0],
    [1.05, 1, 0.82]
  );
  mesh(
    torso,
    new THREE.TorusGeometry(1.02, 0.28, 14, 36),
    materials.hoodieDark,
    "Hood",
    [0, 1.38, -0.55],
    [PI * 0.5, 0, 0],
    [1, 1.1, 1]
  );
  mesh(
    torso,
    new THREE.BoxGeometry(0.13, 1.3, 0.13),
    materials.hoodieDark,
    "HoodieStringLeft",
    [-0.28, 0.62, 0.82]
  );
  mesh(
    torso,
    new THREE.BoxGeometry(0.13, 1.3, 0.13),
    materials.hoodieDark,
    "HoodieStringRight",
    [0.28, 0.62, 0.82]
  );
  mesh(
    torso,
    new THREE.BoxGeometry(1.7, 0.9, 0.24),
    materials.hoodieDark,
    "HoodiePocket",
    [0, -0.72, 0.78]
  );

  const leftArm = group(root, "ArmLeft", [-1.62, 9.18, 0.15]);
  mesh(
    leftArm,
    new THREE.CapsuleGeometry(0.38, 1.75, 6, 18),
    materials.hoodie,
    "SleeveLeftUpper",
    [0, -0.82, 0.68],
    [PI * 0.25, 0, -0.08]
  );
  mesh(
    leftArm,
    new THREE.CapsuleGeometry(0.34, 1.55, 6, 18),
    materials.hoodie,
    "SleeveLeftLower",
    [0.45, -1.85, 1.45],
    [PI * 0.43, 0, -0.42]
  );
  mesh(
    leftArm,
    new THREE.SphereGeometry(0.42, 22, 16),
    materials.skin,
    "HandLeft",
    [0.92, -2.32, 2.12],
    [0, 0, 0],
    [1.15, 0.7, 1.45]
  );

  const rightArm = group(root, "ArmRight", [1.62, 9.18, 0.15]);
  mesh(
    rightArm,
    new THREE.CapsuleGeometry(0.38, 1.75, 6, 18),
    materials.hoodie,
    "SleeveRightUpper",
    [0, -0.82, 0.68],
    [PI * 0.25, 0, 0.08]
  );
  mesh(
    rightArm,
    new THREE.CapsuleGeometry(0.34, 1.55, 6, 18),
    materials.hoodie,
    "SleeveRightLower",
    [-0.45, -1.85, 1.45],
    [PI * 0.43, 0, 0.42]
  );
  mesh(
    rightArm,
    new THREE.SphereGeometry(0.42, 22, 16),
    materials.skin,
    "HandRight",
    [-0.92, -2.32, 2.12],
    [0, 0, 0],
    [1.15, 0.7, 1.45]
  );

  const hips = group(root, "Hips", [0, 6.55, 0.08]);
  mesh(
    hips,
    new THREE.BoxGeometry(2.5, 1.1, 1.5),
    materials.pants,
    "PantsWaist",
    [0, 0, 0]
  );

  const leftLeg = group(root, "LegLeft", [-0.78, 6.18, 0.55]);
  mesh(
    leftLeg,
    new THREE.CapsuleGeometry(0.48, 1.75, 6, 18),
    materials.pants,
    "ThighLeft",
    [0, 0, 0.9],
    [PI * 0.5, 0, 0]
  );
  mesh(
    leftLeg,
    new THREE.CapsuleGeometry(0.43, 2.05, 6, 18),
    materials.pants,
    "ShinLeft",
    [0, -1.55, 1.8]
  );
  mesh(
    leftLeg,
    new THREE.BoxGeometry(1.05, 0.62, 1.9),
    materials.shoe,
    "ShoeLeft",
    [0, -3, 2.25]
  );
  mesh(
    leftLeg,
    new THREE.BoxGeometry(1.08, 0.18, 1.95),
    materials.sole,
    "SoleLeft",
    [0, -3.37, 2.28]
  );

  const rightLeg = group(root, "LegRight", [0.78, 6.18, 0.55]);
  mesh(
    rightLeg,
    new THREE.CapsuleGeometry(0.48, 1.75, 6, 18),
    materials.pants,
    "ThighRight",
    [0, 0, 0.9],
    [PI * 0.5, 0, 0]
  );
  mesh(
    rightLeg,
    new THREE.CapsuleGeometry(0.43, 2.05, 6, 18),
    materials.pants,
    "ShinRight",
    [0, -1.55, 1.8]
  );
  mesh(
    rightLeg,
    new THREE.BoxGeometry(1.05, 0.62, 1.9),
    materials.shoe,
    "ShoeRight",
    [0, -3, 2.25]
  );
  mesh(
    rightLeg,
    new THREE.BoxGeometry(1.08, 0.18, 1.95),
    materials.sole,
    "SoleRight",
    [0, -3.37, 2.28]
  );

  return { torso, leftArm, rightArm, leftLeg, rightLeg };
}

function createWorkspace(root: THREE.Object3D, materials: ReturnType<typeof createMaterials>) {
  mesh(
    root,
    new THREE.BoxGeometry(8.4, 0.38, 4.2),
    materials.desk,
    "Plane",
    [0, 7.05, 1.35]
  );
  mesh(
    root,
    new THREE.BoxGeometry(8.55, 0.13, 4.28),
    materials.deskEdge,
    "DeskEdge",
    [0, 6.82, 1.35]
  );
  mesh(
    root,
    new THREE.BoxGeometry(0.45, 4.1, 3.2),
    materials.deskEdge,
    "Plane.003",
    [-3.55, 4.92, 1.35]
  );
  mesh(
    root,
    new THREE.BoxGeometry(0.45, 4.1, 3.2),
    materials.deskEdge,
    "Plane.004",
    [3.55, 4.92, 1.35]
  );

  mesh(
    root,
    new THREE.BoxGeometry(4.4, 2.7, 0.34),
    materials.monitorBack,
    "Cube.002",
    [0, 9.25, 0.3]
  );
  mesh(
    root,
    new THREE.BoxGeometry(3.86, 2.2, 0.08),
    materials.screen,
    "screenlight",
    [0, 9.25, 0.5]
  );
  mesh(
    root,
    new THREE.BoxGeometry(0.34, 1.5, 0.34),
    materials.monitor,
    "MonitorStand",
    [0, 7.48, 0.3]
  );
  mesh(
    root,
    new THREE.BoxGeometry(2.25, 0.16, 1.05),
    materials.monitor,
    "MonitorBase",
    [0, 7.12, 0.42]
  );

  const keyboard = mesh(
    root,
    new THREE.BoxGeometry(3.65, 0.2, 1.22),
    materials.keyboard,
    "Keyboard",
    [0, 7.35, 2.35],
    [-0.08, 0, 0]
  );

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      mesh(
        keyboard,
        new THREE.BoxGeometry(0.25, 0.08, 0.22),
        materials.key,
        `Key${row}-${column}`,
        [-1.38 + column * 0.31, 0.14, -0.35 + row * 0.32]
      );
    }
  }

  mesh(
    root,
    new THREE.BoxGeometry(2.55, 3.55, 0.52),
    materials.chair,
    "Plane.002",
    [0, 6.5, -1.25],
    [-0.1, 0, 0]
  );
  mesh(
    root,
    new THREE.BoxGeometry(2.35, 0.55, 2.1),
    materials.chairAccent,
    "ChairSeat",
    [0, 5.3, -0.05]
  );

  mesh(
    root,
    new THREE.CircleGeometry(5.2, 48),
    materials.floor,
    "ground",
    [0, 2.77, 1],
    [-PI * 0.5, 0, 0],
    [1.3, 1, 0.75]
  );
}

function createAnimations() {
  const blinkTimes = [0, 2.35, 2.43, 2.54, 3.2];
  const blinkValues = [
    1, 1, 1,
    1, 1, 1,
    1, 0.06, 1,
    1, 1, 1,
    1, 1, 1,
  ];

  const blink = new THREE.AnimationClip("Blink", 3.2, [
    new THREE.VectorKeyframeTrack("EyeLeft.scale", blinkTimes, blinkValues),
    new THREE.VectorKeyframeTrack("EyeRight.scale", blinkTimes, blinkValues),
  ]);

  const intro = new THREE.AnimationClip("introAnimation", 1.4, [
    new THREE.VectorKeyframeTrack(
      "CharacterRoot.scale",
      [0, 1.4],
      [0.97, 0.97, 0.97, 1, 1, 1]
    ),
  ]);

  const browUp = new THREE.AnimationClip("browup", 0.65, [
    new THREE.VectorKeyframeTrack(
      "EyebrowLeft.position",
      [0, 0.32, 0.65],
      [-0.56, 0.83, 1.34, -0.56, 1.03, 1.34, -0.56, 0.83, 1.34]
    ),
    new THREE.VectorKeyframeTrack(
      "EyebrowRight.position",
      [0, 0.32, 0.65],
      [0.56, 0.83, 1.34, 0.56, 1.03, 1.34, 0.56, 0.83, 1.34]
    ),
  ]);

  const empty = (name: string, duration = 1) =>
    new THREE.AnimationClip(name, duration, []);

  return [
    intro,
    blink,
    browUp,
    empty("typing", 1.2),
    empty("key1", 0.45),
    empty("key2", 0.5),
    empty("key5", 0.55),
    empty("key6", 0.6),
  ];
}

export default function createIssaCharacter(): GLTF {
  const materials = createMaterials();
  const character = new THREE.Group();
  character.name = "CharacterRoot";

  createBody(character, materials);
  createFace(character, materials);
  createWorkspace(character, materials);

  character.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      object.frustumCulled = true;
    }
  });

  const animations = createAnimations();

  return {
    scene: character,
    scenes: [character],
    animations,
    cameras: [],
    asset: {
      version: "2.0",
      generator: "Issa procedural Three.js character",
    },
    parser: undefined as unknown as GLTF["parser"],
    userData: {},
  };
}
