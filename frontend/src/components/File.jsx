import React from "react";
import { Grid } from "@mui/material";
// import TextEditor from "./TextEditor";

export default File = (props) => {
  const { file } = props;
  // if (!file || typeof file !== "object") {
  //   console.error("Invalid file data", file);
  //   return null;
  // }

  return (
    <>
      <Grid sx={{ overflow: "scroll", height: "100%", width: "100%" }}>
        <div>{file.name}</div>
        <div>{/* <TextEditor /> */}</div>
      </Grid>
    </>
  );
};
