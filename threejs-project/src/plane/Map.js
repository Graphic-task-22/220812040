// import * as THREE from 'three';
// import { Grass } from './Grass';
// import { Tree } from './Tree';
// import { Road } from './Road';

// export const metadata = [
//     {
//       type: "grass",
//       trees: [
//         { tileIndex: -3, height: 50 },
//         { tileIndex: 2, height: 30 },
//         { tileIndex: 5, height: 50 },
        
//       ],
//     },
//     {
//       type: "road", // 添加一条灰色道路
//     },
//   ];

// export const map = new THREE.Group();

// export function initializeMap() {
//     for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
//         const grass = Grass(rowIndex);
//         map.add(grass);
//       }
//   addRows();
// }



// export function addRows() {
//   metadata.forEach((rowData, index) => {
//     const rowIndex = index + 1;

//     if (rowData.type === "grass") {
//       const row = Grass(rowIndex);
//       rowData.trees.forEach(({ tileIndex, height }) => {
//         const tree = Tree(tileIndex, height);
//         row.add(tree);
//       });
//       map.add(row);
//     } else if (rowData.type === "road") {
//       const row = Road(rowIndex);
//       map.add(row);
//     }
//   });
// }

import * as THREE from "three";
import { Grass } from "./Grass";
import { Road } from "./Road";
import { Tree } from "./Tree";
import { Car } from "./Car";
import { Truck } from "./Truck";
import { generateRows } from "../utilities/generateRows";

export const metadata = [];

// export const metadata = [
//   {
//     type: "car",
//     direction: false,
//     speed: 188,
//     vehicles: [
//       { initialTileIndex: -4, color: 0xbdb638 },
//       { initialTileIndex: -1, color: 0x78b14b },
//       { initialTileIndex: 4, color: 0xa52523 },
//     ],
//   },
//   {
//     type: "forest",
//     trees: [
//       { tileIndex: -5, height: 50 },
//       { tileIndex: 0, height: 30 },
//       { tileIndex: 3, height: 50 },
//     ],
//   },
//   {
//     type: "truck",
//     direction: true,
//     speed: 125,
//     vehicles: [
//       { initialTileIndex: -4, color: 0x78b14b },
//       { initialTileIndex: 0, color: 0xbdb638 },
//     ],
//   },
//   {
//     type: "forest",
//     trees: [
//       { tileIndex: -8, height: 30 },
//       { tileIndex: -3, height: 50 },
//       { tileIndex: 2, height: 30 },
//     ],
//   },
// ];

export const map = new THREE.Group();

export function initializeMap() {
  for (let rowIndex = 0; rowIndex > -5; rowIndex--) {
    const grass = Grass(rowIndex);
    map.add(grass);
  }
  addRows();
}

export function addRows() {
   const newMetadata = generateRows(20);
   const startIndex = metadata.length;
   metadata.push(...newMetadata);

  newMetadata.forEach((rowData, index) => {
    const rowIndex = startIndex + index + 1;

    if (rowData.type === "forest") {
      const row = Grass(rowIndex);

      rowData.trees.forEach(({ tileIndex, height }) => {
        const three = Tree(tileIndex, height);
        row.add(three);
      });

      map.add(row);
    }

    if (rowData.type === "car") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const car = Car(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref=car;
        row.add(car);
      });

      map.add(row);
    }

    if (rowData.type === "truck") {
      const row = Road(rowIndex);

      rowData.vehicles.forEach((vehicle) => {
        const truck = Truck(
          vehicle.initialTileIndex,
          rowData.direction,
          vehicle.color
        );
        vehicle.ref=truck;
        row.add(truck);
      });

      map.add(row);
    }
  });
}