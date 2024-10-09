<script lang="ts" setup>
import { ref,Ref, onMounted, onUnmounted,watch, nextTick, computed } from 'vue'


const isLoading = ref(false)

//
const loadingAudioData = ref(false);
const waitingToLoad = ref(false);
const loadedAudioData = ref(false);
const audioData: Ref<AudioBuffer | null> = ref(null);
const audioContext = new AudioContext();

const isPlaying = ref(false)
const showVolumeControls = ref(false)

const currentTime = ref('0:00');
const totalTime = ref('--:--');
const isSourceAvailable = ref(false);

const progress = ref<HTMLElement | null>(null);
const pin = ref<HTMLElement | null>(null);
const volumePin = ref<HTMLElement | null>(null);
const audioPlayer = ref(null);
const audio = ref<HTMLAudioElement | null>(null);
const durationTime = ref();

const volumeControls = ref(null);
const volumeProgress = ref<HTMLElement | null>(null);
const currentlyDragged = ref<HTMLElement | null>(null);

const speaker = ref<SVGPathElement | null>(null);

const isDraggable = (el: EventTarget | null): el is HTMLElement => {
  return el instanceof HTMLElement && el.classList.contains('pin');
};

const togglePlay = () => {
    if (audio.value) {
        if (isPlaying.value) {
            audio.value.pause();
        } else {
            audio.value.play();
        }
        isPlaying.value = !isPlaying.value;
    }
};

function formatT (time: number){
const min = Math.floor(time / 60);
var sec = Math.floor(time % 60);
return min + ':' + ((sec<10) ? ('0' + sec) : sec);
}

const props = defineProps({
    audioSource: String,
    backgroundColor: String,
    color: String,
    type: String,
    duration: Number
})

// const audioSource = ref('https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/Swing_Jazz_Drum.mp3')

const duration = computed(() => {
        if (audio.value) {
            const duration = audio.value.duration;
            if (!isNaN(duration)) {
                return formatT(duration);
            }
        }             
        const duration = Number(audio.value?.duration)|| Number(props.duration)
        durationTime.value = duration;
        return formatT(duration);
    }); 

const updateProgress = () => {
    if (audio.value) {
        const current = audio.value.currentTime;

        const duration =  durationTime.value || audio.value.duration;             
     
        if (duration && !isNaN(duration)) { // Verificar se a duration é válida
            const percent = (current / duration) * 100;

            if (progress.value && pin.value) {
                progress.value.style.width = percent + '%';
                pin.value.style.left = percent + '%';
            }

            nextTick(() => {
                currentTime.value = formatT(current);
            });

            if (audio.value.ended) {
                totalTime.value = formatT(duration);
                resetProgress();
            }
        }
    }
};


const resetProgress = () => {
    isPlaying.value = false;
    currentTime.value = '0:00';
      
    if (progress.value instanceof HTMLElement && pin.value instanceof HTMLElement) {
        progress.value.style.width = '0%';
        pin.value.style.left = '0%';
    }
};

const updateVolume = () => {
    if (audio.value instanceof HTMLAudioElement && volumeProgress.value instanceof HTMLElement) {        
        volumeProgress.value.style.height = audio.value.volume * 100 + '%';

        if (speaker.value instanceof SVGPathElement) {
            if (audio.value.volume >= 0.5) {
                speaker.value.setAttribute('d', 'M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z');
            } else if (audio.value.volume < 0.5 && audio.value.volume > 0.05) {
                speaker.value.setAttribute('d', 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6V10.707c2-.947 3.333-2.987 3.333-5.334z');
            } else if (audio.value.volume <= 0.05) {
                speaker.value.setAttribute('d', 'M0 7.667v8h5.333L12 22.333V1L5.333 7.667');
            }
        }
    }
};


const handleMouseDown = (event:MouseEvent) => {
  if (!isDraggable(event.target)) return false;

  currentlyDragged.value = event.target as HTMLElement;

  const handleMethod = currentlyDragged.value?.dataset.method;

  const handleMouseMove = (moveEvent:MouseEvent) => {
    if (!currentlyDragged.value) return;

    // Implement your logic here for mousemove event
    if (handleMethod === 'changeVolume') changeVolume(moveEvent);
    if (handleMethod === 'rewind') rewind(moveEvent);

  };

  const handleMouseUp = () => {
    if (!currentlyDragged.value) return;

    currentlyDragged.value = null;  
 document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};


const getRangeBox = (event:MouseEvent) => {

  let rangeBox: HTMLElement | null = null;
  
  if (event.target instanceof HTMLElement) {
    rangeBox = event.target;

    if (event.type === 'click' && isDraggable(event.target)) {
      
      rangeBox = event.target?.parentElement?.parentElement as HTMLElement;
    }
    
    if (event.type === 'mousemove') {
      rangeBox = currentlyDragged.value?.parentElement?.parentElement as HTMLElement; 
    }
  }

  return rangeBox;

};

const getCoefficient = (event:MouseEvent) => {
    const slider = getRangeBox(event);
    const rect = slider?.getBoundingClientRect();

    let coefficient = 0;

    if (slider?.dataset.direction === 'horizontal') {

      if (event.clientX && rect) {
        const offsetX = event.clientX - rect.left;
        const width = slider.offsetWidth;
        coefficient = offsetX / width;
      }

    } else if (slider?.dataset.direction === 'vertical') {
      if (event.clientY && rect) {
        const offsetY = event.clientY - rect.top;
        const height = slider?.offsetHeight;
        coefficient = 1 - offsetY / height;
      }
    }
    return coefficient;
};

const inRange = (event:MouseEvent) => {

  const rangeBox = getRangeBox(event);

  const direction = rangeBox?.dataset.direction;

  if (direction === 'horizontal') {
      const rect = rangeBox?.getBoundingClientRect();
      const offsetX = event.clientX - (rect?.left ?? 0);
      const width = rangeBox?.offsetWidth;

      if (rect && width !== undefined) {
          return offsetX >= 0 && offsetX <= width;
      }

  } else if (direction === 'vertical') {

      const rect = rangeBox?.getBoundingClientRect();
      const offsetY = event.clientY - (rect?.top ?? 0);      
      const height = rangeBox?.offsetHeight;

      if (rect && height !== undefined) {
        return offsetY >= 0 && offsetY <= height;
      }
  }

  return false;
}

const rewind = (event:MouseEvent) => {
  if (audio.value && inRange(event)) {
    const coefficient = getCoefficient(event);
    const duration =  durationTime.value || audio.value.duration;   
    audio.value.currentTime = duration * coefficient;
  }
};

const changeVolume = (event:MouseEvent) => {
  if (audio.value && inRange(event)) {
    audio.value.volume = getCoefficient(event);
  }
};

watch(() => audio.value, (newVal) => {
    if (newVal) {
        audio.value?.addEventListener('timeupdate', updateProgress);
        audio.value?.addEventListener('volumechange', updateVolume);

        audio.value?.addEventListener('loadedmetadata', () => {
            if (audio.value) {   
                    
              const duration = audio.value?.duration; // Obter a duração do arquivo de áudio
               if (duration !== undefined && !isNaN(duration)  && duration !== Infinity) {
                    
                        totalTime.value = formatT(duration);
                        isSourceAvailable.value = true;
                                    
                }
            }
        });      
    }
});

//watch duration
watch(() => audio.value?.duration, () => {
    if (audio.value) {
        const duration = audio.value.duration;
        if (!isNaN(duration)) {
            nextTick(() => {
                totalTime.value = formatT(duration);
                isSourceAvailable.value = true;
            });
        }
    }
});

watch(() => audio.value, (newVal) => {
    if (newVal) {

        audio.value?.addEventListener('ended', () => {
            resetProgress();
        });      

    }
});

watch(() => props.audioSource, () => {
    if (audio.value) {
      isSourceAvailable.value = true;
    }
});

onMounted(() => {  

    getAudioData(props.audioSource as string);

    isSourceAvailable.value = false;
    audio.value = document.querySelector('audio') as HTMLAudioElement;
    isSourceAvailable.value = true;
    progress.value?.addEventListener('click', rewind);    
    audio.value.addEventListener('timeupdate', updateProgress);

    pin.value?.addEventListener('mousedown', handleMouseDown);
    
    volumePin.value?.addEventListener('mousedown', handleMouseDown);
    audio.value.addEventListener('volumechange', updateVolume);

    audio.value.addEventListener('loadedmetadata', () => {
      console.log('loadedmetadata')
      console.log('audio.value.duration',audio?.value?.duration)
      if (audio.value && audio.value.duration !== undefined) {
        const duration = audio.value.duration;
        if (duration !== undefined && !isNaN(duration) && duration !== Infinity) {    
          totalTime.value = formatT(duration);
          isSourceAvailable.value = true;    
        }
        else if (duration === Infinity || isNaN(duration)) {
          totalTime.value = '--:--';
         
        }
         
      }      
    });

  
});

onUnmounted(() => {
    if (audio.value) {
        audio.value.removeEventListener('timeupdate', updateProgress);
        audio.value.removeEventListener('volumechange', updateVolume);
        audio.value.removeEventListener('loadedmetadata', () => {
            if (audio.value) {
                const duration = audio.value.duration;
                if (!isNaN(duration)) {
                    totalTime.value = formatT(duration);
                    isSourceAvailable.value = true;
                }
            }
        });
    }
});

function getAudioData(url: string) {
        loadingAudioData.value = true;
        fetch(url)
        .then((res) => {
             return res.blob().then((raw) => {
                if (!res.headers?.get('Content-Type')?.includes('audio/')) {
                    throw new Error('Invalid audio type');
                }
                return raw;
            });
        })
        .then((bl) => {
            waitingToLoad.value = false;
            const src = URL.createObjectURL(bl);

            if (audio.value){
              audio.value.src = src;
            }             

            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                audioContext.decodeAudioData(
                    fileReader.result as ArrayBuffer,
                    (bufferData) => {
                        audioData.value = bufferData;
                        setTimeout(() => {
                            loadingAudioData.value = false;
                            loadedAudioData.value = true;                            
                        }, 1000);
                    },
                    (err) => {
                        loadingAudioData.value = false;
                        throw err;
                    }
                );
            };
            fileReader.readAsArrayBuffer(bl);
        })
        .catch((err) => {
            loadingAudioData.value = false;
            throw err;
        });
    }
</script>

<template>
    <div class="holder" :class="{'justify-end':  type !== 'bot'}">
      <div class="audio green-audio-player rounded-2xl" ref="audioPlayer" 
      :class="{ 'disabled' : !isSourceAvailable || isLoading || loadingAudioData, 'rounded-tl-none': type == 'bot', 'rounded-tr-none': type == 'user'}"
        :style="{ backgroundColor : backgroundColor, color : color}"
      >

        <!-- Loading -->
        <div class="loading" v-if="isLoading || loadingAudioData">
             
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            style="background: rgba(255, 255, 255, 0); display: block; shape-rendering: auto;" 
            width="34px" height="34px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">
              <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
              </circle>
          </svg>      
        </div>

        <!-- Play/Pause -->
        <div class="play-pause-btn" @click="togglePlay" v-else>            
          <svg v-if="!isPlaying"
           xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 24">
            <path :fill="color" fill-rule="evenodd" d="M18 12L0 24V0" class="play-pause-icon" id="playPause"/>
          </svg>

          <svg  v-else
          xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24">
            <path :fill="color" fill-rule="evenodd" d="M0 0h6v24H0zM12 0h6v24h-6z" class="play-pause-icon" id="playPause"/>
          </svg>

        </div>  

        <!-- Controls-->

        <div class="controls">
            <span :style="{ color : color }"
            class="current-time">{{ currentTime }}</span>

            <div class="slider" data-direction="horizontal">
                <div class="progress" ref="progress" :style="{ backgroundColor : color }"
                >
                    <div :style="{ backgroundColor : color }"
                    class="pin" ref="pin" id="progress-pin" data-method="rewind"></div>
                </div>
            </div>
            <span  
              v-if="duration !== 'Infinity:NaN'"
              :style="{ color : color }"           
              class="total-time">{{ duration }}
            </span>
            <span v-else
              :style="{ color : color }"           
              class="total-time">--:--</span>
        </div>
      
        
        <!-- Volume -->
        <div class="volume ">

            <div class="volume-btn" @click="showVolumeControls = !showVolumeControls">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path :fill="color" ref="speaker" fill-rule="evenodd" d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z" id="speaker"/>
        </svg>
            </div>

            <div class="volume-controls" ref="volumeControls" v-show="showVolumeControls">
                <div class="slider" data-direction="vertical">
                    <div class="progress" ref="volumeProgress">
                        <div class="pin" id="volume-pin" data-method="changeVolume" ref="volumePin"></div>
                    </div>
                </div>
            </div>

        </div>        

        <!-- Media Info -->
        <audio crossorigin="anonymous" ref="audio">
          <source :src="audioSource" type="audio/mpeg">
        </audio>

      </div>
    </div>
  </template>

<style scoped>

  .disabled{
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

    .hidden {
        display: none;
  }

    .holder {
        display: flex;      
        align-items: center;        
       
    }

    .audio.green-audio-player {
        width: 100%;  
        max-width:  236px;     
        height: 50px;
        box-shadow: 0 4px 16px 0 rgba(0, 0, 0, .07);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 16px;
        padding-right: 16px;        
        gap: 8px;
        user-select: none;
        -webkit-user-select: none;
        background-color: #e7e9f1
    }

    .audio.green-audio-player .play-pause-btn {    
        cursor: pointer;
       
    }
    .audio.green-audio-player .play-pause-btn svg, .audio.green-audio-player .volume-btn svg {        
        height: 18px;
    }	


    .audio.green-audio-player .spinner {
        width: 18px;
        height: 18px;
        background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/355309/loading.png);
        background-size: cover;
        background-repeat: no-repeat;
        animation: spin 0.4s linear infinite;
    }

    .audio.green-audio-player .slider {
        flex-grow: 1;
        background-color: #D8D8D8;
        cursor: pointer;
        position: relative;   
  }

  .audio.green-audio-player .progress {
        background-color: #536cbc;
        border-radius: inherit;
        position: absolute;
        pointer-events: none;        
    }

    .audio.green-audio-player .slider .progress .pin {
        height: 16px;
        width: 16px;        
        border-radius: 8px;
        background-color: #536cbc;
        position: absolute;
        pointer-events: all;
        box-shadow: 0px 1px 1px 0px rgba(0,0,0,0.32);
      }
    
    .controls {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        line-height: 18px;
        color: #55606E;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        align-items: center;
        /* margin-left: 24px;
        margin-right: 24px; */
        
    }
    .controls .slider{
        margin-left: 16px;
        margin-right: 16px;
        border-radius: 2px;
        height: 4px;
    }
    .controls .slider .progress {
        width: 0;
        height: 100%;
    }
    .controls .slider .progress .pin {
        left: -5px;
        top: -6px;
    }

    .volume {
    position: relative;
    }
    .volume .volume-btn {
      cursor: pointer;      
    }
    

    .volume-controls {
        width: 30px;
        height: 135px;
        background-color:#e7e9f1;
        border-radius: 7px;
        position: absolute;
        right: -4px;
        top: 27px;
        flex-direction: column;
        align-items: center;
        display: flex;
        z-index: 50;
    }
    .volume-controls .pin {
        left: -5px;
        top: -7px;
    }
    .volume-controls .slider {
        margin-top: 12px;
        margin-bottom: 12px;
        width: 6px;
        border-radius: 3px;
    }

    .volume-controls .progress {
          bottom: 0;
          height: 100%;
          width: 6px;
    }


    @keyframes spin {
        from {
            transform: rotateZ(0);
        }
        to {
            transform: rotateZ(1turn);
        }
    }


</style>