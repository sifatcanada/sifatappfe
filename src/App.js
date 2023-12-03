import React, { useState } from 'react';
import CheckoutForm from "./Components/Checkout"
import Locations from "./Components/Locations"
import ActionCard from './Components/ActionCard';
import SocialMediaBar from './Components/SocialMediaBar';
import CustomerDataTable from "./Components/CustomerDataTable"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import axios from 'axios';
import { disclaimerTerms } from './disclaimer'
import './App.css';
import jsonData from './data.json'; // Import the JSON file

const useStyles = styled((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 'md',
    margin: '0 auto',
  },
  formControl: {
    margin: theme.spacing(1),
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
}));

var targetAddress = [{"name": "", "address" : "","classes" : [{"class_name": "","class_time": "","class_level": ""}]   }]
const defaultTheme = createTheme();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.sifatcanada.com">
        SIFAT Canada
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function App() {
  const [step, setStep] = useState('booking');

  const prevPage = () => {
    // Add logic to determine the previous page based on the current page
    switch (step) {
      case 'classes':
        setStep('booking');
        break;
      case 'locations':
        setStep('classes');
        break;
      case 'age-group':
        setStep('classes');
        break;
      case 'level':
        setStep('classes');
        break;
      case 'location-address':
        setStep('classes');
        break;
      case 'packages':
        setStep('classes');
        break;
      case 'package-detail':
        setStep('classes');
        break;
      case 'register':
        setStep('classes');
        break;
      case 'register-button':
        setStep('classes');
        break;
      case 'payment':
        setStep('register-button');
        break;
      // Add more cases for additional pages
      default:
        break;
    }
  };

  const [selectedCity, setSelectedCity] = useState({});
  const [selectedCityLocations, setSelectedCityLocations] = useState([{}]);
  const [selectedCityLocationClasses, setSelectedCityLocationClasses] = useState([{}]);
  const [selectedClassesByAgeGroup, setSelectedClassesByAgeGroup] = useState([{}]);
  const [selectedClassesByAgeLevel, setSelectedClassesByAgeLevel] = useState([{}]);
  const [selectedClassesByAgeLevelTiming, setSelectedClassesByAgeLevelTiming] = useState([{}]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedClassPackage, setSelectedClassPackage] = useState({});
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [location, setLocation] = useState(''); 
  const [address, setAddress] = useState('');
  const [classTiming, setClassTiming] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();
  const isLandingPage = step === 'booking';
  var targetPackage = jsonData.packages

  const getCurrentDate = () => {
    const currentDate = new Date();
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const calculateDays = (startDate, endDate, day, excludedDates) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const availableDates = [];
    const dateObjects = excludedDates.map((excludedDate) => (new Date(excludedDate)).toLocaleString('en-US', { timeZone: 'EST' }));
    // Iterate through each day from start to end
    while (start <= end) {
      // Check if the current day matches with specified day (0 corresponds to Sunday, 1 to Monday, and so on)
      if (start.getDay() === day) {
        if (!dateObjects.includes((new Date(start)).toLocaleString('en-US', { timeZone: 'EST' }))) {
            console.log("match found")
            count++;
            availableDates.push(new Date(start)); // Save the date of each Monday
        }
      }
      // Move to the next day
      start.setDate(start.getDate() + 1);
    }
    return { count, availableDates };
  };

  const handleClasses = (event) => {
    // console.log(event.target.value)
    // sort cities by city name
    jsonData.locations.sort((a, b) => a.name.localeCompare(b.name))
    setStep('classes');
  };

  const handleLocationChange = (event) => {
    // console.log(event)
    // targetLocation = jsonData.locations.filter((item) => item.city === event)
    setSelectedCity(jsonData.locations.filter((item) => item.city === event))
    setSelectedCityLocations((jsonData.locations.filter((item) => item.city === event))[0].locations)
    setLocation(event);
    // console.log(selectedCityLocations)
    setStep('locations');
  };

  const handleAddressChange = (event) => {
    // console.log(event.target.value)
    setAddress(event.target.value);
    targetAddress = selectedCityLocations.filter((item) => item.address === event.target.value)
    setSelectedCityLocationClasses((selectedCityLocations.filter((item) => item.address === event.target.value))[0].classes)
    // console.log(targetAddress)
    // console.log(selectedCityLocationClasses)
    setStep('age-group');
  };

  const handleAge = (event) => {
    // console.log(event.target.value)
    setSelectedAgeGroup(event.target.value)
    let classes = []
    selectedCityLocationClasses.filter((items) => {
      if(items.age_group.includes(event.target.value)) {
        classes.push(items)
      }
    });
    // console.log(classes)
    setSelectedClassesByAgeGroup(classes)
    // console.log(selectedClassesByAgeGroup)
    classes = []
    setStep('level');
  };

  const handleLevel = (event) => {
    // console.log(event.target.value)
    // console.log(selectedClassesByAgeGroup)
    let classes = []
    selectedClassesByAgeGroup.filter((items) => {
      // console.log(items.class_level)
      if(items.class_level.includes(event.target.value)) {
        classes.push(items)
      }
    });
    setSelectedClassesByAgeLevel(classes)
    // console.log(selectedClassesByAgeLevel)
    classes = []
    setStep('location-address');
  };

  const handleClassTimingChange = (event) => {
    let class_time = []
    selectedClassesByAgeLevel.filter((items) => {
      if(items.class_id === event.target.value) {
        class_time.push(items)
      }
    });
    setSelectedClassesByAgeLevelTiming(class_time)
    setClassTiming(class_time[0].class_time + " | " +  class_time[0].class_type);
    class_time = []
    setStep('packages');
  };

  const handlePackageType = (event) => {
    // console.log(event)
    setSelectedCard(event);
    setSelectedClassPackage(event)
    // console.log(selectedClassPackage)
    setStep('register');
  };

  const handlePackageChange = (event) => {
    // console.log(event)
    setStep('register');
  };

  const handleEnrollmentSubmit = (event) => {
    event.preventDefault();
    setStep('register-button');
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleCheckboxChange = (e) => {
    // console.log(e.target.checked)
    setTermsAccepted(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // console.log(formData)
    // Validate on change
    validate(name, value);
  };

  const validate = (name, value) => {
    switch (name) {
      case 'firstName':
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: value.trim() === '' ? 'First Name is required' : '',
        }));
        break;
      case 'lastName':
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: value.trim() === '' ? 'Last Name is required' : '',
        }));
        break;
      case 'email':
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: value.trim() === '' ? 'Email is required' : '',
        }));
        break;
      case 'phone':
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: value.trim() === '' ? 'Phone number is required' : '',
        }));
        break;
      default:
        break;
    }
  };
    
  const sendEmail = async (first_name, last_name, phone, recipient_email, sender_email, subject, location, address, class_timing, class_package, student_age, amount, transactionId, orderID) => {
    try {
      await axios.post(jsonData.server_url+'/send-email', {
      date: getCurrentDate(),
      to: sender_email,
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
      orderId: orderID,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const storeData = async (first_name, last_name, phone, email, location, address, class_timing, class_package, student_age, amount, transactionId, tab_name) => {

    try {
      await axios.post(jsonData.server_url+'/store', {
      date: getCurrentDate(),
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      email: email,
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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Validate all fields before submitting
    for (const [name, value] of Object.entries(formData)) {
      validate(name, value);
    }
    // Check if there are no errors before submitting
    if (Object.values(errors).every((error) => error === '') && termsAccepted === true) {
      // Form submission logic goes here
      // console.log('Form submitted:', formData);
      // console.log(formData.firstName)
      setFirstName(formData.firstName)
      setLastName(formData.lastName)
      setEmail(formData.email)
      setPhone(formData.phone)
      setIsSubmitting(true);
      // console.log(formData)
      sendEmail(
        formData.firstName,
        formData.lastName,
        formData.phone,
        jsonData.sender_email,
        jsonData.sender_email,
        jsonData.reg_email_subject + " - " + formData.firstName,
        location,
        address,
        classTiming,
        selectedClassPackage.name,
        selectedAgeGroup,
        (selectedClassPackage.qty * selectedClassPackage.unit * 1.13).toFixed(2),
        "Not Paid",
        "N/A"
      );

      storeData(
        formData.firstName,
        formData.lastName,
        formData.phone,
        jsonData.email,
        location,
        address,
        classTiming,
        selectedClassPackage.name,
        selectedAgeGroup,
        (selectedClassPackage.qty * selectedClassPackage.unit * 1.13).toFixed(2),
        "Not Paid",
        "Pre-Payment"
      );

      setIsSubmitting(false);
      setStep('payment');
    }

  };

  return (
    <>
    <ThemeProvider theme={defaultTheme}>
      <Container className={classes.formContainer}>
      <CssBaseline />
    <div className="App">
    <SocialMediaBar />
      <img 
      src="sifat-logo.jpg" 
      alt="Sifat Logo" 
      style={{ maxWidth: isLandingPage ? '85%' : '60%', height: 'auto' }}
      />
      {(step === 'booking') && (
        <>
          <h1>Welcome to School of Indian Folk Arts & Tradition (SIFAT)</h1>
          <Button
              type="submit"
              onClick={handleClasses}
              value="classes"
              variant="contained"
              sx={{ mt: 3, mb: 2, m: 0.5 }}
          >Classes Info & Registration!
          </Button>
        </>
      )}

      {step === 'classes' && (
        <>
          <br></br><br></br>
          <Typography gutterBottom variant="h6" color="text.primary" component="div" fontWeight="bold">
          SIFAT is providing Bhangra & Giddha Classes across {jsonData.locations.length} cities. Kindly choose a city to commence your enrollment
          </Typography>
          
          {jsonData.locations.map((item) => (
            <Locations
              title={item.city}
              desc=""
              width="25%"
              onClick={handleLocationChange}
            />
          ))}
        </>
      )}
      
      {(step === 'locations' || step === 'age-group' || step === 'level' || step === 'location-address' || step === 'packages' || step === 'package-detail' || step === 'register') && (
        <div>
          <p className='selection-heading'>Available locations in {location}:</p>
          <RadioGroup
          name="address"
          >
          {selectedCityLocations.map((item) => (
              <div>
                <FormControlLabel 
                  value={item.address} 
                  control={<Radio />} 
                  label={
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                      {item.name}
                    </Typography>
                  } 
                  onChange={handleAddressChange}
                />
              <div>{item.address}</div>
                </div>
            ))}
            </RadioGroup>
        </div>
      )}

      {(step === 'age-group' || step === 'level' || step === 'location-address' || step === 'packages' || step === 'package-detail' || step === 'register') && (
        <div>
          <p className='selection-heading'>Please select your Age Group</p>
          <RadioGroup
          name="age-group"
          >
              <div>
                <FormControlLabel value="4-7" control={<Radio />} label="4-7 yrs" onChange={handleAge}/>
              </div>
              <div>
                <FormControlLabel value="8-14" control={<Radio />} label="8-14 yrs" onChange={handleAge}/>
              </div>
              <div>
                <FormControlLabel value="15+" control={<Radio />} label="15+ yrs" onChange={handleAge}/>
              </div>
            </RadioGroup>
        </div>
      )}

      {(step === 'level' || step === 'location-address' || step === 'packages' || step === 'package-detail' || step === 'register') && (
        <div>
          <p className='selection-heading'>Please select your Level</p>
          <RadioGroup
          name="level"
          >
              <div>
                <FormControlLabel value="Beginner" control={<Radio />} label="Beginner" onChange={handleLevel}/>
              </div>
              <div>
                <FormControlLabel value="Intermediate" control={<Radio />} label="Intermediate" onChange={handleLevel}/>
              </div>
              <div>
                <FormControlLabel value="Advance" control={<Radio />} label="Advance" onChange={handleLevel}/>
              </div>
            </RadioGroup>
        </div>
      )}

      {(step === 'location-address' || step === 'packages' || step === 'package-detail' || step === 'register') && (
        <div>
          <p className='selection-heading'>Available Classes</p>
          <RadioGroup
          name="classTiming"
          >
          {selectedClassesByAgeLevel.length === 0 && (
            <div>
              <p>Sorry there are no available classes for the selected Age Group and Level! Please check other locations!</p>
            </div>
          )}

          {selectedClassesByAgeLevel.map((item) => (
              <div>
                <FormControlLabel
                value={item.class_id}
                control={<Radio />} 
                label={
                  <Typography variant="body1">
                    {item.class_time} | <b>{item.class_type}</b>
                  </Typography>
                }
                onChange={handleClassTimingChange}
                />
                </div>
            ))}
            </RadioGroup>
        </div>
      )}

      {(step === 'packages' || step === 'package-detail' || step === 'register') && (
        <>
        {selectedCity[0].name === 'CALEDON' && (
            <div>
              <Button
                component="a"
                href={selectedClassesByAgeLevelTiming[0].class_link}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >Proceed to Registration
              </Button>
            </div>
        )}

        {selectedCity[0].name === 'CAMBRIDGE' && (
            <div>
              <p>Please visit Cambridge City <a rel="noopener noreferrer" target="_blank" href="https://www.cambridge.ca/en/index.aspx">Website</a> to register for Bhangra Dance Classes</p>
            </div>
        )}

        {!(selectedCity[0].name === 'CAMBRIDGE' || selectedCity[0].name === 'CALEDON') && (
            <>
              <p className='selection-heading'>Available Packages</p>
              <Grid container spacing={2} justifyContent="center">
                {jsonData.packages.map((item) => (
                  <Grid item>
                    <ActionCard
                      item={item}
                      onClick={handlePackageType}
                      selected={selectedCard === item}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
        )}
        </>
      )}

      {step === 'register' && (
        <Button
          type="submit"
          onClick={handleEnrollmentSubmit}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >Proceed to Registration
        </Button>
      )}

      {step === 'register-button' && (
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }} disabled={isSubmitting}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="first-name"
                  name="firstName"
                  value={formData.firstName}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                  helperText={errors.firstName}
                  error={!!errors.firstName}
                />
              </Grid>

            <Grid item xs={12} sm={6}>
            <TextField
                autoComplete="last-name"
                name="lastName"
                value={formData.lastName}
                required
                fullWidth
                id="lastName"
                label="Last Name"
                onChange={handleChange}
                helperText={errors.lastName}
                error={!!errors.lastName}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                helperText={errors.email}
                error={!!errors.email}
              />
            </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="phone"
              label="Phone"
              name="phone"
              autoComplete="phone"
              value={formData.phone}
              onChange={handleChange}
              helperText={errors.phone}
              error={!!errors.phone}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontWeight: "bold", position: 'relative' }}>
                By submitting this form, you agree to our terms and conditions.
            </Typography>
          </Grid>

          <Grid item xs={24} sm={12}>
          <TextField
            label=""
            name="terms"
            multiline
            rows={10} // Adjust the number of rows as needed
            fullWidth
            variant="outlined"
            margin="normal"
            value={disclaimerTerms}
            InputProps={{
              readOnly: true,
            }}
          />
          </Grid>

          <Grid item xs={12} sm={7}>
          <FormControlLabel
          control={
              <Checkbox
                checked={termsAccepted}
                onChange={handleCheckboxChange}
                color="primary"
                helperText={errors.terms}
                error={!!errors.terms}
            />
          }
          label="I agree to all the terms and conditions mentioned above in the Disclaimer"
          />
          </Grid>
          </Grid>
          <Button
            type="submit"
            disabled={!termsAccepted}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >Pay Now
          </Button>
        </Box>
      )}

      {step === 'payment' && (
        <>
          <CustomerDataTable
            first_name={firstName}
            last_name={lastName}
            phone={phone}
            email={email}
            class_location={location}
            class_address={address}
            class_timing={classTiming}
            student_age={selectedAgeGroup}
            package_name={selectedClassPackage.name}
            package_qty={selectedClassPackage.qty}
            package_unit={selectedClassPackage.unit}
          />
          <br/>
          <CheckoutForm
            first_name={firstName}
            last_name={lastName}
            phone={phone}
            email={email}
            sender_email={jsonData.sender_email}
            subject={jsonData.reg_payment_email_subject}
            class_location={location}
            class_address={address}
            class_timing={classTiming}
            class_package={selectedClassPackage}
            student_age={selectedAgeGroup}
            package_qty={selectedClassPackage.qty}
            server_url={jsonData.server_url}
          />
        </>
        
      )}

      <div>
        {step !== 'booking' && (
          <Button
          onClick={prevPage}
          variant="contained"
          sx={{ mt: 3, mb: 2, m: 5 }}
          >Back</Button>
        )}
      </div>
    </div>
    
    <Copyright sx={{ mt: 5 }} />
    </Container>
    </ThemeProvider>
    </>
  );
}

export default App;