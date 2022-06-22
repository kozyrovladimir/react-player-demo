import React, {useRef, useState} from 'react';
import ReactPlayer from "react-player/vimeo";
import './App.css';
import VimeoPlayer, {VimeoPlayerProps} from "react-player/types/vimeo";
import PlayerControllers from "./PlayerControllers";
import {Box, Button} from "@mui/material";
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

    //player state
    const [reactPlayerState, setReactPlayerState] = useState<VimeoPlayerProps>({
        url: 'https://vimeo.com/712337045',
        pip: false,
        playing: false,
        controls: true,
        light: false,
        volume: 0.5,
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
            setSeekingCallback(false);
        },
    }

    //seeking state
    const [seeking, setSeeking] = useState<boolean>(false);
    function setSeekingCallback(value: boolean) {
        setSeeking(value);
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

    //player state change handler
    function playerStateChangeHandler(newState: VimeoPlayerProps){
        setReactPlayerState(prevState => {
            return {...prevState, ...newState}
        })
    }

    return (
        <div className="App">
            <ReactPlayer
                ref={ReactPlayerRef}
                {...reactPlayerState}
                {...PlayerCallbacks}
                onPause={() => console.log('pause')}
            />
            <PlayerControllers
                reactPlayerState={reactPlayerState}
                playerStateChangeHandler={playerStateChangeHandler}
                playPauseHandle={playPauseHandle}
                duration={duration || 0}
                currentTime={timelineState.playedSeconds}
                seekTo={seekTo}
                seeking={seeking}
                setSeekingCallback={setSeekingCallback}

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
                    <span>Volume: {reactPlayerState.volume}</span>
                </div>
            </Box>
        </div>
    );
}

export default App;
