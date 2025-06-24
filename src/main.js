class Piano {
    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.octaves = 3;
        this.startOctave = 3;
        this.keys = [];
        this.activeNotes = new Set();
        this.init();
    }

    init() {
        const pianoElement = document.getElementById('piano');
        const scrollContent = document.querySelector('.scroll-content');
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Create all keys first
        for (let octave = this.startOctave; octave < this.startOctave + this.octaves; octave++) {
            notes.forEach(note => {
                const key = document.createElement('div');
                const isSharp = note.includes('#');
                key.className = `piano-key ${isSharp ? 'black' : 'white'}`;
                key.dataset.note = `${note}${octave}`;
                key.dataset.octave = octave;
                
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

        // Sync scroll area width with piano width
        const syncScrollWidth = () => {
            scrollContent.style.width = pianoElement.scrollWidth + 'px';
        };

        // Initial sync
        syncScrollWidth();

        // Sync on window resize
        window.addEventListener('resize', syncScrollWidth);

        // Sync scrolling between piano and scroll area
        const scrollArea = document.querySelector('.scroll-area');
        const pianoContainer = pianoElement.parentElement;

        pianoContainer.addEventListener('scroll', () => {
            scrollArea.scrollLeft = pianoContainer.scrollLeft;
        });

        scrollArea.addEventListener('scroll', () => {
            pianoContainer.scrollLeft = scrollArea.scrollLeft;
        });

        // Scroll to C4 after a brief delay to ensure layout is complete
        setTimeout(() => {
            const c4Key = this.keys.find(key => key.dataset.note === 'C4');
            if (c4Key) {
                const scrollOffset = c4Key.offsetLeft;
                pianoContainer.scrollLeft = scrollOffset;
                scrollArea.scrollLeft = scrollOffset;
            }
        }, 100);

        // Rest of your existing event listeners
        document.addEventListener('touchend', (e) => {
            this.activeNotes.forEach(note => {
                this.stopNote(note);
            });
        });

        document.addEventListener('mouseup', (e) => {
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