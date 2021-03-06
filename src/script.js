import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ColorKeyframeTrack } from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loading manager started')
}
loadingManager.onLoad = () =>
{
    console.log('loading manager finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading manager progressing')
}
loadingManager.onError = () =>
{
    console.log('loading manager error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// like magic, while using an 8x8 image it looks sharp!
colorTexture.magFilter = THREE.NearestFilter

const gui = new dat.GUI({ width:400, closed:true })

// Sizes
const sizes =
{
    width: window.innerWidth,
    height: window.innerHeight
}
let aspect_ratio = sizes.width/sizes.height

const debugObject =
{
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, { duration:2, y:mesh.rotation.y + Math.PI*2 })
    }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4)

// const geometry = new THREE.BufferGeometry()
// const count = 500
// const positionsArray = new Float32Array(count * 3 * 3)
// for(let i = 0; i < count * 3 * 3; i++){
//     positionsArray[i] = Math.random() - 0.5 // -0.5 to center
// }
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionsAttribute)

const material = new THREE.MeshBasicMaterial(
 { 
    map: colorTexture
    // wireframe: true
 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

gui.add(mesh.position, 'y', -3, 3, 0.01).name('red cube Y')
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('red cube X') //same result as above
gui.add(mesh.position, 'z', -3, 3, 0.01).name('red cube Z')
gui.add(mesh, 'visible').name('red cube visible')
gui.add(material, 'wireframe').name('show wireframe')
gui.addColor(debugObject, 'color').onChange(() =>
{
    material.color.set(debugObject.color)
})
gui.add(debugObject, 'spin')

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
const renderer = new THREE.WebGLRenderer(
{
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    aspect_ratio = sizes.width/sizes.height

    camera.aspect = aspect_ratio
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        // go full screen (entire canvas)
        if(canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if(canvas.webkitRequestFullscreen){
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        // leave full screen
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if (document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

// Cursor
const cursor =
{
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) =>
{
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
const tick = () =>
{
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
