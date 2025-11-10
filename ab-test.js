// A/B testi JavaScript
// See fail haldab testi loogikat ja tulemuste salvestamist

// Määrab, millist varianti kasutaja näeb (A või B)
function määraVariant() {
    // Kui variant on juba määratud (localStorage'is), kasuta seda
    let variant = localStorage.getItem('abTestVariant');
    
    if (!variant) {
        // Juhuslikult vali variant A või B (50% tõenäosus)
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('abTestVariant', variant);
    }
    
    return variant;
}

// Salvestab klikkide andmed
function salvestaKlikk(variant, klikkideArv) {
    const aeg = new Date().toISOString();
    const andmed = {
        variant: variant,
        klikkideArv: klikkideArv,
        aeg: aeg,
        timestamp: Date.now()
    };
    
    // Salvesta localStorage'i (ajutine salvestus)
    let tulemused = JSON.parse(localStorage.getItem('abTestTulemused') || '[]');
    tulemused.push(andmed);
    localStorage.setItem('abTestTulemused', JSON.stringify(tulemused));
    
    // Saada andmed serverile
    saadaServerile(andmed);
}

// Saadab andmed Node.js serverile
async function saadaServerile(andmed) {
    try {
        const response = await fetch('http://localhost:3000/salvesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(andmed)
        });
        
        if (!response.ok) {
            console.log('Viga andmete saamisel serverile:', response.statusText);
        }
    } catch (error) {
        console.log('Ei saanud serveriga ühendust. Andmed salvestatakse localStorage\'i.');
    }
}

// Avalehe loogika
if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function() {
        const startBtn = document.getElementById('startTestBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                const variant = määraVariant();
                // Suuna kasutaja õigele testi lehele
                if (variant === 'A') {
                    window.location.href = 'test-a.html';
                } else {
                    window.location.href = 'test-b.html';
                }
            });
        }
    });
}

// Testi lehtede loogika
if (window.location.pathname.includes('test-a.html') || window.location.pathname.includes('test-b.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const testButton = document.getElementById('testButton');
        const countDisplay = document.getElementById('count');
        const clicksDisplay = document.getElementById('clicks');
        const backBtn = document.getElementById('backBtn');
        const variant = testButton ? testButton.getAttribute('data-variant') : 'A';
        
        // Loe praegune klikkide arv
        let klikkideArv = parseInt(localStorage.getItem(`klikkideArv_${variant}`) || '0');
        
        // Uuenda ekraani
        if (countDisplay) countDisplay.textContent = klikkideArv;
        if (clicksDisplay) clicksDisplay.textContent = klikkideArv;
        
        // Klikkimise sündmus
        if (testButton) {
            testButton.addEventListener('click', function() {
                // Suurenda klikkide arvu
                klikkideArv++;
                localStorage.setItem(`klikkideArv_${variant}`, klikkideArv.toString());
                
                // Uuenda ekraani
                if (countDisplay) countDisplay.textContent = klikkideArv;
                if (clicksDisplay) clicksDisplay.textContent = klikkideArv;
                
                // Lisa visuaalne tagasiside
                testButton.classList.add('clicked');
                setTimeout(() => {
                    testButton.classList.remove('clicked');
                }, 300);
                
                // Salvesta andmed
                salvestaKlikk(variant, klikkideArv);
            });
        }
        
        // Tagasi nupp
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'index.html';
            });
        }
    });
}

