import Vue from 'vue';
import {setKeySynth} from 'main';
import {synthGenome, renderSynthOffline} from 'synth';
import template from 'templates/components/synth-view.html!'

class CustomCanvas {
    constructor(el) {
        this.el = el;
        this.ctx = el.getContext('2d');
        this.width = this.el.width;
        this.height = this.el.height;
        var devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                this.ctx.mozBackingStorePixelRatio ||
                this.ctx.msBackingStorePixelRatio ||
                this.ctx.oBackingStorePixelRatio ||
                this.ctx.backingStorePixelRatio || 1;
        let ratio = devicePixelRatio / backingStoreRatio;
        if (devicePixelRatio !== backingStoreRatio) {
            var oldWidth = el.width;
            var oldHeight = el.height;
            el.width = oldWidth * ratio;
            el.height = oldHeight * ratio;
            el.style.width = oldWidth + 'px';
            el.style.height = oldHeight + 'px';
            this.ctx.scale(ratio, ratio);
        }
    }
}

Vue.component('synth-view', {
    template: template,
    data() { return {
        graphLength: 0.02,
        graphNote: 440,
        persist: false,
        entity: synthGenome.generate()
    }},
    methods: {
        select() {
            setKeySynth(this.entity);
        },
        drawWaveform() {
            renderSynthOffline(this.graphNote, this.entity, {length: this.graphLength}).then(buffer => {
                var ctx = this.waveformCanvas.ctx;
                var width = this.waveformCanvas.width;
                var height = this.waveformCanvas.height;

                var data = buffer.getChannelData(0);
                var xRatio = width / (data.length-1);
                var dataMax = (function() {
                    let acc = 0;
                    for (let i = 0; i < data.length; i++)
                        acc = Math.max(acc, Math.abs(data[i]));
                    return acc;
                }());

                ctx.fillStyle = 'rgb(50, 50, 50)';
                ctx.fillRect(0, 0, width, height);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgb(80, 150, 250)';
                ctx.moveTo(0, height*0.5);
                ctx.beginPath();
                for (let i = 0; i < data.length; i++) {
                    let [x, y] = [i * xRatio, ((data[i]/dataMax+1)*0.5)*height];
                    ctx.lineTo(x, y);
                }
                ctx.stroke();
            });
        }
    },
    watch: {
        graphNote(g) {
            this.drawWaveform();
        },
        graphLength(g) {
            this.drawWaveform();
        },
        entity(e) {
            this.drawWaveform();
        }
    },
    ready() {
        this.waveformCanvas = new CustomCanvas(this.$$.waveformCanvas);
        this.drawWaveform();
    }
});
