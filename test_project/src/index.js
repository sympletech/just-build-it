class Index {
    constructor() {
        this.timeStamps = [];
    }

    startTimer(onUpdate = (timestamp) => console.log) {
        setInterval(() => {
            const timestamp = new Date();
            this.timeStamps = [...this.timeStamps, timestamp];
    
            onUpdate(timestamp);
        }, 5000);
    }
}

window.index = new Index();