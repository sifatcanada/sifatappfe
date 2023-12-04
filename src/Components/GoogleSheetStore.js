import axios from 'axios';

export async function storeData(server_url, date, first_name, last_name, email, phone, location, address, class_timing, class_package, student_age, amount, transactionId, tab_name) {

    try {
        await axios.post(server_url+'/store', {
        date: date,
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone: phone,
        location: location,
        address: address,
        class_timing: class_timing,
        class_package: class_package,
        student_age: student_age,
        amount: amount,
        transactionId: transactionId,
        tab_name: tab_name,
        });
        console.log('success');
    } catch (error) {
        console.error('failure:', error);
    }
};