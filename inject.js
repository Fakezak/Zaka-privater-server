// =============================================
// SIMPLE INJECTOR - ALWAYS-ACTIVE CHEAT
// =============================================

(function() {
    console.log('🔥 Loading Always-Active FreeFire Cheat...');
    
    // Load the cheat
    var script = document.createElement('script');
    script.src = 'https://zaka-privater-server.vercel.app/scripts/cheat.js';
    script.onload = function() {
        console.log('✅ Cheat loaded! All hacks are active!');
        console.log('♾️ Hacks will stay active permanently');
    };
    script.onerror = function() {
        console.log('❌ Failed to load cheat. Retrying...');
        setTimeout(function() {
            document.head.appendChild(script);
        }, 3000);
    };
    document.head.appendChild(script);
    
})();
