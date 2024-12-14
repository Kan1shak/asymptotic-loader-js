function truncateDecimals(number, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
}


class AsymptoticProgressBar {
    constructor(maxSegments) {
        this.maxSegments = maxSegments;
        this.currentSegment = 0;
        this.progress = 0;
        this.startTime = null;
        this.animationId = null;
        this.isCompleting = false;
        this.completionStartProgress = 0;
        this.totalProgress = 0;
    }

    start() {
        this.startTime = performance.now();
        this.animate(0);
    }

    animate(currentTime) {
        const elapsedTime = (currentTime - this.startTime) / 1000;

        if (this.isCompleting) {
            const completionProgress = Math.min(1, (currentTime - this.completionStartTime) / 500);
            this.progress = this.completionStartProgress + 
                (100 - this.completionStartProgress) * completionProgress;
            
            if (completionProgress >= 1) {
                this.isCompleting = false;
                this.currentSegment++;
                this.progress = 0;
                this.startTime = performance.now();
            }
        } else {
            //              this was maxlimit before
            this.progress = 100 * (1 - Math.exp(Math.pow(-elapsedTime, 3) * 0.005 / 4));
            // the formula can be written as 100 * (1 - e^(-t^3 * 0.005 / 4))
            // teh values can be tweaeked to get better results
            // but looks good enuf to me
        }

        // calculate total progress as a percentage of all segments
        this.totalProgress = ((this.currentSegment * 100) + this.progress) / this.maxSegments;

        this.render();

        if (this.currentSegment < this.maxSegments) {
            this.animationId = requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }

    render() {
        const progressBar = document.getElementById('progress');
        const progressText = document.getElementById('progress-text');
        const displayProgress = Math.min(this.totalProgress, 100);
        
        progressBar.style.width = `${displayProgress}%`;
        progressBar.className = this.isCompleting ? 'complete' : '';
        progressText.textContent = `${truncateDecimals(displayProgress, 2)}% (Segment ${this.currentSegment}/${this.maxSegments})`;
    }

    completeSegment() {
        if (!this.isCompleting && this.currentSegment < this.maxSegments) {
            this.isCompleting = true;
            this.completionStartTime = performance.now();
            this.completionStartProgress = this.progress;
        }
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

let progressBar;

function startProgress() {
    if (progressBar) progressBar.stop();
    // now we can just specify the number of segments
    progressBar = new AsymptoticProgressBar(5);
    progressBar.start();
}

function completeSegment() {
    if (progressBar) {
        progressBar.completeSegment();
    }
}