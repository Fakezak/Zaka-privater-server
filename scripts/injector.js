// =============================================
// FREEFIRE INJECTOR
// Loads hack from server and injects into game
// =============================================

const SERVER = 'https://zaka-privater-server.vercel.app';
const SCRIPT_URL = `${SERVER}/scripts/freefire_hack.js`;

console.log('🔥 FreeFire Injector v2.3.1');
console.log('========================================');

// =============================================
// INJECTION FUNCTION
// =============================================
function injectHack() {
    console.log('📥 Loading hack from server...');
    
    // Method 1: Script tag injection
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.onload = () => {
        console.log('✅ Hack injected successfully!');
        console.log('📱 Version: 2.3.1');
        console.log('👤 Author: Zaka');
        console.log('========================================');
        console.log('🔥 Hacks activated!');
        console.log('🛡️ Anti-ban active!');
        
        // Notify that hack is loaded
        if (typeof FreeFireHack !== 'undefined') {
            console.log('📊 Status:', FreeFireHack.status());
        }
    };
    script.onerror = () => {
        console.error('❌ Failed to load hack!');
        console.log('🔄 Retrying in 5 seconds...');
        setTimeout(injectHack, 5000);
    };
    document.head.appendChild(script);
}

// =============================================
// CHECK IF GAME IS READY
// =============================================
function waitForGame() {
    console.log('⏳ Waiting for game to load...');
    
    let attempts = 0;
    const maxAttempts = 30;
    
    const check = setInterval(() => {
        attempts++;
        
        // Check if game is loaded
        const gameLoaded = document.querySelector('canvas') || 
                          document.querySelector('.game-container') ||
                          typeof UnityLoader !== 'undefined';
        
        if (gameLoaded) {
            clearInterval(check);
            console.log('✅ Game detected!');
            setTimeout(injectHack, 2000);
        } else if (attempts >= maxAttempts) {
            clearInterval(check);
            console.log('⚠️ Game not detected, injecting anyway...');
            injectHack();
        }
    }, 1000);
}

// =============================================
// START INJECTION
// =============================================
console.log('========================================');
console.log('🚀 Starting injection process...');
console.log(`📡 Server: ${SERVER}`);
console.log('========================================');

// Start
waitForGame();

// =============================================
// MANUAL INJECTION (If needed)
// =============================================
window.manualInject = () => {
    console.log('🔄 Manual injection triggered!');
    injectHack();
};

console.log('🔄 To manually inject, run: manualInject()');

// =============================================
// EXPOSE FOR EXTERNAL USE
// =============================================
window.FreeFireInjector = {
    server: SERVER,
    inject: injectHack,
    status: () => {
        if (typeof FreeFireHack !== 'undefined') {
            return FreeFireHack.status();
        }
        return 'Hack not loaded';
    }
};
