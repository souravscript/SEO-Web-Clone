export async function POST(req) {

   try {

       //Verify the payment Id first, then access the Razorpay API.

       const options = {

           payment_id: req.body.paymentId,

           amount: req.body.amount,

       };

const razorpayResponse = await razorpay.refund(options);

       //We can send the response and store information in a database

       res.send('Successfully refunded')

   } catch (error) {

       console.log(error);

       res.status(400).send('unable to issue a refund');

   }

}
