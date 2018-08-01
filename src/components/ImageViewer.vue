<template>

  <div class="image-viewer">
    <div class="image-controls">
      <button class="button small secondary" @click.prevent="zoomIn">+ Zoom in</button>
      <button class="button small secondary" @click.prevent="zoomOut">- Zoom out</button>
    </div>
    <img :src="imageSource" ref="imageFile" :style="imageStyles" @load="imageLoadHandler">
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import store from "../store";
import { StudentFileData, FileType, FILE_TYPES } from "../data/File";

@Component({})
export default class ImageViewer extends Vue {
  @Prop({ type: String, required: true }) imageSource!: string;

  height: number = 500;
  width: number = 500;
  zoom: number = 1;
  loaded: boolean = false;
  zoomDelta: number = 0.2;

  get imageZoom() {
    return this.zoom;
  }

  get naturalHeight() {
    return this.height;
  }

  get naturalWidth() {
    return this.width;
  }

  set naturalHeight(height: number) {
    this.height = height;
  }

  set naturalWidth(width: number) {
    this.width = width;
  }
  set imageZoom(zoom: number) {
    this.zoom = zoom;
  }

  zoomIn() {
    this.imageZoom += this.imageZoom*this.zoomDelta;
  }

  zoomOut() {
    this.imageZoom -= this.imageZoom*this.zoomDelta;
  }

  get imageStyles() {
    if (!this.loaded || this.imageZoom === 1)
      return {
        maxWidth: "100%",
        height: "auto"
      };

    if (this.loaded) {
      return {
        width: this.imageZoom * this.naturalWidth + "px",
        height: this.imageZoom * this.naturalHeight + "px"
      };
    }
  }

  imageLoadHandler() {
    const image = this.$refs.imageFile as HTMLImageElement;
    this.naturalHeight = image.naturalHeight;
    this.naturalWidth = image.naturalWidth;
    this.loaded = true;
  }
}
</script>
<style scoped src="../assets/style.css"></style>
<style scoped>
.image-viewer {
  max-width: 55%;
  height: auto;
  overflow: auto;
}

.image-controls {
  padding: 1rem;
}
</style>