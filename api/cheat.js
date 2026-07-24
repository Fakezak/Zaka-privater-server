const userAgent = req.headers['user-agent'] || '';
const isFreeFire = userAgent.includes('GarenaFreeFire');

if (isFreeFire) {
    // Send the Lua script
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(aimlockScript + backjumpScript);
} else {
    // Send the HTML page (what I'm seeing now)
    res.send(htmlPage);
}
