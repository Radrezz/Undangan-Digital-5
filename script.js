// Smooth Scroll: Lenis Initialization
const lenis = new Lenis({
    duration: 2.5, // Slow, elegant scroll
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// GSAP Registration
gsap.registerPlugin(ScrollTrigger);

// Supabase Configuration
const SUPABASE_URL = 'https://yeluzuphrbptxhlgpugx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllbHV6dXBocmJwdHhobGdwdWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MzkyMjQsImV4cCI6MjA4NzQxNTIyNH0.QByaeSt41Z-xiiQOkQ327O5Mh36vJVtun0IO9T9WkHo';
const INVITATION_ID = 'frezza-hanna';

let _supabase = null;
try {
    if (typeof supabase !== 'undefined') {
        _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (e) {
    console.error("Supabase Error:", e);
}

// Elements
const loader = document.getElementById('loader');
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const openButton = document.getElementById('open-invitation');
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

// 1. Loader Animation (Architectural)
window.addEventListener('load', () => {
    document.body.style.overflow = 'hidden'; // Lock scroll
    const tl = gsap.timeline();
    tl.to(".loader-logo", { opacity: 1, letterSpacing: "1.5rem", duration: 1.5, ease: "power2.out" })
        .to(loader, { opacity: 0, duration: 1, onComplete: () => loader.style.display = 'none' });
});

// 2. The Professional Reveal
openButton.addEventListener('click', () => {
    if (bgMusic) bgMusic.play().catch(e => console.log("Music blocked"));

    const tl = gsap.timeline();

    // Animate Splash Content Out
    tl.to(".splash-content", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in"
    })
        .to(splashScreen, {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                document.body.style.overflow = ''; // Unlock scroll
            }
        }, "-=0.3")
        .add(() => {
            mainContent.classList.add('ready');
            document.querySelector('.audio-wrap').classList.add('visible');
            initProfessionalAnimations();
            fetchWishes();
        });
});

// 3. Innovative Professional Animation System
function initProfessionalAnimations() {
    // A. Architectural Parallax (Layered Depth)
    gsap.utils.toArray('.hero-asset').forEach((asset, i) => {
        let speed = 0;
        if (asset.classList.contains('layer-bg')) speed = 0.05;
        if (asset.classList.contains('layer-mid')) speed = 0.15;
        if (asset.classList.contains('layer-fg')) speed = 0.3;

        gsap.to(asset, {
            scrollTrigger: {
                trigger: "#hero",
                start: "top top",
                end: "bottom top",
                scrub: 1.5
            },
            y: () => {
                const direction = asset.classList.contains('fl-br') || asset.classList.contains('fl-bl') ? 1 : -1;
                return direction * (800 * speed);
            },
            rotation: i % 2 === 0 ? 15 : -15,
            scale: 1.15,
            ease: "none"
        });
    });

    // B. Hero Frame Expansion
    gsap.from(".hero-frame", {
        scale: 0.95,
        opacity: 0,
        duration: 2.5,
        ease: "power4.out"
    });

    // C. Section Entrance (The "Gallery Reveal" Effect)
    gsap.utils.toArray('.reveal-up').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            y: 80,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
    });

    // D. Gallery Stagger (Portfolio Precision)
    gsap.utils.toArray('.gallery-tile').forEach((tile, i) => {
        gsap.from(tile, {
            scrollTrigger: {
                trigger: tile,
                start: "top 95%"
            },
            y: 100,
            opacity: 0,
            duration: 1.2,
            delay: (i % 3) * 0.1,
            ease: "power3.out"
        });
    });

    // E. Text Shimmer Tracking
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        gsap.to(".bg-shimmer", {
            backgroundPosition: `${x}% ${y}%`,
            duration: 2,
            ease: "power2.out"
        });
    });
}

// 4. Supabase Module
async function fetchWishes() {
    if (!_supabase) return;
    const { data, error } = await _supabase
        .from('guest_wishes')
        .select('*')
        .eq('invitation_id', INVITATION_ID)
        .order('created_at', { ascending: false });

    if (!error) renderWishes(data);
}

function renderWishes(wishes) {
    const container = document.getElementById('wish-list');
    container.innerHTML = wishes.map(wish => `
        <div class="reveal-up" style="border-bottom: 1px solid var(--color-border); padding: 3rem 0;">
            <p style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-primary); margin-bottom: 1rem;">${wish.name.toUpperCase()}</p>
            <p class="text-serif" style="font-size: 1.1rem; opacity: 0.8;">${wish.message}</p>
        </div>
    `).join('');
}

const wishForm = document.getElementById('wish-form');
if (wishForm) {
    wishForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const name = document.getElementById('wish-name').value;
        const presence = document.getElementById('wish-presence').value;
        const rawMessage = document.getElementById('wish-message').value;

        // Combine presence into message for uniform storage
        const statusIcon = presence === 'Hadir' ? '✓ ATTENDING' : '✗ ABSENT';
        const message = `[${statusIcon}] ${rawMessage}`;

        btn.disabled = true;
        btn.innerText = 'DOCUMENTING...';

        const { error } = await _supabase.from('guest_wishes').insert([{ name, message, invitation_id: INVITATION_ID }]);

        if (!error) {
            wishForm.reset();
            fetchWishes();
        }
        btn.disabled = false;
        btn.innerText = 'COMMIT TO ARCHIVE';
    });
}

// 5. Music Control
let isPlaying = false;
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// 6. Signature Guest Mapping
const params = new URLSearchParams(window.location.search);
if (params.get('to')) document.getElementById('guest-name').innerText = params.get('to');
