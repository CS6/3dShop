
// 定義角度
var theta = 0 ;
// 初始化鼠標X方向移動值
var mouseX = 0 ;
var r = 1000 / ( 2 * Math .PI); //用於角度計算：鼠標移動1000px時，角度改變2PI
var far = 20000 ; //用於照相機焦點設置（焦點距離，越大越精確）
var move = 0.1 ; //用於步長（照相機移動距離）
// 設置場景
var scene = new THREE.Scene();
// 創建正交投影照相機
var camera = new THREE.PerspectiveCamera( 75 , window .innerWidth / window .innerHeight, 0.1 , 1000 )
camera.position.set( 0 , -5 , 1 );
camera.up = new THREE.Vector3( 0 , 0 , 1 );
camera.lookAt( new THREE.Vector3( 0 , 0 , 1 ));
// 定義著色器
var renderer = new THREE.WebGLRenderer()
renderer.setSize( window .innerWidth, window .innerHeight)
document .body.appendChild(renderer.domElement)
// 告訴渲染器渲染陰影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// 添加地板
function  initFloor () {
    var floorGeo = new THREE.PlaneBufferGeometry( 12 , 8 , 1 , 1 )
    var floorMaterial = new THREE.MeshStandardMaterial({ color : '#aaaaaa' })
    var floor = new THREE.Mesh(floorGeo, floorMaterial)
    floor.position.set( 0 , 0 , -1 )
    floor.receiveShadow = true ; //接受陰影
    scene.add(floor)
    return floor
}
var floor = initFloor()
// 添加物體
function  initCube ( imageUrl ) {
    var geometry = new THREE.BoxGeometry( 1 , 1 , 1 )
    var material
    if (imageUrl) {
        material = new THREE.MeshLambertMaterial({
            map : THREE.ImageUtils.loadTexture(imageUrl)
        })
    } else {
        material = new THREE.MeshLambertMaterial()
    }
    var cube = new THREE.Mesh(geometry, material)
    cube.castShadow = true ; //要產生陰影
    scene.add(cube)
    return cube
}
// 添加物體
var cube1 = initCube( './img/1.jpg' )
var cube2 = initCube( './img/2.png' )
var cube3 = initCube()
var cube4 = initCube()
cube1.position.set( 2 , 0 , 0 )
cube2.position.set( -2 , 0 , 0 )
cube3.position.set( 0 , -2 , 1 )
cube4.position.set( 1 , 1 , 3 )
// 添加聚光燈光源
function  initLight () {
    var light = new THREE.SpotLight( 0xffffff )
    light.position.set( 0 , -3 , 4 )
    light.target = floor; //投射方向指向地板
    light.castShadow = true ; //用於產生陰影
    scene.add(light)
    // 光源的陰影設置
    light.shadow.mapSize.width = 512  // default
    light.shadow.mapSize.height = 512  // default
    light.shadow.camera.near = 0.5  // default
    light.shadow.camera.far = 500  // default
    var helper = new THREE.CameraHelper(light.shadow.camera)
    scene.add(helper)
}
initLight()
// 讓世界動起來
function  render () {
    requestAnimationFrame(render)
    // 此處可添加動畫處理
    cube1.rotation.x += 0.03
    cube1.rotation.y += 0.03
    cube2.rotation.x += 0.02
    cube3.rotation.y += 0.01
    cube4.rotation.x -= 0.04
    renderer.render(scene, camera)
}
// 添加文字
var loader = new THREE.FontLoader();
loader.load( './js/font.json' , function ( font ) {
    var mesh = new THREE.Mesh( new THREE.TextGeometry( 'Please press Up/Down/Ledt/Right or W/A/S/D' , {
        font : font,
        size : 0.4 ,
        height : 0.1
    }), new THREE.MeshLambertMaterial());
    mesh.position.set( -5 , 2 , 2 );
    mesh.rotation.set( 1.2 , 0 , 0 )
    scene.add(mesh);
    render();
});
// 添加按鍵時走動
document .addEventListener( 'keydown' , handleKeydown, false );
// 添加鼠標移動時事件
document .addEventListener( 'mousemove' , handleMousemove, false );
// 添加鼠標進入頁面時初始化鼠標位置
document .addEventListener( 'mouseenter' , initMousePosition, false );
// 處理按鍵
function  handleKeydown ( e ) {
    var e = e || window .event;
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if ( '37, 38, 39, 40, 65, 87, 68, 83' .indexOf(keyCode) === -1 ) {
        return ;
    } else {
        switch (e.keyCode) {
            case  37 :
            case  65 :
                CameraMove( 'left' );
                break ;
            case  38 :
            case  87 :
                CameraMove( 'forward' );
                break ;
            case  39 :
            case  68 :
                CameraMove( 'right' );
                break ;
            case  83 :
            case  40 :
                CameraMove( 'backward' );
                break ;
        }
    }
}
// 照相機移動計算
function  CameraMove ( direction ) {
    var x, y;
    var oX = camera.position.x, oY = camera.position.y;
    switch (direction) {
        case  'left' :
            x = oX - move * Math .cos(theta);
            y = oY + move * Math .sin(theta);
            break ;
        case  'forward' :
            x = oX + move * Math .sin(theta);
            y = oY + move * Math .cos(theta);
            break ;
        case  'right' :
            x = oX + move * Math .cos(theta);
            y = oY - move * Math .sin(theta);
            break ;
        case  'backward' :
            x = oX - move * Math .sin(theta);
            y = oY - move * Math .cos(theta);
            break ;
    }
    camera.position.x = x;
    camera.position.y = y;
}
// 初始化鼠標移動值
function  initMousePosition ( e ) {
    mouseX = getMousePos(e || window .event);
}
// 獲取鼠標坐標
function  getMousePos ( event ) {
    var e = event || window .event;
    var scrollX = document .documentElement.scrollLeft || document .body.scrollLeft;
    var scrollY = document .documentElement.scrollTop || document .body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return { 'x' : x, 'y' : y };
}
// 處理鼠標移動
function  handleMousemove ( e ) {
    var e = e || window .event;
    // 獲取鼠標x坐標
    var newMouseX = getMousePos(e).x;
    // 若值無效，更新坐標然後返回
    if ( Number .isNaN((newMouseX - mouseX) / r)) { mouseX = newMouseX; return ; }
    // 更新視角以及坐標位置
    theta += (newMouseX - mouseX) / r;
    mouseX = newMouseX;
    // 更新照相機焦點
    renderCameraLookat();
}
// 更新照相機焦點
function  renderCameraLookat () {
    camera.lookAt( new THREE.Vector3(camera.position.x + far * Math .sin(theta), camera.position.y + far * Math .cos(theta), 1 ));
}
