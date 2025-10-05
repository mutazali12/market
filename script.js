// script.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// بيانات المنتجات (يمكنك استبدال مسار 3DModel.gltf برابط نموذج 3D فعلي)
const productsData = [
    {
        id: 1,
        name: "القفل البصري (Vision Lock)",
        description: "أحدث تقنيات الفتح بالبصمة ثلاثية الأبعاد. استجابة فائقة السرعة وأمان لا يُضاهى. تصميم نحيف وأنيق يتناسب مع أي باب عصري.",
        price: 950,
        modelPath: '3DModel_FingerprintLock.gltf', // نموذج تخيلي لقفل بصمة
        features: ["بصمة 3D", "واي فاي", "بطارية تدوم سنة"],
    },
    {
        id: 2,
        name: "قفل الشفرة الذكي (Code Secure)",
        description: "فتح بالرمز السري أو البطاقة الذكية (NFC). مثالي للمكاتب والشقق المؤجرة. يحتوي على نظام إنذار ضد العبث. مقاوم للماء والصدأ.",
        price: 680,
        modelPath: '3DModel_CodeLock.gltf', // نموذج تخيلي لقفل شفرة
        features: ["رمز سري", "بطاقة NFC", "إنذار ضد السرقة"],
    },
    {
        id: 3,
        name: "القفل التوافقي (Harmony Lock)",
        description: "يجمع بين الفتح بالمفتاح التقليدي، البلوتوث، والتحكم عن بعد عبر التطبيق. مرونة كاملة في الاستخدام لجميع أفراد العائلة.",
        price: 1120,
        modelPath: '3DModel_HybridLock.gltf', // نموذج تخيلي لقفل هجين
        features: ["مفتاح تقليدي", "بلوتوث", "تحكم عن بعد"],
    },
];

const productsGrid = document.getElementById('products-grid');

// ----------------------------------------------------
// دالة الإبداع: تهيئة مشهد Three.js وعرض النموذج ثلاثي الأبعاد
// ----------------------------------------------------
function initThreeJS(containerId, modelPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. المشهد (Scene)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7faff); // خلفية فاتحة للحاوية

    // 2. الكاميرا (Camera)
    // PerspectiveCamera: (مجال الرؤية, نسبة العرض إلى الارتفاع, قريب, بعيد)
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2; // تقريب الكاميرا لعرض المنتج

    // 3. المـُصيّر (Renderer)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. الإضاءة (Lighting)
    // إضاءة محيطية خفيفة
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    // إضاءة اتجاهية لإنشاء ظلال وتفاصيل
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // 5. تحميل النموذج (Loading the 3D Model)
    const loader = new GLTFLoader();
    let model;
    
    // ملاحظة إبداعية: بما أنك طلبت نموذجًا ثلاثي الأبعاد، ولم تحدد نماذج GLTF،
    // سنستخدم مكعبًا (Cube) كبديل مؤقت "Placeholder" لتمثيل القفل،
    // مع إمكانية التحميل الفعلي عند توفر ملفات .gltf
    
    loader.load(modelPath, 
        (gltf) => {
            model = gltf.scene;
            model.scale.set(0.5, 0.5, 0.5); // تغيير حجم النموذج ليناسب المشهد
            scene.add(model);
        }, 
        undefined, 
        (error) => {
            console.warn(`Could not load GLTF model at ${modelPath}. Using placeholder cube.`);
            // Placeholder: مكعب يمثل القفل في حال فشل التحميل
            const geometry = new THREE.BoxGeometry(1, 1.5, 0.3);
            const material = new THREE.MeshPhongMaterial({ color: 0x2563EB }); // لون أزرق مميز
            model = new THREE.Mesh(geometry, material);
            scene.add(model);
        }
    );

    // 6. دالة التحريك (Animation Loop) - الإبداع في الحركة
    function animate() {
        requestAnimationFrame(animate);
        
        if (model) {
            // تدوير خفيف ومستمر للمنتج
            model.rotation.y += 0.005; 
        }

        renderer.render(scene, camera);
    }
    
    animate();
    
    // الاستجابة لتغيير حجم النافذة
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}


// ----------------------------------------------------
// دالة إنشاء بطاقة المنتج (Product Card)
// ----------------------------------------------------
function createProductCard(product) {
    const card = document.createElement('div');
    // تصميم مستوحى من Next.js/Vercel: خلفية بيضاء، حواف مستديرة، ظل خفيف، وتأثير عند التحويم.
    card.className = 'bg-white rounded-xl overflow-hidden shadow-custom-light hover:shadow-custom-hover transition duration-300 transform hover:-translate-y-1';
    
    // إنشاء الحاوية الخاصة بـ Three.js
    const threeDContainerId = `product-3d-${product.id}`;
    const threeDContainer = `<div id="${threeDContainerId}" class="product-3d-container bg-secondary-gray"></div>`;

    // جسم البطاقة
    const cardBody = `
        <div class="p-6 flex flex-col justify-between h-full">
            <div>
                <h3 class="text-2xl font-bold mb-2 text-text-dark">${product.name}</h3>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${product.features.map(feature => `<span class="px-3 py-1 text-sm font-medium bg-blue-100 text-accent-blue rounded-full">${feature}</span>`).join('')}
                </div>
                
                <p class="text-gray-600 mb-6 leading-relaxed">${product.description}</p>
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
                <p class="text-3xl font-black text-accent-blue">
                    ${product.price.toLocaleString('ar-EG')} <span class="text-lg text-gray-500 font-normal mr-1">ريال</span>
                </p>
                
                <button class="bg-text-dark text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-gray-700 transition duration-150 transform hover:scale-[1.02]">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    `;

    card.innerHTML = threeDContainer + cardBody;
    productsGrid.appendChild(card);
    
    // تهيئة مشهد Three.js بعد إضافة الحاوية لـ DOM
    initThreeJS(threeDContainerId, product.modelPath);
}

// ----------------------------------------------------
// حلقة إنشاء جميع المنتجات
// ----------------------------------------------------
productsData.forEach(createProductCard);
