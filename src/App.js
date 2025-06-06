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
import { disclaimerTerms } from './disclaimer'
import { sendEmail } from './Components/Email';
import { getCurrentDate } from './Components/Date';
import { storeData } from './Components/GoogleSheetStore';
import { startOfDay, isSunday, isMonday, isTuesday, isWednesday, isThursday, isFriday, isSaturday, format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
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
  const [semClassQty, setSemClassQty] = useState(11);
  const [semAvailableDates, setSemAvailableDates] = useState([]);
  const [allAvailDates, setAllAvailDates] = useState({avdts: [{"package_id": "", "dts": [], "class_count": 0}]});
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

  const calculateDays = (startDate, endDate, day, excludedDates) => {
    // console.log(day)
    const easternTimeZone = 'America/New_York';

    let start = utcToZonedTime(startOfDay(new Date(startDate)), easternTimeZone);
    const end = utcToZonedTime(startOfDay(new Date(endDate)), easternTimeZone);
    let todayDate = utcToZonedTime(startOfDay(new Date()), easternTimeZone);
    
    if (start.getTime() === todayDate.getTime()) {
      start.setDate(start.getDate() + 1);
    }
    if (start < todayDate) {
      start = todayDate;
    }
    let count = 0;
    const availableDates = [];
    // console.log(start)
    // console.log(end)

    const excludedDateObjects = excludedDates.map(excludedDate =>
      utcToZonedTime(startOfDay(new Date(excludedDate)), easternTimeZone)
    );

    // console.log(excludedDateObjects)

    while (start <= end) {
      const currentDate = start;

      // Check if the current day matches the specified day
      let isMatch = false;
      switch (day) {
        case 0: isMatch = isSunday(currentDate); break;
        case 1: isMatch = isMonday(currentDate); break;
        case 2: isMatch = isTuesday(currentDate); break;
        case 3: isMatch = isWednesday(currentDate); break;
        case 4: isMatch = isThursday(currentDate); break;
        case 5: isMatch = isFriday(currentDate); break;
        case 6: isMatch = isSaturday(currentDate); break;
        default: isMatch = false;
      }

      const currentDateTimeZone = utcToZonedTime(currentDate, easternTimeZone);

      if (isMatch && !excludedDateObjects.some(excludedDate => excludedDate.getTime() === currentDateTimeZone.getTime())) {
        count++;
        availableDates.push(format(currentDateTimeZone, 'yyyy-MM-dd')); // You can adjust the date format as needed
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
    
    jsonData.packages.forEach(item => {

      // console.log(item)
      const { count, availableDates } = calculateDays(item.start_date, item.end_date, class_time[0].class_day, item.excluded_dates);
      const newItem = { package_id: item.package_id, dts: availableDates, class_count: count };

      setAllAvailDates(prevState => ({
        ...prevState,
        avdts: [...prevState.avdts, newItem]
      }));
    });
    class_time = []
    setStep('packages');
  };

  const handlePackageType = (event) => {
    // console.log(event)
    setSelectedCard(event);
    setSelectedClassPackage(event)
    allAvailDates['avdts'].filter((avdtsitem) => {
      if(avdtsitem.package_id === event.package_id) {
        setSemAvailableDates(avdtsitem.dts)
        setSemClassQty(avdtsitem.class_count)
      }
    });
    
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
        jsonData.server_url,
        getCurrentDate(),
        formData.firstName,
        formData.lastName,
        formData.phone,
        jsonData.sender_email,
        formData.email,
        jsonData.reg_email_subject + " - " + formData.firstName,
        location,
        address,
        classTiming,
        selectedClassPackage.name,
        selectedAgeGroup,
        ((selectedClassPackage.type === 'semester' ? semClassQty : selectedClassPackage.qty) * selectedClassPackage.unit * 1.13).toFixed(2),
        "Not Paid",
        (selectedClassPackage.type === 'semester' ? semAvailableDates : "NA"),
        (selectedClassPackage.type === 'semester' ? true : false)
      );

      storeData(
        jsonData.server_url,
        getCurrentDate(),
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        location,
        address,
        classTiming,
        selectedClassPackage.name,
        selectedAgeGroup,
        ((selectedClassPackage.type === 'semester' ? semClassQty : selectedClassPackage.qty) * selectedClassPackage.unit * 1.13).toFixed(2),
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
            {jsonData.age_group.map((item) => (
              <div>
              <FormControlLabel value={item.name} control={<Radio />} label={item.name + " yrs"} onChange={handleAge}/>
            </div>
            ))}
            </RadioGroup>
        </div>
      )}

      {(step === 'level' || step === 'location-address' || step === 'packages' || step === 'package-detail' || step === 'register') && (
        <div>
          <p className='selection-heading'>Please select your Level</p>
          <RadioGroup
          name="level"
          >
              {jsonData.level.map((item) => (
                <div>
                <FormControlLabel value={item.name} control={<Radio />} label={item.name} onChange={handleLevel}/>
              </div>
              ))}
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

        {!(selectedCity[0].name === 'CAMBRIDGE' || selectedCity[0].name === 'CALEDON') && (
            <>
              <p className='selection-heading'>Available Packages</p>
              <Grid container spacing={2} justifyContent="center">
                {jsonData.packages.map((item) => (
                  <Grid item>
                    <ActionCard
                      item={item}
                      semClassQty={(allAvailDates['avdts'].find(avdtsitem => avdtsitem.package_id === item.package_id)).class_count}
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
            package_type={selectedClassPackage.type}
            semClassQty={semClassQty}
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
            package_type={selectedClassPackage.type}
            semClassQty={semClassQty}
            semAvailableDates={semAvailableDates}
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