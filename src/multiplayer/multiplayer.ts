import * as PeerDefinition from 'peerjs';
import {Level} from '../scenes/level';
import PeerStateManager from './peerStateManager';
import HostStateManager from './hostStateManager';
// Module does not quite match Typescript definitions.
const Peer = (PeerDefinition as any).default;

const hostGame = (scene: Level) => {
    console.log('Trying to host game');
    const peer = new Peer('gingers-day-in-host');
    peer.on('error', err => {
        console.error(err);
    });
    peer.on('open', id => {
        console.log('My peer ID is: ' + id);
    });
    peer.on('connection', (connection) => {
        console.log('Joined game as host');
        scene.stateManager = new HostStateManager(connection);
    });
};

const joinGame = (scene: Level) => {
    console.log('Trying to join game');
    const peer = new Peer();
    peer.on('open', id => {
        console.log('My peer ID is: ' + id);
        const connection = peer.connect('gingers-day-in-host');
        scene.stateManager = new PeerStateManager(connection);
        connection.on('open', () => {
            console.log('Joined game as peer');
        });
        connection.on('error', err => {
            console.error(err);
        });
    });
};

export const listenForMultiplayerHotkeys = (scene: Level) => {
    scene.input.keyboard.addKey('H').once('down', () => {
        hostGame(scene);
    });
    scene.input.keyboard.addKey('J').once('down', () => {
        joinGame(scene);
    });
};
