import {Mixer, Compressor} from './components';
import {NOTES} from './notes'

function keycode(e) {
    e = e || window.event;
    return (e.keyCode || e.which);
}

export class KeyboardPiano {
    constructor(
        generator,
        compress = true,
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
            NOTES.F5
            ].map((note) => generator(note)));
        this.signalMixer.setAllInGain(0);
        this.signalMixer.setOutGain(0.5);
        if (compress)
            this.outNode = new Compressor(this.signalMixer);
        else
            this.outNode = this.signalMixer;
        if (dest) this.connect(dest);
    }

    connect(dest) {
        this.outNode.connect(dest);
    }

    keyDown(e) {
        let self = this;
        switch(keycode(e)) {
            case 90:
                self.signalMixer.setInGain(0, 1);
                break;
            case 83:
                self.signalMixer.setInGain(1, 1);
                break;
            case 88:
                self.signalMixer.setInGain(2, 1);
                break;
            case 68:
                self.signalMixer.setInGain(3, 1);
                break;
            case 67:
                self.signalMixer.setInGain(4, 1);
                break;
            case 86:
                self.signalMixer.setInGain(5, 1);
                break;
            case 71:
                self.signalMixer.setInGain(6, 1);
                break;
            case 66:
                self.signalMixer.setInGain(7, 1);
                break;
            case 72:
                self.signalMixer.setInGain(8, 1);
                break;
            case 78:
                self.signalMixer.setInGain(9, 1);
                break;
            case 74:
                self.signalMixer.setInGain(10, 1);
                break;
            case 77:
                self.signalMixer.setInGain(11, 1);
                break;
            case 188:
                self.signalMixer.setInGain(12, 1);
                break;
            case 76:
                self.signalMixer.setInGain(13, 1);
                break;
            case 190:
                self.signalMixer.setInGain(14, 1);
                break;
            case 186:
                self.signalMixer.setInGain(15, 1);
                break;
            case 191:
                self.signalMixer.setInGain(16, 1);
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

