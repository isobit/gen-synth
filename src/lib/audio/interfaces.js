import {Mixer} from './components';
import {NOTES} from './notes'

function keycode(e) {
    e = e || window.event;
    return (e.keyCode || e.which);
}

export class KeyboardPiano {
    constructor(
        generator,
        dest = null
    ) {
        this.signalMixer = new Mixer([
            NOTES.C4,
            NOTES.Db4,
            NOTES.D4,
            NOTES.Eb4,
            NOTES.E4,
            NOTES.F4,
            NOTES.Gb4,
            NOTES.G4,
            NOTES.Ab4,
            NOTES.A5,
            NOTES.Bb5,
            NOTES.B5,
            NOTES.C5,
            NOTES.Db5,
            NOTES.D5,
            NOTES.Eb5,
            NOTES.E5,
            NOTES.F5,
            NOTES.Gb5,
            NOTES.G5,
            NOTES.Ab5,
            NOTES.A6
            ].map((note) => generator(note)));
        this.signalMixer.setAllInGain(0);
        this.signalMixer.setOutGain(0.5);
        if (dest) this.connect(dest);
    }

    connect(dest) {
        this.signalMixer.connect(dest);
    }

    keyDown(e) {
        let self = this;
        switch(keycode(e)) {
            case 90:
                self.signalMixer.setInGain(0, .5);
                break;
            case 83:
                self.signalMixer.setInGain(1, .5);
                break;
            case 88:
                self.signalMixer.setInGain(2, .5);
                break;
            case 68:
                self.signalMixer.setInGain(3, .5);
                break;
            case 67:
                self.signalMixer.setInGain(4, .5);
                break;
            case 86:
                self.signalMixer.setInGain(5, .5);
                break;
            case 71:
                self.signalMixer.setInGain(6, .5);
                break;
            case 66:
                self.signalMixer.setInGain(7, .5);
                break;
            case 72:
                self.signalMixer.setInGain(8, .5);
                break;
            case 78:
                self.signalMixer.setInGain(9, .5);
                break;
            case 74:
                self.signalMixer.setInGain(10, .5);
                break;
            case 77:
                self.signalMixer.setInGain(11, .5);
                break;
            case 188:
                self.signalMixer.setInGain(12, .5);
                break;
            case 76:
                self.signalMixer.setInGain(13, .5);
                break;
            case 190:
                self.signalMixer.setInGain(14, .5);
                break;
            case 186:
                self.signalMixer.setInGain(15, .5);
                break;
            case 191:
                self.signalMixer.setInGain(16, .5);
                break;
        }
    }

    keyUp(e) {
        let self = this;
        switch(keycode(e)) {
            case 90:
                self.signalMixer.setInGain(0, 0);
                break;
            case 83:
                self.signalMixer.setInGain(1, 0);
                break;
            case 88:
                self.signalMixer.setInGain(2, 0);
                break;
            case 68:
                self.signalMixer.setInGain(3, 0);
                break;
            case 67:
                self.signalMixer.setInGain(4, 0);
                break;
            case 86:
                self.signalMixer.setInGain(5, 0);
                break;
            case 71:
                self.signalMixer.setInGain(6, 0);
                break;
            case 66:
                self.signalMixer.setInGain(7, 0);
                break;
            case 72:
                self.signalMixer.setInGain(8, 0);
                break;
            case 78:
                self.signalMixer.setInGain(9, 0);
                break;
            case 74:
                self.signalMixer.setInGain(10, 0);
                break;
            case 77:
                self.signalMixer.setInGain(11, 0);
                break;
            case 188:
                self.signalMixer.setInGain(12, 0);
                break;
            case 76:
                self.signalMixer.setInGain(13, 0);
                break;
            case 190:
                self.signalMixer.setInGain(14, 0);
                break;
            case 186:
                self.signalMixer.setInGain(15, 0);
                break;
            case 191:
                self.signalMixer.setInGain(16, 0);
                break;
        }
    }
}

