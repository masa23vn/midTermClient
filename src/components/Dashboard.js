import React, { useState, useEffect } from 'react';
import {
  Link,
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DataService from "../utils/data.service";


const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    marginTop: '20px',
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const [data, setData] = useState();       // list of board

  const [open, setOpen] = useState(false);    // open/close create dialog
  const [name, setName] = useState("");                   // name of new board
  const [message, setMessage] = useState("");             // error mess when create
  const [status, setStatus] = useState("error");          // check if create is success

  // get all boards of user from database
  const getBoard = () => {
    DataService.getUserBoard()
      .then(res => setData(res.data))
      .catch(err => err);
  }

  useEffect(() => {
    getBoard();
  }, [])

  // manage dialog
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setName("");
    setOpen(false);
    setMessage("");
    setStatus("error");
  };
  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const handleCreate = () => {
    if (name === "") {
      setMessage("Name fields must not be empty");
      setStatus("error");
    }
    else if (name.length > 50) {
      setMessage("Name fields must not exceed 50 character");
      setStatus("error");
    }
    else {
      DataService.createBoard(name).then(
        () => {
          setMessage("Tạo thành công");
          setStatus("success");
          setName("");
          getBoard();
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setStatus("error");
        });
    }
  };


  return (
    <React.Fragment>
      <main className={classes.content}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Your current boards
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              You can manage your boards here.
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Create board.
                  </Button>
                  <Dialog open={open} maxWidth="xs" fullWidth={true} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New board</DialogTitle>
                    {message && (
                      <div className="form-group">
                        <Alert severity={status}>
                          {message}
                        </Alert>
                      </div>
                    )}

                    <DialogContent>
                      <Typography >Name: *</Typography>
                      <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        value={name}
                        type="text"
                        fullWidth
                        onChange={(value) => onChangeName(value)}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button onClick={handleCreate} color="primary">
                        Create
                      </Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
              </Grid>
            </div>
          </Container>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {data ?
                data.map((board) => (
                  <Grid item key={board.ID} xs={12} sm={6} md={4}>
                    <CustomCard board={board} getBoard={() => getBoard()}></CustomCard>
                  </Grid>
                )) : ""
              }
            </Grid>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}

function CustomCard(props) {
  const [openDelete, setOpenDelete] = useState(false);    // open/close delete dialog

  const classes = useStyles();
  const board = props.board;
  const urlView = "/Board/" + board.ID;

  // delete board
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = () => {
    DataService.deleteBoard(board.ID)
      .then(res => {
        setOpenDelete(false);
        props.getBoard();
      })
      .catch(err => err);;
  };

  return (
    <Card className={classes.card}>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {board.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" component={Link} to={urlView}>
          View
                    </Button>
        <Button size="small" color="primary" onClick={handleClickOpenDelete}>
          Delete
                    </Button>
        <Dialog open={openDelete} maxWidth="xs" fullWidth={true} onClose={handleCloseDelete} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Are you sure ?</DialogTitle>
          <DialogContent>
            <Typography >Do you want to delete this board - {board.name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Cancel
                      </Button>
            <Button onClick={handleDelete} color="primary">
              Delete
                      </Button>
          </DialogActions>
        </Dialog>

      </CardActions>
    </Card>
  );

} 