// A/B testi 2 JavaScript
// See test mõõdab toodete/teenuste valimist

// Määrab, millist varianti kasutaja näeb (A või B)
function määraVariant2() {
    // Kui variant on juba määratud (localStorage'is), kasuta seda
    let variant = localStorage.getItem('abTest2Variant');
    
    if (!variant) {
        // Juhuslikult vali variant A või B (50% tõenäosus)
        variant = Math.random() < 0.5 ? 'A' : 'B';
        localStorage.setItem('abTest2Variant', variant);
    }
    
    return variant;
}

// Salvestab valiku andmed
function salvestaValik(variant, valik, valikuteArv) {
    const aeg = new Date().toISOString();
    const andmed = {
        test: 'Test2',
        variant: variant,
        valik: valik,
        valikuteArv: valikuteArv,
        aeg: aeg,
        timestamp: Date.now()
    };
    
    // Salvesta localStorage'i (ajutine salvestus)
    let tulemused = JSON.parse(localStorage.getItem('abTest2Tulemused') || '[]');
    tulemused.push(andmed);
    localStorage.setItem('abTest2Tulemused', JSON.stringify(tulemused));
    
    // Saada andmed serverile
    saadaServerile2(andmed);
}

// Saadab andmed Node.js serverile
async function saadaServerile2(andmed) {
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

// Avalehe loogika testi 2 jaoks
if (window.location.pathname.includes('test2-index.html') || window.location.pathname.endsWith('/test2-index.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const startBtn = document.getElementById('startTestBtn');
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                const variant = määraVariant2();
                // Suuna kasutaja õigele testi lehele
                if (variant === 'A') {
                    window.location.href = 'test2-a.html';
                } else {
                    window.location.href = 'test2-b.html';
                }
            });
        }
    });
}

// Testi lehtede loogika
if (window.location.pathname.includes('test2-a.html') || window.location.pathname.includes('test2-b.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const selectButtons = document.querySelectorAll('.select-btn');
        const countDisplay = document.getElementById('count');
        const selectionsDisplay = document.getElementById('selections');
        const lastChoiceDisplay = document.getElementById('lastChoice');
        const backBtn = document.getElementById('backBtn');
        const productCards = document.querySelectorAll('.product-card');
        
        // Leia variant lehelt
        const variant = selectButtons.length > 0 ? selectButtons[0].getAttribute('data-variant') : 'A';
        
        // Loe praegune valikute arv
        let valikuteArv = parseInt(localStorage.getItem(`valikuteArv_Test2_${variant}`) || '0');
        let viimaneValik = localStorage.getItem(`viimaneValik_Test2_${variant}`) || '-';
        
        // Uuenda ekraani
        if (countDisplay) countDisplay.textContent = valikuteArv;
        if (selectionsDisplay) selectionsDisplay.textContent = valikuteArv;
        if (lastChoiceDisplay) lastChoiceDisplay.textContent = viimaneValik;
        
        // Valiku sündmused
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const valik = this.getAttribute('data-choice');
                
                // Suurenda valikute arvu
                valikuteArv++;
                localStorage.setItem(`valikuteArv_Test2_${variant}`, valikuteArv.toString());
                localStorage.setItem(`viimaneValik_Test2_${variant}`, valik);
                
                // Uuenda ekraani
                if (countDisplay) countDisplay.textContent = valikuteArv;
                if (selectionsDisplay) selectionsDisplay.textContent = valikuteArv;
                if (lastChoiceDisplay) lastChoiceDisplay.textContent = valik;
                
                // Visuaalne tagasiside
                productCards.forEach(card => {
                    card.classList.remove('selected');
                });
                
                const selectedCard = this.closest('.product-card');
                if (selectedCard) {
                    selectedCard.classList.add('selected');
                    setTimeout(() => {
                        selectedCard.classList.remove('selected');
                    }, 1000);
                }
                
                // Lisa visuaalne tagasiside nupule
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 500);
                
                // Salvesta andmed
                salvestaValik(variant, valik, valikuteArv);
            });
        });
        
        // Tagasi nupp
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                window.location.href = 'test2-index.html';
            });
        }
    });
}

