import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
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

import DataService from "../../utils/data.service";
import BoardCard from "./BoardCard";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    overflow: 'auto',
    marginTop: '20px',
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
}));

export default function Dashboard() {
  const classes = useStyles();
  const [data, setData] = useState();       // list of board

  const [open, setOpen] = useState(false);    // open/close create new board dialog
  const [name, setName] = useState("");                   // name of new board
  const [message, setMessage] = useState("");             // error mess when create
  const [status, setStatus] = useState("error");          // check if create is success

  // get all boards of user from database
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await DataService.getUserBoard()
        setData(res.data)
      }
      catch (error) {
      }
    }
    fetchData();
  }, [])


  // manage create new board dialog
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
  const handleCreate = async () => {
    if (name === "") {
      setMessage("Name fields must not be empty");
      setStatus("error");
    }
    else if (name.length > 50) {
      setMessage("Name fields must not exceed 50 character");
      setStatus("error");
    }
    else {
      try {
        const res = await DataService.createBoard(name);
        setMessage("Tạo thành công");
        setStatus("success");
        setName("");
        // add new board to front end data
        const newData = data.slice();
        newData.push({ ID: res.data.ID, name: name });
        setData(newData);
      }
      catch (error) {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setStatus("error");
      }
    }
  };

  // delete board
  const deleteBoard = (i) => {
    const newData = data.filter((e) => { return e.ID !== i })
    setData(newData);
  }

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
                    <BoardCard board={board} deleteBoard={(i) => deleteBoard(i)}></BoardCard>
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