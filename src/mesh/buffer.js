import * as THREE from 'three';
const vertices = new Float32Array( [
	-10.0, -10.0,  10.0, // v0
	 10.0, -10.0,  10.0, // v1
	 10.0,  10.0,  10.0, // v2
	-10.0,  10.0,  10.0, // v3
] );


const indices = [
	0, 1, 2,
	2, 3, 0,
];


const geometry=new THREE.BufferGeometry();
geometry.attributes.position=new THREE.BufferAttribute(vertices,3);

const material=new THREE.MeshBasicMaterial({
    color:new THREE.Color(0xff0000),
wireframe:true
});
// itemSize = 3 因为每个顶点都是一个三元组。
geometry.setIndex( indices );
const bufferMesh = new THREE.Mesh( geometry, material );
console.log(bufferMesh);
export default bufferMesh;
