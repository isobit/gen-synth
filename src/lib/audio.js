export var AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) alert('Your browser does not support the web audio api!');
export var audioCtx = new AudioContext();
export var OUT = audioCtx.destination;

export class Mixer {
    constructor(
        channels = [],
        dest = null
    ) {
        this.outNode = audioCtx.createGain();
        this.gain = this.outNode.gain;
        this.inNodes = channels.map(ch => {
            let g = audioCtx.createGain();
            ch.connect(g);
            g.connect(this.outNode);
            return g;
        });
        if (dest) this.connect(dest);
    }
    connect(dest) {
        this.outNode.connect(dest);
    }
    setInGain(i, gain) {
        this.inNodes[i].gain.value = gain;
    }
    setAllInGain(gain) {
        this.inNodes.forEach(ch => ch.gain.value = gain);
    }
    setOutGain(gain) {
        this.outNode.gain.value = gain;
    }
    mute() {
        this.mutedGain = this.outNode.gain.value;
        this.setOutGain(0);
    }
    unmute() {
        this.setOutGain(this.mutedGain || 0);
    }
}

export class Oscillator {
    constructor(
        type = 'sine',
        freq = 440,
        dest = null
    ) {
        this.node = audioCtx.createOscillator();
        this.setType(type);
        this.setFreq(freq);
        this.node.start();
        if (dest) this.connect(dest);
        this.frequency = this.node.frequency;
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setType(type) {
        this.node.type = type;
    }
    setFreq(freq) {
        this.node.frequency.value = freq;
    }
}

export var NOTES = {
    A1: 27.500000000000000,
    Bb1    : 29.135235094880619,
    B1    : 30.867706328507756,
    C1    : 32.703195662574829,
    Db1    : 34.647828872109012,
    D1    : 36.708095989675945,
    Eb1    : 38.890872965260113,
    E1    : 41.203444614108741,
    F1    : 43.653528929125485,
    Gb1    : 46.249302838954299,
    G1    : 48.999429497718661,
    Ab1    : 51.913087197493142,

    A2    : 55.000000000000000,
    Bb2    : 58.270470189761239,
    B2    : 61.735412657015513,
    C2    : 65.406391325149658,
    Db2    : 69.295657744218024,
    D2    : 73.416191979351890,
    Eb2    : 77.781745930520227,
    E2    : 82.406889228217482,
    F2    : 87.307057858250971,
    Gb2    : 92.498605677908599,
    G2    : 97.998858995437323,
    Ab2   : 103.826174394986284,

    A3   : 110.000000000000000,
    Bb3   : 116.540940379522479,
    B3   : 123.470825314031027,
    C3   : 130.812782650299317,
    Db3   : 138.591315488436048,
    D3   : 146.832383958703780,
    Eb3   : 155.563491861040455,
    E3   : 164.813778456434964,
    F3   : 174.614115716501942,
    Gb3   : 184.997211355817199,
    G3   : 195.997717990874647,
    Ab3   : 207.652348789972569,

    A4   : 220.000000000000000,
    Bb4   : 233.081880759044958,
    B4   : 246.941650628062055,
    C4   : 261.625565300598634,
    Db4   : 277.182630976872096,
    D4   : 293.664767917407560,
    Eb4   : 311.126983722080910,
    E4   : 329.627556912869929,
    F4   : 349.228231433003884,
    Gb4   : 369.994422711634398,
    G4   : 391.995435981749294,
    Ab4   : 415.304697579945138,

    A5   : 440.000000000000000,
    Bb5   : 466.163761518089916,
    B5   : 493.883301256124111,
    C5   : 523.251130601197269,
    Db5   : 554.365261953744192,
    D5   : 587.329535834815120,
    Eb5   : 622.253967444161821,
    E5   : 659.255113825739859,
    F5   : 698.456462866007768,
    Gb5   : 739.988845423268797,
    G5   : 783.990871963498588,
    Ab5   : 830.609395159890277,

    A6   : 880.000000000000000,
    Bb6   : 932.327523036179832,
    B6   : 987.766602512248223,
    C6  : 1046.502261202394538,
    Db6  : 1108.730523907488384,
    D6  : 1174.659071669630241,
    Eb6  : 1244.507934888323642,
    E6  : 1318.510227651479718,
    F6  : 1396.912925732015537,
    Gb6  : 1479.977690846537595,
    G6  : 1567.981743926997176,
    Ab6  : 1661.218790319780554,

    A7  : 1760.000000000000000,
    Bb7  : 1864.655046072359665,
    B7  : 1975.533205024496447,
    C7  : 2093.004522404789077,
    Db7  : 2217.461047814976769,
    D7  : 2349.318143339260482,
    Eb7  : 2489.015869776647285,
    E7  : 2637.020455302959437,
    F7  : 2793.825851464031075,
    Gb7  : 2959.955381693075191,
    G7  : 3135.963487853994352,
    Ab7  : 3322.437580639561108,

    A8  : 3520.000000000000000,
    Bb8  : 3729.310092144719331,
    B8  : 3951.066410048992894,
    C8  : 4186.009044809578154
};
