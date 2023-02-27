class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 30);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            const path = this.downloadQueue[i];
            console.log(path);
            let ext = path.substring(path.length-3)

            switch(ext) {
                case 'cur':
                case 'png':
                    const img = new Image();
                    img.addEventListener("load", () => {
                        console.log("Loaded " + img.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });
        
                    img.addEventListener("error", () => {
                        console.log("Error loading " + img.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });
        
                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'wav':
                case 'mp3':
                case 'mp4':
                    const audio = new Audio()

                    audio.addEventListener("loadeddata", () => {
                        console.log("Loaded " + audio.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    audio.addEventListener("error", () => {
                        console.log("Error loading " + audio.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    audio.addEventListener("ended", () => {
                        audio.pause();
                        audio.currentTime = 0;
                    });

                    audio.src = path;
                    audio.load();
                    this.cache[path] = audio;
                    break;
            }
            


            
        }
    };

    getAsset(path) {
        return this.cache[path];
    };

    playAsset(path) {
        let audio = this.cache[path];
        audio.currentTime = 0;
        audio.play();
    };

    muteAudio(mute) {
        for (let key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.muted = mute;
            }
        }
    };

    adjustVolume(volume) {
        for (let key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.volume = volume;
            }
        }
    };

    pauseBackgroundMusic() {
        for (let key in this.cache) {
            let asset = this.cache[key];
            if (asset instanceof Audio) {
                asset.pause();
                asset.currentTime = 0;
            }
        }
    };

    autoRepeat(path) {
        let aud = this.cache[path];
        aud.addEventListener("ended",  () => {
            aud.play();
        });
    };
}


