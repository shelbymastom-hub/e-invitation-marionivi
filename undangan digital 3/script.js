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
    const jumlahAnakContainer = document.getElementById('jumlah-anak-container');
    const jumlahAnakSelect = document.getElementById('jumlah-anak');
    const btnSubmitRsvp = document.getElementById('btn-submit-rsvp');
    const thankYouMsg = document.getElementById('thank-you-msg');

    kehadiranSelect.addEventListener('change', function() {
        if (this.value === 'tidak') {
            jumlahContainer.classList.add('hidden');
            jumlahSelect.removeAttribute('required');
            jumlahAnakContainer.classList.add('hidden');
            jumlahAnakSelect.removeAttribute('required');
            btnSubmitRsvp.innerText = "Send Confirmation & Wishes";
        } else {
            jumlahContainer.classList.remove('hidden');
            jumlahSelect.setAttribute('required', 'required');
            jumlahAnakContainer.classList.remove('hidden');
            jumlahAnakSelect.setAttribute('required', 'required');
            btnSubmitRsvp.innerText = "Submit & Get QR Ticket";
        }
    });

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const kehadiran = kehadiranSelect.value;

        if (kehadiran === 'hadir') {
            const jumlah = jumlahSelect.value;
            const jumlahAnak = jumlahAnakSelect.value;
            
            document.getElementById('tiket-nama').innerText = nama.toUpperCase();
            document.getElementById('tiket-pax').innerText = jumlah + (jumlah === "1" ? " Adult" : " Adults");
            
            let textAnak = "0 Children";
            if (jumlahAnak === "1") textAnak = "1 Child";
            else if (jumlahAnak === "2") textAnak = "2 Children";
            document.getElementById('tiket-anak').innerText = textAnak;

            ticketModal.classList.remove('hidden');
            thankYouMsg.classList.add('hidden');
        } else {
            thankYouMsg.classList.remove('hidden');
            ticketModal.classList.add('hidden');
            
            rsvpForm.reset();
            
            setTimeout(() => {
                jumlahContainer.classList.remove('hidden');
                jumlahSelect.setAttribute('required', 'required');
                jumlahAnakContainer.classList.remove('hidden');
                jumlahAnakSelect.setAttribute('required', 'required');
                btnSubmitRsvp.innerText = "Submit & Get QR Ticket";
                thankYouMsg.classList.add('hidden');
                kehadiranSelect.style.color = ""; 
                jumlahSelect.style.color = "";
                jumlahAnakSelect.style.color = "";
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

    // 7. DOWNLOAD TICKET LOGIC (HTML5 CANVAS) - UPDATED
    const downloadTicketBtn = document.getElementById('download-ticket-btn');
    downloadTicketBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Memperbesar ukuran canvas agar margin lebih lega
        canvas.width = 500;
        canvas.height = 650;

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Text Styles
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';

        // Title
        ctx.font = 'bold 22px "Cormorant Garamond", serif';
        // Support browser modern untuk letter-spacing di canvas
        if (ctx.letterSpacing !== undefined) {
            ctx.letterSpacing = "3px";
        }
        ctx.fillText('E-TICKET INVITATION', 250, 70);

        // Dashed Line
        ctx.beginPath();
        ctx.moveTo(50, 110);
        ctx.lineTo(450, 110);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#cccccc';
        ctx.stroke();

        // Get Data
        const guestName = document.getElementById('tiket-nama').innerText;
        const paxText = document.getElementById('tiket-pax').innerText;
        const anakText = document.getElementById('tiket-anak').innerText;

        // Draw Image (QR Code) - Centered
        const qrImg = document.getElementById('qr-img');
        ctx.drawImage(qrImg, 125, 150, 250, 250);

        // Draw Text Data
        // Menggunakan parameter maxWidth (400) agar teks otomatis menyusut jika kepanjangan
        ctx.font = 'bold 36px "Cormorant Garamond", serif';
        ctx.fillText(guestName, 250, 460, 400);

        ctx.font = '18px "Lora", serif';
        ctx.fillStyle = '#666666';
        ctx.fillText(paxText, 250, 500);
        ctx.fillText(anakText, 250, 530);

        // Info Text (Footer)
        ctx.font = '14px "Lora", serif';
        ctx.fillStyle = '#888888';
        ctx.fillText('Please present this QR code at the reception desk.', 250, 600, 400);

        // Trigger Download
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `Wedding_Ticket_${guestName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Canvas export failed due to CORS limitations.", err);
            alert("Could not download automatically. You can take a screenshot of the ticket.");
        }
    });

    // 8. EFEK TYPEWRITER UNTUK LOVE STORY
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

    // 9. LOGIKA SWIPE KARTU 3D GALERI
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
                if (relativeIndex === 0) card.classList.add('active');
                else if (relativeIndex === 1) card.classList.add('next-1');
                else if (relativeIndex === 2) card.classList.add('next-2');
            });
        }
        updateCards();

        function swipeNext() {
            if (isAnimating) return;
            isAnimating = true;
            currentCardIndex = (currentCardIndex + 1) % totalCards;
            updateCards();
            setTimeout(() => { isAnimating = false; }, 600);
        }

        function swipePrev() {
            if (isAnimating) return;
            isAnimating = true;
            currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
            updateCards();
            setTimeout(() => { isAnimating = false; }, 600);
        }

        const nextBtn = document.getElementById('next-gal');
        const prevBtn = document.getElementById('prev-gal');
        
        if(nextBtn) nextBtn.addEventListener('click', swipeNext);
        if(prevBtn) prevBtn.addEventListener('click', swipePrev);

        let startX = 0;
        stackContainer.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        }, {passive: true});

        stackContainer.addEventListener('touchend', e => {
            let endX = e.changedTouches[0].clientX;
            let diff = startX - endX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) swipeNext();
                else swipePrev();
            }
        }, {passive: true});

        let isDragging = false;
        let startMouseX = 0;
        stackContainer.addEventListener('mousedown', e => {
            isDragging = true;
            startMouseX = e.clientX;
        });

        window.addEventListener('mouseup', e => {
            if (!isDragging) return;
            isDragging = false;
            let diff = startMouseX - e.clientX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) swipeNext();
                else swipePrev();
            }
        });
    }
});

function copyRek(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Account number successfully copied: " + text);
    }).catch(err => {
        console.error("Failed to copy", err);
    });
}