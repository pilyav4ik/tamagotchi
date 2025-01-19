const { Telegraf, Markup } = require("telegraf")
const axios = require('axios');
require('dotenv').config()


class TgbotService {
    webAppUrl = process.env.WEBAPP_URL

    bot=""
    async tgbotInit () {
        this.bot = new Telegraf(process.env.TG_TOKEN);



        // Start command with inline keyboard button
        this.bot.command('start', (ctx) => {
            ctx.reply(
                'Hello! Press to start the app',
                Markup.inlineKeyboard([
                    Markup.button.webApp('Open mini app', `${this.webAppUrl}?ref=${ctx.payload}`),
                ])
            );
        });



        this.bot.on('pre_checkout_query', async ctx => {
            const query = ctx.update.pre_checkout_query;
            console.log('pre_checkout_query: ', query)

            const payload = JSON.parse(query.invoice_payload)
            
            const { subscription_period } = payload
            console.log('subscription_period: ', subscription_period)

            if (subscription_period) {
                switch(subscription_period) {
                    case 'yearly':
                        // Database actions
                        // userModel.activateSubscription(userid, subscription_period, DB)
                        await ctx.answerPreCheckoutQuery(true)
                        break
                    case 'monthly':
                        // Database actions
                        // userModel.activateSubscription(userid, subscription_period, DB)
                        await ctx.answerPreCheckoutQuery(true)
                        break
                }
            }
            else {
                await ctx.answerPreCheckoutQuery(false, 'A non-existent subscription period has been selected')
            }
        })

        this.bot.on('successful_payment', async ctx => {
            ctx.reply('You got PRO')
            const userID = ctx.update.message.from.id
            const paymentChargeID = ctx.update.message?.successful_payment.telegram_payment_charge_id
            console.log('successful_payment: ', ctx.update.message?.successful_payment)
            console.log('payment_charge_id: ', paymentChargeID)
            try {
                const isRefunded = await this.refundStarPayment(userID, paymentChargeID)
                console.log('is_refunded: ', isRefunded)
            }
            catch(err) {
                console.error("Can't refund on successful_payment: ", err)
            }
        })

        this.bot.launch()
        console.log('bot Launched')
    }

    async reduceTimer(titleText, descriptionText, priceLabel, priceAmount) {      
        let payload = {
            userid: 12345678,
            subscription_period: 'monthly' 
        }
        let providerToken = "" 
        let currency = "XTR"
        let prices = [{label:priceLabel, amount:priceAmount}]
        let obj = {title:titleText, description:descriptionText, payload:payload, provider_token:providerToken, currency:currency, prices:prices }
        let result = await this.bot.telegram.createInvoiceLink(obj)
    
        console.log('result: ', result)
        return result
    }

    async refundStarPayment(userId, telegramPaymentChargeId) {
        try {
            const response = await axios.post(
                `https://api.telegram.org/bot/${process.env.TG_TOKEN}/refundStarPayment`,
                {
                    user_id: userId,
                    telegram_payment_charge_id: telegramPaymentChargeId,
                }
            );

            if (response.data.ok) {
                return response.data.result;
            } else {
                throw new Error(response.data.description);
            }
        } catch (error) {
            console.error('Error when refunding a payment:', error.message);
            throw error;
        }
    }
}


module.exports = new TgbotService()