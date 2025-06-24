class Piano {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.octaves = 2;
        this.startOctave = 4;
        this.keys = [];
        this.activeNotes = new Set();
        this.init();
    }

    init() {
        const pianoElement = document.getElementById('piano');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for (let octave = this.startOctave; octave < this.startOctave + this.octaves; octave++) {
            notes.forEach(note => {
                const key = document.createElement('div');
                const isSharp = note.includes('#');
                key.className = `piano-key ${isSharp ? 'black' : 'white'}`;
                key.dataset.note = `${note}${octave}`;
                
                // Add event listeners for both mouse and touch events
                key.addEventListener('mousedown', () => this.playNote(key.dataset.note));
                key.addEventListener('mouseup', () => this.stopNote(key.dataset.note));
                key.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.playNote(key.dataset.note);
                });
                key.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.stopNote(key.dataset.note);
                });

                pianoElement.appendChild(key);
                this.keys.push(key);
            });
        }

        // Add global touch event listeners to handle finger release outside keys
        document.addEventListener('touchend', (e) => {
            // Stop all active notes when touch ends anywhere on the document
            this.activeNotes.forEach(note => {
                this.stopNote(note);
            });
        });

        // Also handle mouse events globally for consistency
        document.addEventListener('mouseup', (e) => {
            // Only stop notes if the mouse is not over a piano key
            const target = e.target;
            if (!target.classList.contains('piano-key')) {
                this.activeNotes.forEach(note => {
                    this.stopNote(note);
                });
            }
        });
    }

    async playNote(note) {
        await Tone.start();
        this.synth.triggerAttack(note);
        this.activeNotes.add(note);
        const key = this.keys.find(k => k.dataset.note === note);
        if (key) key.classList.add('active');
    }

    stopNote(note) {
        this.synth.triggerRelease(note);
        this.activeNotes.delete(note);
        const key = this.keys.find(k => k.dataset.note === note);
        if (key) key.classList.remove('active');
    }
}

// Initialize piano when the page loads
window.addEventListener('load', () => {
    new Piano();
}); 