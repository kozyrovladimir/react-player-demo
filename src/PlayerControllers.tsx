import React, {useRef, useState} from 'react';
import {Box, Button, Grid, IconButton, Slider, SliderTypeMap} from "@mui/material";
import PlayArrow from '@mui/icons-material/PlayArrow';
import {VimeoPlayerProps} from "react-player/types/vimeo";
import {Pause, VolumeOff, VolumeUp} from "@mui/icons-material";
import {format} from "./Duration";

type PlayerControl = {
    reactPlayerState: VimeoPlayerProps
    playerStateChangeHandler: (newState: VimeoPlayerProps) => void
    playPauseHandle: () => void
    duration: number
    currentTime: number
    seekTo: (seconds: number) => void
    seeking: boolean
    setSeekingCallback: (value: boolean) => void
}

const PlayerControllers = (props: PlayerControl) => {
    function valueLabelFormat(duration: number): string {
        return format(duration).toString()
    }

    //volume
    const volume = (() => {
        let localVolume;
        if(props.reactPlayerState.volume) {
            localVolume = props.reactPlayerState.volume;
        } else {
            localVolume = 0.5;
        };
        if (props.reactPlayerState.muted) {
            localVolume = 0;
        };
        return localVolume * 100;
    })();
    //volume change props
    const [targetVolume, setTargetVolume] = useState<number>(0);
    const [volumeIsChanging, setVolumeIsChanging] = useState<boolean>(false);

    function onMouseDownVolumeHandler() {
        console.log('changing volume');
        setVolumeIsChanging(true);
    }

    function handleVolumeChange(event: Event, value: number | number[], activeThumb: number) {
        console.log('change volume value');
        if (!Array.isArray(value)) {
            setTargetVolume(value);
        }
        ;
    }

    function onMouseUpVolumeHandler() {
        console.log('changing volume done');
        props.playerStateChangeHandler({volume: targetVolume/100});
        setVolumeIsChanging(false);
    }

    //target time state
    const [targetTime, setTargetTime] = useState<number>(0);

    //time seek functions
    function onMouseDownHandler() {
        console.log('seeking');
        props.setSeekingCallback(true);
    }

    function handleSeekChange(event: Event, value: number | number[], activeThumb: number) {
        console.log('change slider value');
        if (!Array.isArray(value)) {
            setTargetTime(value);
        }
        ;
    }

    function onMouseUpHandler() {
        console.log('seeking done');
        props.seekTo(targetTime);
    }

    function volumeMuteUnmute() {
        props.playerStateChangeHandler({muted: !props.reactPlayerState.muted});
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
                    onChange={handleSeekChange}
                    onMouseUp={onMouseUpHandler}
                    min={0}
                    max={props.duration}
                    value={props.seeking ? targetTime : props.currentTime}
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
                    <IconButton
                        aria-label="forvard"
                        color="primary"
                        onClick={volumeMuteUnmute}
                    >
                        {props.reactPlayerState.muted ? <VolumeOff/> : <VolumeUp/>}
                    </IconButton>
                </Grid>
                <Grid item md={2}>
                    <Slider
                        size={'small'}
                        min={0}
                        max={100}
                        value={volumeIsChanging ? targetVolume : volume}
                        onChange={handleVolumeChange}
                        onMouseDown={onMouseDownVolumeHandler}
                        onMouseUp={onMouseUpVolumeHandler}
                        // getAriaValueText={() => volume.toString()}
                        // valueLabelFormat={() => volume.toString()}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PlayerControllers;
