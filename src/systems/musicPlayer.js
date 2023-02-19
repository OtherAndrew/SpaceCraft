

const song = function Song() {
    this.sound = document.createElement("audio")
    this.sound.src = ASSET_MANAGER.cache[SOUND_PATH.BOSS]
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play()
    }
    this.stop = function(){
        this.sound.pause();
      }
}