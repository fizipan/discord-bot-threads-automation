require('dotenv').config()
const { Client, GatewayIntentBits } = require('discord.js')
const cron = require('node-cron')

// Format tanggal seperti "10 Juni 2025"
function getFormattedDateID() {
    return new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] })

client.once('ready', () => {
    console.log(`✅ Bot is ready as ${client.user.tag}`)

    // Setiap hari pukul 19:00 WIB
    cron.schedule('0 19 * * *', createProgressThread)
})

// Pindahkan fungsi utama ke fungsi sendiri agar bisa dipanggil ulang
async function createProgressThread() {
    try {
        const channel = await client.channels.fetch(process.env.CHANNEL_ID)
        if (!channel || !channel.isTextBased()) return

        const today = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        const threadTitle = `📌 Progress Report - ${today}`

        const thread = await channel.threads.create({
            name: threadTitle,
            autoArchiveDuration: 1440,
            reason: 'Thread rutin malam hari',
        })

        await thread.send({
            content: `<@&${process.env.ROLE_ID}> Mohon update progress hari ini ya!`,
            allowedMentions: {
                roles: [process.env.ROLE_ID],
            },
        })

        console.log(`🧵 Thread dibuat: ${threadTitle}`)
    } catch (err) {
        console.error('❌ Gagal membuat thread:', err)
    }
}


client.login(process.env.DISCORD_TOKEN)
