import * as THREE from 'three';

export type Layer = {
    name: string;
    src?: string,
    width?: number,
    height?: number,
    scale: number,
    position: THREE.Vector3,
    blurOnMovement?: number,
    disableRotation?: boolean;
    disableMovement?: boolean;
    hoverBrightness?: number;
    isBeingHovered?: boolean;
    isSmoke?: boolean;
    isClouds?: boolean;
    noiseScale?: number;
}

export const invasionScreen: Layer[] = [
    {
        name: 'invasion-background',
        src: 'invasion/invasion_0.png',
        scale: 100,
        position: new THREE.Vector3(0, 0, -100000),
    },{
        name: 'invasion-clouds',
        scale: 100,
        width: 3000,
        height: 2000,
        position: new THREE.Vector3(0, -10000, -90000),
        disableRotation: true,
        isClouds: true,
    },{
        name: 'invasion-range',
        src: 'invasion/invasion_1.png',
        scale: 50,
        position: new THREE.Vector3(0, 0, -50000),
    },{
        name: 'invasion-fortress',
        src: 'invasion/invasion_2.png',
        scale: 24,
        position: new THREE.Vector3(1000, 0, -30000),
    },{
        name: 'invasion-smoke',
        scale: 3.2,
        width: 3000,
        height: 2000,
        position: new THREE.Vector3(0, -1000, -2900),
        isSmoke: true,
    },{
        name: 'invasion-right_noxians',
        src: 'invasion/invasion_3.png',
        scale: 6,
        position: new THREE.Vector3(7000, 3500, -9000),
        blurOnMovement: 1,
        hoverBrightness: 2,
    },{
        name: 'invasion-bust',
        src: 'invasion/invasion_4.png',
        scale: 3,
        position: new THREE.Vector3(2000, 1600, -3000),
        blurOnMovement: 1,
        hoverBrightness: 2,
    },{
        name: 'invasion-charger',
        src: 'invasion/invasion_5.png',
        scale: 3,
        position: new THREE.Vector3(1500, 2000, -3500),
        blurOnMovement: 1,
        hoverBrightness: 2,
    },{
        name: 'invasion-left_noxians',
        src: 'invasion/invasion_6.png',
        scale: 4,
        position: new THREE.Vector3(-500, 2500, -5000),
        blurOnMovement: 1,
        hoverBrightness: 2,
    }
]

export const highSilvermereScreen: Layer[] = [
    {
        name: 'silvermere-background',
        src: 'silvermere/silvermere_0.png',
        scale: 82,
        position: new THREE.Vector3(3000, -16000, -100000),
        disableRotation: true,
    },{
        name: 'silvermere-range',
        src: 'silvermere/silvermere_1.png',
        scale: 51,
        position: new THREE.Vector3(0, 0, -60000),
        disableRotation: true,
    },{
        name: 'silvermere-range_2',
        src: 'silvermere/silvermere_2.png',
        scale: 24,
        position: new THREE.Vector3(11000, 0, -30000),
        disableRotation: true,
    },{
        name: 'silvermere-water',
        src: 'silvermere/silvermere_3.png',
        scale: 18,
        position: new THREE.Vector3(-1000, 5000, -25000),
        disableRotation: true,
    },{
        name: 'silvermere-right_mountain',
        src: 'silvermere/silvermere_4.png',
        scale: 14,
        position: new THREE.Vector3(9000, 3000, -20000),
        disableRotation: true,
    },{
        name: 'silvermere-back-clouds',
        src: 'silvermere/silvermere_4.png',
        scale: 12,
        width: 3000,
        height: 2000,
        position: new THREE.Vector3(0, 0, -24000),
        disableRotation: true,
        isClouds: true,
    },{
        name: 'silvermere-silvermere',
        src: 'silvermere/silvermere_5.png',
        scale: 8,
        position: new THREE.Vector3(-1000, 1000, -10000),
        disableRotation: true,
    },{
        name: 'silvermere-front-clouds',
        scale: 8,
        width: 3000,
        height: 2000,
        position: new THREE.Vector3(0, 0, -9000),
        disableRotation: true,
        isClouds: true,
        noiseScale: 50,
    },{
        name: 'silvermere-forest',
        src: 'silvermere/silvermere_6.png',
        scale: 3,
        position: new THREE.Vector3(0, 1900, -4000),
        blurOnMovement: .5,
    },
]

export const petricitePillarScreen: Layer[] = [
    {
        name: 'petricite-landscape',
        src: 'petricite_pillar/petricite_pillar_0.png',
        scale: 50,
        position: new THREE.Vector3(10000, -16000, -100000),
        disableRotation: true,
    },{
        name: 'petricite-smoke',
        width: 3000,
        height: 2000,
        scale: 50,
        position: new THREE.Vector3(10000, -16000, -90000),
        disableRotation: true,
        isSmoke: true,
    },{
        name: 'petricite-building',
        src: 'petricite_pillar/petricite_pillar_1.png',
        scale: 30,
        position: new THREE.Vector3(-40000, -11000, -50000),
        disableRotation: true,
        blurOnMovement: .05,
    },{
        name: 'petricite-jail',
        src: 'petricite_pillar/petricite_pillar_2.png',
        scale: 20,
        position: new THREE.Vector3(25000, -5000, -40000),
        blurOnMovement: .3,
    },{
        name: 'petricite-pillar',
        src: 'petricite_pillar/petricite_pillar_3.png',
        scale: 20,
        position: new THREE.Vector3(17000, 4000, -70000),
        hoverBrightness: 1.5,
    },{
        name: 'petricite-arrest',
        src: 'petricite_pillar/petricite_pillar_4.png',
        scale: 14,
        position: new THREE.Vector3(8000, 12000, -45000),
        blurOnMovement: .5,
        hoverBrightness: 1.5,
    },{
        name: 'petricite-mageseeker',
        src: 'petricite_pillar/petricite_pillar_5.png',
        scale: 3,
        position: new THREE.Vector3(-2000, 2000, -10000),
        blurOnMovement: .5,
        hoverBrightness: 1.75,
    },
]


export const plazaScreen: Layer[] = [
    {
        name: 'plaza-landscape',
        src: 'plaza/plaza_0.png',
        scale: 65,
        position: new THREE.Vector3(0, 0, -100000),
        disableRotation: true,
    },{
        name: 'plaza-clouds',
        width: 3000,
        height: 2000,
        scale: 50,
        position: new THREE.Vector3(10000, -16000, -90000),
        disableRotation: true,
        isClouds: true,
    },{
        name: 'plaza-plaza',
        src: 'plaza/plaza_1.png',
        scale: 35,
        position: new THREE.Vector3(0, 1000, -50000),
        disableRotation: true,
    },{
        name: 'plaza-tianna',
        src: 'plaza/plaza_2.png',
        scale: 6,
        position: new THREE.Vector3(-2000, 2000, -10000),
        blurOnMovement: .25,
        hoverBrightness: 1.25,
    },
]

export const screens = [
    {
        id: 'invasion',
        title: 'Battle against Noxus',
        description: 'More than a century ago, Noxus expansion brought the empire forces dangerously close to the lands protected by Demacia. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        layers: invasionScreen,
    },
    {
        id: 'silvermere',
        title: 'High Silvermere',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        layers: highSilvermereScreen,
    },
    {
        id: 'petricite',
        title: 'Mage Seekers',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        layers: petricitePillarScreen,
    },
    {
        id: 'plaza',
        title: 'The Grand Plaza',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        layers: plazaScreen,
    },
];