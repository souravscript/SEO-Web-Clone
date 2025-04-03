const crypto = require('crypto')

const secret_key = '1234567890'

export async function POST(req) {

   // do a validation

const data = crypto.createHmac('sha256', secret_key)

   data.update(JSON.stringify(req.body))

   const digest = data.digest('hex')

if (digest === req.headers['x-razorpay-signature']) {

       console.log('request is legit')

       //We can send the response and store information in a database.

       res.json({

           status: 'ok'

       })

} else {

       res.status(400).send('Invalid signature');

   }

}