import { v4 as uuid } from 'uuid';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';



export const TopPaths = (props) => (
  <Card {...props}>
    <CardHeader
      title="Top paths"
    />
    <Divider />
    <List>
      {props.data.map((path, i) => (
        <ListItem
          divider={i < path.length - 1}
          key={path.hits}
        >
          <ListItemText
            primary={path.path}
            secondary={`Hitted  ${path.hits} times`}
          />

        </ListItem>
      ))}
    </List>
    <Divider />
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
    </Box>
  </Card>
);
