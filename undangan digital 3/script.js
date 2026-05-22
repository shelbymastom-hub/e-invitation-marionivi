document.addEventListener("DOMContentLoaded", () => {
    
    const introScreen = document.getElementById('intro-screen');
    const openBtn = document.getElementById('open-invite-btn');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    const musicControl = document.getElementById('music-control');
    const bgm = document.getElementById('bgm');
    const bgVideo = document.getElementById('bg-video');

    // 1. OPEN INVITATION LOGIC
    openBtn.addEventListener('click', () => {
        introScreen.style.transform = 'translateY(-100%)';
        
        mainContent.classList.remove('hidden');
        bottomNav.classList.remove('hidden');
        musicControl.classList.remove('hidden');
        
        bgm.play().catch(e => console.log("Auto-play prevented by browser."));
        bgVideo.play().catch(e => console.log("Video auto-play prevented."));
        
        setTimeout(() => {
            introScreen.style.display = 'none';
        }, 1000);
    });

    // 2. AUDIO CONTROL
    musicControl.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play();
            musicControl.classList.remove('paused');
        } else {
            bgm.pause();
            musicControl.classList.add('paused');
        }
    });

    // 3. INTERSECTION OBSERVER
    const observerOptions = {
        root: mainContent,
        threshold: 0.1, 
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // 4. BOTTOM NAV HIGHLIGHT 
    const navItems = document.querySelectorAll('.nav-item');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.getAttribute('id');
                navItems.forEach(item => item.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-item[data-target="${targetId}"]`);
                if(activeLink) activeLink.classList.add('active');
            }
        });
    }, { root: mainContent, threshold: 0.3 }); 

    document.querySelectorAll('.nav-section').forEach(sec => navObserver.observe(sec));

    // 5. COUNTDOWN TIMER
    const countDownDate = new Date("Aug 15, 2026 09:00:00").getTime();
    setInterval(() => {
        const distance = countDownDate - new Date().getTime();
        if (distance > 0) {
            document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);

    // 6. RSVP FORM & TICKET MODAL 
    const rsvpForm = document.getElementById('rsvp-form');
    const ticketModal = document.getElementById('ticket-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    const kehadiranSelect = document.getElementById('kehadiran');
    const jumlahContainer = document.getElementById('jumlah-container');
    const jumlahSelect = document.getElementById('jumlah');
    const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
    const thankYouMsg = document.getElementById('thank-you-msg');

    kehadiranSelect.addEventListener('change', function() {
        if (this.value === 'tidak') {
            jumlahContainer.classList.add('hidden');
            jumlahSelect.removeAttribute('required');
            btnSubmitRsvp.innerText = "Send Confirmation & Wishes";
        } else {
            jumlahContainer.classList.remove('hidden');
            jumlahSelect.setAttribute('required', 'required');
            btnSubmitRsvp.innerText = "Submit & Get QR Ticket";
        }
    });

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const kehadiran = kehadiranSelect.value;

        if (kehadiran === 'hadir') {
            const jumlah = jumlahSelect.value;
            document.getElementById('tiket-nama').innerText = nama.toUpperCase();
            document.getElementById('tiket-pax').innerText = jumlah + (jumlah === "1" ? " Person" : " People");
            ticketModal.classList.remove('hidden');
            thankYouMsg.classList.add('hidden');
        } else {
            thankYouMsg.classList.remove('hidden');
            ticketModal.classList.add('hidden');
            
            rsvpForm.reset();
            
            setTimeout(() => {
                jumlahContainer.classList.remove('hidden');
                jumlahSelect.setAttribute('required', 'required');
                btnSubmitRsvp.innerText = "Submit & Get QR Ticket";
                thankYouMsg.classList.add('hidden');
                kehadiranSelect.style.color = ""; 
                jumlahSelect.style.color = "";
            }, 6000); 
        }
    });

    closeModalBtn.addEventListener('click', () => {
        ticketModal.classList.add('hidden');
        rsvpForm.reset();
    });

    document.querySelectorAll('select').forEach(sel => {
        sel.addEventListener('change', function() {
            if(this.value) this.style.color = "#fff";
        });
    });

    // 7. EFEK TYPEWRITER UNTUK LOVE STORY
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const p = item.querySelector('p');
        if (p) {
            p.setAttribute('data-html', p.innerHTML);
            p.innerHTML = ''; 
        }
    });

    const typeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const p = entry.target.querySelector('p');
                if (p && !p.classList.contains('typing-done')) {
                    p.classList.add('typing-done'); 
                    jalankanTypewriter(p, p.getAttribute('data-html'), 35); 
                }
            }
        });
    }, { rootMargin: "0px 0px -100px 0px" });

    timelineItems.forEach(item => typeObserver.observe(item));

    function jalankanTypewriter(elemen, htmlString, speed) {
        let i = 0;
        let isTag = false;
        let textUtama = '';

        function ketik() {
            if (i < htmlString.length) {
                let char = htmlString.charAt(i);

                if (char === '<') isTag = true;
                textUtama += char;
                if (char === '>') isTag = false;

                if (!isTag) {
                    elemen.innerHTML = textUtama + '<span class="type-cursor"></span>';
                    setTimeout(ketik, speed);
                } else {
                    elemen.innerHTML = textUtama;
                    setTimeout(ketik, 0);
                }
                i++;
            } else {
                elemen.innerHTML = textUtama;
            }
        }
        ketik();
    }

    // 8. LOGIKA SWIPE KARTU 3D GALERI
    const stackContainer = document.getElementById('stacked-gallery');
    if (stackContainer) {
        const cards = stackContainer.querySelectorAll('.stacked-card');
        let currentCardIndex = 0;
        const totalCards = cards.length;
        let isAnimating = false;

        function updateCards() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'next-1', 'next-2', 'animating-out');
                
                let relativeIndex = (index - currentCardIndex + totalCards) % totalCards;

                if (relativeIndex === 0) {
                    card.classList.add('active');
                } else if (relativeIndex === 1) {
                    card.classList.add('next-1');
                } else if (relativeIndex === 2) {
                    card.classList.add('next-2');
                }
            });
        }

        updateCards();

        function swipeNextCard() {
            if (isAnimating) return;
            isAnimating = true;

            const activeCard = cards[currentCardIndex];
            activeCard.classList.remove('active');
            activeCard.classList.add('animating-out');

            currentCardIndex = (currentCardIndex + 1) % totalCards;
            
            cards.forEach((card, index) => {
                if (card !== activeCard) {
                    card.classList.remove('active', 'next-1', 'next-2');
                    let relativeIndex = (index - currentCardIndex + totalCards) % totalCards;
                    if (relativeIndex === 0) card.classList.add('active');
                    else if (relativeIndex === 1) card.classList.add('next-1');
                    else if (relativeIndex === 2) card.classList.add('next-2');
                }
            });

            setTimeout(() => {
                activeCard.classList.remove('animating-out');
                isAnimating = false;
            }, 600); 
        }

        let startY = 0;
        stackContainer.addEventListener('touchstart', e => {
            startY = e.touches[0].clientY;
        }, {passive: true});

        stackContainer.addEventListener('touchend', e => {
            let endY = e.changedTouches[0].clientY;
            if (startY - endY > 40) { 
                swipeNextCard();
            }
        }, {passive: true});

        let isDragging = false;
        let startMouseY = 0;
        stackContainer.addEventListener('mousedown', e => {
            isDragging = true;
            startMouseY = e.clientY;
        });
        window.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;
            let endMouseY = e.clientY;
            if (startMouseY - endMouseY > 40) {
                swipeNextCard();
            }
        });
    }

});

// Copy Account Number Function
function copyRek(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Account number successfully copied: " + text);
    }).catch(err => {
        console.error("Failed to copy", err);
    });
}