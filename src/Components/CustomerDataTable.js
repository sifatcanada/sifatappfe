import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';

export default function CustomerDataTable({ first_name, last_name, phone, email, class_location, class_address, class_timing, student_age, package_name, package_qty, package_type, semClassQty, package_unit }) {
  return (
    <>
    <Typography gutterBottom variant="h4" component="div" fontWeight="bold">
      ORDER SUMMARY
    </Typography>
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} sm={6}>
        <Card variant="outlined" sx={{ textAlign: 'justify' }}>
            <CardContent >
            <Typography gutterBottom variant="h5" component="div">
              Personal Details
            </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '10px' }}>
                <b>Name: </b>{first_name} {last_name}     
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '10px' }}>
              <b>Email: </b>{email}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '10px' }}>
              <b>Phone: </b>{phone}
              </Typography>
            </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Card variant="outlined" sx={{ textAlign: 'justify' }}>
            <CardContent >
            <Typography gutterBottom variant="h5" component="div">
              Class Details
            </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
              <b>Location: </b>{class_location}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
              <b>Address: </b>{class_address}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
              <b>Time: </b>{class_timing}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
              <b>Age Group: </b>{student_age}
              </Typography>
            </CardContent>
        </Card>
      </Grid>
    <Grid item xs={12} sm={6}>
      <Card variant="outlined" sx={{ textAlign: 'justify' }}>
          <CardContent >
            <Typography gutterBottom variant="h5" component="div">
              Package Cost
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
            <b>Type: </b>{package_name}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
            <b>Cost: </b>${(package_type === 'semester' ? semClassQty : package_qty) * package_unit}
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ padding: '5px' }}>
            <b>HST: </b>13%
            </Typography>
            <Typography variant="body1" color="text.primary" sx={{ padding: '5px' }}>
            <b>Total: </b>${((package_type === 'semester' ? semClassQty : package_qty) * package_unit * 1.13).toFixed(2)} CAD
            </Typography>
          </CardContent>
      </Card>
      </Grid>
    </Grid>
  </>
  );
}
