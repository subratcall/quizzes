import { Grid, IconButton, TextField, Typography } from "@material-ui/core"
import React from "react"
import ShortItemWrapper from "../ItemTools/ShortWrapper"

const ShortEssay = props => {
  const item = props.items[props.order]

  return (
    <ShortItemWrapper toggleExpand={props.toggleExpand}>
      <Grid
        container={true}
        spacing={3}
        justify="flex-start"
        alignItems="center"
      >
        <Grid item={true} xs={12}>
          <Typography variant="h6">{`${item.texts[0].title ||
            "Question " + (props.order + 1)} (Essay)`}</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            variant="outlined"
            disabled={true}
            fullWidth={true}
            multiline={true}
            rowsMax={4}
            value={item.texts[0].body || ""}
            onClick={props.toggleExpand}
          />
        </Grid>
      </Grid>
    </ShortItemWrapper>
  )
}

export default ShortEssay
