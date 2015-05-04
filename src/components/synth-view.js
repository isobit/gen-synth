import Vue from 'vue';
import {setKeySynth} from 'main';
import {synthGenome, renderSynthOffline} from 'synth';
import template from 'templates/components/synth-view.html!'

Vue.component('synth-view', {
    template: template,
    data() { return {
        graphLength: 0.02,
        persist: false,
        entity: synthGenome.generate()
    }},
    methods: {
        select() {
            setKeySynth(this.entity);
        },
        drawWaveform() {
            renderSynthOffline(440, this.entity, this.graphLength).then(buffer => {
                let canvas = this.$$.waveformCanvas;
                let ctx = canvas.getContext('2d');
                ctx.fillStyle = 'rgb(50, 50, 50)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgb(80, 150, 250)';
                ctx.beginPath();
                let data = buffer.getChannelData(0);
                let sliceWidth = canvas.width * 1.0 / data.length;
                var x = 0;
                for(var i = 0; i < data.length; i++) {
                    var v = (data[i]+1.0) / 2.0;
                    var y = (v * canvas.height/2) + canvas.height/4;
                    if(i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
                ctx.lineTo(canvas.width, canvas.height/2);
                ctx.stroke();
            });
        }
    },
    watch: {
        graphLength: this.drawWaveform,
        entity: this.drawWaveform
    },
    ready() {
        this.drawWaveform();
    }
});