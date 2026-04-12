function hisobla() {
    const summaSelect = document.getElementById('summa');
    const kunSelect = document.getElementById('kun');
    
    if (!summaSelect || !kunSelect) return;

    const summa = parseFloat(summaSelect.value);
    const options = kunSelect.options;

    // --- TARIF CHEKLOVLARI ---
    if (summa === 200000) { 
        // Kitob 1: Faqat 60 kun
        options[1].disabled = true;  // 150 kun yopiq
        options[2].disabled = true;  // 365 kun yopiq
        kunSelect.value = "60";      
    } 
    else if (summa === 500000) { 
        // Kitob 2: 60 va 150 kun
        options[1].disabled = false; // 150 kun ochiq
        options[2].disabled = true;  // 365 kun yopiq
        if (kunSelect.value === "365") kunSelect.value = "150";
    } 
    else if (summa === 1000000) { 
        // Kitob 3: Hamma muddatlar ochiq
        options[1].disabled = false;
        options[2].disabled = false;
    }

    // --- HISOB-KITOB (3%) ---
    const kunlar = parseInt(kunSelect.value);
    const kunlikFoiz = 0.03; // 3% stavka

    const kunlikFoyda = summa * kunlikFoiz;
    const jamiSofFoyda = kunlikFoyda * kunlar;

    // --- NATIJALARNI CHIQARISH ---
    document.getElementById('kunlikFoyda').innerText = Math.floor(kunlikFoyda).toLocaleString() + " UZS";
    document.getElementById('umumiyFoyda').innerText = Math.floor(jamiSofFoyda).toLocaleString() + " UZS";
    document.getElementById('jamiSumma').innerText = Math.floor(jamiSofFoyda).toLocaleString() + " UZS";
}

window.onload = hisobla;
