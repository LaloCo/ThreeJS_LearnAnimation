import './style.css'
import * as THREE from 'three'

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

let time = Date.now() // nano(?)seconds since Jan 1st 1970
// called once per frame refresh
// which depends on monitor framerate
const tick = () => {
    const current_time = Date.now() // nano(?)seconds since Jan 1st 1970
    const delta_time = current_time - time
    time = current_time

    // using delta time means animation is the same regardless of framerate
    mesh.rotation.y += 0.001 * delta_time

    // re-render
    renderer.render(scene, camera)

    // loops because this method calls tick again
    window.requestAnimationFrame(tick)
}

tick()
