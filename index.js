const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] 
});

const OWNER_ID = '1306034100544737461';

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // فلتر الأمان لمنع كلمات السر
    const forbidden = [/password/i, /كلمة سر/i, /pass/i, /رمز/i];
    if (forbidden.some(p => p.test(message.content))) {
        message.delete();
        return message.reply("⚠️ **تنبيه:** يمنع ذكر كلمات السر منعاً باتاً!");
    }

    // أمر !يلا
    if (message.content === '!يلا') {
        if (message.author.id !== OWNER_ID) return;
        message.delete();
        
        const embed = new EmbedBuilder()
            .setTitle('⚠️ Support Center / مركز المساعدة')
            .setDescription('Need help with Roblox, Minecraft, or Discord? Click below.\n\n-# Note: We provide guidance only. We do not recover accounts or perform hacks.')
            .setColor(0x0099FF);

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('open_ticket').setLabel('حل / Help').setStyle(ButtonStyle.Danger).setEmoji('⚠️')
        );
        message.channel.send({ embeds: [embed], components: [row] });
    }
});

// التعامل مع المودال (القائمة)
client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'open_ticket') {
        const modal = new ModalBuilder().setCustomId('ticket_modal').setTitle('نموذج المساعدة');
        
        const nameInput = new TextInputBuilder().setCustomId('user_name').setLabel('اكتب اسمك').setStyle(TextInputStyle.Short).setRequired(true);
        const ageInput = new TextInputBuilder().setCustomId('user_age').setLabel('اكتب العمر').setStyle(TextInputStyle.Short).setRequired(true);
        const probInput = new TextInputBuilder().setCustomId('user_problem').setLabel('اكتب مشكلتك').setStyle(TextInputStyle.Paragraph).setRequired(true);
        const imgInput = new TextInputBuilder().setCustomId('user_image').setLabel('رابط صورة المشكلة (اختياري)').setStyle(TextInputStyle.Short).setRequired(false);

        modal.addComponents(
            new ActionRowBuilder().addComponents(nameInput),
            new ActionRowBuilder().addComponents(ageInput),
            new ActionRowBuilder().addComponents(probInput),
            new ActionRowBuilder().addComponents(imgInput)
        );
        await interaction.showModal(modal);
    }
});

// منطق التحقق من الروابط والارسال للخاص
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    
    const imgUrl = interaction.fields.getTextInputValue('user_image');
    const imageExtensions = ['.jpg', '.png', '.gif', '.webp', '.jpeg'];
    
    if (imgUrl && !imageExtensions.some(ext => imgUrl.toLowerCase().endsWith(ext))) {
        return interaction.reply({ content: "❌ الرابط غير صحيح! يجب أن ينتهي بصيغة صورة.", ephemeral: true });
    }

    await interaction.user.send("✅ مرحباً، تم إرسال مشكلتك للدعم، انتظر الرد.");
    await interaction.reply({ content: "تم إرسال طلبك بنجاح!", ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

