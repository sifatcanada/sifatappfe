import axios from 'axios';

export async function sendEmail(server_url, date, first_name, last_name, phone, recipient_email, sender_email, subject, location, address, class_timing, class_package, student_age, amount, transactionId) {
    try {
      await axios.post(server_url+'/send-email', {
      date: date,
      to: recipient_email,
      subject: subject,
      sender_email: sender_email,
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      location: location,
      address: address,
      class_timing: class_timing,
      class_package: class_package,
      student_age: student_age,
      amount: amount,
      transactionId: transactionId,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
};