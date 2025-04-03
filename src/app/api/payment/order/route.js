const Razorpay = require("razorpay");

export async function POST(req) {
    // initializing razorpay
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_TEST_KEY_ID,
        key_secret: process.env.RAZORPAY_TEST_KEY_SECRET,
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "any unique id for every order",
        payment_capture: 1
    };
    try {
        const response = await razorpay.orders.create(options)
        res.json({
            order_id: response.id,
            currency: response.currency,
            amount: response.amount,
        })
    } catch (err) {
       res.status(400).send('Not able to create order. Please try again!');
    }
};