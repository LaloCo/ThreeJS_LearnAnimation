import './style.css'
import * as THREE from 'three'
import { ColorKeyframeTrack } from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

const clock = new THREE.Clock()
// called once per frame refresh
// which depends on monitor framerate
const tick = () => {
    const elapsedTime = clock.getElapsedTime() // in seconds

    // remember PI equals half a rotation
    mesh.rotation.y = elapsedTime * Math.PI * 2 // one rotation per second
    camera.position.y = Math.sin(elapsedTime)
    camera.position.x = Math.cos(elapsedTime)
    camera.lookAt(mesh.position)

    // re-render
    renderer.render(scene, camera)

    // loops because this method calls tick again
    window.requestAnimationFrame(tick)
}

tick()
