import React from "react";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import socketIOClient from "socket.io-client";
import { setMaterialData } from "../../../shared/actions/index";
import getMaterials from "../../../shared/functions/getMaterials";
import MaterialsPanel from "../components/MaterialsPanel";
import useStyles from "../styles/AdminPageStyle";
import Title from "../../../shared/components/Title";
import Loader from "../../../shared/components/Loader";

const socket = socketIOClient("http://localhost:8000");

function MaterialsPanelContainer(props) {
  const classes = useStyles();
  const { data, setMaterialData, user } = props;
  if (!data) {
    getMaterials().then(res => {
      setMaterialData(res);
    });
  }
  socket.on("updateMaterial", data => {
    setMaterialData(data);
  });
  return (
    <Paper className={classes.paper}>
      <Title>Materials Pannel</Title>
      <Grid container className={classes.operationBoxWrap}>
        {data ? (
          data.map((item, index) => (
            <MaterialsPanel
              key={item._id}
              admin={user}
              data={data}
              material={item}
              index={index}
            />
          ))
        ) : (
          <Loader />
        )}
      </Grid>
    </Paper>
  );
}
const mapStateToProps = state => ({
  user: state.shared.user,
  data: state.shared.data
});

const mapDispatchToProps = {
  setMaterialData
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialsPanelContainer);
