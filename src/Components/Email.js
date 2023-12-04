import axios from 'axios';

export async function sendEmail(server_url, date, first_name, last_name, phone, recipient_email, user_email, subject, location, address, class_timing, class_package, student_age, amount, transactionId, class_schedule, semester) {
    try {
      await axios.post(server_url+'/send-email', {
      date: date,
      recipient_email: recipient_email,
      subject: subject,
      user_email: user_email,
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
      class_schedule: class_schedule,
      semester: semester
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
};