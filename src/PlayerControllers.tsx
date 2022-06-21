import React, {useState} from 'react';
import {Box, Button, Grid, IconButton, Slider} from "@mui/material";
import PlayArrow from '@mui/icons-material/PlayArrow';
import {VimeoPlayerProps} from "react-player/types/vimeo";
import {Pause} from "@mui/icons-material";
import {format} from "./Duration";

type PlayerControl = {
    reactPlayerState: VimeoPlayerProps
    playPauseHandle: () => void
    duration: number
    currentTime: number
    seekTo: (seconds: number) => void
}

const PlayerControllers = (props: PlayerControl) => {
    function valueLabelFormat(duration: number): string {
        return format(duration).toString()
    }

    //state for seeking
    const [seeking, setSeeking] = useState<boolean>(false);
    const [targetTime, setTargetTime] = useState<number>(0);

    function onMouseDownHandler () {
        console.log('seeking');
        setSeeking(true);
    }

    return (
        <Box sx={{width: '800px', margin: '0 auto'}}>
            {/*Time track*/}
            <Box sx={{width: '100%'}}
                 paddingTop={2}
                 paddingBottom={2}
            >
                <Slider
                    onMouseDown={onMouseDownHandler}
                    onChange={(event, value, activeThumb) => {
                        console.log('change slider value');
                        if (!Array.isArray(value))
                        setTargetTime(value);
                    }}
                    onMouseUp={() =>{
                        console.log('seeking done');
                        setSeeking(false);
                        props.seekTo(targetTime);
                    }}
                    min={0}
                    max={props.duration}
                    value={seeking ? targetTime : props.currentTime}
                    defaultValue={0}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                    getAriaValueText={valueLabelFormat}
                    valueLabelFormat={valueLabelFormat}
                />
            </Box>
            <Grid container spacing={1}>
                <Grid item md={1}>
                    <IconButton
                        aria-label="forvard"
                        color="primary"
                        onClick={props.playPauseHandle}
                    >
                        {props.reactPlayerState.playing ? <Pause/> : <PlayArrow/>}
                    </IconButton>
                </Grid>
                <Grid item md={1}>

                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayerControllers;
