import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export const NumberCard = (props) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            {props.title || "Title"}
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            {props.number || 0}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            {props.icon || <PersonOutlineIcon />}
          </Avatar>
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {(props.showicon && <ArrowDownwardIcon color="error"/>) || ""}
        <Typography
          color="error"
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          {props.text || ""}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
