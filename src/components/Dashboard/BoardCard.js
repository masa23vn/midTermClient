import React, { useState } from 'react';
import {
  Link,
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DataService from "../../utils/data.service";

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    flexGrow: 1,
  },
}));

export default function BoardCard(props) {
  const [openDelete, setOpenDelete] = useState(false);    // open/close delete dialog
  const [deleteError, setDeleteError] = useState(false);  // check if delete fail to display alert

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

  const handleDelete = async () => {
    try {
      await DataService.deleteBoard(board.ID);
      setOpenDelete(false);
      props.deleteBoard(board.ID);

    }
    catch (error) {
      setOpenDelete(false);
      setDeleteError(true);
    }
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
      {deleteError ?
        <Alert severity="error" onClose={() => { setDeleteError(false) }}>
          Fail to delete board — Please try again.
        </Alert> : ""
      }

    </Card>
  );
}  
