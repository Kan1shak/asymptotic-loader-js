function truncateDecimals(number, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(number * factor) / factor;
  }


class AsymptoticProgressBar {
    constructor(maxLimit) {
        this.maxLimit = maxLimit;
        this.progress = 0;
        this.startTime = null;
        this.animationId = null;
        this.startTimestamp = Date.now();
        this.isCompleting = false;
        this.completionStartProgress = 0;
    }

    start() {
        this.startTime = performance.now();
        this.animate(0);
    }

    animate(currentTime) {
        const elapsedTime = (currentTime - this.startTime) / 1000;

        if (this.isCompleting) {
            // smooth transition to maxLimit over 0.5 seconds
            const completionProgress = Math.min(1, (currentTime - this.completionStartTime) / 500);
            this.progress = this.completionStartProgress + 
                (this.maxLimit - this.completionStartProgress) * completionProgress;
        } else {
            // normal asymptotic progress
            this.progress = this.maxLimit * (1 - Math.exp(Math.pow(-elapsedTime, 3) * 0.005 / 4));
        }

        this.render();

        if (this.progress < this.maxLimit) {
            this.animationId = requestAnimationFrame((timestamp) => this.animate(timestamp));
        }
    }

    render() {
        const progressBar = document.getElementById('progress');
        const progressText = document.getElementById('progress-text');
        const displayProgress = Math.min(this.progress, this.maxLimit);
        
        progressBar.style.width = `${displayProgress}%`;
        progressBar.className = this.isCompleting ? 'complete' : '';
        // only display the first two decimal places, and no rounding
        progressText.textContent = `${truncateDecimals(displayProgress, 2)}%`;
    }

    complete() {
        if (!this.isCompleting) {
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
    progressBar = new AsymptoticProgressBar(60);
    progressBar.start();
}

function completeProgress() {
    if (progressBar) {
        progressBar.complete();
    }
}