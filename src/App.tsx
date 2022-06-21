import React, {useRef, useState} from 'react';
import ReactPlayer from "react-player/vimeo";
import './App.css';
import VimeoPlayer, {VimeoPlayerProps} from "react-player/types/vimeo";
import PlayerControllers from "./PlayerControllers";
import {Box, Button, Slider} from "@mui/material";
import Duration from "./Duration";

function App() {
    //reference to ReactPlayer
    const ReactPlayerRef = useRef<VimeoPlayer>(null);

    //some values of player
    let duration = ReactPlayerRef.current ? ReactPlayerRef.current.getDuration() : null;
    function seekTo(seconds: number) {
        if (ReactPlayerRef.current) {
            ReactPlayerRef.current.seekTo(seconds, "seconds");
        }
    }

    //state for seeking
    // const [seeking, setSeeking] = useState<boolean>(false);
    //
    // function handleSeekMouseDown(e: React.MouseEventHandler) {
    //     setSeeking(true);
    // }

    // function handleSeekChange(e: React.MouseEventHandler) {
    //     this.setState({ played: parseFloat(e.target.value) })
    // }

    // function handleSeekMouseUp(e: React.MouseEventHandler<HTMLSpanElement>) {
    //     setSeeking(false);
    //     seekTo(0);
    //     this.player.seekTo(parseFloat(e.target.value))
    // }
    //
    // function handleProgress (e: React.MouseEventHandler) {
    //     console.log('onProgress', state)
    //     // We only want to update time slider if we are not currently seeking
    //     if (!this.state.seeking) {
    //         this.setState(state)
    //     }
    // }

    //player state
    const [reactPlayerState, setReactPlayerState] = useState<VimeoPlayerProps>({
        url: 'https://vimeo.com/712337045',
        pip: false,
        playing: false,
        controls: true,
        light: false,
        volume: 0.8,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        progressInterval: 1000,
    });

    //player timeline state
    type PlayerTimelineStateType = {
        played: number,
        playedSeconds: number,
        loaded: number,
        loadedSeconds: number
    };

    const [timelineState, setTimelineState] = useState<PlayerTimelineStateType>({
        played: 0,
        loadedSeconds: 0,
        loaded: 0,
        playedSeconds: 0,
    })

    //playerCallbacks
    const PlayerCallbacks: VimeoPlayerProps = {
        onProgress: state => {
            console.log('on progress called');
            setTimelineState({...state});
        },
    }

    //player control handlers
    const playPauseHandle = () => {
        setReactPlayerState(
            {
                ...reactPlayerState,
                playing: !reactPlayerState.playing
            }
        )
    }

    return (
        <div className="App">
            <ReactPlayer
                ref={ReactPlayerRef}
                {...reactPlayerState}
                {...PlayerCallbacks}
                onPause={()=>console.log('pause')}
            />
            <PlayerControllers
                reactPlayerState={reactPlayerState}
                playPauseHandle={playPauseHandle}
                duration={duration || 0}
                currentTime={timelineState.playedSeconds}
                seekTo={seekTo}
            />
            <Box>
                <div>
                    <span>Current time: </span>
                    <Duration
                        seconds={timelineState.playedSeconds}
                    />
                </div>
                <div>
                    <span>Total time: </span>
                    <Duration
                        seconds={duration ? duration : 0}
                    />
                </div>
                <div>
                    <span>Played: {}</span>
                </div>
                <div>
                    <Button
                        onClick={() => {
                            seekTo(10)
                        }}
                    >To 10</Button>
                </div>
            </Box>
        </div>
    );
}

export default App;
