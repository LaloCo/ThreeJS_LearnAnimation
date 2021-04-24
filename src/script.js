import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColorKeyframeTrack } from 'three'
import gsap from 'gsap'

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
let aspect_ratio = sizes.width/sizes.height

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Camera
const camera = new THREE.PerspectiveCamera(75, aspect_ratio, 0.1, 1000) // closer than near, further than far won't be visible
// Orthographic camera doesn't render with perspective (like a code) but as a simple square
// changing z position won't matter
// params: left, right, top, bottom, near, far
// const camera = new THREE.OrthographicCamera(-1*aspect_ratio, 1*aspect_ratio, 1, -1, 1, 1000)
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    aspect_ratio = sizes.width/sizes.height

    camera.aspect = aspect_ratio
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

// Cursor
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

const clock = new THREE.Clock()

// gsap.to(mesh.position, { duration:1, delay:1, x:2 }) // seconds, seconds, destination
// delay means when will this start, so this has to be two since previous
// animation lasts 2, if set to 1 it does not work
// gsap.to(mesh.position, { duration:1, delay:2, x:0 })

// called once per frame refresh
// which depends on monitor framerates
const tick = () => {
    const elapsedTime = clock.getElapsedTime() // in seconds

    // remember PI equals half a rotation
    // mesh.rotation.y = elapsedTime * Math.PI * 2 // one rotation per second
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    // camera.lookAt(mesh.position)

    // Move camera with cursor
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 3
    // camera.lookAt(mesh.position)

    // update controls
    controls.update()

    // re-render
    renderer.render(scene, camera)

    // loops because this method calls tick again
    window.requestAnimationFrame(tick)
}

tick()
