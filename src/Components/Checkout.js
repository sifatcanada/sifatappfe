import { CLIENT_ID } from '../Config/Config'
import React, { useState, useEffect } from "react" ;
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { sendEmail } from './Email';
import { getCurrentDate } from './Date';
import { storeData } from './GoogleSheetStore';

const Checkout = ({ first_name, last_name, phone, email, sender_email, subject, class_location, class_address, class_timing, class_package, student_age, package_qty, server_url }) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderId, setOrderId] = useState(false);
    const [transactionId, setTransactionId] = useState(false);
    const [step, setStep] = useState('checkout-payment');
    const [userEmail, setUserEmail] = useState('');

    const createOrder = async (data, actions) => {
        const response = await axios.post(server_url+'/api/create-payment',
        {
            "amount": (package_qty * class_package.unit * 1.13).toFixed(2),
            "currency_code": "CAD",
            "return_url": "https://sifatcanada.com/success",
            "cancel_url": "https://sifatcanada.com/cancel"
        });
        // console.log(response)
        setOrderId(response.data.id);
    
        return actions.order.create({
          purchase_units: [
            {
                description: class_package.name,
                amount: {
                    currency_code: "CAD",
                    value: (package_qty * class_package.unit * 1.13).toFixed(2),
                    quantity: package_qty
                },
            },
          ],
        });
      };

    const onApprove = async (data, actions) => {
        return actions.order.capture().then((details) => {
            const { purchase_units } = details;
            setTransactionId(purchase_units[0].payments.captures[0].id)
            // console.log('Transaction completed:', details);
            setSuccess(true);
          // Handle the successful transaction
        });
    };

    const onError = (err) => {
        // console.error('Transaction failed:', err);
        // Handle errors
    };

    useEffect(() => {
        if (success) {
          
            sendEmail(
                server_url,
                getCurrentDate(),
                first_name,
                last_name,
                phone,
                email,
                sender_email,
                subject,
                class_location,
                class_address,
                class_timing,
                class_package.name,
                student_age,
                (package_qty * class_package.unit * 1.13).toFixed(2),
                transactionId,
              );

              storeData(
                server_url,
                getCurrentDate(),
                first_name,
                last_name,
                email,
                phone,
                class_location,
                class_address,
                class_timing,
                class_package.name,
                student_age,
                (package_qty * class_package.unit * 1.13).toFixed(2),
                transactionId,
                "Payment"
              );

            // alert("Payment successful!!");
            setStep('payment-complete')
            // console.log('Order successful . Your order id is--', orderId);
        }
    },[success]);

    return (
        <>
        {step === 'checkout-payment' && (

            <>
            <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
                SELECT A PAYMENT METHOD
            </Typography>
            <PayPalScriptProvider options={{ "client-id": CLIENT_ID, currency: "CAD" }}>
                <Grid container spacing={0.5} justifyContent="center">
                    <Grid item xs={12} sm={6}>
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={(data, actions) => createOrder(data, actions)}
                            onApprove={(data, actions) => onApprove(data, actions)}
                            onError={(err) => onError(err)}
                        />
                    </Grid>
                </Grid>
            </PayPalScriptProvider>
        </>
        )}

        {step === 'payment-complete' && (

        <>
        <Typography gutterBottom variant="h6" component="div" fontWeight="bold">
            Payment Completed!!!
        </Typography>
        <Typography gutterBottom variant="body2" component="div" fontWeight="bold">
            Confirmation Number: {transactionId}
            <br></br>
            Email Confirmation Sent To: {userEmail}
        </Typography>
        </>
        )}
        </>
        
    );
}
export default Checkout